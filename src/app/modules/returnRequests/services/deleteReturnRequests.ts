import {
  throwBadRequest,
  throwInternalServerError,
  toObjectId,
} from "@utils/index";
import { ReturnRequestModel } from "../returnRequest.model";

export const deleteReturnRequests = async (_ids: string[]) => {
  if (!Array.isArray(_ids) || _ids.length === 0)
    return throwBadRequest("No request IDs provided for deletion");

  const objectIds = _ids.map(toObjectId);

  const result = await ReturnRequestModel.deleteMany({
    _id: { $in: objectIds },
  });

  if (!result) return throwInternalServerError();

  return `${result.deletedCount} requests(s) were deleted`;
};
