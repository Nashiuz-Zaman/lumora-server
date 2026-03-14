import { ProductModel } from "@app/modules/product/product.model";
import { TDatabaseCartDoc } from "../cart.type";
import { calculateCouponDiscount } from "@app/modules/coupon/service/calculateCouponDiscount";
import { validateCoupon } from "@app/modules/coupon/service/validateCoupon";
import { throwNotFound } from "@utils/operationalErrors";

export const calculateCartTotals = async (cart: TDatabaseCartDoc) => {
  cart.totalItemQty = cart.items.reduce((sum, i) => sum + i.quantity, 0);

  const productIds = cart.items.map((i) => i.product);

  const products = await ProductModel.find({
    _id: { $in: productIds },
  }).lean();

  const productMap = new Map(products.map((p) => [p._id.toString(), p]));

  let subtotal = 0;

  for (const item of cart.items) {
    const product = productMap.get(item.product.toString());

    if (!product) return throwNotFound(`Product ${item.product} not found`);

    const variant = product.variants.find(
      (v) => v._id?.toString() === item.variant?.toString(),
    );

    if (!variant) {
      return throwNotFound(
        `Variant ${item.variant} not found for product ${item.product}`,
      );
    }

    subtotal += variant.price * item.quantity;
  }

  const tax = subtotal * 0.05;
  const shippingFee = 50;

  let discount = 0;

  if (cart.couponCode?.trim()) {
    try {
      const coupon = await validateCoupon(cart.couponCode, subtotal);
      discount = calculateCouponDiscount(coupon, subtotal);
      cart.couponCode = coupon.code;
    } catch {
      cart.couponCode = "";
      discount = 0;
    }
  }

  cart.subtotal = subtotal;
  cart.tax = tax;
  cart.shippingFee = shippingFee;
  cart.discount = discount;
  cart.total = subtotal + tax + shippingFee - discount;
};
