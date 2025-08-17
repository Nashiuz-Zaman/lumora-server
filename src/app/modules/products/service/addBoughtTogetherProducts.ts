import mongoose from "mongoose";
import { ProductModel } from "../product.model";
import { throwBadRequest } from "@utils/operationalErrors";

/**
 * Service to add/update "Frequently Bought Together" products
 */
export const addBoughtTogether = async (
  productId: string,
  relatedIds: string[]
) => {
  // Validate incoming IDs
  if (!Array.isArray(relatedIds) || relatedIds.length === 0) return;
  throwBadRequest("ids must be a non-empty array of product _ids");

  const uniqueIds = [
    ...new Set(relatedIds.map((id) => new mongoose.Types.ObjectId(id))),
  ];

  await ProductModel.findByIdAndUpdate(productId, {
    $addToSet: { frequentlyBoughtTogetherProducts: { $each: uniqueIds } },
  });
};
