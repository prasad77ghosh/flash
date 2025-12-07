import { Group } from "./group";
import { Member } from "./member";
export type MESSAGE_TYPE =
  | "TEXT"
  | "POLL"
  | "IMAGE"
  | "VIDEO"
  | "CODE"
  | "AUDIO"
  | "RICH_TEXT";

export type DELIVER_STATUS = "NOT_SEND" | "SEND" | "SEEN";

export interface Message {
  type: MESSAGE_TYPE;
  sender: Member;
  group: Group;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  deliverStatus: DELIVER_STATUS;
  replies: Message[];
  createdAt: Date;
  updatedAt: Date;
}
