
import { GoogleGenAI } from "@google/genai";

export async function askGemini(prompt: string, history: { role: 'user' | 'model', text: string }[] = []) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    
    // We use a simplified model setup for quick responses in a chat interface
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history.map(h => ({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: h.text }] })),
        { parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: "You are a helpful, witty, and friendly AI assistant integrated into a Discord-like application. Keep your responses relatively concise and formatted using Markdown, similar to how users chat on Discord. Use emojis occasionally.",
        temperature: 0.8,
        topP: 0.95,
      }
    });

    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error: Failed to connect to my brain. Check your API configuration.";
  }
}
