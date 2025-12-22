"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { RootState} from "@/store/store";
import { useSelector } from "react-redux";

export function ProfileAvatar({ className }: { className?: string }) {
   const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="flex flex-row flex-wrap items-center gap-12">
      <Avatar className={cn(className)}>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </div>
  );
}
