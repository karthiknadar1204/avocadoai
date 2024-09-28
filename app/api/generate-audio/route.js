import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import { NextResponse } from "next/server";
import util from "util";
import fs from "fs";
import { storage } from "@/configs/FirebaseConfig";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const client = new TextToSpeechClient({
  apiKey: process.env.GOOGLE_API_KEY,
});

export async function POST(req, res) {
  const { text, id } = await req.json();
  const storageRef = ref(storage,`avocado-ai-files/${id}.mp3`);

  const request = {
    input: { text: text },
    // Select the language and SSML voice gender (optional)
    voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
    // select the type of audio encoding
    audioConfig: { audioEncoding: "MP3" },
  };

  const [response] = await client.synthesizeSpeech(request);
  
const audioBuffer = Buffer.from(response.audioContent, "binary");
const uploadTask = await uploadBytesResumable(storageRef, audioBuffer,{contentType: "audio/mp3"});
const url = await getDownloadURL(uploadTask.ref);
console.log("Audio content written to file: output.mp3");
console.log("url",url);

  return NextResponse.json({ result: "success" });
}
