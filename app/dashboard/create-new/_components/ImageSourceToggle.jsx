import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const ImageSourceToggle = ({ useGettyImages, onToggle }) => {
  return (
    <div className="flex items-center space-x-3 bg-gray-800 p-3 rounded-lg">
      <div className="flex flex-col space-y-1">
        <div className="flex items-center space-x-2">
          <Switch 
            id="image-source" 
            checked={useGettyImages}
            onCheckedChange={onToggle}
          />
          <Label htmlFor="image-source" className="text-gray-100">
            Use Getty Images
          </Label>
        </div>
        <p className="text-xs text-gray-400">
          {useGettyImages 
            ? "Using professional stock images from Getty" 
            : "Using AI-generated images"}
        </p>
      </div>
    </div>
  );
};

export default ImageSourceToggle; 