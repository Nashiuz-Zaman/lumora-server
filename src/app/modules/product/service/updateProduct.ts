import { throwNotFound } from "@utils/operationalErrors";
import { ProductModel } from "../product.model";
import { IProduct } from "../product.type";

export const updateProduct = async (
  filter: Record<string, any>,
  product: Partial<IProduct>
): Promise<boolean> => {
  const existingProduct = await ProductModel.findOne(filter);
  if (!existingProduct) return throwNotFound("Product not found");

  existingProduct.set(product);

  const updatedProduct = await existingProduct.save();

  return Boolean(updatedProduct._id);
};
