import { generateVideoScript } from "@/configs/AiModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    console.log("prompt", prompt);
    
    const result = await generateVideoScript(prompt);
    console.log("result", result);
    
    return NextResponse.json({ result: result });
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
}
