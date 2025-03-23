"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import SelectTopic from "./_components/SelectTopic";
import SelectStyle from "./_components/SelectStyle";
import SelectDuration from "./_components/SelectDuration";
import { Button } from "@/components/ui/button";
import CustomLoading from "./_components/CustomLoading";
import { v4 as uuidv4 } from "uuid";
import { useContext } from "react";
import { VideoDataContext } from "../../_context/VideoDataContext";
import PlayerDialog from "../_components/PlayerDialog";
import ImageSourceToggle from "./_components/ImageSourceToggle";

const FILEURL =
  "https://firebasestorage.googleapis.com/v0/b/avocadoai-5a34b.appspot.com/o/avocado-ai-files%2F5b2dc991-d45f-42fd-9bad-ff696c32bc56.mp3?alt=media&token=6cf83e21-98ee-4a9d-82a1-dba0b6676ca4";

const CreateNew = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [videoScript, setVideoScript] = useState(null);
  const [audioFileUrl, setAudioFileUrl] = useState(null);
  const [captions, setCaptions] = useState(null);
  const [audio, setAudio] = useState(null);
  const [images, setImages] = useState([]);
  const [videoScriptData, setVideoScriptData] = useState(null);
  const [playVideo, setPlayVideo] = useState(false);
  const [videoId, setVideoId] = useState(null);
  const [useGettyImages, setUseGettyImages] = useState(false);
  const [videoUrls, setVideoUrls] = useState([]);

  const { videoData, setVideoData } = useContext(VideoDataContext);

  const onHandleInputChange = (fieldName, fieldValue) => {
    setFormData((prev) => ({ ...prev, [fieldName]: fieldValue }));
  };

  const onCreateClickHandler = () => {
    getVideoScript();
  };

  const getVideoScript = async () => {
    try {
      setLoading(true);
      console.log("formData Duration", formData.duration);
      console.log("formData Topic", formData.topic);
      console.log("formData Image Style", formData.imageStyle);
      console.log("Using Getty Images:", useGettyImages);

      const prompt =
        "write a script to generate " +
        formData.duration +
        " on a topic " +
        formData.topic +
        " along with AI image prompt in " +
        formData.imageStyle +
        " format for each scene and give me result in JSON format with imagePrompt and contextText as field";
      console.log("prompt", prompt);

      const response = await axios.post("/api/get-video-script", {
        prompt: prompt,
      });
      console.log("data", response.data);

      if (response.data && response.data.result) {
        setVideoData((prev) => ({ ...prev, videoScript: response.data.result }));
        setVideoScript(response.data.result);
        setVideoScriptData(response.data.result);
        const audioUrl = await GenerateAudio(response.data.result);
        setAudioFileUrl(audioUrl);
      } else {
        console.error("Invalid response format from get-video-script API");
      }
    } catch (error) {
      console.error("Error fetching video script:", error);
    } finally {
      setLoading(false);
    }
  };

  const GenerateAudio = async (script) => {
    try {
      if (!script || !Array.isArray(script)) {
        console.error("Invalid video script data");
        return;
      }

      let fullScript = "";
      const id = uuidv4();
      script.forEach((element) => {
        if (element && element.contextText) {
          fullScript += element.contextText + " ";
        }
      });
      console.log("Full script:", fullScript);

      if (fullScript.trim() === "") {
        console.error("Empty script generated");
        return;
      }

      const response = await axios.post("/api/generate-audio", {
        text: fullScript,
        id: id,
      });
      console.log("Audio generation response:", response.data.result);
      setAudio(response.data.result);
      setVideoData((prev) => ({ ...prev, audio: response.data.result }));
      if (response.data.result) {
        await getCaption(response.data.result,script);
      }
    } catch (error) {
      console.error("Error generating audio:", error);
    }
  };

  const getCaption = async (fileurl,script) => {
    try {
      setLoading(true);
      console.log("fileurl", fileurl);
      const response = await axios.post("/api/generate-caption", {
        audioUrl: fileurl,
      });
      console.log("Caption generation response:", response.data.result);
      const captionsData = response.data.transcript;
      setCaptions(captionsData);
      setVideoData((prev) => ({ ...prev, captions: captionsData }));
      await generateImages(script);
      return captionsData;
    } catch (error) {
      console.error("Error generating caption:", error);
      if (error.response && error.response.status === 500) {
        console.error("Server error: ", error.response.data);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const generateImages = async (script) => {
    try {
      setLoading(true);
      console.log("videoScriptData", script);
      const newImages = [];
      const videoUrls = [];
      
      // If using Getty Images, we'll use Pexels API
      if (useGettyImages) {
        for (const element of script) {
          if (element && element.contextText) {
            // Extract a good search term from the context text
            // Use the first 5-10 words as a search query
            const searchQuery = element.contextText
              .split(' ')
              .slice(0, 7)
              .join(' ')
              .replace(/[^\w\s]/gi, ''); // Remove punctuation
            
            console.log("Pexels search query:", searchQuery);
            
            try {
              const response = await axios.post("/api/fetch-pexels-video", {
                query: searchQuery,
              });
              
              console.log("Pexels response:", response.data);
              
              if (response.data.result) {
                newImages.push(response.data.result);
                // Store video URL if available
                if (response.data.videoUrl) {
                  videoUrls.push(response.data.videoUrl);
                } else {
                  videoUrls.push(null);
                }
              } else {
                // Fallback to placeholder if no result
                newImages.push(`https://via.placeholder.com/1024x1280/333333/FFFFFF?text=Getty+Image+${newImages.length+1}`);
                videoUrls.push(null);
              }
            } catch (error) {
              console.error("Error fetching from Pexels:", error);
              newImages.push(`https://via.placeholder.com/1024x1280/333333/FFFFFF?text=Getty+Image+${newImages.length+1}`);
              videoUrls.push(null);
            }
          }
        }
      } else {
        // Use AI-generated images as before
        for (const element of script) {
          if (element && element.imagePrompt) {
            console.log("Image prompt:", element.imagePrompt);
            const response = await axios.post("/api/generate-image", {
              prompt: element.imagePrompt,
            });
            console.log("Image generation response:", response.data.result);
            newImages.push(response.data.result);
          }
        }
      }
      
      console.log("All generated images:", newImages);
      setImages(newImages);
      
      // Store video URLs in state if using Getty Images
      if (useGettyImages) {
        setVideoData((prev) => ({ 
          ...prev, 
          images: newImages,
          videoUrls: videoUrls 
        }));
      } else {
        setVideoData((prev) => ({ ...prev, images: newImages }));
      }
    } catch (error) {
      console.error("Error generating images:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("videoData", videoData);
    if (videoData.videoScript && videoData.audio && videoData.captions && videoData.images) {
      saveVideoData(videoData);
    }
  }, [videoData]);

  const saveVideoData = async (videoData) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/save-video-data', {
        script: videoData.videoScript,
        audioFileUrl: videoData.audio,
        captions: videoData.captions,
        imageList: videoData.images,
        videoUrls: videoData.videoUrls || [],
        isGettyImages: useGettyImages
      });
      const newVideoId = response?.data[0]?.id;
      setVideoId(newVideoId);
      console.log("videoId", newVideoId);
      setPlayVideo(true);
      console.log("Save video data result:", response.data);
      return newVideoId;
    } catch (error) {
      console.error("Error saving video data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setPlayVideo(false);
    setVideoId(null);
  };

  const handleToggleImageSource = (value) => {
    setUseGettyImages(value);
  };

  return (
    <div className="md:px-20 bg-gray-900 text-gray-100 min-h-screen">
      <div className="flex justify-between items-center pt-10">
        <h2 className="text-3xl font-bold text-gray-100">Create New Video</h2>
        <ImageSourceToggle 
          useGettyImages={useGettyImages} 
          onToggle={handleToggleImageSource} 
        />
      </div>
      
      <div className="mt-10 shadow-md p-10 bg-gray-800 rounded-lg">
        <SelectTopic onUserSelect={onHandleInputChange} />
        <SelectStyle 
          onUserSelect={onHandleInputChange} 
          disabled={useGettyImages}
        />
        <SelectDuration onUserSelect={onHandleInputChange} />
        <Button
          className="mt-10 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
          onClick={onCreateClickHandler}
        >
          Create Video
        </Button>
      </div>
      <CustomLoading loading={loading} />
      <PlayerDialog playVideo={playVideo} videoId={videoId} onClose={handleCloseDialog} />
      
      {images.length > 0 && (
        <div className="mt-10">
          <h3 className="text-2xl font-bold text-gray-100">
            {useGettyImages ? "Getty Stock Images:" : "Generated Images:"}
          </h3>
          {useGettyImages && (
            <p className="text-gray-400 mt-2 mb-4">
              Using professional stock images from Getty Images for your video.
            </p>
          )}
          <div className="grid grid-cols-1 gap-4 mt-4">
            {images.map((imageUrl, index) => (
              <div key={index} className="relative">
                <img
                  src={imageUrl}
                  alt={`${useGettyImages ? "Getty" : "Generated"} image ${index + 1}`}
                  className={`w-full h-auto rounded-lg shadow-md ${useGettyImages ? "opacity-80" : ""}`}
                />
                {useGettyImages && (
                  <div className="absolute top-4 right-4 bg-gray-800 text-white px-3 py-1 rounded-full text-sm">
                    Getty Images
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateNew;
