import { Router } from "express";
import categoryRouter from "@app/modules/category/category.router";
import cloudinaryRouter from "@app/modules/cloudinary/cloudinary.router";
import productRouter from "@app/modules/product/product.router";
import userRouter from "@app/modules/user/user.router";
import customerRouter from "@app/modules/customer/customer.router";
import authRouter from "@app/modules/auth/auth.router";
import reviewRouter from "@app/modules/review/review.router";
import cartRouter from "@app/modules/cart/cart.router";
import orderRouter from "@app/modules/order/order.router";
import paymentRouter from "@app/modules/payment/payment.router";
import productCollectionRouter from "@app/modules/productCollection/productCollection.router";
import couponRouter from "@app/modules/coupon/coupon.router";
import returnRequestRouter from "@app/modules/returnRequests/returnRequest.router";

// create main router
const mainRouter = Router();

mainRouter.use("/categories", categoryRouter);
mainRouter.use("/cloudinary", cloudinaryRouter);
mainRouter.use("/products", productRouter);
mainRouter.use("/users", userRouter);
mainRouter.use("/customers", customerRouter);
mainRouter.use("/auth", authRouter);
mainRouter.use("/reviews", reviewRouter);
mainRouter.use("/carts", cartRouter);
mainRouter.use("/orders", orderRouter);
mainRouter.use("/payments", paymentRouter);
mainRouter.use("/product-collections", productCollectionRouter);
mainRouter.use("/coupons", couponRouter);
mainRouter.use("/return-requests", returnRequestRouter);

export default mainRouter;
