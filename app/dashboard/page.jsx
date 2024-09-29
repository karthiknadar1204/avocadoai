"use client";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import EmptyState from "./_components/EmptyState";
import Link from "next/link";
import { db } from "@/configs/db";
import { VideoData } from "@/configs/schema";
import { Thumbnail } from "@remotion/player";
import RemotionVideo from "./_components/RemotionVideo";
import PlayerDialog from "./_components/PlayerDialog";

const Page = () => {
  const [videoList, setVideoList] = useState([]);
  const [playVideo, setPlayVideo] = useState(false);
  const [videoId, setVideoId] = useState(null);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const data = await db.select().from(VideoData);
        setVideoList(data);
        console.log("Fetched video data:", data);
      } catch (error) {
        console.error("Error fetching video data:", error);
      }
    };

    fetchVideoData();
  }, []);

  console.log("Current videoList state:", videoList);

  const handleCloseDialog = () => {
    setPlayVideo(false);
    setVideoId(null);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold mb-4 sm:mb-0">Dashboard</h2>
        <Link href="/dashboard/create-new">
          <Button className="w-full sm:w-auto">+ Create New Video</Button>
        </Link>
      </div>
      {videoList.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {videoList.map((video) => (
            <div key={video.id} className="border rounded-lg p-4 shadow-sm cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={() => {
              setPlayVideo(true);
              setVideoId(video.id);
            }}>
              <Thumbnail
                component={RemotionVideo}
                compositionWidth={300}
                compositionHeight={450}
                frameToDisplay={30}
                durationInFrames={120}
                fps={30}
                inputProps={{
                  ...video,
                  setDurationInFrame: (value) => console.log("setDurationInFrame", value),
                }}
              />
            </div>
          ))}
        </div>
      )}
      <PlayerDialog playVideo={playVideo} videoId={videoId} onClose={handleCloseDialog} />
    </div>
  );
};

export default Page;
