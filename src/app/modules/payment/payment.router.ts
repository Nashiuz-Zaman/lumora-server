import { Router } from "express";
import {
  handleIpnController,
  paymentResultController,
  getPaymentList,
} from "./controllers";
import { userAuthMiddleware } from "@app/middlewares";
import { UserRoles } from "../user/user.constants";

const paymentRouter = Router();

const { admin, superAdmin } = UserRoles;

// Gets all the payments for admins via secure route
paymentRouter.get("/", userAuthMiddleware([admin, superAdmin]), getPaymentList);

// Handles IPN callback
paymentRouter.post("/ipn", handleIpnController);

// Handles payment results
paymentRouter.post("/result", paymentResultController);

export default paymentRouter;
