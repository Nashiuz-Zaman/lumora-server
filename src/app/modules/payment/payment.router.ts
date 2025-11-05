import { Router } from "express";
import {
  handleIpnController,
  paymentResultController,
  getPaymentList,
  refundPaymentController,
} from "./controllers";
import { userAuthMiddleware } from "@app/middlewares";
import { UserRoles } from "../user/user.constants";

const paymentRouter = Router();

const { admin, superAdmin } = UserRoles;

// Gets all the payments for admins
paymentRouter.get("/", userAuthMiddleware([admin, superAdmin]), getPaymentList);

// Issues refund for a payment
paymentRouter.patch(
  "/refund/:id",
  userAuthMiddleware([admin, superAdmin]),
  refundPaymentController
);

// Handles IPN callback
paymentRouter.post("/ipn", handleIpnController);

// Handles payment results
paymentRouter.post("/result", paymentResultController);

export default paymentRouter;
