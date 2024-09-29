import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import { VideoData } from "@/configs/schema";

export async function POST(req) {
    try {
        const { script, audioFileUrl, captions, imageList, createdBy } = await req.json();
        console.log("Received video data:", { script, audioFileUrl, captions, imageList, createdBy });

        const result = await db.insert(VideoData).values({
            script,
            audioFileUrl,
            captions,
            imageList,
        }).returning();

        return NextResponse.json({ result: "Video data saved successfully", data: result });
    } catch (error) {
        console.error("Error saving video data:", error);
        return NextResponse.json({ error: "Failed to save video data" }, { status: 500 });
    }
}