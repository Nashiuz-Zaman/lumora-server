// services/product.service.ts

import { ProductModel } from "../product.model";
import { FilterQuery } from "mongoose";
import { IProduct } from "../product.type";
import { throwNotFound } from "@utils/index";

const populateableFields = ["topCategory", "subCategory"];

export const getProduct = async (
  filters: FilterQuery<IProduct>,
  options?: {
    populate?: string;
    limitFields?: string;
  }
) => {
  let query = ProductModel.findOne(filters);

  // Apply population if requested
  if (options?.populate) {
    const populateKeys = options.populate
      .split(",")
      .map((key) => key.trim())
      .filter((key) => populateableFields.includes(key));

    if (populateKeys.length > 0) {
      populateKeys.forEach((key) => {
        query = query.populate(key);
      });
    }
  }

  // Apply field limiting if requested
  if (options?.limitFields) {
    const fields = options.limitFields
      .split(",")
      .map((field) => field.trim())
      .join(" ");
    query = query.select(fields);
  }

  const product = await query.exec();

  if (!product) return throwNotFound("Product not found");

  return product;
};
