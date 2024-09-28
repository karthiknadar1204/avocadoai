"use client";

import React, { useState } from "react";
import axios from "axios";
import SelectTopic from "./_components/SelectTopic";
import SelectStyle from "./_components/SelectStyle";
import SelectDuration from "./_components/SelectDuration";
import { Button } from "@/components/ui/button";
import CustomLoading from "./_components/CustomLoading";

const CreateNew = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [videoScript, setVideoScript] = useState();

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
      setVideoScript(response.data.result);
    } catch (error) {
      console.error("Error fetching video script:", error);
    } finally {
      setLoading(false);
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
