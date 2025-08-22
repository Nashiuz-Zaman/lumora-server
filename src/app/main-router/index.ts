import { Router } from "express";
import categoryRouter from "@app/modules/category/category.router";
import cloudinaryRouter from "@app/modules/cloudinary/cloudinary.router";

// create main router
const mainRouter = Router();

mainRouter.use("/categories", categoryRouter);
mainRouter.use("/cloudinary", cloudinaryRouter);

export default mainRouter;
