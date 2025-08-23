// imports
import { Router } from "express";
import multer from "multer";
import { authenticateMiddleware, approveTargetUser } from "@app/middlewares";
import {
  addAdminController,
  getAdminLIstController,
  blockAdminController,
  unblockAdminController,
  deleteAdminController,
} from "./controllers";
import { UserRoles } from "../user/user.constants";

// destructure roles
const { superAdmin, admin } = UserRoles;

// create instances
const upload = multer();
const adminRouter = Router();

// routes
adminRouter.post(
  "/",
  authenticateMiddleware([superAdmin]),
  upload.none(),
  addAdminController
);

adminRouter.get(
  "/",
  authenticateMiddleware([superAdmin]),
  getAdminLIstController
);

adminRouter.patch(
  "/block/:id",
  authenticateMiddleware([superAdmin]),
  approveTargetUser([admin]),
  blockAdminController
);

adminRouter.patch(
  "/unblock/:id",
  authenticateMiddleware([superAdmin]),
  approveTargetUser([admin]),
  unblockAdminController
);

adminRouter.delete(
  "/:id",
  authenticateMiddleware([superAdmin]),
  approveTargetUser([admin]),
  deleteAdminController
);

export default adminRouter;
