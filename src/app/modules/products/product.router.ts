// imports
import { Router } from "express";
import { authenticateMiddleware } from "@app/middlewares/authenticate";
import { UserRoles } from "../user/user.constants";
import {
  bulkSoftDeleteProductsController,
  createProductController,
  getProductForAdminController,
  getProductForCustomerController,
  getProductsForAdminController,
  getRelatedProductsController,
  updateProductController,
} from "./controller";

const { admin, superAdmin } = UserRoles;

// create instances
const productRouter = Router();

// GET /admin/products
productRouter.get(
  "/admin",
  authenticateMiddleware([admin, superAdmin]),
  getProductsForAdminController
);

// PATCH /products/bulk-delete
productRouter.patch(
  "/bulk-delete",
  authenticateMiddleware([admin, superAdmin]),
  bulkSoftDeleteProductsController
);

// POST create product
productRouter.post(
  "/",
  authenticateMiddleware([admin, superAdmin]),
  createProductController
);

// GET product for admin by id
productRouter.get(
  "/:id/admin",
  authenticateMiddleware([admin, superAdmin]),
  getProductForAdminController
);

// PATCH update product (general)
productRouter.patch(
  "/:id",
  authenticateMiddleware([admin, superAdmin]),
  updateProductController
);

// POST related products search
productRouter.get("/related-products", getRelatedProductsController);

// GET product for customer by slug
productRouter.get("/:slug", getProductForCustomerController);

export default productRouter;
