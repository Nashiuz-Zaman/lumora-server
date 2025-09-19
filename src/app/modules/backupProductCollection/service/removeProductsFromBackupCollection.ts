import mongoose from "mongoose";

import { isObjectId, throwBadRequest, toObjectId } from "@utils/index";
import { BackupProductCollectionModel } from "../backupProductCollection.model";

export const removeProductsFromBackupCollection = async (
  collectionSlug: string,
  productIds: string[]
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check if collection exists
    const collection = await BackupProductCollectionModel.findOne({
      slug: collectionSlug,
    }).session(session);
    if (!collection)
      return throwBadRequest("No collection found with the given slug");

    // Validate productIds
    const validProductIds = productIds
      .filter((id) => isObjectId(id))
      .map((id) => toObjectId(id));

    if (validProductIds.length === 0)
      return throwBadRequest("No valid product IDs provided");

    // Remove products that exist in the collection
    const existingIds = new Set(
      collection.products.map((p) => p.product.toString())
    );
    const idsToRemove = validProductIds.filter((id) =>
      existingIds.has(id.toString())
    );

    if (idsToRemove.length === 0)
      return throwBadRequest(
        "None of the provided products exist in the collection"
      );

    // Pull products
    collection.products = collection.products.filter(
      (p) => !idsToRemove.some((id) => id.equals(p.product))
    );

    await collection.save({ session });

    await session.commitTransaction();

    return {
      success: true,
      message: `${idsToRemove.length} product(s) removed from the collection.`,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
