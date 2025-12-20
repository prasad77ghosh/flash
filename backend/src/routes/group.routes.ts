import { Router } from "express";
import { GroupController } from "../controllers/group.controller";
import { GroupControllerValidator } from "../validator/group.validator";
import ProtectedMiddleware from "../middlewares/protected.middleware";

export default class GroupRoutes {
  public router: Router;
  private groupController: GroupController;
  public path = "groups";

  constructor() {
    this.router = Router();
    this.groupController = new GroupController();
    this.routes();
  }

  private routes() {
    /* ----------------------------------------------------
       CREATE GROUP
    ---------------------------------------------------- */
    this.router.post(
      "/",
      new ProtectedMiddleware().protected,
      GroupControllerValidator.createGroupValidation,
      this.groupController.create
    );

    /* ----------------------------------------------------
       GET ONE GROUP
    ---------------------------------------------------- */
    this.router.get(
      "/:id",
      new ProtectedMiddleware().protected,
      GroupControllerValidator.getGroupValidation,
      this.groupController.getOne
    );

    /* ----------------------------------------------------
       UPDATE GROUP
    ---------------------------------------------------- */
    this.router.put(
      "/:id",
      new ProtectedMiddleware().protected,
      GroupControllerValidator.updateGroupValidation,
      this.groupController.update
    );

    /* ----------------------------------------------------
       DELETE GROUP
    ---------------------------------------------------- */
    this.router.delete(
      "/:id",
      new ProtectedMiddleware().protected,
      GroupControllerValidator.deleteGroupValidation,
      this.groupController.delete
    );
  }
}
