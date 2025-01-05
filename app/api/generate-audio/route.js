import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import { NextResponse } from "next/server";
import { storage } from "@/configs/FirebaseConfig";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const client = new TextToSpeechClient({
  apiKey: process.env.GOOGLE_API_KEY,
});

// Maximum text length to process (characters)
const MAX_TEXT_LENGTH = 5000;

export async function POST(req) {
  try {
    const { text, id } = await req.json();

    // Check text length
    if (text.length > MAX_TEXT_LENGTH) {
      return NextResponse.json(
        { error: "Text too long. Maximum length is 5000 characters." },
        { status: 400 }
      );
    }

    // Split text into chunks if needed
    const textChunks = splitTextIntoChunks(text);
    const audioBuffers = [];

    // Process each chunk
    for (const chunk of textChunks) {
      const request = {
        input: { text: chunk },
        voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
        audioConfig: { 
          audioEncoding: "MP3",
          speakingRate: 1.2, // Slightly faster to reduce processing time
          sampleRateHertz: 24000 // Lower quality but faster processing
        },
      };

      const [response] = await client.synthesizeSpeech(request);
      audioBuffers.push(Buffer.from(response.audioContent, "binary"));
    }

    // Combine audio buffers if multiple chunks
    const finalAudioBuffer = Buffer.concat(audioBuffers);

    // Upload with timeout
    const storageRef = ref(storage, `avocado-ai-files/${id}.mp3`);
    const uploadTask = await Promise.race([
      uploadBytesResumable(storageRef, finalAudioBuffer, {
        contentType: "audio/mp3",
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Upload timeout")), 15000)
      ),
    ]);

    const url = await getDownloadURL(uploadTask.ref);
    return NextResponse.json({ result: url });

  } catch (error) {
    console.error("Error in audio generation:", error);
    return NextResponse.json(
      { error: "Failed to generate audio" },
      { status: 500 }
    );
  }
}

function splitTextIntoChunks(text, maxChunkLength = 1000) {
  const chunks = [];
  let start = 0;

  while (start < text.length) {
    // Find the last period or comma before maxChunkLength
    let end = Math.min(start + maxChunkLength, text.length);
    if (end < text.length) {
      const lastPeriod = text.lastIndexOf('.', end);
      const lastComma = text.lastIndexOf(',', end);
      end = Math.max(lastPeriod, lastComma);
      if (end <= start) end = Math.min(start + maxChunkLength, text.length);
    }
    chunks.push(text.slice(start, end).trim());
    start = end;
  }

  return chunks;
}
