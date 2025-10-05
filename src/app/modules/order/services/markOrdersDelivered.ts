import { toObjectId, throwBadRequest } from "@utils/index";
import { OrderStatus } from "../order.constants";
import { OrderModel } from "../order.model";

export const markOrdersDelivered = async (_ids: string[]): Promise<string> => {
  if (!Array.isArray(_ids) || _ids.length === 0)
    return throwBadRequest("_ids array needed");

  const objectIds = _ids.map((_id) => toObjectId(_id));

  const result = await OrderModel.updateMany(
    { _id: { $in: objectIds }, status: { $ne: OrderStatus.Delivered } },
    {
      $set: { status: OrderStatus.Delivered },
      $push: {
        activities: {
          time: new Date(),
          status: OrderStatus.Delivered,
        },
      },
    }
  );

  const count = result.modifiedCount || 0;

  return `${count} order${count !== 1 ? "s" : ""} marked as delivered.`;
};
