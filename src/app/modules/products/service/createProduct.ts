import { ProductModel } from "../product.model";
import { IProduct } from "../product.type";

export const createProduct = async (product: Partial<IProduct>) => {
  const createdProduct = await ProductModel.create(product);

  return Boolean(createdProduct?._id);
};
