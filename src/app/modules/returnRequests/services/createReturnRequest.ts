import { OrderModel } from "../../order/order.model";
import { TReturnRequestDoc } from "../returnRequest.type";
import {
  throwBadRequest,
  throwInternalServerError,
  throwNotFound,
} from "@utils/index";
import { OrderStatus } from "@app/modules/order/order.constants";
import { ReturnRequestModel } from "../returnRequest.model";
import cloneDeep from "lodash/cloneDeep";

export const createReturnRequest = async (payload: {
  orderId: string;
  description: string;
  reason: string;
  invoice: string;
  files?: string[];
}) => {
  const { orderId, description, reason, invoice, files = [] } = payload;

  if (!orderId || !description || !reason || !invoice || !files)
    return throwBadRequest("Missing required fields");

  const order = await OrderModel.findOne({ orderId });

  if (!order) return throwNotFound("Order not found");

  if (order.status < OrderStatus.Delivered)
    return throwBadRequest("Order not eligible for return");

  const deliveredDate = cloneDeep(order.activities)
    .reverse()
    .find((activity) => +activity.status === OrderStatus.Delivered)?.time;

  // product not delivered yet
  if (!deliveredDate)
    return throwBadRequest("Order has not been delivered yet");

  // Calculate 15 days in milliseconds
  const FIFTEEN_DAYS_MS = 15 * 24 * 60 * 60 * 1000;

  const deliveredTime = deliveredDate.getTime();

  // Current time
  const now = Date.now();

  // Check if 15 days have passed
  if (now - deliveredTime > FIFTEEN_DAYS_MS)
    return throwBadRequest(
      "Return period has expired (more than 15 days since delivery)"
    );

  // Otherwise, return is still valid
  const returnRequest = await ReturnRequestModel.create({
    orderId,
    description,
    reason,
    invoice,
    files,
  });

  if (returnRequest._id) return returnRequest;

  return throwInternalServerError();
};
