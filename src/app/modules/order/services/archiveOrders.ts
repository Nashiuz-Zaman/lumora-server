import { OrderStatus } from "../order.constants";
import { OrderModel } from "../order.model";
import { toObjectId, throwBadRequest, hasElements } from "@utils/index";

export const archiveOrders = async (_ids: string[]) => {
  if (!hasElements(_ids)) return throwBadRequest("_ids not provided");

  const objectIds = _ids.map((id) => toObjectId(id));

  const result = await OrderModel.collection.updateMany(
    {
      _id: { $in: objectIds },
      isArchived: { $ne: true },
      status: {
        $nin: [OrderStatus.Confirmed, OrderStatus.Shipped, OrderStatus.Pending],
      },
    },
    [
      {
        $set: {
          isArchived: true,
          activities: {
            $concatArrays: [
              "$activities",
              [
                {
                  time: "$$NOW",
                  status: "$status",
                  isArchived: true,
                },
              ],
            ],
          },
        },
      },
    ]
  );

  const count = result.modifiedCount ?? 0;
  return `${count} order${count !== 1 ? "s" : ""} archived.`;
};
