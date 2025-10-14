import { throwNotFound, throwBadRequest, toObjectId } from "@utils/index";
import { ReturnRequestStatus } from "../returnRequest.constants";
import { ReturnRequestModel } from "../returnRequest.model";

export const rejectReturnRequest = async (id: string) => {
  if (!id) return throwBadRequest("No _id provided");

  const request = await ReturnRequestModel.findById(toObjectId(id));

  if (!request) return throwNotFound("Return request not found");

  if (request.status !== ReturnRequestStatus.Pending)
    return throwBadRequest("Only pending return requests can be rejected");

  request.status = ReturnRequestStatus.Rejected;
  await request.save();

  return request;
};
