import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { AssessmentData } from "./Assessment";
import ExerciseCard from "@/components/ExerciseCard";

interface AIResponse {
  analysis: string;
  severity: "mild" | "moderate" | "needs_attention";
  issues: string[];
  exercises: Array<{
    name: string;
    steps: string[];
    duration: string;
    frequency: string;
  }>;
  tips: string[];
}

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<AIResponse | null>(null);

  const assessmentData = location.state?.assessmentData as AssessmentData | undefined;

  useEffect(() => {
    if (!assessmentData) {
      navigate("/assessment");
      return;
    }

    const analyzeAssessment = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("analyze-posture", {
          body: { assessment: assessmentData },
        });

        if (error) {
          if (error.message?.includes("429")) {
            toast({
              title: "Rate Limit Exceeded",
              description: "Too many requests. Please try again in a few moments.",
              variant: "destructive",
            });
          } else if (error.message?.includes("402")) {
            toast({
              title: "Service Unavailable",
              description: "Please contact support to add credits to your workspace.",
              variant: "destructive",
            });
          } else {
            throw error;
          }
          navigate("/assessment");
          return;
        }

        setResults(data);
      } catch (error) {
        console.error("Error analyzing assessment:", error);
        toast({
          title: "Analysis Error",
          description: "We couldn't analyze your assessment. Please try again.",
          variant: "destructive",
        });
        navigate("/assessment");
      } finally {
        setLoading(false);
      }
    };

    analyzeAssessment();
  }, [assessmentData, navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-xl text-muted-foreground">Analyzing your assessment...</p>
        </div>
      </div>
    );
  }

  if (!results) return null;

  const severityColors = {
    mild: "bg-secondary text-secondary-foreground",
    moderate: "bg-yellow-500 text-white",
    needs_attention: "bg-destructive text-destructive-foreground",
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        {/* Severity Badge */}
        <div className="mb-6 animate-fade-in">
          <Badge className={`${severityColors[results.severity]} text-lg px-4 py-2`}>
            {results.severity === "mild" && "Mild Concerns"}
            {results.severity === "moderate" && "Moderate Concerns"}
            {results.severity === "needs_attention" && "Needs Medical Attention"}
          </Badge>
        </div>

        {/* Analysis */}
        <Card className="p-8 mb-6 shadow-soft animate-fade-in">
          <h2 className="text-2xl font-bold mb-4">Your Assessment Results</h2>
          <p className="text-muted-foreground mb-4">{results.analysis}</p>
          
          {results.issues.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-3">Identified Issues:</h3>
              <ul className="space-y-2">
                {results.issues.map((issue, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>

        {/* Warning for severe cases */}
        {results.severity === "needs_attention" && (
          <Card className="p-6 mb-6 border-destructive bg-destructive/5 animate-fade-in">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-destructive mb-2">Medical Attention Recommended</h3>
                <p className="text-sm">
                  Based on your responses, we recommend consulting with a licensed healthcare professional 
                  for a proper evaluation. The exercises below may provide temporary relief, but professional 
                  assessment is important for your condition.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Exercises */}
        {results.exercises.length > 0 && (
          <div className="mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <h2 className="text-2xl font-bold mb-4">Recommended Exercises</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {results.exercises.map((exercise, index) => (
                <ExerciseCard key={index} exercise={exercise} />
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        {results.tips.length > 0 && (
          <Card className="p-8 shadow-soft animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <h2 className="text-2xl font-bold mb-4">Posture & Lifestyle Tips</h2>
            <ul className="space-y-3">
              {results.tips.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-secondary mr-2 font-bold">✓</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        <div className="mt-8 text-center">
          <Button
            onClick={() => navigate("/assessment")}
            variant="outline"
            size="lg"
          >
            Take Another Assessment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Results;
