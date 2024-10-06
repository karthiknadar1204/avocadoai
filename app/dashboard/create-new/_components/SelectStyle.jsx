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
    <div className="bg-gray-900 text-gray-100 p-4 sm:p-6 rounded-lg shadow-lg">
      <h2 className="text-xl sm:text-2xl font-bold mb-2">Style</h2>
      <p className="text-sm sm:text-base text-gray-400 mb-4">Select your video style</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4 md:gap-6 mt-2">
        {styleOptions.map((option, index) => (
          <div
            key={index}
            className={`relative hover:scale-105 transition-all duration-300 cursor-pointer rounded-xl ${selectedOption === option.name ? 'border-2 border-purple-500' : 'border-2 border-transparent'}`}
          >
            <img
              src={option.image}
              alt={option.name}
              className="h-24 sm:h-32 md:h-40 lg:h-48 object-cover rounded-lg w-full filter brightness-75 hover:brightness-100 transition-all duration-300"
              onClick={() => {
                setSelectedOption(option.name)
                onUserSelect('imageStyle',option.name)
            }}
            />
            <h2 className="absolute p-1 sm:p-2 bg-black bg-opacity-70 bottom-0 text-white w-full text-center rounded-b-lg text-xs sm:text-sm md:text-base font-semibold">
              {option.name}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectStyle;
