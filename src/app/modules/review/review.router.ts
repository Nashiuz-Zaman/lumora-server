import { Router } from "express";
import { userAuthMiddleware } from "@app/middlewares";
import { UserRoles } from "../user/user.constants";

import {
  writeReviewController,
  markReviewHelpfulController,
  getAllReviewsController,
  bulkDeleteReviewsController,
  bulkApproveReviewsController,
  getProductReviewsWithStatsController,
} from "./controllers";

const reviewRouter = Router();
const { customer, admin, superAdmin } = UserRoles;

reviewRouter.post("/", writeReviewController);

reviewRouter.get(
  "/",
  userAuthMiddleware([admin, superAdmin]),
  getAllReviewsController
);

reviewRouter.patch(
  "/bulk-approve",
  userAuthMiddleware([admin, superAdmin]),
  bulkApproveReviewsController
);

reviewRouter.patch(
  "/bulk-delete",
  userAuthMiddleware([admin, superAdmin]),
  bulkDeleteReviewsController
);

reviewRouter.patch(
  "/:reviewId/helpful",
  userAuthMiddleware([customer]),
  markReviewHelpfulController
);

reviewRouter.get("/:productId", getProductReviewsWithStatsController);

export default reviewRouter;
