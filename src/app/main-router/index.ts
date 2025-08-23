import { Router } from "express";
import categoryRouter from "@app/modules/category/category.router";
import cloudinaryRouter from "@app/modules/cloudinary/cloudinary.router";
import productRouter from "@app/modules/products/product.router";

// create main router
const mainRouter = Router();

mainRouter.use("/categories", categoryRouter);
mainRouter.use("/cloudinary", cloudinaryRouter);
mainRouter.use("/products", productRouter);

export default mainRouter;
