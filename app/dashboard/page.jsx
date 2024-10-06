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
import Image from "next/image";
import { cn } from "@/lib/utils";

const videoTitles = [
  "Cosmic Journey", "Ocean Depths", "Mountain Peak", "Urban Jungle",
  "Desert Mirage", "Forest Whispers", "Arctic Silence", "Tropical Paradise",
  "Neon Nights", "Rustic Charm", "Futuristic Vision", "Ancient Wonders",
  "Serene Meadow", "Stormy Seas", "Autumn Leaves", "Spring Bloom",
  "Starry Night", "Misty Morning", "Sunset Serenade", "Lunar Landing",
  "Volcanic Fury", "Gentle Stream", "Bustling Market", "Quiet Library",
  "Snowy Peaks", "Golden Fields", "Mystic Ruins", "Cosmic Dance",
  "Underwater World", "Skyline View"
];

const Card = React.memo(({
  video,
  index,
  hovered,
  setHovered,
  onCardClick
}) => (
  <div
    onMouseEnter={() => setHovered(index)}
    onMouseLeave={() => setHovered(null)}
    onClick={() => onCardClick(video.id)}
    className={cn(
      "rounded-xl relative bg-gray-800 bg-opacity-30 overflow-hidden shadow-lg cursor-pointer transition-all duration-300 ease-out border border-gray-700/50",
      hovered !== null && hovered !== index && "blur-sm scale-[0.98]",
      "hover:shadow-gray-700/30 hover:scale-105"
    )}>
    <div className="aspect-w-2 aspect-h-3 w-full">
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
        className="w-full h-full object-cover transition-opacity duration-300 hover:opacity-90"
      />
    </div>
    <div
      className={cn(
        "absolute inset-0 bg-black/50 flex items-end py-4 sm:py-6 md:py-8 px-2 sm:px-3 md:px-4 transition-opacity duration-300",
        hovered === index ? "opacity-100" : "opacity-0"
      )}>
      <div
        className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200">
        {video.title || videoTitles[index % videoTitles.length]}
      </div>
    </div>
  </div>
));

Card.displayName = "Card";

const Page = () => {
  const [videoList, setVideoList] = useState([]);
  const [playVideo, setPlayVideo] = useState(false);
  const [videoId, setVideoId] = useState(null);
  const [hovered, setHovered] = useState(null);

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

  const handleCardClick = (id) => {
    setPlayVideo(true);
    setVideoId(id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-gray-200">
      <div className="container mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 md:mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-0 text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400">Dashboard</h2>
          <Link href="/dashboard/create-new">
            <Button className="w-full sm:w-auto bg-gradient-to-r from-gray-800 to-gray-600 hover:from-gray-700 hover:to-gray-500 text-white font-semibold py-2 px-4 sm:px-6 rounded-full shadow-lg hover:shadow-xl transition duration-300">
              + Create New Video
            </Button>
          </Link>
        </div>
        {videoList.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
            {videoList.map((video, index) => (
              <Card
                key={video.id}
                video={video}
                index={index}
                hovered={hovered}
                setHovered={setHovered}
                onCardClick={handleCardClick}
              />
            ))}
          </div>
        )}
        <PlayerDialog playVideo={playVideo} videoId={videoId} onClose={handleCloseDialog} />
      </div>
    </div>
  );
};

export default Page;
