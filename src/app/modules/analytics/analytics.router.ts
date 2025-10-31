import { Router } from "express";

import { UserRoles } from "../user/user.constants";
import {
  orderStatsController,
  totalRevenueController,
  recentPaymentsController,
  revenueTrendsController,
  paymentStatsController,
  topSellingProductsController,
  lowTotalStockProductsController,
  lowVariantStockProductsController,
  customerGrowthController,
  totalCustomersController,
  totalProductsSoldController,
  averageOrderTotalController,
  topCategorySalesPercentageController,
  orderTrendsCombinedController,
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
  "/total-products-sold",
  userAuthMiddleware([superAdmin, admin]),
  totalProductsSoldController
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
  "/order/trends",
  userAuthMiddleware([superAdmin, admin]),
  orderTrendsCombinedController
);

analyticsRouter.get(
  "/total-customers",
  userAuthMiddleware([superAdmin, admin]),
  totalCustomersController
);

analyticsRouter.get(
  "/average-order-total",
  userAuthMiddleware([superAdmin, admin]),
  averageOrderTotalController
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

analyticsRouter.get(
  "/top-category-sales-percentage",
  userAuthMiddleware([superAdmin, admin]),
  topCategorySalesPercentageController
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
