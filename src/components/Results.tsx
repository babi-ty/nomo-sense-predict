import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Home, TrendingUp } from "lucide-react";
import { AssessmentResult } from "@/pages/Index";

interface ResultsProps {
  results: AssessmentResult;
  onBackToHome: () => void;
}

const Results = ({ results, onBackToHome }: ResultsProps) => {
  const getRiskColor = (level: string) => {
    switch (level) {
      case "Low": return "text-green-600";
      case "Moderate": return "text-yellow-600";
      case "High": return "text-red-600";
      default: return "text-muted-foreground";
    }
  };

  const getRiskIcon = (level: string) => {
    return level === "Low" ? CheckCircle : AlertCircle;
  };

  const RiskIcon = getRiskIcon(results.riskLevel);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="p-6 md:p-10 bg-gradient-card border-border/50 shadow-medium animate-fade-in">
          <div className="text-center mb-8">
            <div className={`inline-flex items-center gap-2 mb-4 ${getRiskColor(results.riskLevel)}`}>
              <RiskIcon className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Your Assessment Results</h2>
            <p className="text-muted-foreground">Based on your responses, here's what we found</p>
          </div>

          {/* Prediction Card */}
          <Card className="p-6 mb-6 bg-background/50 border-border/50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">Nomophobia Status</h3>
                <p className="text-3xl font-bold text-primary">{results.prediction}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-1">Confidence Level</p>
                <p className="text-2xl font-bold">{Math.round(results.probability * 100)}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span className={`font-semibold ${getRiskColor(results.riskLevel)}`}>
                {results.riskLevel} Risk Level
              </span>
            </div>
          </Card>

          {/* Recommendations */}
          <div className="space-y-4 mb-8">
            <h3 className="text-xl font-semibold">Recommendations</h3>
            {results.recommendations.map((recommendation, index) => (
              <Card key={index} className="p-4 bg-background/50 border-border/50">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </div>
                  <p className="text-muted-foreground flex-1">{recommendation}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Disclaimer */}
          <Card className="p-4 mb-6 bg-muted/30 border-border/50">
            <p className="text-sm text-muted-foreground">
              <strong>Important:</strong> This assessment is for informational purposes only and does not constitute medical advice. If you're experiencing significant distress related to smartphone use, please consult a mental health professional.
            </p>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={onBackToHome}
              className="bg-gradient-hero hover:opacity-90 text-white shadow-medium"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Results;
