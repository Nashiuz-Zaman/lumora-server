import { Types } from "mongoose";
import { throwBadRequest } from "./operationalErrors";

export const toObjectId = (id: string): Types.ObjectId => {
  if (!Types.ObjectId.isValid(id)) {
    throwBadRequest(`Invalid ObjectId string: "${id}"`);
  }
  return new Types.ObjectId(id);
};

export const isObjectId = (id: string): boolean => {
  if (Types.ObjectId.isValid(id)) {
    if (String(new Types.ObjectId(id)) === id) return true;
    return false;
  }
  return false;
};
