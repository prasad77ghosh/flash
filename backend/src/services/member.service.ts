import mongoose, { Mongoose, PipelineStage } from "mongoose";
import MemberSchema from "../models/member.model";
import { Conflict } from "http-errors";
import { cursorPagination } from "../helpers/pagination.helper";
import {
  CreateMemberType,
  GetAllMemberType,
  UpdateMember,
} from "../types/member";

export class MemberService {
  static async create(memberData: CreateMemberType) {
    const isalreadyMember = await MemberSchema.findOne({
      group: memberData.groupId,
      user: memberData.userId,
    });

    if (isalreadyMember) {
      throw new Conflict("This user already member of this group!");
    }

    const createdMember = await MemberSchema.create({
      group: memberData.groupId,
      user: memberData.userId,
      isAdmin: memberData.isAdmin,
    });

    return createdMember;
  }

  static async getAll({
    limit,
    cursor,
    groupId,
    isBlocked,
    userId,
  }: GetAllMemberType) {
    const pipeline: PipelineStage[] = [];

    const match: any = {};

    if (userId) {
      match.user = new mongoose.Types.ObjectId(userId);
    }

    if (typeof isBlocked !== "undefined") {
      match.isBlocked = isBlocked;
    }

    if (Object.keys(match).length > 0) {
      pipeline.push({ $match: match });
    }

    pipeline.push(
      {
        $lookup: {
          from: "users",
          localField: "send",
          foreignField: "_id",
          as: "Sender",
        },
      },
      {
        $lookup: {
          from: "groups",
          localField: "group",
          foreignField: "_id",
          as: "Group",
        },
      },
      {
        $project: {
          isAdmin: 1,
          isBlocked: 1,
          groupInfo: {
            _id: { $arrayElemAt: ["$Group._id", 0] },
            name: { $arrayElemAt: ["$Group.name", 0] },
            profile: { $arrayElemAt: ["$Group.profile", 0] },
            is_private: { $arrayElemAt: ["$Group.isPrivate", 0] },
          },
          userInfo: {
            _id: { $arrayElemAt: ["$Sender._id", 0] },
            name: { $arrayElemAt: ["$Sender.name", 0] },
            email: { $arrayElemAt: ["$Sender.email", 0] },
            profile: { $arrayElemAt: ["$Sender.avatar", 0] },
          },
        },
      }
    );

    const { items, hasNext, nextCursor } = await cursorPagination({
      model: MemberSchema,
      cursor: cursor,
      limit: limit,
      match: {
        group: new mongoose.Types.ObjectId(groupId),
      },
      pipeline: pipeline,
    });

    return { items, hasNext, nextCursor };
  }

  static async getById(id: string) {
    const memberInfo = MemberSchema.findById(id)
      .populate({
        path: "group",
        select: "_id name description isPrivate profile lastMessage",
      })
      .populate({
        path: "user",
        select: "_id name email avatar",
      })
      .lean();
    return memberInfo;
  }

  static async update(memberId: string, updateData: Partial<UpdateMember>) {
    return MemberSchema.findByIdAndUpdate(
      memberId,
      { $set: updateData },
      { new: true }
    )
      .populate("group")
      .populate("user")
      .lean();
  }

  static async insertMany(members: CreateMemberType) {
    const createdMembers = await MemberSchema.insertMany({
      ...members,
    });

    return createdMembers;
  }
}
