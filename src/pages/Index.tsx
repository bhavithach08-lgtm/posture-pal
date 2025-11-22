import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Activity, Shield, CheckCircle } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                Minor Alignment Treatment Guide
              </h1>
              <p className="text-xl text-muted-foreground">
                AI-powered guidance for posture correction and minor body alignment issues. 
                Get personalized treatment recommendations in minutes.
              </p>
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-soft hover:shadow-hover transition-all"
                onClick={() => navigate("/assessment")}
              >
                Start Assessment
              </Button>
            </div>
            <div className="animate-scale-in">
              <img 
                src={heroImage} 
                alt="Healthcare professional assessing posture" 
                className="rounded-2xl shadow-hover w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-xl shadow-soft hover:shadow-hover transition-all animate-fade-in">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Activity className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Quick Assessment</h3>
              <p className="text-muted-foreground">
                Answer a few simple questions about your posture and discomfort areas. Takes less than 2 minutes.
              </p>
            </div>
            <div className="bg-card p-8 rounded-xl shadow-soft hover:shadow-hover transition-all animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="bg-secondary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Analysis</h3>
              <p className="text-muted-foreground">
                Our AI evaluates your responses and identifies potential alignment issues with personalized recommendations.
              </p>
            </div>
            <div className="bg-card p-8 rounded-xl shadow-soft hover:shadow-hover transition-all animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="bg-accent w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Treatment Guide</h3>
              <p className="text-muted-foreground">
                Receive step-by-step exercises, posture tips, and activity modifications tailored to your needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Disclaimer */}
      <section className="py-12 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-3">Important Safety Notice</h3>
            <p className="text-muted-foreground">
              This guide is designed for <strong>minor alignment issues only</strong>. 
              If you experience severe pain, numbness, or injury, please consult a licensed healthcare professional immediately. 
              This tool does not replace professional medical advice.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
