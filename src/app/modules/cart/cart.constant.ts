export const cartCookieName = "Cart_Token";

export const emptyCart = {
  _id: undefined,
  user: "",
  items: [],
  couponCode: "",
  discount: 0,
  tax: 0,
  shippingFee: 0,
  subtotal: 0,
  totalItemQty: 0,
  total: 0,
};

export const CartActions = Object.freeze({
  add: "add",
  remove: "remove",
} as const);
