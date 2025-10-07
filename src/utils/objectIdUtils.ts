import { Types } from "mongoose";
import { throwBadRequest } from "./operationalErrors";

export const isObjectId = (id: string): boolean => Types.ObjectId.isValid(id);

export const toObjectId = (id: string): Types.ObjectId => {
  if (!isObjectId(id)) {
    return throwBadRequest(`Invalid ObjectId string: "${id}"`);
  }
  return new Types.ObjectId(id);
};
