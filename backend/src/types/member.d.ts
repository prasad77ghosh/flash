import { Group } from "./group";
import { User } from "./user";

export interface Member {
  group: Group;
  user: User;
  createdAt: Date;
  updatedAt: Date;
}
