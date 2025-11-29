import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Training data extracted from the uploaded Excel file
const trainingData = [
  { hours: 4, frequency: 3, prioritize: 5, distracted: 2, relationships: 3, label: 1 },
  { hours: 3, frequency: 2, prioritize: 3, distracted: 3, relationships: 3, label: 1 },
  { hours: 2, frequency: 3, prioritize: 3, distracted: 2, relationships: 1, label: 1 },
  { hours: 3, frequency: 3, prioritize: 3, distracted: 3, relationships: 1, label: 1 },
  { hours: 4, frequency: 4, prioritize: 2, distracted: 3, relationships: 3, label: 1 },
  { hours: 4, frequency: 2, prioritize: 3, distracted: 1, relationships: 2, label: 0 },
  { hours: 3, frequency: 2, prioritize: 4, distracted: 3, relationships: 3, label: 1 },
  { hours: 3, frequency: 3, prioritize: 2, distracted: 1, relationships: 2, label: 1 },
  { hours: 4, frequency: 4, prioritize: 4, distracted: 2, relationships: 1, label: 1 },
  { hours: 3, frequency: 4, prioritize: 2, distracted: 3, relationships: 2, label: 1 },
  { hours: 2, frequency: 2, prioritize: 4, distracted: 2, relationships: 2, label: 1 },
  { hours: 3, frequency: 4, prioritize: 4, distracted: 3, relationships: 3, label: 1 },
  { hours: 2, frequency: 2, prioritize: 3, distracted: 2, relationships: 2, label: 1 },
  { hours: 3, frequency: 3, prioritize: 3, distracted: 2, relationships: 2, label: 1 },
  { hours: 3, frequency: 3, prioritize: 4, distracted: 1, relationships: 2, label: 1 },
  { hours: 3, frequency: 2, prioritize: 2, distracted: 3, relationships: 3, label: 1 },
  { hours: 2, frequency: 2, prioritize: 3, distracted: 1, relationships: 1, label: 1 },
  { hours: 2, frequency: 3, prioritize: 2, distracted: 1, relationships: 3, label: 0 },
  { hours: 4, frequency: 2, prioritize: 1, distracted: 1, relationships: 2, label: 0 },
  { hours: 3, frequency: 2, prioritize: 3, distracted: 2, relationships: 1, label: 1 },
  { hours: 3, frequency: 2, prioritize: 4, distracted: 2, relationships: 3, label: 0 },
  { hours: 2, frequency: 4, prioritize: 3, distracted: 2, relationships: 1, label: 1 },
  { hours: 2, frequency: 3, prioritize: 4, distracted: 3, relationships: 3, label: 1 },
  { hours: 3, frequency: 3, prioritize: 4, distracted: 3, relationships: 3, label: 1 },
  { hours: 3, frequency: 4, prioritize: 4, distracted: 3, relationships: 3, label: 1 },
  { hours: 2, frequency: 4, prioritize: 5, distracted: 2, relationships: 3, label: 1 },
  { hours: 2, frequency: 3, prioritize: 3, distracted: 3, relationships: 3, label: 1 },
  { hours: 2, frequency: 3, prioritize: 3, distracted: 2, relationships: 2, label: 1 },
  { hours: 2, frequency: 2, prioritize: 3, distracted: 1, relationships: 2, label: 0 },
  { hours: 3, frequency: 4, prioritize: 4, distracted: 3, relationships: 3, label: 1 },
  { hours: 2, frequency: 4, prioritize: 3, distracted: 3, relationships: 1, label: 1 },
  { hours: 2, frequency: 4, prioritize: 3, distracted: 3, relationships: 1, label: 1 },
  { hours: 3, frequency: 3, prioritize: 4, distracted: 3, relationships: 2, label: 1 },
  { hours: 2, frequency: 2, prioritize: 3, distracted: 3, relationships: 2, label: 1 },
  { hours: 2, frequency: 3, prioritize: 3, distracted: 3, relationships: 2, label: 1 },
  { hours: 2, frequency: 3, prioritize: 4, distracted: 1, relationships: 2, label: 1 },
  { hours: 2, frequency: 4, prioritize: 4, distracted: 3, relationships: 3, label: 1 },
  { hours: 4, frequency: 3, prioritize: 4, distracted: 3, relationships: 2, label: 1 },
  { hours: 2, frequency: 2, prioritize: 3, distracted: 3, relationships: 2, label: 1 },
  { hours: 4, frequency: 2, prioritize: 5, distracted: 1, relationships: 3, label: 0 },
  { hours: 1, frequency: 1, prioritize: 1, distracted: 1, relationships: 3, label: 0 },
  { hours: 1, frequency: 1, prioritize: 1, distracted: 1, relationships: 3, label: 0 },
  { hours: 2, frequency: 3, prioritize: 2, distracted: 1, relationships: 3, label: 1 },
  { hours: 3, frequency: 3, prioritize: 2, distracted: 1, relationships: 2, label: 1 },
  { hours: 4, frequency: 3, prioritize: 3, distracted: 3, relationships: 3, label: 1 },
  { hours: 4, frequency: 4, prioritize: 3, distracted: 3, relationships: 3, label: 1 },
  { hours: 4, frequency: 4, prioritize: 3, distracted: 3, relationships: 3, label: 1 },
  { hours: 3, frequency: 3, prioritize: 4, distracted: 3, relationships: 2, label: 1 },
  { hours: 2, frequency: 1, prioritize: 2, distracted: 1, relationships: 2, label: 0 },
  { hours: 2, frequency: 2, prioritize: 3, distracted: 1, relationships: 2, label: 0 },
  { hours: 2, frequency: 3, prioritize: 2, distracted: 3, relationships: 3, label: 1 },
  { hours: 3, frequency: 3, prioritize: 4, distracted: 3, relationships: 3, label: 1 },
  { hours: 4, frequency: 4, prioritize: 5, distracted: 3, relationships: 3, label: 1 },
  { hours: 4, frequency: 4, prioritize: 3, distracted: 3, relationships: 3, label: 1 },
  { hours: 3, frequency: 3, prioritize: 3, distracted: 3, relationships: 3, label: 1 },
  { hours: 3, frequency: 2, prioritize: 3, distracted: 3, relationships: 2, label: 1 }
];

// Simple logistic regression implementation
function trainLogisticRegression(data: typeof trainingData) {
  const learningRate = 0.1;
  const iterations = 1000;
  
  // Initialize coefficients
  let coefficients = {
    intercept: 0,
    hours: 0,
    frequency: 0,
    prioritize: 0,
    distracted: 0,
    relationships: 0
  };

  // Gradient descent
  for (let iter = 0; iter < iterations; iter++) {
    let gradients = { intercept: 0, hours: 0, frequency: 0, prioritize: 0, distracted: 0, relationships: 0 };
    
    for (const sample of data) {
      const prediction = sigmoid(
        coefficients.intercept +
        coefficients.hours * sample.hours +
        coefficients.frequency * sample.frequency +
        coefficients.prioritize * sample.prioritize +
        coefficients.distracted * sample.distracted +
        coefficients.relationships * sample.relationships
      );
      
      const error = prediction - sample.label;
      gradients.intercept += error;
      gradients.hours += error * sample.hours;
      gradients.frequency += error * sample.frequency;
      gradients.prioritize += error * sample.prioritize;
      gradients.distracted += error * sample.distracted;
      gradients.relationships += error * sample.relationships;
    }
    
    // Update coefficients
    coefficients.intercept -= learningRate * gradients.intercept / data.length;
    coefficients.hours -= learningRate * gradients.hours / data.length;
    coefficients.frequency -= learningRate * gradients.frequency / data.length;
    coefficients.prioritize -= learningRate * gradients.prioritize / data.length;
    coefficients.distracted -= learningRate * gradients.distracted / data.length;
    coefficients.relationships -= learningRate * gradients.relationships / data.length;
  }

  return coefficients;
}

function sigmoid(z: number): number {
  return 1 / (1 + Math.exp(-z));
}

// Train the model
const coefficients = trainLogisticRegression(trainingData);

function calculateMetrics() {
  let truePositive = 0, trueNegative = 0, falsePositive = 0, falseNegative = 0;
  const predictions: { actual: number; predicted: number; probability: number }[] = [];

  for (const sample of trainingData) {
    const logit = coefficients.intercept +
      coefficients.hours * sample.hours +
      coefficients.frequency * sample.frequency +
      coefficients.prioritize * sample.prioritize +
      coefficients.distracted * sample.distracted +
      coefficients.relationships * sample.relationships;
    
    const probability = sigmoid(logit);
    const predicted = probability >= 0.5 ? 1 : 0;
    
    predictions.push({ actual: sample.label, predicted, probability });

    if (sample.label === 1 && predicted === 1) truePositive++;
    else if (sample.label === 0 && predicted === 0) trueNegative++;
    else if (sample.label === 0 && predicted === 1) falsePositive++;
    else if (sample.label === 1 && predicted === 0) falseNegative++;
  }

  const accuracy = (truePositive + trueNegative) / trainingData.length;
  const precision = truePositive / (truePositive + falsePositive) || 0;
  const recall = truePositive / (truePositive + falseNegative) || 0;
  const f1Score = 2 * (precision * recall) / (precision + recall) || 0;

  // Calculate ROC-AUC
  predictions.sort((a, b) => b.probability - a.probability);
  let tpr = 0, fpr = 0;
  let rocAuc = 0;
  const positives = trainingData.filter(s => s.label === 1).length;
  const negatives = trainingData.length - positives;
  
  for (const pred of predictions) {
    if (pred.actual === 1) {
      tpr += 1 / positives;
    } else {
      rocAuc += tpr / negatives;
      fpr += 1 / negatives;
    }
  }

  return {
    accuracy,
    precision,
    recall,
    f1Score,
    rocAuc,
    confusionMatrix: {
      truePositive,
      trueNegative,
      falsePositive,
      falseNegative
    },
    coefficients,
    sampleSize: trainingData.length
  };
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

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();

    // Check if requesting metrics
    if (body.getMetrics) {
      const metrics = calculateMetrics();
      return new Response(
        JSON.stringify(metrics),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Otherwise, handle prediction request
    const { answers } = body;

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
