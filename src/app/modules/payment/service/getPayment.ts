import { QueryBuilderOne } from "@app/classes/QueryBuilderOne";
import { IPayment } from "../payment.type";
import { PaymentModel } from "../payment.model";
import { PaymentSearchableFields } from "../payment.constant";

export const getPayment = async (queryObj: Record<string, any>) => {
  let query = new QueryBuilderOne<IPayment>(PaymentModel, queryObj)
    .filter()
    .search([...PaymentSearchableFields])
    .populate()
    .limitFields();

  return await query.exec();
};
