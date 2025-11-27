import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Activity, Target, TrendingUp, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  rocAuc: number;
  confusionMatrix: {
    truePositive: number;
    trueNegative: number;
    falsePositive: number;
    falseNegative: number;
  };
  coefficients: {
    intercept: number;
    hours: number;
    frequency: number;
    prioritize: number;
    distracted: number;
    relationships: number;
  };
  sampleSize: number;
}

const ModelMetrics = () => {
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('predict-nomophobia', {
          body: { getMetrics: true }
        });

        if (error) throw error;
        setMetrics(data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
        toast.error('Failed to load model metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Activity className="w-12 h-12 text-primary animate-pulse mx-auto" />
          <p className="text-muted-foreground">Loading model metrics...</p>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Failed to Load Metrics</h2>
          <p className="text-muted-foreground mb-4">Unable to retrieve model performance data.</p>
          <Link to="/">
            <Button>Return Home</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const { confusionMatrix } = metrics;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 py-8">
        <Link to="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-4 animate-fade-in">
            <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Model Performance Metrics
            </h1>
            <p className="text-muted-foreground">
              Logistic regression model trained on {metrics.sampleSize} behavioral samples
            </p>
          </div>

          {/* Primary Metrics */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 bg-gradient-card border-border/50 shadow-soft">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Accuracy</h3>
              </div>
              <p className="text-3xl font-bold text-primary">{(metrics.accuracy * 100).toFixed(2)}%</p>
              <p className="text-sm text-muted-foreground mt-2">Overall prediction correctness</p>
            </Card>

            <Card className="p-6 bg-gradient-card border-border/50 shadow-soft">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Precision</h3>
              </div>
              <p className="text-3xl font-bold text-primary">{(metrics.precision * 100).toFixed(2)}%</p>
              <p className="text-sm text-muted-foreground mt-2">Positive prediction accuracy</p>
            </Card>

            <Card className="p-6 bg-gradient-card border-border/50 shadow-soft">
              <div className="flex items-center gap-3 mb-2">
                <Activity className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Recall</h3>
              </div>
              <p className="text-3xl font-bold text-primary">{(metrics.recall * 100).toFixed(2)}%</p>
              <p className="text-sm text-muted-foreground mt-2">True positive detection rate</p>
            </Card>

            <Card className="p-6 bg-gradient-card border-border/50 shadow-soft">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">F1 Score</h3>
              </div>
              <p className="text-3xl font-bold text-primary">{(metrics.f1Score * 100).toFixed(2)}%</p>
              <p className="text-sm text-muted-foreground mt-2">Harmonic mean of precision & recall</p>
            </Card>

            <Card className="p-6 bg-gradient-card border-border/50 shadow-soft">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">ROC-AUC</h3>
              </div>
              <p className="text-3xl font-bold text-primary">{(metrics.rocAuc * 100).toFixed(2)}%</p>
              <p className="text-sm text-muted-foreground mt-2">Area under ROC curve</p>
            </Card>

            <Card className="p-6 bg-gradient-card border-border/50 shadow-soft">
              <div className="flex items-center gap-3 mb-2">
                <Activity className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Sample Size</h3>
              </div>
              <p className="text-3xl font-bold text-primary">{metrics.sampleSize}</p>
              <p className="text-sm text-muted-foreground mt-2">Training data samples</p>
            </Card>
          </div>

          {/* Confusion Matrix */}
          <Card className="p-8 bg-gradient-card border-border/50 shadow-soft">
            <h2 className="text-2xl font-bold mb-6">Confusion Matrix</h2>
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div></div>
              <div className="text-center font-semibold text-muted-foreground">Predicted Absence</div>
              <div className="text-center font-semibold text-muted-foreground">Predicted Presence</div>
              
              <div className="flex items-center justify-end font-semibold text-muted-foreground pr-4">
                Actual Absence
              </div>
              <Card className="p-6 text-center bg-background/50">
                <p className="text-2xl font-bold text-primary">{confusionMatrix.trueNegative}</p>
                <p className="text-xs text-muted-foreground mt-1">True Negative</p>
              </Card>
              <Card className="p-6 text-center bg-background/50">
                <p className="text-2xl font-bold text-destructive">{confusionMatrix.falsePositive}</p>
                <p className="text-xs text-muted-foreground mt-1">False Positive</p>
              </Card>

              <div className="flex items-center justify-end font-semibold text-muted-foreground pr-4">
                Actual Presence
              </div>
              <Card className="p-6 text-center bg-background/50">
                <p className="text-2xl font-bold text-destructive">{confusionMatrix.falseNegative}</p>
                <p className="text-xs text-muted-foreground mt-1">False Negative</p>
              </Card>
              <Card className="p-6 text-center bg-background/50">
                <p className="text-2xl font-bold text-primary">{confusionMatrix.truePositive}</p>
                <p className="text-xs text-muted-foreground mt-1">True Positive</p>
              </Card>
            </div>
          </Card>

          {/* Model Coefficients */}
          <Card className="p-8 bg-gradient-card border-border/50 shadow-soft">
            <h2 className="text-2xl font-bold mb-6">Logistic Regression Coefficients</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Intercept</span>
                <span className="text-primary font-mono">{metrics.coefficients.intercept.toFixed(4)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Daily Hours (β₁)</span>
                <span className="text-primary font-mono">{metrics.coefficients.hours.toFixed(4)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Check Frequency (β₂)</span>
                <span className="text-primary font-mono">{metrics.coefficients.frequency.toFixed(4)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Prioritize Over Face-to-Face (β₃)</span>
                <span className="text-primary font-mono">{metrics.coefficients.prioritize.toFixed(4)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Distraction Level (β₄)</span>
                <span className="text-primary font-mono">{metrics.coefficients.distracted.toFixed(4)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Relationship Impact (β₅)</span>
                <span className="text-primary font-mono">{metrics.coefficients.relationships.toFixed(4)}</span>
              </div>
            </div>
          </Card>

          {/* Interpretation Guide */}
          <Card className="p-8 bg-gradient-card border-border/50 shadow-soft">
            <h2 className="text-2xl font-bold mb-4">Understanding the Metrics</h2>
            <div className="space-y-4 text-muted-foreground">
              <p><strong className="text-foreground">Accuracy:</strong> The percentage of correct predictions (both presence and absence).</p>
              <p><strong className="text-foreground">Precision:</strong> Of all predicted nomophobia cases, how many were actually correct.</p>
              <p><strong className="text-foreground">Recall (Sensitivity):</strong> Of all actual nomophobia cases, how many did the model correctly identify.</p>
              <p><strong className="text-foreground">F1 Score:</strong> Balanced measure combining precision and recall.</p>
              <p><strong className="text-foreground">ROC-AUC:</strong> Model's ability to distinguish between presence and absence classes (0.5 = random, 1.0 = perfect).</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ModelMetrics;
