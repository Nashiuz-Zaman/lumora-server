// imports
import { Router } from "express";
import { requestNewVerificationEmail } from "./controllers/requestNewVerificationEmail.controller";
import { verifyUserAccountController } from "./controllers/verifyUserAccount";

// create instances
const userRouter = Router();

// routes
userRouter.patch("/new-confirmation-email", requestNewVerificationEmail);
userRouter.get("/confirm-user", verifyUserAccountController);

export default userRouter;
