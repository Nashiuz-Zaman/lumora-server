import {
  throwNotFound,
  throwBadRequest,
  throwInternalServerError,
  toObjectId,
} from "@utils/index";

import { ReturnRequestStatus } from "../returnRequest.constants";
import { OrderModel } from "@app/modules/order/order.model";
import { OrderStatus } from "@app/modules/order/order.constants";
import { ReturnRequestModel } from "../returnRequest.model";
import { issueRefund } from "@app/modules/payment/service";
import { PaymentStatus } from "@app/modules/payment/payment.constant";

export const approveReturnRequest = async (
  id: string,
  customAmount?: number
) => {
  const returnRequest = await ReturnRequestModel.findById(toObjectId(id));
  if (!returnRequest) return throwNotFound("Return request not found");

  if (returnRequest.status !== ReturnRequestStatus.Pending)
    return throwBadRequest("Only pending return requests can be approved");
  if (!returnRequest.orderId || !returnRequest.payment)
    return throwBadRequest("Invalid Return Request");

  const order = await OrderModel.findOne({ orderId: returnRequest.orderId });
  if (!order) return throwNotFound("Order from return request not found");

  const payment = await issueRefund(
    returnRequest?.payment,
    "Settling Return Request",
    typeof customAmount === "number" && customAmount > 0 ? customAmount : 0
  );
  if (!payment) return throwInternalServerError("Error refunding payment");

  // Only mark as returned if fully refunded
  if (payment.status === PaymentStatus.Refunded) {
    order.status = OrderStatus.Returned;
    order.returnReason = returnRequest.reason;
  }

  returnRequest.status = ReturnRequestStatus.Approved;

  const [updatedOrder, updatedReturnRequest] = await Promise.all([
    order.save(),
    returnRequest.save(),
  ]);

  if (updatedOrder._id && updatedReturnRequest._id) {
    return updatedReturnRequest;
  }

  return throwInternalServerError("Failed to approve request");
};
