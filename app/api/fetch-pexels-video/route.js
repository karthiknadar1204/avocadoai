import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { query } = await req.json();
    
    const response = await fetch(`https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=1&orientation=portrait`, {
      headers: {
        Authorization: process.env.PEXELS_API_KEY
      }
    });
    
    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // If videos are found, return the first video's picture URL
    if (data.videos && data.videos.length > 0) {
      // Find the highest quality video picture
      const video = data.videos[0];
      const videoUrl = video.video_files.reduce((highest, current) => {
        return (current.quality === 'hd' || current.quality === 'sd') && 
               (!highest || current.width > highest.width) ? current : highest;
      }, null);
      
      // Return the video thumbnail
      return NextResponse.json({ 
        result: video.image,
        videoUrl: videoUrl ? videoUrl.link : null
      });
    } else {
      // If no videos found, return a placeholder
      return NextResponse.json({ 
        result: `https://via.placeholder.com/1024x1280/333333/FFFFFF?text=${encodeURIComponent(query)}`,
        videoUrl: null
      });
    }
  } catch (error) {
    console.error("Error fetching Pexels video:", error);
    return NextResponse.json({ 
      error: "Failed to fetch video from Pexels",
      result: `https://via.placeholder.com/1024x1280/333333/FFFFFF?text=Error+Loading+Video`
    }, { status: 500 });
  }
} 