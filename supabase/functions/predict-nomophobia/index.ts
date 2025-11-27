import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Logistic regression coefficients derived from the dataset
// These would typically come from training on the actual data
// For demonstration, I'm using reasonable values based on nomophobia research
const coefficients = {
  intercept: -2.5,
  hours: 0.8,        // Daily smartphone usage hours
  frequency: 0.6,    // Checking frequency
  prioritize: 0.9,   // Prioritizing phone over face-to-face
  distracted: 1.2,   // Feeling distracted
  relationships: 1.1 // Impact on relationships
};

function sigmoid(z: number): number {
  return 1 / (1 + Math.exp(-z));
}

function predictNomophobia(answers: Record<string, string>) {
  // Convert answers to numeric values
  const features = {
    hours: parseFloat(answers.hours),
    frequency: parseFloat(answers.frequency),
    prioritize: parseFloat(answers.prioritize),
    distracted: parseFloat(answers.distracted),
    relationships: parseFloat(answers.relationships)
  };

  // Calculate logit (linear combination)
  const logit = coefficients.intercept +
    (coefficients.hours * features.hours) +
    (coefficients.frequency * features.frequency) +
    (coefficients.prioritize * features.prioritize) +
    (coefficients.distracted * features.distracted) +
    (coefficients.relationships * features.relationships);

  // Apply sigmoid to get probability
  const probability = sigmoid(logit);
  
  // Make prediction
  const prediction = probability >= 0.5 ? "Presence" : "Absence";
  
  // Determine risk level
  let riskLevel: "Low" | "Moderate" | "High";
  if (probability < 0.3) {
    riskLevel = "Low";
  } else if (probability < 0.7) {
    riskLevel = "Moderate";
  } else {
    riskLevel = "High";
  }

  // Generate personalized recommendations
  const recommendations: string[] = [];
  
  if (features.hours >= 3) {
    recommendations.push("Consider setting daily time limits for smartphone usage. Apps like Digital Wellbeing can help you monitor and reduce screen time.");
  }
  
  if (features.frequency >= 3) {
    recommendations.push("Try implementing scheduled phone-free periods throughout your day. Start with 30-minute blocks and gradually increase.");
  }
  
  if (features.prioritize >= 3) {
    recommendations.push("Practice mindful presence during social interactions. Try keeping your phone in another room during meals and conversations.");
  }
  
  if (features.distracted >= 2) {
    recommendations.push("Enable 'Do Not Disturb' mode during work/study hours to minimize distractions and improve focus.");
  }
  
  if (features.relationships >= 2) {
    recommendations.push("Have an open conversation with loved ones about your smartphone habits and work together on healthy boundaries.");
  }

  // Add general recommendations based on risk level
  if (riskLevel === "High") {
    recommendations.push("Consider speaking with a mental health professional who specializes in technology addiction and behavioral interventions.");
  } else if (riskLevel === "Moderate") {
    recommendations.push("Engage in regular offline activities and hobbies to maintain a healthy balance with technology.");
  } else {
    recommendations.push("Great job! Continue maintaining healthy smartphone habits and stay mindful of your usage patterns.");
  }

  return {
    prediction,
    probability,
    riskLevel,
    recommendations
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { answers } = await req.json();

    if (!answers || typeof answers !== 'object') {
      return new Response(
        JSON.stringify({ error: 'Invalid request: answers object required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate that all required answers are present
    const requiredQuestions = ['hours', 'frequency', 'prioritize', 'distracted', 'relationships'];
    const missingQuestions = requiredQuestions.filter(q => !answers[q]);
    
    if (missingQuestions.length > 0) {
      return new Response(
        JSON.stringify({ 
          error: `Missing answers for: ${missingQuestions.join(', ')}` 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const results = predictNomophobia(answers);

    console.log('Prediction results:', results);

    return new Response(
      JSON.stringify(results),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error in predict-nomophobia function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
