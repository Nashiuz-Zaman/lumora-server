import { FilterQuery } from "mongoose";
import { IReturnRequest } from "../returnRequest.type";
import { throwNotFound } from "@utils/index";
import { ReturnRequestModel } from "../returnRequest.model";

const populateableFields = ["order", "payment"];

export const getReturnRequest = async (
  filters: FilterQuery<IReturnRequest>,
  options?: {
    populate?: string;
    limitFields?: string;
  }
) => {
  let query = ReturnRequestModel.findOne(filters);

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

  const returnRequest = await query.exec();

  if (!returnRequest) return throwNotFound("Return request not found");

  return returnRequest;
};
