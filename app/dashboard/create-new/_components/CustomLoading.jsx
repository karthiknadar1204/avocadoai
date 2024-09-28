import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Image from "next/image";

const CustomLoading = ({loading}) => {
  return (
    <div>
      <AlertDialog open={loading}>
        <AlertDialogContent className="flex justify-center items-center my-10 bg-white">
          <div>
            <Image src="/work-in-progress.gif" alt="loading" width={100} height={100} />
            <h2>Generating your video.... Do not Refresh</h2>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CustomLoading;
