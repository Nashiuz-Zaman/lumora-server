import { formatPrice } from "@utils/index";
import { TPopulatedCartItem } from "../cart/cart.type";
import { IOrder } from "../order/order.type";
import { IVariant } from "../product/product.type";
import { getVariantSpecs } from "../product/product.util";

export const transformOrderForEmail = (order: IOrder) => {
  const emailItems = order?.items?.map((item: TPopulatedCartItem) => ({
    title: item.product?.title || "Product",
    quantity: item.quantity,
    price: formatPrice(item.variant?.price || 0),
    specs: item.variant ? getVariantSpecs(item.variant as IVariant) : {},
  }));

  return {
    orderId: order.orderId,
    email: order.email,
    name: order.name,
    items: emailItems,
    subtotal: formatPrice(order.subtotal || 0),
    total: formatPrice(order.total || 0),
    discount: formatPrice(order.discount || 0),
    tax: formatPrice(order.tax || 0),
    shippingFee: formatPrice(order.shippingFee || 0),
    couponCode: order.couponCode,
  };
};
