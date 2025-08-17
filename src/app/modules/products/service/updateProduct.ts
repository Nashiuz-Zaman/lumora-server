import { ProductModel } from "../product.model";
import { IProduct, TRawProduct } from "../product.type";
import { sanitizeProductData } from "../products.helper";

export const updateProduct = async (
  filter: Record<string, any>,
  product: TRawProduct
): Promise<IProduct | null> => {
  const existingProduct = await ProductModel.findOne(filter);
  if (!existingProduct) return null;

  const [cleanProduct] = await sanitizeProductData(product);

  existingProduct.set(cleanProduct);

  const updatedProduct = await existingProduct.save();

  return updatedProduct;
};
