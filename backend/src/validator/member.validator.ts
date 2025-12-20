import { body, query } from "express-validator";
import { NotAcceptable } from "http-errors";

export const MemberControllerValidator = {
  // 🔹 CREATE MEMBER VALIDATION
  createMemberValidation: [
    body("groupId")
      .notEmpty()
      .withMessage("groupId is required")
      .bail()
      .isMongoId()
      .withMessage("groupId must be a valid MongoDB ObjectId"),

    body("userId")
      .notEmpty()
      .withMessage("userId is required")
      .bail()
      .isMongoId()
      .withMessage("userId must be a valid MongoDB ObjectId"),

    body("isAdmin")
      .optional()
      .isBoolean()
      .withMessage("isAdmin must be a boolean value"),
  ],
  getAllMembersValidation: [
    query("cursor")
      .optional()
      .isMongoId()
      .withMessage("cursor must be a valid MongoDB ObjectId"),

    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("limit must be a number between 1 and 100")
      .toInt(),

    query("userId")
      .optional()
      .isMongoId()
      .withMessage("userId must be a valid MongoDB ObjectId"),

    query("groupId")
      .optional()
      .isMongoId()
      .withMessage("groupId must be a valid MongoDB ObjectId"),

    query("isBlocked")
      .optional()
      .isBoolean()
      .withMessage("isBlocked must be a boolean value")
      .toBoolean(),
  ],

  getMemberbyIdValidation: [
    body("memberId")
      .notEmpty()
      .withMessage("memberId is required..")
      .bail()
      .isMongoId()
      .withMessage("Invalid memberId"),
  ],

  updateMemberValidation: [
    body("isAdmin")
      .optional()
      .isBoolean()
      .withMessage("isAdmin must be a boolean value")
      .toBoolean(),

    body("isBlocked")
      .optional()
      .isBoolean()
      .withMessage("isBlocked must be a boolean value")
      .toBoolean(),
  ],
};
