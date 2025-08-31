// imports
import { Router } from "express";
import multer from "multer";
import { userAuthMiddleware, approveTargetUser } from "@app/middlewares";
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
  userAuthMiddleware([superAdmin]),
  upload.none(),
  addAdminController
);

adminRouter.get(
  "/",
  userAuthMiddleware([superAdmin]),
  getAdminLIstController
);

adminRouter.patch(
  "/block/:id",
  userAuthMiddleware([superAdmin]),
  approveTargetUser([admin]),
  blockAdminController
);

adminRouter.patch(
  "/unblock/:id",
  userAuthMiddleware([superAdmin]),
  approveTargetUser([admin]),
  unblockAdminController
);

adminRouter.delete(
  "/:id",
  userAuthMiddleware([superAdmin]),
  approveTargetUser([admin]),
  deleteAdminController
);

export default adminRouter;
