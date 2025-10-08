// services/getPaginatedUsersByRole.ts

import { QueryBuilder } from "@app/classes/QueryBuilder";
import { PaymentModel } from "../payment.model";
import { PaymentSearchableFields, PaymentStatus } from "../payment.constant";
import { normalizeStatusFilter } from "@utils/normalizeQueryParam";

export const getPayments = async (queryObj: Record<string, any>) => {
  const newQueryObj = normalizeStatusFilter(queryObj);

  const paymentsQuery = new QueryBuilder(PaymentModel, newQueryObj);

  const payments = await paymentsQuery
    .populate({
      localField: "order",
      from: "orders",
      foreignField: "_id",
      as: "order",
      unwind: true,
    })
    .addField("orderId", "order.orderId")
    .removeField("order")
    .filter()
    .search([...PaymentSearchableFields])
    .sort()
    .limitFields()
    .paginate()
    .exec();

  const queryMeta = await paymentsQuery.getQueryMeta();

  return { queryMeta, payments };
};
