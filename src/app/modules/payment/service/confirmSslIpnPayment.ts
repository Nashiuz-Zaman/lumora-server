import { confirmOrder } from "@app/modules/order/services";
import { createPayment } from "./createPayment";
import { OrderModel } from "@app/modules/order/order.model";

import axios from "axios";
import { config } from "@config/env";
import {
  isObjectId,
  throwBadRequest,
  throwNotFound,
  toObjectId,
} from "@utils/index";
import { incrementCouponUsageByCode } from "@app/modules/coupon/service";

export const confirmSslIpnPayment = async (ipnPayload: any) => {
  const {
    val_id,
    tran_id,
    value_a: cus_name,
    value_b: cus_email,
    status,
  } = ipnPayload;

  // extract order _id and find the existing order
  const orderObjId = tran_id.split("_")[0] as string;

  if (!isObjectId(orderObjId)) return throwBadRequest("Invalid order _Id");

  const convertedOrderObjId = toObjectId(orderObjId);

  // if payment status not valid delete the pending order and exit from this function
  if (status !== "VALID") {
    await OrderModel.deleteOne({ _id: convertedOrderObjId });
    return;
  }

  const validationUrl =
    "https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php";

  let validatedData;

  // validat the payment
  try {
    const response = await axios.get(validationUrl, {
      params: {
        val_id,
        store_id: config.sslStoreId,
        store_passwd: config.sslStorePass,
        v: 1,
        format: "json",
      },
    });

    validatedData = response.data;
  } catch (err) {
    console.error("SSLCommerz payment validation failed:", err);
    return throwBadRequest("Could not validate payment with SSLCommerz");
  }

  const existingOrder = await OrderModel.findById(convertedOrderObjId);
  if (!existingOrder) return throwNotFound("Order not found");

  if (validatedData) {
    // Save the payment record even if it failed or had mismatches
    const newPayment = await createPayment({
      email: cus_email,
      orderId: existingOrder.orderId!,
      name: cus_name,
      transactionId: tran_id,
      validatedData,
      orderObjId: convertedOrderObjId,
    });

    // Confirm the order if the payment is valid and matches expected details
    const isValid = ["VALID", "VALIDATED"].includes(validatedData.status);
    const amountMatches =
      parseFloat(validatedData.amount) === existingOrder.total;
    const currencyMatches = validatedData.currency === "BDT";

    if (isValid && amountMatches && currencyMatches) {
      const newOrder = await confirmOrder(existingOrder);

      if (newOrder?._id && existingOrder.couponCode) {
        await incrementCouponUsageByCode(existingOrder.couponCode);
      }
    }

    return {
      status: validatedData.status,
      paymentId: newPayment._id,
      orderStatus: existingOrder.status,
    };
  } else {
    await OrderModel.deleteOne({ _id: convertedOrderObjId });
    return;
  }
};
