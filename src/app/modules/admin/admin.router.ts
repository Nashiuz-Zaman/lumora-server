// imports
import { Router } from "express";
import multer from "multer";
import { userAuthMiddleware } from "@app/middlewares";
import { addAdminController, getAdminLIstController } from "./controllers";
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

adminRouter.get("/", userAuthMiddleware([superAdmin]), getAdminLIstController);

export default adminRouter;
