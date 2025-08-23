// imports
import { Router } from "express";
import { requestNewVerificationEmail } from "./controllers/requestNewVerificationEmail.controller";
import { confirmUserAccountController } from "./controllers/confirmUserAccount";

// create instances
const userRouter = Router();

// routes
userRouter.patch("/new-confirmation-email", requestNewVerificationEmail);
userRouter.get("/confirm-user", confirmUserAccountController);

export default userRouter;
