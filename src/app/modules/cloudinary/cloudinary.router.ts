// imports
import { Router } from "express";
import { getSignedUrlController } from "./controller";

// create instance
const cloudinaryRouter = Router();

cloudinaryRouter.get("/signed-url", getSignedUrlController);

export default cloudinaryRouter;
