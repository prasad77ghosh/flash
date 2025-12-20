import { Request, Response, NextFunction } from "express";
import { MemberService } from "../services/member.service";
import { AuthRequest } from "../types/auth";
import { fieldValidateError } from "../helpers/field-validation.helper";

export class MemberController {
  // 🔹 CREATE MEMBER
  async createMember(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      fieldValidateError(req);
      const { groupId, userId, isAdmin } = req.body;
      const member = await MemberService.create({
        groupId,
        userId,
        isAdmin,
      });

      res.status(201).json({
        success: true,
        msg: "Member added successfully",
        data: member,
      });
    } catch (error) {
      next(error);
    }
  }

  // 🔹 GET ALL MEMBERS (Cursor Pagination)
  async getAllMembers(req: Request, res: Response, next: NextFunction) {
    try {
      fieldValidateError(req);

      const { cursor, limit = 15, userId, groupId, isBlocked }:any = req.query;

      const { hasNext, items, nextCursor } = await MemberService.getAll({
        cursor: cursor,
        limit: Number(limit),
        userId: userId,
        groupId: groupId,
        isBlocked:
          typeof isBlocked === "boolean" ? isBlocked : isBlocked === "true",
      });

      res.status(200).json({
        success: true,
        msg: "Members fetched successfully",
        data: {
          hasNext,
          items,
          nextCursor,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // 🔹 GET MEMBER BY ID
  async getMemberById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id }:any = req.params;

      const member = await MemberService.getById(id);

      res.status(200).json({
        success: true,
        msg: "Member fetched successfully",
        data: member,
      });
    } catch (error) {
      next(error);
    }
  }

  // 🔹 UPDATE MEMBER
  async updateMember(req: Request, res: Response, next: NextFunction) {
    try {
      fieldValidateError(req);

      const { id }:any = req.params;
      const { isAdmin, isBlocked } = req.body;

      const updatedMember = await MemberService.update(id, {
        isAdmin,
        isBlocked,
      });

      res.status(200).json({
        success: true,
        msg: "Member updated successfully",
        data: updatedMember,
      });
    } catch (error) {
      next(error);
    }
  }
}
