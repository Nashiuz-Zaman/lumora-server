import { Types } from "mongoose";
import { throwBadRequest } from "./operationalErrors";

export const isObjectId = (id: string): boolean => {
  if (Types.ObjectId.isValid(id)) {
    if (String(new Types.ObjectId(id)) === id) return true;
    return false;
  }
  return false;
};

export const toObjectId = (id: string): Types.ObjectId => {
  if (!isObjectId(id)) {
    return throwBadRequest(`Invalid ObjectId string: "${id}"`);
  }
  return new Types.ObjectId(id);
};
