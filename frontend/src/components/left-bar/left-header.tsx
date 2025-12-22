"use client"

import { EllipsisVerticalIcon } from "lucide-react";
import { ProfileAvatar } from "../global/Avatar";
import { fetcher } from "@/lib/axios";
import useSWR from 'swr'
const LeftHeader = () => {
  const { data, error, isLoading } = useSWR(`/auth/profile`, fetcher);

  console.log("DATA-->", data)

  return (
    <div className="flex py-2 px-3 items-center justify-between bg-sidebar border-b border-sidebar-border">
      <div>
        <ProfileAvatar className="w-10 h-10" />
      </div>
      <div>
        <EllipsisVerticalIcon />
      </div>
    </div>
  );
};

export default LeftHeader;
