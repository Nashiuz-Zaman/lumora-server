import { throwBadRequest } from "@utils/operationalErrors";
import { CartModel } from "../cart.model";
import { TDatabaseCart, TDatabaseCartItem } from "../cart.type";

export const createCart = async (
  data: Partial<TDatabaseCart>,
  creatorType: "user" | "guest" = "guest"
) => {
  if (!data) return throwBadRequest("No data for cart provided");

  // Ensure items are at least an empty array if not provided
  const items: TDatabaseCartItem[] = data?.items ?? [];

  if (creatorType === "user" && !data.user) {
    return throwBadRequest("User ID is required for user cart creation");
  }

  const newCart: TDatabaseCart = {
    user: creatorType === "user" ? data.user! : "guest",
    items,
  };
  const cart = await CartModel.create(newCart);
  return cart;
};
