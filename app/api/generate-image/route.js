import Replicate from "replicate";
import { NextResponse } from 'next/server';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/configs/FirebaseConfig";
import axios from "axios";

export async function POST(req) {
    try {
        const replicate = new Replicate({
            auth: process.env.REPLICATE_API_TOKEN,
        });
        const { prompt } = await req.json();
        const input = { prompt: prompt, height: 1280, width: 1024, num_outputs: 1 };
        const output = await replicate.run("bytedance/sdxl-lightning-4step:5599ed30703defd1d160a25a63321b4dec97101d98b4674bcc56e41f62f35637", { input });
        
        const imageBuffer = await fetchImageAsBuffer(output[0]);
        const fileName = 'avocado-ai-files/' + Date.now() + '.png';
        const storageRef = ref(storage, fileName);
        
        await uploadBytes(storageRef, imageBuffer);
        const downloadUrl = await getDownloadURL(storageRef);
        
        console.log(downloadUrl);
        return NextResponse.json({ 'result': downloadUrl });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to generate image" }, { status: 500 });
    }
}

const fetchImageAsBuffer = async (imageUrl) => {
    try {
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        return Buffer.from(response.data, 'binary');
    } catch (error) {
        console.error(error);
        return null;
    }
}