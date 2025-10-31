import { QueryBuilder } from "@app/classes/QueryBuilder";
import { PaymentModel } from "../payment.model";
import { PaymentSearchableFields } from "../payment.constant";

export const getPayments = async (queryObj: Record<string, any>) => {
  const paymentsQuery = new QueryBuilder(PaymentModel, queryObj);

  const payments = await paymentsQuery
    .filter()
    .search([...PaymentSearchableFields])
    .addField("cardType", "$details.card_type")
    .addField("refundReason", "$details.refundReason")
    .sort()
    .limitFields()
    .paginate()
    .exec();

  const queryMeta = await paymentsQuery.getQueryMeta();

  return { queryMeta, payments };
};
