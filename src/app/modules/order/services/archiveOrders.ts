import { OrderModel } from "../order.model";
import { toObjectId, throwBadRequest } from "@utils/index";

export const archiveOrders = async (_ids: string[]) => {
  if (!Array.isArray(_ids) || _ids.length === 0) {
    throwBadRequest("_ids not provided");
  }

  const objectIds = _ids.map((id) => toObjectId(id));

  const result = await OrderModel.updateMany(
    { _id: { $in: objectIds }, isArchived: { $ne: true } },
    {
      $set: { isArchived: true },
      $push: {
        activities: {
          time: new Date(),
          isArchived: true,
        },
      },
    }
  );

  const count = result.modifiedCount ?? 0;
  return `${count} order${count !== 1 ? "s" : ""} archived.`;
};
