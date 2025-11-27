import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AssessmentResult } from "@/pages/Index";

interface AssessmentFormProps {
  onBack: () => void;
  onResultsReceived: (result: AssessmentResult) => void;
}

const questions = [
  {
    id: "hours",
    question: "How many hours per day do you spend on your smartphone?",
    options: [
      { value: "1", label: "Less than 1 hour" },
      { value: "2", label: "1-3 hours" },
      { value: "3", label: "3-6 hours" },
      { value: "4", label: "More than 6 hours" }
    ]
  },
  {
    id: "frequency",
    question: "How frequently do you check your smartphone in a day?",
    options: [
      { value: "1", label: "Less than 10 times" },
      { value: "2", label: "10-30 times" },
      { value: "3", label: "30-50 times" },
      { value: "4", label: "More than 50 times" }
    ]
  },
  {
    id: "prioritize",
    question: "How often do you prioritize smartphone usage over face-to-face interactions?",
    options: [
      { value: "1", label: "Never" },
      { value: "2", label: "Rarely" },
      { value: "3", label: "Sometimes" },
      { value: "4", label: "Often" },
      { value: "5", label: "Always" }
    ]
  },
  {
    id: "distracted",
    question: "Do you feel distracted by your smartphone during social interactions?",
    options: [
      { value: "1", label: "No" },
      { value: "2", label: "Maybe" },
      { value: "3", label: "Yes" }
    ]
  },
  {
    id: "relationships",
    question: "How has your smartphone usage affected your relationships with family or friends?",
    options: [
      { value: "1", label: "Positive Impact" },
      { value: "2", label: "No Impact" },
      { value: "3", label: "Negative Impact" }
    ]
  }
];

const AssessmentForm = ({ onBack, onResultsReceived }: AssessmentFormProps) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const isFormComplete = questions.every(q => answers[q.id]);

  const handleSubmit = async () => {
    if (!isFormComplete) return;

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('predict-nomophobia', {
        body: { answers }
      });

      if (error) throw error;

      onResultsReceived(data);
      
      toast({
        title: "Assessment Complete",
        description: "Your results are ready!"
      });
    } catch (error) {
      console.error('Error submitting assessment:', error);
      toast({
        title: "Error",
        description: "Failed to process assessment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card className="p-6 md:p-10 bg-gradient-card border-border/50 shadow-medium">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Nomophobia Assessment</h2>
            <p className="text-muted-foreground">
              Please answer all questions honestly. This assessment takes approximately 3 minutes.
            </p>
          </div>

          <div className="space-y-8">
            {questions.map((question, index) => (
              <div key={question.id} className="space-y-4">
                <Label className="text-lg font-medium">
                  {index + 1}. {question.question}
                </Label>
                <RadioGroup
                  value={answers[question.id] || ""}
                  onValueChange={(value) => handleAnswerChange(question.id, value)}
                  className="space-y-3"
                >
                  {question.options.map((option) => (
                    <div key={option.value} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                      <Label 
                        htmlFor={`${question.id}-${option.value}`}
                        className="flex-1 cursor-pointer font-normal"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-end">
            <Button 
              size="lg"
              onClick={handleSubmit}
              disabled={!isFormComplete || isSubmitting}
              className="bg-gradient-hero hover:opacity-90 text-white shadow-medium"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Get Results'
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AssessmentForm;
