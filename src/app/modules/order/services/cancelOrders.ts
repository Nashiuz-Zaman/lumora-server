import mongoose from "mongoose";
import { OrderModel } from "../order.model";
import { OrderStatus } from "../order.constants";
import { decrementCouponUsageByCode } from "@app/modules/coupon/service";
import { toObjectId, throwBadRequest } from "@utils/index";
import { updateStock } from "@app/modules/product/service";
import { PaymentModel } from "@app/modules/payment/payment.model";
import { PaymentStatus } from "@app/modules/payment/payment.constant";
import { issueRefund } from "@app/modules/payment/service";

export const cancelOrders = async (_ids: string[], reason?: string) => {
  if (!Array.isArray(_ids) || _ids.length === 0)
    return throwBadRequest("_ids not provided");

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const objectIds = _ids.map((id) => toObjectId(id));

    // 1. Find orders by _id
    const ordersToCancel = await OrderModel.find({
      _id: { $in: objectIds },
      status: { $lt: OrderStatus.Shipped },
    }).session(session);

    // 2. Decrement coupon usage for orders that have a coupon
    for (const order of ordersToCancel) {
      if (order.couponCode) {
        await decrementCouponUsageByCode(order.couponCode, session);
      }

      await updateStock(order, "cancel", session);

      const paymentForOrder = await PaymentModel.findOne({
        order: order._id,
        status: PaymentStatus.Paid,
      })
        .select("_id")
        .lean();

      if (paymentForOrder?._id) {
        await issueRefund(paymentForOrder._id, "Admin Cancelled", 0, session);
      }
    }

    const idsToCancel = ordersToCancel.map((o) => o._id);

    // 3. Update all orders to Cancelled and save reason
    const result = await OrderModel.updateMany(
      { _id: { $in: idsToCancel } },
      {
        $set: {
          status: OrderStatus.Cancelled,
          cancellationReason: reason,
        },
      }
    ).session(session);

    await session.commitTransaction();

    const count = result.modifiedCount || 0;
    return `${count} order${count !== 1 ? "s" : ""} cancelled.`;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};
