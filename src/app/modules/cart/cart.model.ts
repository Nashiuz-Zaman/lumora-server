import { Schema, model, Types } from "mongoose";
import {
  TDatabaseCart,
  TDatabaseCartItem,
  TDatabaseCartDoc,
  IDatabaseCartModel,
  TPopulatedCart,
  TPopulatedCartItem,
} from "./cart.type";
import { ProductModel } from "../product/product.model";
import { AppError } from "@app/classes";
import { convertToTwoDecimalNumber, throwNotFound } from "@utils/index";
import { calculateCouponDiscount, validateCoupon } from "../coupon/service";

// ----- Cart Item Schema -----
const CartItemSchema = new Schema<TDatabaseCartItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    variant: { type: Schema.Types.ObjectId, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

// ----- Cart Schema -----
const CartSchema = new Schema<TDatabaseCart>(
  {
    user: { type: Schema.Types.Mixed, required: true, default: "guest" },
    items: { type: [CartItemSchema], default: [] },
    couponCode: { type: String, default: "" },
    discount: { type: Number, default: 0, set: convertToTwoDecimalNumber },
    tax: { type: Number, default: 0, set: convertToTwoDecimalNumber },
    shippingFee: { type: Number, default: 0, set: convertToTwoDecimalNumber },
    subtotal: { type: Number, default: 0, set: convertToTwoDecimalNumber },
    totalItemQty: { type: Number, default: 0 },
    total: { type: Number, default: 0, set: convertToTwoDecimalNumber },
  },
  { timestamps: true }
);

// ----- Pre-save hook to calculate totals -----
CartSchema.pre<TDatabaseCartDoc>("save", async function (next) {
  try {
    const cart = this;

    // Total item quantity
    cart.totalItemQty = cart.items.reduce((sum, i) => sum + i.quantity, 0);

    // Subtotal calculation
    let subtotal = 0;
    for (const item of cart.items) {
      // find main product
      const product = await ProductModel.findById(item.product).lean();
      if (!product)
        return next(new AppError(`Product ${item.product} not found`));

      // find variant of that main product
      const variant = product.variants.find(
        (v) => v._id?.toString() === item.variant?.toString()
      );
      if (!variant)
        return next(
          new AppError(
            `Variant ${item.variant} not found for product ${item.product}`
          )
        );

      subtotal += variant.price * item.quantity;
    }

    // Tax
    const tax = subtotal * 0.05;

    // Shipping Fee
    const shippingFee = 50;

    // Handle coupon discount if couponCode is present
    let discount = 0;

    if (cart.couponCode && cart.couponCode.trim() !== "") {
      try {
        const coupon = await validateCoupon(cart.couponCode, subtotal);

        discount = calculateCouponDiscount(coupon, subtotal);
        cart.couponCode = coupon?.code;
      } catch (err) {
        next(new AppError((err as Error).message));
        cart.couponCode = "";
        discount = 0;
      }
    } else {
      cart.couponCode = "";
      discount = 0;
    }

    // Total = subtotal + tax + shipping − discount
    const total = subtotal + tax + shippingFee - discount;

    // Assign values
    cart.subtotal = subtotal;
    cart.tax = tax;
    cart.discount = discount;
    cart.shippingFee = shippingFee;
    cart.total = total;

    next();
  } catch (err: unknown) {
    next(new AppError((err as Error).message));
  }
});

// Static method populate cart
CartSchema.statics.getPopulatedCart = async function (
  cartId: Types.ObjectId
): Promise<TPopulatedCart | null> {
  const cart = await this.findById(cartId);
  if (!cart) return null;

  const populatedItems: TPopulatedCartItem[] = await Promise.all(
    cart.items.map(async (item: TDatabaseCartItem) => {
      const product = await ProductModel.findById(item.product).lean();
      if (!product) return throwNotFound(`Product ${item.product} not found`);

      const variant = product.variants.find(
        (v) => v._id?.toString() === item.variant?.toString()
      );
      if (!variant)
        return throwNotFound(
          `Variant ${item.variant} not found for product ${item.product}`
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
        product: filteredProduct,
        variant,
        quantity: item.quantity,
      };
    })
  );

  return {
    ...cart.toObject(),
    items: populatedItems,
  };
};

export const CartModel = model<TDatabaseCart, IDatabaseCartModel>(
  "Cart",
  CartSchema
);
