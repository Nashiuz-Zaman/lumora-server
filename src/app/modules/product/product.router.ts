// imports
import { Router } from "express";
import { userAuthMiddleware } from "@app/middlewares/userAuthMiddleware";
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
  userAuthMiddleware([admin, superAdmin]),
  getProductsForAdminController
);

// GET mega menu data
productRouter.get("/mega-menu", getMegaMenuDataController);

// GET products for search page
productRouter.post("/search", getProductsForSearchPageController);

// PATCH /products/bulk-delete
productRouter.patch(
  "/bulk-delete",
  userAuthMiddleware([admin, superAdmin]),
  bulkSoftDeleteProductsController
);

// POST create product
productRouter.post(
  "/",
  userAuthMiddleware([admin, superAdmin]),
  createProductController
);

// GET product for admin by id
productRouter.get(
  "/:id/admin",
  userAuthMiddleware([admin, superAdmin]),
  getProductForAdminController
);

// PATCH update product (general)
productRouter.patch(
  "/:id",
  userAuthMiddleware([admin, superAdmin]),
  updateProductController
);

// GET related products
productRouter.get("/related-products", getRelatedProductsController);

// GET product for customer by slug
productRouter.get("/:slug/customer", getProductForCustomerController);

export default productRouter;
