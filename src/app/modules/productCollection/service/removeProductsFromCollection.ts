import { Types } from "mongoose";
import { ProductCollectionModel } from "../productCollection.model";
import { isObjectId, throwBadRequest } from "@utils/index";

export const removeProductsFromCollection = async (
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
      $pull: { products: { $in: validProductIds } },
    },
    { new: true }
  );

  return Boolean(updatedCollection?._id);
};
