import { Router } from "express";
import { placeOrderController } from "./controllers/placeOrder";

const orderRouter = Router();

// POST /orders/guest or /orders/my
orderRouter.post("/", placeOrderController);

export default orderRouter;
