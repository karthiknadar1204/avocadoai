"use client";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const SelectTopic = ({ onUserSelect }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const options = [
    "Custom Prompt",
    "Random AI Story",
    "Scary Story",
    "Bedtime Story",
    "Motivational Story",
    "Funny Facts",
    "Historical Facts",
  ];
  return (
    <div className="bg-gray-900 text-gray-100 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-2">Content</h2>
      <p className="text-gray-400 mb-4">What is the topic of your video?</p>
      <Select
        onValueChange={(value) => {
          setSelectedOption(value);
          value !== "custom-prompt" && onUserSelect("topic", value);
        }}
      >
        <SelectTrigger className="w-full mt-2 p-6 text-lg bg-gray-800 border-gray-700 text-gray-100">
          <SelectValue placeholder="Content-Type" />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-700 text-gray-100">
          {options.map((option, index) => (
            <SelectItem
              key={index}
              value={option.toLowerCase().replace(/\s+/g, "-")}
              className="hover:bg-gray-700"
            >
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedOption === "custom-prompt" && (
        <Textarea
          className="mt-4 bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500"
          onChange={(e) => onUserSelect("topic", e.target.value)}
          placeholder="Enter your custom prompt here..."
          rows={4}
        />
      )}
    </div>
  );
};

export default SelectTopic;
