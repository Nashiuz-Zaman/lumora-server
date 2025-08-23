import { authenticateMiddleware } from "../../middlewares/authenticate";
import express from "express";
import { localLoginController } from "./controllers/localLogin";
import multer from "multer";
import { createAdminController } from "../admin/controllers/createAdmin";
import { checkAuthController } from "./controllers/checkAuth";
import { logout } from "./controllers/logout";
import { socialLoginController } from "./controllers/socialLogin";

const authRouter = express.Router();
const upload = multer();

authRouter.get("/me", authenticateMiddleware(), checkAuthController);
authRouter.post("/login/local", upload.none(), localLoginController);
authRouter.post("/login/social", socialLoginController);
authRouter.post("/temp", createAdminController);
authRouter.get("/logout", logout);

export default authRouter;
