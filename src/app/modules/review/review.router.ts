import { Router } from "express";
import { authenticateMiddleware } from "@app/middlewares";
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
  authenticateMiddleware([admin, superAdmin]),
  getAllReviewsController
);

reviewRouter.patch(
  "/bulk-approve",
  authenticateMiddleware([admin, superAdmin]),
  bulkApproveReviewsController
);

reviewRouter.patch(
  "/bulk-delete",
  authenticateMiddleware([admin, superAdmin]),
  bulkDeleteReviewsController
);

reviewRouter.patch(
  "/:reviewId/helpful",
  authenticateMiddleware([customer]),
  markReviewHelpfulController
);

reviewRouter.get("/:productId", getProductReviewsWithStatsController);

export default reviewRouter;
