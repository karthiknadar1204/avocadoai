"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Player } from "@remotion/player";
import RemotionVideo from "./RemotionVideo";
import { Button } from "@/components/ui/button";
import { db } from "@/configs/db";
import { VideoData } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { useRouter } from "next/navigation";

const PlayerDialog = ({ playVideo, videoId, onClose }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [videoData, setVideoData] = useState(null);
  const [durationInFrame, setDurationInFrame] = useState(100);
  const router = useRouter();

  useEffect(() => {
    setOpenDialog(playVideo);
    videoId && getVideoData();
  }, [playVideo, videoId]);

  const getVideoData = async () => {
    const result = await db
      .select()
      .from(VideoData)
      .where(eq(VideoData.id, videoId));
    console.log("video data", result);
    setVideoData(result[0]);
  };

  const handleCancel = () => {
    setOpenDialog(false);
    if (onClose) {
      onClose();
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="flex flex-col items-center justify-center">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold my-5">
            Video Player
          </DialogTitle>
          <DialogDescription>
            <Player
              component={RemotionVideo}
              durationInFrames={Number(durationInFrame.toFixed(0))}
              compositionWidth={300}
              compositionHeight={450}
              fps={30}
              controls={true}
              inputProps={{
                ...videoData,
                setDurationInFrame: (frameValue) =>
                  setDurationInFrame(frameValue),
              }}
            />
            <div className="flex gap-10 mt-10">
              <Button onClick={handleCancel}>Cancel</Button>
              <Button>Export</Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerDialog;
