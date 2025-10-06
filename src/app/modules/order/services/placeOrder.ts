// services/placeOrder.ts
import { IOrder } from "../order.type";
import { createOrder } from "./createOrder";
import { initiateOrderPayment } from "@app/modules/payment/service";
import { validateCoupon } from "@app/modules/coupon/service";
import { throwInternalServerError } from "@utils/index";

export const placeOrder = async (
  orderData: IOrder,
  serverUrl: string
): Promise<string> => {
  // 1. Validate coupon if provided
  if (orderData.couponCode) {
    await validateCoupon(orderData.couponCode, orderData.subtotal);
  }

  // 2. Create the order
  const order = await createOrder(orderData);

  // 3. Initiate payment
  const paymentUrl = await initiateOrderPayment(order, serverUrl);

  if (!paymentUrl) throwInternalServerError();

  return paymentUrl;
};
