import { throwBadRequest } from "@utils/operationalErrors";
import { CartModel } from "../cart.model";
import { ICartAction, TDatabaseCart } from "../cart.type";
import { toObjectId } from "@utils/toObjectId";

export const createCart = async (
  actionData: ICartAction,
  creatorType: "user" | "guest" = "guest",
  userId?: string
) => {
  if (!actionData) return throwBadRequest("No data for cart provided");

  const { productId, variantId, quantity } = actionData;

  if (creatorType === "user" && !userId) {
    return throwBadRequest("User ID is required for user cart creation");
  }

  const newCart: TDatabaseCart = {
    user: creatorType === "user" ? toObjectId(userId!) : "guest",
    items: [
      {
        product: toObjectId(productId),
        variant: toObjectId(variantId),
        quantity: quantity,
      },
    ],
  };
  const cart = await CartModel.create(newCart);
  return cart;
};
