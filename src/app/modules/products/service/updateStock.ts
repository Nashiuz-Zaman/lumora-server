import mongoose from "mongoose";
import { toObjectId } from "@utils/toObjectId";

import { IOrder } from "@app/modules/order/order.type";
import { ProductModel } from "../product.model";

/**
 * Updates stock quantities based on the order action.
 *
 * @param order - The order containing items to update.
 * @param action - Whether to confirm (reduce) or cancel (restore) stock.
 * @param session - Optional mongoose session to run updates in a transaction.
 */
export const updateStock = async (
  order: IOrder,
  action: "create" | "cancel",
  session?: mongoose.ClientSession
): Promise<void> => {
  for (const item of order.items) {
    if (item.kind !== "local") continue;

    const product = await ProductModel.findById(item._id).session(
      session ?? null
    );

    if (!product) continue;

    const variant = product.variants.find((v) =>
      v._id.equals(toObjectId(item.variantId))
    );

    if (!variant) continue;

    if (action === "create") {
      variant.stock = Math.max(variant.stock - item.quantity, 0);
    } else if (action === "cancel") {
      variant.stock += item.quantity;
    }

    await product.save({ session });
  }
};
