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
import { getMegaMenuDataController } from "./controller/getMegaMenuProducts";
import { getProductsForSearchPageController } from "./controller/getProductsForSearchPage"; // <-- import added

const { admin, superAdmin } = UserRoles;

// create instances
const productRouter = Router();

// GET /admin/products
productRouter.get(
  "/admin",
  authenticateMiddleware([admin, superAdmin]),
  getProductsForAdminController
);

// GET mega menu data
productRouter.get("/mega-menu", getMegaMenuDataController);

// GET products for search page
productRouter.post("/search", getProductsForSearchPageController);

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

// GET related products
productRouter.get("/related-products", getRelatedProductsController);

// GET product for customer by slug
productRouter.get("/:slug/customer", getProductForCustomerController);

export default productRouter;
