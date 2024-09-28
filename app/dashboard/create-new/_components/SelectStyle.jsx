'use client'
import React, { useState } from "react";

const SelectStyle = ({onUserSelect}) => {
  const styleOptions = [
    {
      name: "Realistic",
      image: "/real.jpeg",
    },
    {
      name: "Cartoon",
      image: "/cartoon.jpeg",
    },
    {
      name: "Comic",
      image: "/comic.jpeg",
    },
    {
      name: "Water Color",
      image: "/watercolour.jpeg",
    },
    {
      name: "GTA",
      image: "/gta.jpeg",
    },
  ];

  const [selectedOption, setSelectedOption] = useState(null);
  return (
    <div>
      <h2 className="text-xl font-bold">Style</h2>
      <p className="text-gray-500">Select your video style</p>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mt-2">
        {styleOptions.map((option, index) => (
          <div
            key={index}
            className={`relative hover:scale-105 transition-all duration-300 cursor-pointer rounded-xl ${selectedOption === option.name ? 'border-2 border-blue-500' : ''}`}
          >
            <img
              src={option.image}
              alt={option.name}
              width={100}
              height={100}
              className="h-48 object-cover rounded-lg w-full"
              onClick={() => {
                setSelectedOption(option.name)
                onUserSelect('imageStyle',option.name)
            }}
            />
            <h2 className="absolute p-1 bg-black bottom-0 text-white w-full text-center rounded-b-lg">
              {option.name}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectStyle;
