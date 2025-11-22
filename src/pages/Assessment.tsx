import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";

export interface AssessmentData {
  neckPain: string;
  backPain: string;
  shoulderStiffness: string;
  poorPosture: string;
  duration: string;
}

const Assessment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AssessmentData>({
    neckPain: "",
    backPain: "",
    shoulderStiffness: "",
    poorPosture: "",
    duration: "",
  });

  const isFormValid = () => {
    return Object.values(formData).every(value => value !== "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      toast({
        title: "Incomplete Assessment",
        description: "Please answer all questions before proceeding.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // Navigate to results with the assessment data
      navigate("/results", { state: { assessmentData: formData } });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card className="p-8 shadow-soft animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">Posture Assessment</h1>
          <p className="text-muted-foreground mb-8">
            Please answer the following questions to help us understand your alignment concerns.
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Neck Pain */}
            <div className="space-y-3">
              <Label className="text-lg font-semibold">Do you experience neck pain?</Label>
              <RadioGroup
                value={formData.neckPain}
                onValueChange={(value) => setFormData({ ...formData, neckPain: value })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="neck-yes" />
                  <Label htmlFor="neck-yes" className="cursor-pointer">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="neck-no" />
                  <Label htmlFor="neck-no" className="cursor-pointer">No</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Back Pain */}
            <div className="space-y-3">
              <Label className="text-lg font-semibold">Do you experience back pain?</Label>
              <RadioGroup
                value={formData.backPain}
                onValueChange={(value) => setFormData({ ...formData, backPain: value })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="back-yes" />
                  <Label htmlFor="back-yes" className="cursor-pointer">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="back-no" />
                  <Label htmlFor="back-no" className="cursor-pointer">No</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Shoulder Stiffness */}
            <div className="space-y-3">
              <Label className="text-lg font-semibold">Do you experience shoulder stiffness?</Label>
              <RadioGroup
                value={formData.shoulderStiffness}
                onValueChange={(value) => setFormData({ ...formData, shoulderStiffness: value })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="shoulder-yes" />
                  <Label htmlFor="shoulder-yes" className="cursor-pointer">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="shoulder-no" />
                  <Label htmlFor="shoulder-no" className="cursor-pointer">No</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Poor Posture */}
            <div className="space-y-3">
              <Label className="text-lg font-semibold">Do you have poor sitting posture?</Label>
              <RadioGroup
                value={formData.poorPosture}
                onValueChange={(value) => setFormData({ ...formData, poorPosture: value })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="posture-yes" />
                  <Label htmlFor="posture-yes" className="cursor-pointer">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="posture-no" />
                  <Label htmlFor="posture-no" className="cursor-pointer">No</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Duration */}
            <div className="space-y-3">
              <Label className="text-lg font-semibold">How long have you experienced this discomfort?</Label>
              <Select
                value={formData.duration}
                onValueChange={(value) => setFormData({ ...formData, duration: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-7days">1-7 days</SelectItem>
                  <SelectItem value="1-4weeks">1-4 weeks</SelectItem>
                  <SelectItem value=">1month">More than 1 month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              disabled={loading || !isFormValid()}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Get Your Results"
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Assessment;
