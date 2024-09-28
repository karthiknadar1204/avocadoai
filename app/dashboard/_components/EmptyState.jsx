import { Button } from "@/components/ui/button";
import React from "react";
import Link from "next/link";
const EmptyState = () => {
  return (
    <div className="p-5 py-24 flex flex-col items-center mt-10 border-2 border-dashed">
      <h2 className="text-2xl font-bold">No videos found</h2>

      <Link href="/dashboard/create-new">
        <Button>Create a new video to get started</Button>
      </Link>
    </div>
  );
};

export default EmptyState;
