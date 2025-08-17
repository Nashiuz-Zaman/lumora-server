import { ProductSearchableFields } from "../product.constants";
import { ProductModel } from "../product.model";
import { IProduct } from "../product.type";
import { QueryBuilderOne } from "@app/classes/QueryBuilderOne";

export const getProduct = async (queryObj: Record<string, any>) => {
  const query = new QueryBuilderOne<IProduct>(ProductModel, queryObj)
    .filter()
    .search([...ProductSearchableFields])
    .populate()
    .limitFields();

  return await query.exec();
};
