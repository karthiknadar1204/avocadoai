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
    "Random Ai Story",
    "Scary Story",
    "Bed time story",
    "Motivational Story",
    "Funny Facts",
    "Historical Facts",
  ];
  return (
    <div>
      <h2 className="text-xl font-bold">Content</h2>
      <p className="text-gray-500">What is the topic of your video?</p>
      <Select
        onValueChange={(value) => {
          setSelectedOption(value);
          value != "custom-prompt" && onUserSelect("topic", value);
        }}
      >
        <SelectTrigger className="w-full mt-2 p-6 text-lg">
          <SelectValue placeholder="Content-Type" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option, index) => (
            <SelectItem
              key={index}
              value={option.toLowerCase().replace(/\s+/g, "-")}
            >
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedOption === "custom-prompt" && (
        <Textarea
          className="mt-4"
          onChange={(e) => onUserSelect("topic", e.target.value)}
          placeholder="Enter your custom prompt here..."
          rows={4}
        />
      )}
    </div>
  );
};

export default SelectTopic;
