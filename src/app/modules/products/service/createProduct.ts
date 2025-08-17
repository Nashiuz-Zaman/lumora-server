import cloneDeep from "lodash/cloneDeep";

import { ProductModel } from "../product.model";
import { TRawProduct } from "../product.type";
import { sanitizeProductData } from "../products.helper";
// import { CollectionModel } from "../../collections/collection.model";

export const createProduct = async (product: TRawProduct) => {
  const [cleanProduct] = await sanitizeProductData(product);

  // ✅ Create the product
  const createdProduct = await ProductModel.create(cloneDeep(cleanProduct));
  if (!createdProduct?._id) return false;

  return true;
};
