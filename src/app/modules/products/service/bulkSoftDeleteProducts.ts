// services/bulkDeleteProducts.ts

import { throwBadRequest } from "@utils/operationalErrors";
import { ProductStatus } from "../product.constants";
import { ProductModel } from "../product.model";

export const bulkSoftDeleteProducts = async (ids: string[]) => {
  if (!Array.isArray(ids) || ids.length === 0) {
    throwBadRequest("No product IDs provided for deletion.");
  }

  const result = await ProductModel.updateMany(
    { _id: { $in: ids } },
    { $set: { status: ProductStatus.Deleted } }
  );

  return {
    matchedCount: result.matchedCount,
    modifiedCount: result.modifiedCount,
  };
};
