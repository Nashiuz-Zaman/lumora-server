import { QueryBuilder } from "@app/classes/QueryBuilder";
import { IOrder } from "../order.type";
import { OrderSearchableFields } from "../order.constants";
import { normalizeStatusFilter } from "@utils/normalizeQueryParam";
import { OrderModel } from "../order.model";
import { throwInternalServerError } from "@utils/operationalErrors";
import { toObjectId } from "@utils/objectIdUtils";

export const getOrders = async (
  queryObj: Record<string, any> & Partial<IOrder>
) => {
  const newQueryObj = normalizeStatusFilter(queryObj);

  if (typeof newQueryObj.user === "string") {
    newQueryObj.user = toObjectId(newQueryObj.user);
  }

  const query = new QueryBuilder<IOrder>(OrderModel, newQueryObj);

  const orders = await query
    .filter()
    .search([...OrderSearchableFields])
    .sort()
    .paginate()
    .limitFields()
    .exec();

  const queryMeta = await query.getQueryMeta();

  if (!orders || !queryMeta) return throwInternalServerError();

  return { orders, queryMeta };
};
