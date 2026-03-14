// services/placeOrder.ts
import mongoose from "mongoose";
import { IOrder } from "../order.type";
import { createOrder } from "./createOrder";
import { initiateOrderPayment } from "@app/modules/payment/service/initiateOrderPayment";
import { validateCoupon } from "@app/modules/coupon/service/validateCoupon";
import { throwInternalServerError } from "@utils/operationalErrors";

export const placeOrder = async (orderData: IOrder, serverUrl: string) => {
  const session = await mongoose.startSession();
  let order;

  try {
    // Start transaction
    session.startTransaction();

    if (orderData.couponCode) {
      await validateCoupon(orderData.couponCode, orderData.subtotal, session);
    }

    order = await createOrder(orderData, session);

    if (!order?._id) return throwInternalServerError("Payment was not initiated");

    const paymentUrl = await initiateOrderPayment(order, serverUrl);

    if (paymentUrl) {
      await session.commitTransaction();
      return paymentUrl;
    } else {
      return throwInternalServerError();
    }
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
