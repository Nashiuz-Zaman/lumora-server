import { QueryBuilder } from "@app/classes/QueryBuilder";
import { PaymentModel } from "../payment.model";
import { PaymentSearchableFields } from "../payment.constant";
import { normalizeStatusFilter } from "@utils/normalizeQueryParam";

export const getPayments = async (queryObj: Record<string, any>) => {
  const newQueryObj = normalizeStatusFilter(queryObj);

  const paymentsQuery = new QueryBuilder(PaymentModel, newQueryObj);

  const payments = await paymentsQuery
    .filter()
    .search([...PaymentSearchableFields])
    .addField("cardType", "$paymentDetails.card_type")
    .addField("refundReason", "$refundDetails.refundReason")
    .sort()
    .limitFields()
    .paginate()
    .exec();

  const queryMeta = await paymentsQuery.getQueryMeta();

  return { queryMeta, payments };
};
