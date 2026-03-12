import { CartModel } from "../cart.model";
import { TDatabaseCartDoc, TPopulatedCart } from "../cart.type";
import { throwBadRequest } from "@utils/operationalErrors";
import { resolveCart } from "./resolveCart";
import { toObjectId } from "@utils/objectIdUtils";
import { calculateCartTotals } from "./calculateCartTotals";

export const addItemToCart = async (
  productId: string,
  variantId: string,
  quantity: number = 1,
  cartId?: string,
  userId?: string,
): Promise<TPopulatedCart> => {
  if (!productId) return throwBadRequest("Product ID is required");
  if (!variantId) return throwBadRequest("Variant ID is required");

  const cartType: "user" | "guest" = userId ? "user" : "guest";
  let isNewCart = false;

  // Convert IDs to ObjectId
  const productObjId = toObjectId(productId);
  const variantObjId = toObjectId(variantId);

  // --- Fetch existing cart or create a new one ---
  let cart: TDatabaseCartDoc | null = null;

  if (cartId || userId) {
    try {
      cart = await resolveCart(cartId, userId);
    } catch {
      cart = null; // will create new cart if not found
    }
  }

  if (!cart) {
    cart = new CartModel({
      user: userId ? toObjectId(userId) : null,
      items: [],
    });
    isNewCart = true;
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

  await calculateCartTotals(cart);
  const savedCart = await cart.save();

  return await CartModel.getPopulatedCart(savedCart._id) as TPopulatedCart;
};
