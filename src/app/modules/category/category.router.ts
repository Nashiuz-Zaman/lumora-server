import { Router } from "express";
import { getCategoryTreeController } from "./controller";

const categoryRouter = Router();

categoryRouter.get("/tree", getCategoryTreeController);

export default categoryRouter;
