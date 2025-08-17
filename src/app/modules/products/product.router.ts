// imports
import { Router } from "express";

import multer from "multer";
import { createProductController } from "./controller/createProduct";

import { getProductForCustomerController } from "./controller/getProductForCustomer";
import { authenticateMiddleware } from "@app/middlewares/authenticate";
import { UserRoles } from "../user/user.constants";
import { getProductForAdminController } from "./controller/getProductForAdmin";
import { getProductsForAdminController } from "./controller/getProductsForAdmin";
import { bulkSoftDeleteProductsController } from "./controller/bulkSoftDeleteProducts";
import { updateProductController } from "./controller/updateProduct";
import { getRelatedProductsController } from "./controller/getRelatedProducts";
import { addBoughtTogetherController } from "./controller/addToBoughtTogether";

// create instances
const productRouter = Router();
const upload = multer({
  storage: multer.memoryStorage(),
});

// GET /admin/products
productRouter.get(
  "/admin",
  authenticateMiddleware([UserRoles.admin, UserRoles.superAdmin]),
  getProductsForAdminController
);

// PATCH /products/bulk-delete
productRouter.patch(
  "/bulk-delete",
  authenticateMiddleware([UserRoles.admin, UserRoles.superAdmin]),
  bulkSoftDeleteProductsController
);

// POST create product
productRouter.post(
  "/",
  authenticateMiddleware([UserRoles.admin, UserRoles.superAdmin]),
  upload.any(),
  createProductController
);

// GET product for admin by id
productRouter.get(
  "/:id/admin",
  authenticateMiddleware([UserRoles.admin, UserRoles.superAdmin]),
  getProductForAdminController
);

// PATCH frequently bought together (before general patch /:id)
productRouter.patch(
  "/:id/frequently-bought-together/add",
  authenticateMiddleware([UserRoles.admin, UserRoles.superAdmin]),
  addBoughtTogetherController
);
productRouter.patch(
  "/:id/frequently-bought-together/remove",
  authenticateMiddleware([UserRoles.admin, UserRoles.superAdmin]),
  addBoughtTogetherController
);

// PATCH update product (general)
productRouter.patch(
  "/:id",
  authenticateMiddleware([UserRoles.admin, UserRoles.superAdmin]),
  upload.any(),
  updateProductController
);

// POST related products search
productRouter.post("/related-products", getRelatedProductsController);

// GET product for customer by slug — put last to avoid conflict with /:id routes
productRouter.get("/:slug", getProductForCustomerController);

export default productRouter;
