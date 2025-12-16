import {
  hasElements,
  throwBadRequest,
  throwInternalServerError,
  toObjectId,
} from "@utils/index";
import { ReturnRequestModel } from "../returnRequest.model";

export const deleteReturnRequests = async (_ids: string[]) => {
  if (!hasElements(_ids))
    return throwBadRequest("No request IDs provided for deletion");

  const objectIds = _ids.map(toObjectId);

  const result = await ReturnRequestModel.deleteMany({
    _id: { $in: objectIds },
  });

  if (!result) return throwInternalServerError();

  return `${result.deletedCount} requests(s) were deleted`;
};
