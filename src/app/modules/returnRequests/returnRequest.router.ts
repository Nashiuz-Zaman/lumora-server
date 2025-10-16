import { Router } from "express";
import {
  createReturnRequestController,
  getReturnRequestsController,
  getReturnRequestController,
  approveReturnRequestController,
  rejectReturnRequestController,
} from "./controller";

import { UserRoles } from "../user/user.constants";
import { userAuthMiddleware } from "@app/middlewares";
import { deleteReturnRequestsController } from "./controller/deleteReturnRequests";

const returnRequestRouter = Router();
const { admin, superAdmin } = UserRoles;

// --- Routes ---
returnRequestRouter.post("/", createReturnRequestController);

returnRequestRouter.get(
  "/",
  userAuthMiddleware([admin, superAdmin]),
  getReturnRequestsController
);

returnRequestRouter.get(
  "/:id",
  userAuthMiddleware([admin, superAdmin]),
  getReturnRequestController
);

returnRequestRouter.patch(
  "/approve/:id",
  userAuthMiddleware([admin, superAdmin]),
  approveReturnRequestController
);

returnRequestRouter.patch(
  "/reject/:id",
  userAuthMiddleware([admin, superAdmin]),
  rejectReturnRequestController
);

returnRequestRouter.patch(
  "/delete",
  userAuthMiddleware([admin, superAdmin]),
  deleteReturnRequestsController
);

export default returnRequestRouter;
