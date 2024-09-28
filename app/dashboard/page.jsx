"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import EmptyState from "./_components/EmptyState";
import Link from "next/link";

const page = () => {
  const [videoList, setVideoList] = useState([]);
  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <Link href="/dashboard/create-new">
          <Button>+ Create New Video</Button>
        </Link>
      </div>
      {videoList?.length == 0 && <EmptyState />}
    </div>
  );
};

export default page;
