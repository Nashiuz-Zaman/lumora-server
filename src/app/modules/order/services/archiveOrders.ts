import { OrderModel } from "../order.model";
import { OrderStatus } from "../order.constants";
import { toObjectId, throwBadRequest } from "@utils/index";

export const archiveOrders = async (_ids: string[]) => {
  if (!Array.isArray(_ids) || _ids.length === 0)
    return throwBadRequest("_ids not provided");

  const objectIds = _ids.map((id) => toObjectId(id));

  const result = await OrderModel.updateMany(
    { _id: { $in: objectIds }, status: { $ne: OrderStatus.Deleted } },
    {
      $set: { status: OrderStatus.Deleted },
      $push: {
        activities: {
          time: new Date(),
          status: OrderStatus.Deleted,
        },
      },
    }
  );

  const count = result.modifiedCount || 0;
  return `${count} order${count !== 1 ? "s" : ""} archived.`;
};
