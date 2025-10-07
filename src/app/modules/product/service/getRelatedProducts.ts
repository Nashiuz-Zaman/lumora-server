import { IProduct } from "../product.type";
import { getProducts } from "./getProducts";
import { isObjectId, toObjectId } from "@utils/objectIdUtils";
import { throwBadRequest } from "@utils/operationalErrors";
import { ProductStatus } from "../product.constants";

export const getRelatedProducts = async (
  productId: string,
  topCategoryId: string
): Promise<IProduct[]> => {
  if (!isObjectId(productId) || !isObjectId(topCategoryId))
    return throwBadRequest("Invalid productId or topCategoryId");

  const queryObj = {
    limit: 20,
    "topCategory._id": topCategoryId,
    _id: { ne: productId },
    status: ProductStatus.Active,
    limitFields:
      "defaultImage,defaultPrice,defaultOldPrice,title,brand,slug,averageRating,totalReviews",
  };

  const { products } = await getProducts(queryObj);

  return products;
};
