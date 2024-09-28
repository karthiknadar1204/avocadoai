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
    <div className="mt-10">
      <h2 className="text-xl font-bold">Duration</h2>
      <p className="text-gray-500">Select the duration of your video</p>
      <Select
        onValueChange={(value) => {
          setSelectedOption(value);
          value != "custom-prompt" && onUserSelect("duration", value);
        }}
      >
        <SelectTrigger className="w-full mt-2 p-6 text-lg">
          <SelectValue placeholder="Select Duration" />
        </SelectTrigger>
        <SelectContent>
          {durationOptions.map((option, index) => (
            <SelectItem
              key={index}
              value={option.toLowerCase().replace(/\s+/g, "-")}
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
