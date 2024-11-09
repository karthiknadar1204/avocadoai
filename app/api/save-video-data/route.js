import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import { VideoData } from "@/configs/schema";
import { auth } from '@clerk/nextjs/server'
import { currentUser } from '@clerk/nextjs/server'

export async function POST(req) {
    try {
        const user = await currentUser();
        const { script, audioFileUrl, captions, imageList } = await req.json();
        
        const result = await db.insert(VideoData).values({
            script,
            audioFileUrl,
            captions,
            imageList,
            userEmail: user.primaryEmailAddress.emailAddress
        }).returning();

        return NextResponse.json({ result: "Video data saved successfully", data: result });
    } catch (error) {
        console.error("Error saving video data:", error);
        return NextResponse.json({ error: "Failed to save video data" }, { status: 500 });
    }
}