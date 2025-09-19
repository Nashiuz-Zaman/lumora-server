import { Router } from "express";
import {
  addProductsToCollectionController,
  removeProductsFromCollectionController,
  getAllProductCollectionsController,
} from "./controller";
import { userAuthMiddleware } from "@app/middlewares";
import { UserRoles } from "../user/user.constants";

const productCollectionRouter = Router();
const { admin, superAdmin } = UserRoles;

// fetch all collections
productCollectionRouter.get("/", getAllProductCollectionsController);

// add products to a collection
productCollectionRouter.patch(
  "/:slug/add",
  userAuthMiddleware([admin, superAdmin]),
  addProductsToCollectionController
);

// remove products from a collection
productCollectionRouter.patch(
  "/:slug/remove",
  userAuthMiddleware([admin, superAdmin]),
  removeProductsFromCollectionController
);

export default productCollectionRouter;
