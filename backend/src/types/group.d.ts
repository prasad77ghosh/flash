import { CreateMemberType } from "./member";
import { Message } from "./message";

export interface Group {
  _id: string;
  name: string;
  description: string;
  isPrivate: boolean;
  profile?: string | null;  // <-- allow null
  lastMessage?: Message | null;
  createdAt: Date;
  updatedAt: Date;
}




export type CreateGroupType = {
  name: string,
  description?:string,
  isPrivate?:boolean,
  profile?:string
  members?: CreateMemberType[]
}