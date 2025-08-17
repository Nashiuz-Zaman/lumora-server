// imports
import { Router } from "express";
import { getSignedUrlController } from "./controller";

// create instance
const productRouter = Router();

// add route
// frontend will call GET /api/products/upload-signature
productRouter.get("/upload-signature", getSignedUrlController);

export default productRouter;
