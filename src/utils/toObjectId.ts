import { AppError } from "@app/classes/AppError";
import { Types } from "mongoose";

export const toObjectId = (id: string): Types.ObjectId => {
  if (!Types.ObjectId.isValid(id)) {
    throw new AppError(`Invalid ObjectId string: "${id}"`, 400);
  }
  return new Types.ObjectId(id);
};
