import { toObjectId } from "@utils/objectIdUtils";
import { getOrders } from "./getOrders";

export const fetchRecentOrdersForUser = async (userId: string) => {
  const { orders } = await getOrders({
    user: toObjectId(userId),
    sort: "-createdAt",
  });

  return orders;
};
