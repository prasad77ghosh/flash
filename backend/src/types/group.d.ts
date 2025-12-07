import { Message } from "./message";
import { User } from "./user";

export interface Group {
  name: String;
  description: String;
  created_by:User,
  lastMessage?: Message
  createdAt: Date;
  updatedAt: Date;
}
