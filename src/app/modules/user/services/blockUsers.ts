import { UserModel } from "../user.model";
import { UserStatus } from "../user.constants";
import {
  hasElements,
  throwBadRequest,
  throwInternalServerError,
  toObjectId,
} from "@utils/index";

export const blockUsers = async (_ids: string[]) => {
  if (!hasElements(_ids)) {
    return throwBadRequest("No user IDs provided for blocking");
  }

  const objectIds = _ids.map(toObjectId);

  const result = await UserModel.updateMany(
    { _id: { $in: objectIds }, status: { $ne: UserStatus.blocked } },
    { $set: { status: UserStatus.blocked } }
  );

  if (!result) return throwInternalServerError("Failed to block users");

  return `${result.modifiedCount} user(s) were blocked`;
};
