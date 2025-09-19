import mongoose from "mongoose";

import { isObjectId, throwBadRequest, toObjectId } from "@utils/index";
import { BackupProductCollectionModel } from "../backupProductCollection.model";

export const addProductsToBackupCollection = async (
  slug: string,
  productIds: string[]
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check if collection exists
    const collection = await BackupProductCollectionModel.findOne({
      slug,
    }).session(session);
    if (!collection)
      return throwBadRequest(`No collection found with slug: ${slug}`);

    // Validate productIds
    const validProductIds = productIds
      .filter((id) => isObjectId(id))
      .map((id) => toObjectId(id));

    if (validProductIds.length === 0)
      return throwBadRequest("No valid product IDs provided");

    // Remove duplicates that are already in the collection
    const existingIds = new Set(
      collection.products.map((p) => p.product.toString())
    );
    const uniqueNewIds = validProductIds.filter(
      (id) => !existingIds.has(id.toString())
    );

    if (uniqueNewIds.length === 0)
      return throwBadRequest(
        "All provided product IDs already exist in the collection"
      );

    // Get max serial using MongoDB aggregation
    const result = await BackupProductCollectionModel.aggregate([
      { $match: { slug } },
      { $unwind: { path: "$products", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: null,
          maxSerial: { $max: "$products.serial" },
        },
      },
    ]).session(session);

    const maxSerial = result.length ? result[0].maxSerial || 0 : 0;

    // Build new product objects with incremented serials
    const newProducts = uniqueNewIds.map((productId, index) => ({
      product: productId,
      serial: maxSerial + index + 1,
    }));

    // Push new products
    collection.products.push(...newProducts);
    await collection.save({ session });

    // Commit transaction
    await session.commitTransaction();

    return {
      success: true,
      message: `${newProducts.length} product(s) added to the collection.`,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
