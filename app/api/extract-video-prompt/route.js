import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.XAI_API_KEY,
  baseURL: "https://api.x.ai/v1",
});

export async function POST(req) {
  try {
    const { caption } = await req.json();
    
    if (!caption || caption.trim() === '') {
      return NextResponse.json({ 
        query: "scenic nature view",
        error: "Empty caption provided" 
      });
    }

    const messages = [
      {
        role: "system",
        content: "You are a video search expert. Extract the most visually descriptive 3-5 word phrase from the text that would make a good search term for finding relevant stock footage. Focus on concrete visual elements, not abstract concepts."
      },
      {
        role: "user",
        content: `Extract a concise, visually descriptive search term from this caption: "${caption}"`
      }
    ];

    const completion = await openai.chat.completions.create({
      model: "grok-2-latest",
      messages: messages,
      temperature: 0.3,
      max_tokens: 50
    });

    const searchQuery = completion.choices[0].message.content.trim()
      .replace(/^["'](.*)["']$/, '$1') // Remove quotes if present
      .replace(/[^\w\s]/gi, '') // Remove punctuation
      .slice(0, 50); // Limit length

    console.log("Extracted search query:", searchQuery);
    
    return NextResponse.json({ query: searchQuery });
  } catch (error) {
    console.error("Error extracting video prompt:", error);
    return NextResponse.json({ 
      query: "scenic landscape view",
      error: "Failed to extract video prompt" 
    });
  }
} 