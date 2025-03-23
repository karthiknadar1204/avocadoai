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

  // This function ensures we always have an integer value for duration
  const setDurationInFrameHandler = (value) => {
    // Convert to integer by rounding up
    const intValue = Math.ceil(value);
    setDurationInFrame(intValue);
  };

  const handleCancel = () => {
    setOpenDialog(false);
    if (onClose) {
      onClose();
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-[90%] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Video Preview</DialogTitle>
          <DialogDescription>
            Here's a preview of your generated video
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          {videoData && (
            <Player
              component={RemotionVideo}
              durationInFrames={Math.ceil(durationInFrame)}
              fps={30}
              compositionWidth={1280}
              compositionHeight={720}
              style={{ width: "100%" }}
              controls
              inputProps={{
                script: videoData.script,
                audioFileUrl: videoData.audioFileUrl,
                captions: videoData.captions,
                imageList: videoData.imageList,
                videoUrls: videoData.videoUrls,
                isGettyImages: videoData.isGettyImages,
                setDurationInFrame: setDurationInFrameHandler,
              }}
            />
          )}
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={handleCancel}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerDialog;
