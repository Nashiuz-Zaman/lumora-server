import { toObjectId } from "@utils/objectIdUtils";
import { fetchOrders } from "./fetchOrders";

export const fetchRecentOrdersForUser = async (userId: string) => {
  const { orders } = await fetchOrders({
    user: toObjectId(userId),
    sort: "-createdAt",
  });

  return orders;
};
