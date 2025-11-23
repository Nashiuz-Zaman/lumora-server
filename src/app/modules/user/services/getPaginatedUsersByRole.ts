import { UserRoles, UserSearchableFields } from "./../user.constants";
import { QueryBuilder } from "@app/classes/QueryBuilder";
import { AdminModel } from "@app/modules/admin/admin.model";
import { CustomerModel } from "@app/modules/customer/customer.model";
import { Model } from "mongoose";

const MODEL_MAP: Record<
  typeof UserRoles.customer | typeof UserRoles.admin,
  Model<any>
> = {
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

  const usersQuery = new QueryBuilder(Model, query);

  const users = await usersQuery
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

  const queryMeta = await usersQuery.getQueryMeta();

  return { queryMeta, users };
};
