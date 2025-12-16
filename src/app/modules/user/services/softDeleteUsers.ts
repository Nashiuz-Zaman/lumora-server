import { UserModel } from "../user.model";
import { UserStatus } from "../user.constants";
import {
  hasElements,
  throwBadRequest,
  throwInternalServerError,
  toObjectId,
} from "@utils/index";

export const softDeleteUsers = async (_ids: string[]) => {
  if (!hasElements(_ids)) {
    return throwBadRequest("No user IDs provided for deletion");
  }

  const objectIds = _ids.map(toObjectId);

  const result = await UserModel.updateMany(
    { _id: { $in: objectIds }, status: { $ne: UserStatus.deleted } },
    { $set: { status: UserStatus.deleted } }
  );

  if (!result) return throwInternalServerError("Failed to delete users");

  return `${result.modifiedCount} user(s) were deleted`;
};
