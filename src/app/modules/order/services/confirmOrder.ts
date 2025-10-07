import mongoose from "mongoose";
import { sendOrderPlacedEmail } from "@app/modules/email/service/sendOrderPlacedEmail";
import { OrderStatus } from "../order.constants";
import { TOrderDoc } from "../order.type";
import { generateAndUploadInvoicePdf } from "./generateAndUploadInvoicePdf";
import { updateStock } from "@app/modules/product/service";
import { CartModel } from "@app/modules/cart/cart.model";
import { toObjectId } from "@utils/index";

export const confirmOrder = async (order: TOrderDoc) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Update order status
    order.status = OrderStatus.Confirmed;
    order.activities.push({ time: new Date(), status: OrderStatus.Confirmed });

    // 2. Decrease stock for order items
    await updateStock(order, "create", session);

    // 3. Generate and upload invoice
    const { buffer, uploadedUrl } = await generateAndUploadInvoicePdf(order);

    if (uploadedUrl) {
      order.invoice = uploadedUrl;
    }

    const cartId = order.cartId;
    order.cartId = "";

    // 4. Save order and delete cart
    const updatedOrder = await order.save({ session });

    if (cartId) {
      await CartModel.deleteOne({ _id: toObjectId(cartId) }).session(session);
    }

    // 5. Commit transaction
    await session.commitTransaction();

    // 6. Send order placed email (outside session)
    sendOrderPlacedEmail(updatedOrder.toObject(), {
      filename: `Invoice for ${updatedOrder.orderId}.pdf`,
      content: buffer,
      contentType: "application/pdf",
    }).catch((err) => {
      console.error("Failed to send order placed email:", err);
    });

    return updatedOrder;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};
