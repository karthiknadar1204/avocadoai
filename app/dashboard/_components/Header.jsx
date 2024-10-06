import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
    <nav className="bg-black text-white p-4 px-6 flex justify-between items-center shadow-lg shadow-gray-900/50">
      <div className="flex items-center gap-4">
        <Link href="/">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent cursor-pointer">AvocadoAI</h2>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <Button className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105">
          Dashboard
        </Button>
        <UserButton 
          appearance={{
            elements: {
              avatarBox: "w-10 h-10 rounded-full border-2 border-green-400 shadow-md hover:shadow-green-400/50 transition duration-300"
            }
          }}
        />
      </div>
    </nav>
  );
};

export default Header;
