// imports
import { Router } from "express";
import {
  verifyUserAccountController,
  requestNewVerificationEmailController,
} from "./controllers";

// create instances
const userRouter = Router();

// routes
userRouter.patch(
  "/new-confirmation-email",
  requestNewVerificationEmailController
);
userRouter.get("/confirm-user", verifyUserAccountController);

export default userRouter;
