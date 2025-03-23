import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { query } = await req.json();
    
    const response = await fetch(`https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=5&orientation=portrait`, {
      headers: {
        Authorization: process.env.PEXELS_API_KEY
      }
    });
    
    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // If videos are found, prioritize ones with both image and video URL
    if (data.videos && data.videos.length > 0) {
      // First try to find a video that has both image and video files
      let selectedVideo = null;
      
      // Look through the results to find a video with both image and video URL
      for (const video of data.videos) {
        const hasVideoFiles = video.video_files && video.video_files.length > 0;
        const hasImage = !!video.image;
        
        if (hasVideoFiles && hasImage) {
          selectedVideo = video;
          break;
        }
      }
      
      // If no video with both was found, use the first one
      if (!selectedVideo && data.videos.length > 0) {
        selectedVideo = data.videos[0];
      }
      
      if (selectedVideo) {
        // Find the highest quality video file
        const videoUrl = selectedVideo.video_files.reduce((highest, current) => {
          return (current.quality === 'hd' || current.quality === 'sd') && 
                 (!highest || current.width > highest.width) ? current : highest;
        }, null);
        
        // Return the video thumbnail and URL
        return NextResponse.json({ 
          result: selectedVideo.image,
          videoUrl: videoUrl ? videoUrl.link : null
        });
      }
    }
    
    // If no suitable videos found, return a placeholder
    return NextResponse.json({ 
      result: `https://via.placeholder.com/1024x1280/333333/FFFFFF?text=${encodeURIComponent(query)}`,
      videoUrl: null
    });
  } catch (error) {
    console.error("Error fetching Pexels video:", error);
    return NextResponse.json({ 
      error: "Failed to fetch video from Pexels",
      result: `https://via.placeholder.com/1024x1280/333333/FFFFFF?text=Error+Loading+Video`
    }, { status: 500 });
  }
} 