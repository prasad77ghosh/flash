import { Request, Response, NextFunction } from "express";
import { GroupService } from "../services/group.service";
import { fieldValidateError } from "../helpers/field-validation.helper";

export class GroupController {
  /* ----------------------------------------------------
     CREATE GROUP
  ---------------------------------------------------- */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      fieldValidateError(req);

      const { name, description, isPrivate, profile } = req.body;

      const group = await GroupService.createGroup({
        name,
        description,
        isPrivate,
        profile,
      });

      res.status(201).json({
        success: true,
        msg: "Group created successfully",
        data: group,
      });
    } catch (error) {
      next(error);
    }
  }

  

  /* ----------------------------------------------------
     GET SINGLE GROUP BY ID
  ---------------------------------------------------- */
  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      fieldValidateError(req);

      const { id }:any = req.params;
      const group = await GroupService.getGroupById(id);

      res.status(200).json({
        success: true,
        msg: "Group fetched successfully",
        data: group,
      });
    } catch (error) {
      next(error);
    }
  }

  /* ----------------------------------------------------
     UPDATE GROUP
  ---------------------------------------------------- */
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      fieldValidateError(req);

      const { id }:any = req.params;
      const updateData = req.body;

      const group = await GroupService.updateGroup(id, updateData);

      res.status(200).json({
        success: true,
        msg: "Group updated successfully",
        data: group,
      });
    } catch (error) {
      next(error);
    }
  }

  /* ----------------------------------------------------
     DELETE GROUP
  ---------------------------------------------------- */
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      fieldValidateError(req);

      const { id }:any = req.params;
      await GroupService.deleteGroup(id);

      res.status(200).json({
        success: true,
        msg: "Group deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
