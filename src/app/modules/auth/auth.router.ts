import { authenticateMiddleware } from "../../middlewares/authenticate";
import express from "express";
import multer from "multer";

import {
  checkAuthController,
  localLoginController,
  logout,
  socialLoginController,
} from "./controllers";
import { createAdminController } from "../admin/controllers";

const authRouter = express.Router();
const upload = multer();

authRouter.get("/me", authenticateMiddleware(), checkAuthController);
authRouter.post("/login/local", upload.none(), localLoginController);
authRouter.post("/login/social", socialLoginController);
authRouter.post("/temp", createAdminController);
authRouter.get("/logout", logout);

export default authRouter;
