"use client";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SelectDuration = ({ onUserSelect }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const durationOptions = ["30 seconds", "60 seconds", "90 seconds"];

  return (
    <div className="bg-gray-900 text-gray-100 p-6 rounded-lg shadow-lg mt-10">
      <h2 className="text-2xl font-bold mb-2">Duration</h2>
      <p className="text-gray-400 mb-4">Select the duration of your video</p>
      <Select
        onValueChange={(value) => {
          setSelectedOption(value);
          value !== "custom-prompt" && onUserSelect("duration", value);
        }}
      >
        <SelectTrigger className="w-full mt-2 p-6 text-lg bg-gray-800 border-gray-700 text-gray-100">
          <SelectValue placeholder="Select Duration" />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-700 text-gray-100">
          {durationOptions.map((option, index) => (
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
    </div>
  );
};

export default SelectDuration;
