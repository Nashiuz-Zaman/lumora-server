import { CartModel } from "../cart.model";
import { calculateCartTotals } from "./calculateCartTotals";
import { TDatabaseCartDoc } from "../cart.type";
import { throwBadRequest } from "@utils/operationalErrors";
import { toObjectId } from "@utils/objectIdUtils";

interface IAddItemResult {
  cartData: TDatabaseCartDoc;
  isNewCart: boolean;
  cartType: "user" | "guest";
}

export const addItemToCart = async (
  productId: string,
  variantId: string,
  quantity: number = 1,
  cartId?: string,
  userId?: string,
): Promise<IAddItemResult> => {
  if (!productId) return throwBadRequest("Product ID is required");
  if (!variantId) return throwBadRequest("Variant ID is required");

  const cartType = userId ? "user" : "guest";
  let isNewCart = false;
  let cart: TDatabaseCartDoc | null = null;

  // Convert IDs to ObjectId
  const userObjId = userId ? toObjectId(userId) : null;
  const cartObjId = cartId ? toObjectId(cartId) : null;
  const productObjId = toObjectId(productId);
  const variantObjId = toObjectId(variantId);

  // --- Fetch or create cart ---
  if (cartType === "guest") {
    if (!cartObjId) {
      cart = new CartModel({ user: null, items: [] });
      isNewCart = true;
    } else {
      cart = await CartModel.findById(cartObjId);
      if (!cart) {
        cart = new CartModel({ user: null, items: [] });
        isNewCart = true;
      }
    }
  } else {
    cart = await CartModel.findOne({ user: userObjId });
    if (!cart) {
      cart = new CartModel({ user: userObjId, items: [] });
      isNewCart = true;
    }
  }

  // --- Add or update item in cart ---
  const existingIndex = cart.items.findIndex(
    (item) =>
      item.product.equals(productObjId) && item.variant.equals(variantObjId),
  );

  if (existingIndex >= 0) {
    cart.items[existingIndex].quantity += quantity;
  } else {
    cart.items.push({
      product: productObjId,
      variant: variantObjId,
      quantity,
    });
  }

  // --- Recalculate totals ---
  await calculateCartTotals(cart);

  // --- Save cart ---
  const savedCart = await cart.save();

  return {
    cartData: savedCart,
    isNewCart,
    cartType,
  };
};
