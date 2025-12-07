import { Group } from "./group";
import { Member } from "./member";
export type MESSAGE_TYPE =
  | "STRING"
  | "POLL"
  | "IMAGE"
  | "VIDEO"
  | "CODE"
  | "AUDIO";


export type DELIVER_STATUS = 'NOT-SEND'| 'SEND' | 'SEEN';

export interface Message {
  type: MESSAGE_TYPE;
  sender: Member;
  group: Group;
  content:string,
  createdAt: Date;
  updatedAt: Date;
  deliver_status: DELIVER_STATUS
}
