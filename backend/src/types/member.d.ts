import { Group } from "./group";
import { User } from "./user";

export interface Member {
  group: Group;
  user: User;
  isAdmin:boolean;
  isBlocked:boolean;
  createdAt: Date;
  updatedAt: Date;
}
