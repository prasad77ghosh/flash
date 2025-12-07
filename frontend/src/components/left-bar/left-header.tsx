import React from "react";
import { EllipsisVerticalIcon } from "lucide-react";
import { ProfileAvatar } from "../global/Avatar";

const LeftHeader = () => {
  return (
    <div className="flex py-2 px-3 items-center justify-between bg-sidebar border-b border-sidebar-border">
      <div>
        <ProfileAvatar />
      </div>
      <div>
        <EllipsisVerticalIcon />
      </div>
    </div>
  );
};

export default LeftHeader;
