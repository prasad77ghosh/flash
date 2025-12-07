import React from "react";
import { ProfileAvatar } from "../global/Avatar";

const SingleChatCard = () => {
  return (
    <div className="flex w-full justify-between items-center px-4 py-3 border-b cursor-pointer">
      <div className="gap-2 flex">
        <ProfileAvatar className="w-12 h-12" />
        <div>
          <p>Prasad Ghsoh</p>
          <p className="text-sm">Hyy how are you ?</p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1">
        <div>
          <p className="text-sm">19/11/2025</p>
        </div>
        <div className="w-full flex justify-end">
          <p className="p-1 w-4 h-4 font-medium text-white flex items-center justify-center text-xs text-center bg-green-700 rounded-full">
            2
          </p>
        </div>
      </div>
    </div>
  );
};

export default SingleChatCard;
