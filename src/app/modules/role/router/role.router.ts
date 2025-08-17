// imports
import { Router } from "express";
import { getAllRoles } from "../controller/getAllRoles.controller";

// create instance
const roleRouter = Router();

// routes
roleRouter.get("/", getAllRoles);

export default roleRouter;
