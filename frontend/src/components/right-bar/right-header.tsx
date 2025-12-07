import React from "react";
import { ProfileAvatar } from "../global/Avatar";
import { Search } from "lucide-react";

const RightHeader = () => {
  return (
    <div className="flex py-2 px-7 items-center justify-between bg-background border-b border-border">
      <div>
        <ProfileAvatar />
      </div>
      <div>
        <Search />
      </div>
    </div>
  );
};

export default RightHeader;
