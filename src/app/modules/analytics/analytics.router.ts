import { Router } from "express";

import { UserRoles } from "../user/user.constants";
import {
  orderStatsController,
  totalRevenueController,
  orderTrendsController,
  recentPaymentsController,
  revenueTrendsController,
  paymentStatsController,
  topSellingProductsController,
  lowTotalStockProductsController,
  lowVariantStockProductsController,
  customerGrowthController,
} from "./controllers";
import { userAuthMiddleware } from "@app/middlewares";

const analyticsRouter = Router();
const { superAdmin, admin } = UserRoles;

analyticsRouter.get(
  "/order-stats",
  userAuthMiddleware([superAdmin, admin]),
  orderStatsController
);

analyticsRouter.get(
  "/payment-stats",
  userAuthMiddleware([superAdmin, admin]),
  paymentStatsController
);

analyticsRouter.get(
  "/total-revenue",
  userAuthMiddleware([superAdmin, admin]),
  totalRevenueController
);

analyticsRouter.get(
  "/orders/trends",
  userAuthMiddleware([superAdmin, admin]),
  orderTrendsController
);

analyticsRouter.get(
  "/revenue/trends",
  userAuthMiddleware([superAdmin, admin]),
  revenueTrendsController
);

analyticsRouter.get(
  "/customer/trends",
  userAuthMiddleware([superAdmin, admin]),
  customerGrowthController
);

analyticsRouter.get(
  "/top-selling-products",
  userAuthMiddleware([superAdmin, admin]),
  topSellingProductsController
);

// total stock low -->
analyticsRouter.get(
  "/low-total-stock-products",
  userAuthMiddleware([superAdmin, admin]),
  lowTotalStockProductsController
);

analyticsRouter.get(
  "/recent-payments",
  userAuthMiddleware([superAdmin, admin]),
  recentPaymentsController
);

analyticsRouter.get(
  "/low-variant-stock-products",
  lowVariantStockProductsController
);

export default analyticsRouter;
