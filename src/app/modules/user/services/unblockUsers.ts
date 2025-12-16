import { UserModel } from "../user.model";
import { UserStatus } from "../user.constants";
import {
  hasElements,
  throwBadRequest,
  throwInternalServerError,
  toObjectId,
} from "@utils/index";

export const unblockUsers = async (_ids: string[]) => {
  if (!hasElements(_ids)) {
    return throwBadRequest("No user IDs provided for unblocking");
  }

  const objectIds = _ids.map(toObjectId);

  const result = await UserModel.updateMany(
    { _id: { $in: objectIds }, status: { $ne: UserStatus.active } },
    { $set: { status: UserStatus.active } }
  );

  if (!result) {
    return throwInternalServerError("Failed to unblock users");
  }

  return `${result.modifiedCount} user(s) were unblocked`;
};
