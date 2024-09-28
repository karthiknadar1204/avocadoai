import { AssemblyAI } from "assemblyai";

export async function POST(req, res) {
  try {
    const { audioUrl } = await req.json();
    const client = new AssemblyAI({
      apiKey: process.env.ASSEMBLY_API_KEY,
    });

    const FILE_URL = audioUrl;
    const data = {
      audio: FILE_URL,
    };

    const transcript = await client.transcripts.transcribe(data);
    console.log(transcript.words);
    return new Response(JSON.stringify({ success: true, transcript: transcript.text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in POST /api/generate-caption:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}