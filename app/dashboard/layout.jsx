'use client'
import React, { useState } from "react";
import Header from "./_components/Header";
import { VideoDataContext } from "../_context/VideoDataContext";

function DashboardLayout({ children }) {
  const [videoData, setVideoData] = useState({});
  return (
    <VideoDataContext.Provider value={{ videoData, setVideoData }}>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow">
          {children}
        </div>
      </div>
    </VideoDataContext.Provider>
  );
}

export default DashboardLayout;
