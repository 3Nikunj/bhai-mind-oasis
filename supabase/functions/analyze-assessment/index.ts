
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const DEEPSEEK_API_KEY = "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";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { type, answers } = await req.json();
    
    console.log(`Analyzing ${type} assessment:`, JSON.stringify(answers));

    // Format answers for analysis
    const questionsMap = type === 'mental' 
      ? getMentalHealthQuestions() 
      : getBehavioralHealthQuestions();
    
    let formattedAnswers = '';
    Object.entries(answers).forEach(([questionId, value]) => {
      const questionText = questionsMap[questionId]?.text || questionId;
      const option = questionsMap[questionId]?.options?.[Number(value)] || value;
      formattedAnswers += `Question: ${questionText}\nAnswer: ${option}\n\n`;
    });

    const promptText = `As a mental health professional, please analyze these ${type} health assessment answers and provide a detailed, supportive analysis with specific recommendations:\n\n${formattedAnswers}`;

    console.log("Sending prompt to DeepSeek API");
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
        "HTTP-Referer": Deno.env.get('SUPABASE_URL') || '',
        "X-Title": "BHAI - Behavioral Health Assistant Interface"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat-v3-0324:free",
        messages: [
          {
            role: "system",
            content: "You are a compassionate mental health professional providing assessment analysis. Focus on supportive, actionable recommendations while being sensitive to the user's situation."
          },
          {
            role: "user",
            content: promptText
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    const data = await response.json();
    console.log("Received response from DeepSeek API");
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error("Invalid response format:", data);
      throw new Error("Invalid response from AI service");
    }
    
    const analysis = data.choices[0].message.content;
    console.log("Analysis result:", analysis.substring(0, 100) + "...");

    return new Response(JSON.stringify({ result: analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Helper functions to map question IDs to their text and options
function getMentalHealthQuestions() {
  const questions = {
    'q1': { 
      text: 'Over the past 2 weeks, how often have you felt little interest or pleasure in doing things?',
      options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day']
    },
    'q2': { 
      text: 'Over the past 2 weeks, how often have you felt down, depressed, or hopeless?',
      options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day']
    },
    'q3': { 
      text: 'Over the past 2 weeks, how often have you had trouble falling or staying asleep, or sleeping too much?',
      options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day']
    },
    'q4': { 
      text: 'Over the past 2 weeks, how often have you felt tired or had little energy?',
      options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day']
    },
    'q5': { 
      text: 'Over the past 2 weeks, how often have you had poor appetite or overeating?',
      options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day']
    },
    'q6': { 
      text: 'Over the past 2 weeks, how often have you felt bad about yourself — or that you are a failure or have let yourself or your family down?',
      options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day']
    },
    'q7': { 
      text: 'Over the past 2 weeks, how often have you had trouble concentrating on things, such as reading or watching TV?',
      options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day']
    },
    'q8': { 
      text: 'Over the past 2 weeks, how often have you felt nervous, anxious, or on edge?',
      options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day']
    },
    'q9': { 
      text: 'Over the past 2 weeks, how often have you been unable to stop or control worrying?',
      options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day']
    },
    'q10': { 
      text: 'Over the past 2 weeks, how often have you had thoughts that you would be better off dead or of hurting yourself in some way?',
      options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day']
    },
    'q11': { 
      text: 'How difficult have these problems made it for you to do your work, take care of things at home, or get along with other people?',
      options: ['Not difficult at all', 'Somewhat difficult', 'Very difficult', 'Extremely difficult']
    },
    'q12': { 
      text: 'Do you have anyone you can talk to about your problems or concerns?',
      options: ['Yes', 'No']
    },
    'q13': { 
      text: 'Have you previously been diagnosed with a mental health condition?',
      options: ['Yes', 'No']
    },
    'q14': { 
      text: 'Have you noticed any triggers that worsen your mental health?',
      options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day']
    },
    'q15': { 
      text: 'How often do you engage in activities that you enjoy or find fulfilling?',
      options: ['Daily', 'Several times a week', 'Once a week', 'Rarely']
    }
  };

  return questions;
}

function getBehavioralHealthQuestions() {
  const questions = {
    'b1': { 
      text: 'How often do you engage in physical activity or exercise?',
      options: ['Daily', '3-4 times a week', 'Once a week', 'Rarely or never']
    },
    'b2': { 
      text: 'How would you rate your overall sleep quality?',
      options: ['Very good', 'Good', 'Fair', 'Poor']
    },
    'b3': { 
      text: 'How often do you consume alcohol?',
      options: ['Never', 'Occasionally', 'Weekly', 'Daily']
    },
    'b4': { 
      text: 'Do you currently use tobacco products?',
      options: ['No', 'Occasionally', 'Regularly', 'Heavily']
    },
    'b5': { 
      text: 'How often do you eat a balanced diet with fruits and vegetables?',
      options: ['Never', 'Sometimes', 'Often', 'Very often']
    },
    'b6': { 
      text: 'How many hours per day do you typically spend on screens (TV, computer, phone)?',
      options: ['Less than 2 hours', '2-4 hours', '4-6 hours', 'More than 6 hours']
    },
    'b7': { 
      text: 'How often do you engage in social activities with friends or family?',
      options: ['Never', 'Sometimes', 'Often', 'Very often']
    },
    'b8': { 
      text: 'How often do you practice relaxation techniques or mindfulness?',
      options: ['Never', 'Sometimes', 'Often', 'Very often']
    },
    'b9': { 
      text: 'How often do you feel that everyday stressors overwhelm you?',
      options: ['Never', 'Sometimes', 'Often', 'Very often']
    },
    'b10': { 
      text: 'How would you rate your work-life balance?',
      options: ['Never', 'Sometimes', 'Often', 'Very often']
    },
    'b11': { 
      text: 'Have you experienced any major life changes in the past year?',
      options: ['None', 'One minor change', 'One major change', 'Multiple major changes']
    },
    'b12': { 
      text: 'How often do you find yourself procrastinating on important tasks?',
      options: ['Never', 'Sometimes', 'Often', 'Very often']
    },
    'b13': { 
      text: 'How often do you experience physical symptoms like headaches, stomachaches, or muscle tension?',
      options: ['Never', 'Sometimes', 'Often', 'Very often']
    },
    'b14': { 
      text: 'How often do you feel satisfied with your daily accomplishments?',
      options: ['Never', 'Sometimes', 'Often', 'Very often']
    },
    'b15': { 
      text: 'How often do you engage in activities that give you a sense of purpose?',
      options: ['Never', 'Sometimes', 'Often', 'Very often']
    }
  };

  return questions;
}
