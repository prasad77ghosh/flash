import { Group } from "./group";
import { User } from "./user";

export interface Member {
  _id: string;
  group: Group;
  user: User;
  isAdmin: boolean;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateMemberType = {
  groupId: string | any;
  userId: string | any;
  isAdmin: boolean;
};

export type GetAllMemberType = {
  cursor: string;
  limit: number;
  userId?: string;
  groupId?: string;
  isBlocked?: boolean;
};

export type UpdateMember = {
  isAdmin: boolean;
  isBlocked: boolean;
};
