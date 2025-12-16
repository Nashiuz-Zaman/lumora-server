import { UserRoles, UserSearchableFields } from "./../user.constants";
import { IQueryMeta, QueryBuilder } from "@app/classes/QueryBuilder";
import { AdminModel } from "@app/modules/admin/admin.model";
import { CustomerModel } from "@app/modules/customer/customer.model";
import { normalizeStatusFilter } from "@utils/index";
import { Model } from "mongoose";
import { IUser } from "../user.type";
import { IAdmin } from "@app/modules/admin/admin.type";
import { ICustomer } from "@app/modules/customer/customer.type";

const MODEL_MAP: Record<
  typeof UserRoles.customer | typeof UserRoles.admin,
  Model<any>
> = {
  customer: CustomerModel,
  admin: AdminModel,
};

type TPaginatedUsersResult = {
  queryMeta: IQueryMeta;
  admins?: Partial<IUser & IAdmin>[];
  customers?: Partial<IUser & ICustomer>[];
};

export const getPaginatedUsersByRole = async (
  role: typeof UserRoles.customer | typeof UserRoles.admin,
  query: Record<string, any>
): Promise<TPaginatedUsersResult> => {
  const Model = MODEL_MAP[role];
  if (!Model) throw new Error(`Unsupported role: ${role}`);
  const normalizedQuery = normalizeStatusFilter(query);
  const usersQuery = new QueryBuilder(Model, normalizedQuery);

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

  const result: TPaginatedUsersResult = { queryMeta };

  if (role === UserRoles.admin) {
    result.admins = users as Partial<IUser & IAdmin>[];
  } else {
    result.customers = users as Partial<IUser & ICustomer>[];
  }

  return result;
};
