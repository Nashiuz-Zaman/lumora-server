import { IQueryMeta, QueryBuilder } from "@app/classes/QueryBuilder";
import { ReturnRequestSearchableFields } from "../returnRequest.constants";
import { IReturnRequest } from "../returnRequest.type";
import { normalizeStatusFilter } from "@utils/normalizeQueryParam";
import { ReturnRequestModel } from "../returnRequest.model";

export const getReturnRequests = async (
  queryObj: Record<string, any>
): Promise<{
  returnRequests: Partial<IReturnRequest>[];
  queryMeta: IQueryMeta;
}> => {
  const newQueryObj = normalizeStatusFilter(queryObj);
  const query = new QueryBuilder(ReturnRequestModel, newQueryObj);

  const result = await query
    .populate({
      localField: "order",
      from: "orders",
      as: "order",
      foreignField: "_id",
      unwind: true,
    })
    .addField("name", "$order.name")
    .addField("email", "$order.email")
    .addField("phone", "$order.phone")
    .removeField("order")
    .filter()
    .search([...ReturnRequestSearchableFields])
    .sort()
    .limitFields()
    .paginate()
    .exec();

  const queryMeta = await query.getQueryMeta();

  return { returnRequests: result, queryMeta };
};
