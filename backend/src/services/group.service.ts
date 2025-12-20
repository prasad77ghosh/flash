import { BadRequest, Conflict, NotFound } from "http-errors";
import GroupSchema from "../models/group.model";
import { CreateGroupType, Group } from "../types/group";
import { MemberService } from "./member.service";

export class GroupService {
  static async createGroup(data: CreateGroupType) {
    const { name, description, isPrivate, profile , members}:any = data;

    const isExist = await GroupSchema.findOne({ name });
    if (isExist) throw new Conflict("Group with this name already exists");

    const group = await GroupSchema.create({
      name,
      description,
      isPrivate,
      profile,
    });
    await MemberService.insertMany(members);
    return group;
  }

  static async getGroupById(groupId: string) {
    if (!groupId) throw new BadRequest("Group ID is required");
    const group = await GroupSchema.findById(groupId).populate("lastMessage");
    if (!group) throw new NotFound("Group not found");
    return group;
  }

  static async updateGroup(groupId: string, data: Partial<Group>) {
    const group = await GroupSchema.findById(groupId);
    if (!group) throw new NotFound("Group not found");
    if (data.name) {
      const isNameTaken = await GroupSchema.findOne({
        _id: { $ne: groupId },
        name: data.name,
      });

      if (isNameTaken)
        throw new Conflict("Another group already uses this name");
    }

    Object.assign(group, data);
    await group.save();

    return group;
  }

  static async deleteGroup(groupId: string) {
    const group = await GroupSchema.findById(groupId);
    if (!group) throw new NotFound("Group not found");

    await group.deleteOne();

    return { message: "Group deleted successfully" };
  }
}
