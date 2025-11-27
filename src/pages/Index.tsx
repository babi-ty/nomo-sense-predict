import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, Smartphone, TrendingUp, Shield } from "lucide-react";
import AssessmentForm from "@/components/AssessmentForm";
import Results from "@/components/Results";

export interface AssessmentResult {
  prediction: "Presence" | "Absence";
  probability: number;
  riskLevel: "Low" | "Moderate" | "High";
  recommendations: string[];
}

const Index = () => {
  const [showAssessment, setShowAssessment] = useState(false);
  const [results, setResults] = useState<AssessmentResult | null>(null);

  const handleStartAssessment = () => {
    setShowAssessment(true);
    setResults(null);
  };

  const handleBackToHome = () => {
    setShowAssessment(false);
    setResults(null);
  };

  const handleResultsReceived = (result: AssessmentResult) => {
    setResults(result);
  };

  if (results) {
    return <Results results={results} onBackToHome={handleBackToHome} />;
  }

  if (showAssessment) {
    return <AssessmentForm onBack={handleBackToHome} onResultsReceived={handleResultsReceived} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-5" />
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm">
              <Smartphone className="w-4 h-4" />
              <span>Evidence-Based Assessment Tool</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold leading-tight bg-gradient-hero bg-clip-text text-transparent">
              Nomophobia Risk Assessment
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Understand your relationship with your smartphone. Our scientifically validated tool uses machine learning to assess your risk of nomophobia—the fear of being without your mobile device.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                size="lg" 
                onClick={handleStartAssessment}
                className="bg-gradient-hero hover:opacity-90 text-white shadow-medium"
              >
                Take Assessment
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              icon: Brain,
              title: "ML-Powered Analysis",
              description: "Advanced logistic regression model trained on behavioral data for accurate predictions"
            },
            {
              icon: TrendingUp,
              title: "Evidence-Based",
              description: "Built on research-backed indicators of smartphone dependency and psychological impact"
            },
            {
              icon: Shield,
              title: "Private & Secure",
              description: "Your data is processed securely and never stored. Results are for your eyes only"
            }
          ].map((feature, idx) => (
            <Card 
              key={idx} 
              className="p-6 bg-gradient-card border-border/50 shadow-soft hover:shadow-medium transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <feature.icon className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold text-center mb-8">What is Nomophobia?</h2>
          
          <Card className="p-8 bg-gradient-card border-border/50 shadow-soft">
            <p className="text-muted-foreground leading-relaxed mb-4">
              Nomophobia (NO MObile PHone phoBIA) is a modern psychological condition characterized by the fear or anxiety of being without one's smartphone or being unable to use it. As our dependence on mobile technology grows, understanding and addressing nomophobia becomes increasingly important for mental health and wellbeing.
            </p>
            
            <div className="space-y-4 pt-4 border-t border-border/50">
              <h3 className="font-semibold text-lg">Common Signs Include:</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Anxiety when separated from your phone</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Constantly checking your device</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Difficulty focusing on tasks without your phone nearby</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Feeling disconnected when unable to access your device</span>
                </li>
              </ul>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto p-8 md:p-12 text-center bg-gradient-hero shadow-medium">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Understand Your Smartphone Relationship?
          </h2>
          <p className="text-white/90 mb-8 text-lg">
            Take our quick 5-minute assessment and receive personalized insights.
          </p>
          <Button 
            size="lg" 
            onClick={handleStartAssessment}
            variant="secondary"
            className="bg-white text-primary hover:bg-white/90 shadow-soft"
          >
            Start Assessment Now
          </Button>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>This tool is for informational purposes only and does not constitute medical advice.</p>
          <p className="mt-2">Please consult a healthcare professional for proper diagnosis and treatment.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
