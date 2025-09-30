import mongoose from "mongoose";
import { IOrder } from "@app/modules/order/order.type";
import { ProductModel } from "../product.model";

export const updateStock = async (
  order: IOrder,
  action: "create" | "cancel",
  session?: mongoose.ClientSession
): Promise<void> => {
  for (const item of order.items) {
    const product = await ProductModel.findById(item.product._id).session(
      session ?? null
    );

    if (!product) continue;

    const variant = product.variants.find((v) =>
      v._id.equals(item.variant._id!)
    );

    if (!variant) continue;

    if (action === "create") {
      variant.stock = Math.max(variant.stock - item.quantity, 0);
    } else if (action === "cancel") {
      variant.stock += item.quantity;
    }

    // totalStock will be recalculated automatically by pre-save middleware
    await product.save({ session });
  }
};
