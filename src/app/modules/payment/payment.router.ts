import { Router } from "express";
import { handleSSLIpnController } from "./controllers/handleSSLIpn";
import { paymentResultController } from "./controllers/paymentResult";
import { getPaymentList } from "./controllers/getPaymentList";
import { userAuthMiddleware } from "@app/middlewares";
import { UserRoles } from "../user/user.constants";

const paymentRouter = Router();

const { admin, superAdmin } = UserRoles;

// Gets all the payments for admins via secure route
paymentRouter.get("/", userAuthMiddleware([admin, superAdmin]), getPaymentList);

// handles ipn callback
paymentRouter.post("/ipn", handleSSLIpnController);

// handles payment results
paymentRouter.post("/result", paymentResultController);

export default paymentRouter;
