import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { assessment } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are a professional physiotherapy and chiropractic AI assistant specializing in posture analysis and minor alignment issues. 

Based on the user's assessment responses, provide:
1. A brief analysis of their condition (2-3 sentences)
2. A severity level: "mild", "moderate", or "needs_attention"
3. A list of specific alignment issues identified
4. 3-4 recommended exercises with detailed steps, duration, and frequency
5. 3-5 practical posture correction tips and daily activity modifications

IMPORTANT SAFETY GUIDELINES:
- If the user reports severe or persistent pain (duration >1 month with multiple yes answers), set severity to "needs_attention" and recommend medical consultation
- Keep recommendations focused on minor alignment issues only
- Be clear that this is guidance, not medical diagnosis
- All exercises should be gentle and safe for beginners

Return your response as JSON in this exact format:
{
  "analysis": "Brief 2-3 sentence analysis",
  "severity": "mild" | "moderate" | "needs_attention",
  "issues": ["issue 1", "issue 2", ...],
  "exercises": [
    {
      "name": "Exercise name",
      "steps": ["step 1", "step 2", "step 3"],
      "duration": "X minutes",
      "frequency": "X times per day"
    }
  ],
  "tips": ["tip 1", "tip 2", ...]
}`;

    const userPrompt = `Assessment Results:
- Neck pain: ${assessment.neckPain}
- Back pain: ${assessment.backPain}
- Shoulder stiffness: ${assessment.shoulderStiffness}
- Poor sitting posture: ${assessment.poorPosture}
- Duration of discomfort: ${assessment.duration}

Please analyze this assessment and provide personalized recommendations.`;

    console.log('Calling Lovable AI for posture analysis...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a few moments.' }), 
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to your workspace.' }), 
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI Gateway returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const aiResponse = JSON.parse(data.choices[0].message.content);

    console.log('AI analysis complete');

    return new Response(JSON.stringify(aiResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-posture function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
