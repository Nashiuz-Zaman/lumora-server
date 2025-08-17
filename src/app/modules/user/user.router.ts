// imports
import { Router } from "express";
import { requestNewVerificationEmail } from "./controllers/requestNewVerificationEmail.controller";
import { confirmUserAccountController } from "./controllers/confirmUserAccount";
import { getCustomerProfileForMe } from "./controllers/getCustomerProfileForMe.controller";
import { authenticateMiddleware } from "@app/middlewares/authenticate";
import { UserRoles } from "./user.constants";

// create instances
const userRouter = Router();

// routes
userRouter.patch("/new-confirmation-email", requestNewVerificationEmail);
userRouter.get("/confirm-user", confirmUserAccountController);

userRouter.get(
  "/me/customer-profile/:id",
  authenticateMiddleware([UserRoles.customer]),
  getCustomerProfileForMe
);

export default userRouter;
