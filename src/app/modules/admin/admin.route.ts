// imports
import { authenticateMiddleware } from "@app/middlewares/authenticate";
import { Router } from "express";
import multer from "multer";
import { UserRoles } from "../user/user.constants";
import { addAdminController } from "./controllers/addAdmin";
import { getAdminLIstController } from "./controllers/getAdminList";
import { approveTargetUser } from "@app/middlewares/approveTargetUser";
import { blockAdminController } from "./controllers/blockAdmin";
import { unblockAdminController } from "./controllers/unblockAdmin";
import { deleteAdminController } from "./controllers/deleteAdmin";

// create instances
const upload = multer();
const adminRouter = Router();

// routes
adminRouter.post(
  "/",
  authenticateMiddleware([UserRoles.superAdmin]),
  upload.none(),
  addAdminController
);

adminRouter.get(
  "/",
  authenticateMiddleware([UserRoles.superAdmin]),
  getAdminLIstController
);

adminRouter.patch(
  "/block/:id",
  authenticateMiddleware([UserRoles.superAdmin]),
  approveTargetUser([UserRoles.admin]),
  blockAdminController
);

adminRouter.patch(
  "/unblock/:id",
  authenticateMiddleware([UserRoles.superAdmin]),
  approveTargetUser([UserRoles.admin]),
  unblockAdminController
);

adminRouter.delete(
  "/:id",
  authenticateMiddleware([UserRoles.superAdmin]),
  approveTargetUser([UserRoles.admin]),
  deleteAdminController
);

export default adminRouter;
