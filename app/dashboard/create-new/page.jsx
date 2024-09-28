"use client";

import React, { useState } from "react";
import axios from "axios";
import SelectTopic from "./_components/SelectTopic";
import SelectStyle from "./_components/SelectStyle";
import SelectDuration from "./_components/SelectDuration";
import { Button } from "@/components/ui/button";
import CustomLoading from "./_components/CustomLoading";
import { v4 as uuidv4 } from "uuid";

const CreateNew = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [videoScript, setVideoScript] = useState(null);
  const [audioFileUrl, setAudioFileUrl] = useState(null);

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

      const prompt =
        "write a script to generate " +
        formData.duration +
        " on a topic " +
        formData.topic +
        " along with AI image prompt in " +
        formData.imageStyle +
        " format for each scene and give me result in JSON format with imagePrompt and contextText as field";
      console.log("prompt", prompt);
      const response = await axios.post("/api/get-video-script", { prompt: prompt });
      console.log("data", response.data);
      
      if (response.data && response.data.result) {
        setVideoScript(response.data.result);
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

      const response = await axios.post("/api/generate-audio", { text: fullScript, id: id });
      console.log("Audio generation response:", response.data);
    } catch (error) {
      console.error("Error generating audio:", error);
    }
  };

  return (
    <div className="md:px-20">
      <h2 className="text-2xl font-bold">Create New Video</h2>
      <div className="mt-10 shadow-md p-10">
        {/* select topic */}
        <SelectTopic onUserSelect={onHandleInputChange} />

        {/* select style */}
        <SelectStyle onUserSelect={onHandleInputChange} />

        {/* Duration */}
        <SelectDuration onUserSelect={onHandleInputChange} />

        {/* Create Video */}
        <Button className="mt-10" onClick={onCreateClickHandler}>
          Create Video
        </Button>
      </div>
      <CustomLoading loading={loading} />
    </div>
  );
};

export default CreateNew;
