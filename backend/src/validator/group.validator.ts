import { body, param } from "express-validator";
import { NotAcceptable } from "http-errors";

export const GroupControllerValidator = {
  /* ----------------------------------------------------
     🔹 CREATE GROUP VALIDATION
  ---------------------------------------------------- */
  createGroupValidation: [
    body("name")
      .notEmpty()
      .withMessage("name is required")
      .bail()
      .isString()
      .withMessage("name must be a string")
      .trim(),

    body("description")
      .notEmpty()
      .withMessage("description is required")
      .bail()
      .isString()
      .withMessage("description must be a string")
      .trim(),

    body("isPrivate")
      .optional()
      .isBoolean()
      .withMessage("isPrivate must be a boolean"),

    body("profile")
      .optional()
      .isString()
      .withMessage("profile must be a string URL"),
  ],

  /* ----------------------------------------------------
     🔹 UPDATE GROUP VALIDATION
  ---------------------------------------------------- */
  updateGroupValidation: [
    param("id")
      .notEmpty()
      .withMessage("Group ID is required")
      .bail()
      .isMongoId()
      .withMessage("Invalid group ID"),

    body("name")
      .optional()
      .isString()
      .withMessage("name must be a string"),

    body("description")
      .optional()
      .isString()
      .withMessage("description must be a string"),

    body("isPrivate")
      .optional()
      .isBoolean()
      .withMessage("isPrivate must be a boolean"),

    body("profile")
      .optional()
      .isString()
      .withMessage("profile must be a string URL"),
  ],

  /* ----------------------------------------------------
     🔹 GET GROUP BY ID
  ---------------------------------------------------- */
  getGroupValidation: [
    param("id")
      .notEmpty()
      .withMessage("Group ID is required")
      .bail()
      .isMongoId()
      .withMessage("Invalid group ID"),
  ],

  /* ----------------------------------------------------
     🔹 DELETE GROUP VALIDATION
  ---------------------------------------------------- */
  deleteGroupValidation: [
    param("id")
      .notEmpty()
      .withMessage("Group ID is required")
      .bail()
      .isMongoId()
      .withMessage("Invalid group ID"),
  ],
};
