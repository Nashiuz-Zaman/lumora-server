import { Router } from "express";
import {
  addProductsToCollectionController,
  removeProductsFromCollectionController,
  getCollectionProductsController,
  getAllProductCollectionsController,
} from "./controller";

const productCollectionRouter = Router();

// fetch all collections (slug + title)
productCollectionRouter.get("/", getAllProductCollectionsController);

// fetch products in a specific collection
productCollectionRouter.get("/:slug", getCollectionProductsController);

// add products to a collection
productCollectionRouter.patch("/:id/add", addProductsToCollectionController);

// remove products from a collection
productCollectionRouter.patch(
  "/:id/remove",
  removeProductsFromCollectionController
);

export default productCollectionRouter;
