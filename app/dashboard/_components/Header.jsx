import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import React from "react";

const Header = () => {
  return (
    <div className=" p-3 px-5 flex justify-between items-center shadow-md">
      <div className="flex items-center gap-3">
        LOGO
        <h2 className="text-xl font-bold">AvocadoAI</h2>
      </div>
      <div className="flex items-center gap-3">
        <Button>Dashboard</Button>
        <UserButton />
      </div>
    </div>
  );
};

export default Header;
