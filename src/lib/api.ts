
// API functions for BHAI application

// DeepSeek API for AI chat
export const DEEPSEEK_API_KEY = "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";
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

// Function to get AI response
export async function getAIResponse(messages: { role: string; content: string }[], userContext: string = '') {
  try {
    // Add context to system message if available
    const systemMessage = {
      role: "system",
      content: "You are BHAI (Behavioral Health Assistant Interface), a compassionate and supportive AI mental health assistant. Respond with empathy to users discussing mental health concerns like depression, anxiety, and stress. Provide evidence-based suggestions for coping strategies, such as CBT techniques, breathing exercises, or journaling. For severe issues, recommend professional help and provide crisis resources. Keep responses concise, warm, and focused on wellbeing. Never diagnose or replace professional care."
    };

    // If we have user context, add it to the system message
    if (userContext) {
      systemMessage.content += `\n\n${userContext}`;
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
        "HTTP-Referer": window.location.origin,
        "X-Title": "BHAI - Behavioral Health Assistant Interface"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat-v3-0324:free",
        messages: [
          systemMessage,
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("AI response error:", error);
    return "I'm having trouble connecting right now. Please try again in a moment.";
  }
}

// Example function for analyzing assessment answers and generating prescription
export async function analyzeAssessment(type: 'mental' | 'behavioral', answers: Record<string, any>) {
  try {
    const promptMessages = [
      {
        role: "user",
        content: `Please analyze these ${type} health assessment answers and provide a personalized plan with supportive recommendations:\n${JSON.stringify(answers)}`
      }
    ];

    return await getAIResponse(promptMessages);
  } catch (error) {
    console.error("Assessment analysis error:", error);
    return "I couldn't analyze your assessment at this time. Please try again later.";
  }
}
