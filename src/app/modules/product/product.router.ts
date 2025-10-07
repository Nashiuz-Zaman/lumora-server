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
  getMegaMenuDataController,
  getProductsForSearchPageController,
  getCollectionProductsReviewCountAvgController,
} from "./controller";

const { admin, superAdmin } = UserRoles;

// create instances
const productRouter = Router();

// get admin products multiple
productRouter.get(
  "/admin",
  userAuthMiddleware([admin, superAdmin]),
  getProductsForAdminController
);

productRouter.get("/related-products", getRelatedProductsController);
productRouter.get(
  "/product-collection/:slug",
  getCollectionProductsReviewCountAvgController
);

// mega menu data
productRouter.get("/mega-menu", getMegaMenuDataController);

// products for search page
productRouter.get("/search", getProductsForSearchPageController);

// products to bulk-delete
productRouter.patch(
  "/bulk-delete",
  userAuthMiddleware([admin, superAdmin]),
  bulkSoftDeleteProductsController
);

// create product
productRouter.post(
  "/",
  userAuthMiddleware([admin, superAdmin]),
  createProductController
);

//  get admin product single
productRouter.get(
  "/:id/admin",
  getProductForAdminController
);

// update product
productRouter.patch(
  "/:id",
  userAuthMiddleware([admin, superAdmin]),
  updateProductController
);

productRouter.get("/:slug/customer", getProductForCustomerController);

export default productRouter;
