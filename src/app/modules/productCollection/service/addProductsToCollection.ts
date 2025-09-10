import { Types } from "mongoose";
import { ProductCollectionModel } from "../productCollection.model";
import { isObjectId, throwBadRequest } from "@utils/index";

export const addProductsToCollection = async (
  collectionId: string,
  productIds: string[]
) => {
  // validate collectionId
  if (!isObjectId(collectionId)) {
    return throwBadRequest("Invalid collection ID");
  }

  // validate productIds
  const validProductIds = productIds
    .filter((id) => isObjectId(id))
    .map((id) => new Types.ObjectId(id));

  if (validProductIds.length === 0) {
    return throwBadRequest("No valid product IDs provided");
  }

  const updatedCollection = await ProductCollectionModel.findByIdAndUpdate(
    collectionId,
    {
      $addToSet: { products: { $each: validProductIds } },
    },
    { new: true }
  );

  return Boolean(updatedCollection?._id);
};
