import { QueryBuilder } from "@app/classes/QueryBuilder";
import { IOrder } from "../order.type";
import { OrderSearchableFields } from "../order.constants";
import { normalizeStatusFilter } from "@utils/normalizeQueryParam";
import { OrderModel } from "../order.model";

export const getOrders = async (
  queryObj: Record<string, any> & Partial<IOrder>
) => {
  console.log("before", queryObj);
  const newQueryObj = normalizeStatusFilter(queryObj);
  console.log("after", newQueryObj);

  const query = new QueryBuilder<IOrder>(OrderModel, newQueryObj);

  const orders = await query
    .filter()
    .search([...OrderSearchableFields])
    .sort()
    .paginate()
    .limitFields()
    .exec();

  const queryMeta = await query.getQueryMeta();

  return { orders, queryMeta };
};
