import { Schema, model, Types } from "mongoose";
import {
  TDatabaseCart,
  TDatabaseCartItem,
  IDatabaseCartModel,
  TPopulatedCart,
  TPopulatedCartItem,
} from "./cart.type";
import { ProductModel } from "../product/product.model";
import { convertToTwoDecimalNumber } from "@utils/convertToTwoDecimalNumber";
import { throwNotFound } from "@utils/operationalErrors";

// ----- Cart Item Schema -----
const CartItemSchema = new Schema<TDatabaseCartItem>({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  variant: { type: Schema.Types.ObjectId, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

// ----- Cart Schema -----
const CartSchema = new Schema<TDatabaseCart>(
  {
    user: { type: Schema.Types.ObjectId, default: null },
    items: { type: [CartItemSchema], default: [] },
    couponCode: { type: String, default: "" },
    discount: { type: Number, default: 0, set: convertToTwoDecimalNumber },
    tax: { type: Number, default: 0, set: convertToTwoDecimalNumber },
    shippingFee: { type: Number, default: 0, set: convertToTwoDecimalNumber },
    subtotal: { type: Number, default: 0, set: convertToTwoDecimalNumber },
    totalItemQty: { type: Number, default: 0 },
    total: { type: Number, default: 0, set: convertToTwoDecimalNumber },
  },
  { timestamps: true },
);

// Static method populate cart
CartSchema.statics.getPopulatedCart = async function (
  cartId: Types.ObjectId,
): Promise<TPopulatedCart | null> {
  const cart = await this.findById(cartId);
  if (!cart) return null;

  const populatedItems: TPopulatedCartItem[] = await Promise.all(
    cart.items.map(async (item: TDatabaseCartItem) => {
      const product = await ProductModel.findById(item.product).lean();
      if (!product) return throwNotFound(`Product ${item.product} not found`);

      const variant = product.variants.find(
        (v) => v._id?.toString() === item.variant?.toString(),
      );
      if (!variant)
        return throwNotFound(
          `Variant ${item.variant} not found for product ${item.product}`,
        );

      // Only include real-world essential fields for product and variant
      const filteredProduct = {
        _id: product._id,
        title: product.title,
        slug: product.slug,
        defaultPrice: product.defaultPrice,
        defaultImage: product.defaultImage,
        brand: product.brand,
      };

      return {
        _id: item._id,
        product: filteredProduct,
        variant,
        quantity: item.quantity,
      };
    }),
  );

  return {
    ...cart.toObject(),
    items: populatedItems,
  };
};

export const CartModel = model<TDatabaseCart, IDatabaseCartModel>(
  "Cart",
  CartSchema,
);
