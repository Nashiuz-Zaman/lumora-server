import { confirmOrder } from "@app/modules/order/services";
import { createPayment } from "./createPayment";
import { checkDuplicatePayment } from "./checkDuplicatePayment";
import { OrderModel } from "@app/modules/order/order.model";

import axios from "axios";
import { config } from "@config/env";
import {
  isObjectId,
  throwBadRequest,
  throwNotFound,
  toObjectId,
} from "@utils/index";

export const confirmSslIpnPayment = async (ipnPayload: any) => {
  const { val_id, tran_id, value_a: cus_name, value_b: cus_email } = ipnPayload;

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
    console.error("SSLCommerz validation request failed:", err);
    return throwBadRequest("Could not validate payment with SSLCommerz");
  }

  // extract order _id and find the existing order
  const orderObjId = tran_id.split("_")[0] as string;

  if (!isObjectId(orderObjId)) return throwBadRequest("Invalid order _Id");

  const convertedOrderObjId = toObjectId(orderObjId);

  const existingOrder = await OrderModel.findById(convertedOrderObjId);
  if (!existingOrder) return throwNotFound("Order not found");

  const duplicateCheck = await checkDuplicatePayment(
    existingOrder._id,
    existingOrder.status
  );

  if (duplicateCheck) return duplicateCheck;

  // Save the payment record even if it failed or had mismatches
  const newPayment = await createPayment({
    email: cus_email,
    name: cus_name,
    transactionId: tran_id,
    validatedData,
    orderObjId: convertedOrderObjId,
    rawIpnPayload: ipnPayload,
  });

  // Only confirm the order if the payment is valid and matches expected details
  const isValid = validatedData.status === "VALID";
  const amountMatches =
    parseFloat(validatedData.amount) === existingOrder.total;
  const currencyMatches = validatedData.currency === "BDT";

  if (isValid && amountMatches && currencyMatches) {
    await confirmOrder(existingOrder);
  }

  return {
    status: validatedData.status, // VALID / FAILED / CANCELLED
    paymentId: newPayment._id,
    orderStatus: existingOrder.status,
  };
};
