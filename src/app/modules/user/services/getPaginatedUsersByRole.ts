import { UserRoles, UserSearchableFields } from "./../user.constants";
// services/getPaginatedUsersByRole.ts

import { QueryBuilder } from "@app/classes/QueryBuilder";
import { AdminModel } from "@app/modules/admin/admin.model";
import { CustomerModel } from "@app/modules/customer/customer.model";

const MODEL_MAP = {
  customer: CustomerModel,
  admin: AdminModel,
};

export const getPaginatedUsersByRole = async (
  role: typeof UserRoles.customer | typeof UserRoles.admin,
  query: Record<string, any>
) => {
  const Model = MODEL_MAP[role];
  if (!Model) throw new Error(`Unsupported role: ${role}`);

  if (query?.status === "all") delete query.status;

  const qb = new QueryBuilder(Model, query);

  const users = await qb
    .populate({
      localField: "user",
      from: "users",
      foreignField: "_id",
      as: "user",
      unwind: true,
    })
    .customMethod([
      {
        $set: {
          userId: "$user._id", // Keep original user._id as userId
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ["$user", "$$ROOT"],
          },
        },
      },
      {
        $unset: "user",
      },
    ])
    .filter()
    .search([...UserSearchableFields])
    .sort()
    .limitFields()
    .paginate()
    .exec();

  const queryMeta = await qb.getQueryMeta();

  return { queryMeta, users };
};
