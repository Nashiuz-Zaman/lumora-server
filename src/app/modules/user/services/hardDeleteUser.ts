import { UserModel } from "../user.model";

import {
  throwBadRequest,
  throwInternalServerError,
  toObjectId,
} from "@utils/index";

export const hardDeleteUser = async (_id: string) => {
  if (!_id) {
    return throwBadRequest("No user ID provided for hard deletion");
  }

  const result = await UserModel.findOneAndDelete({ _id: toObjectId(_id) });

  if (!result) return throwInternalServerError("Failed to hard delete user");

  return true;
};
