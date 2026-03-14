import { RequestHandler } from "express";
import { catchAsync } from "@utils/catchAsync";
import { sendSuccess } from "@utils/sendSuccess";
import { throwInternalServerError } from "@utils/operationalErrors";
import { getAllProductCollections } from "../service/getAllProductCollections";

export const getAllProductCollectionsController: RequestHandler = catchAsync(
  async (_req, res) => {
    const collections = await getAllProductCollections();

    if (collections)
      return sendSuccess(res, {
        message: "Collections fetched successfully",
        data: { collections },
      });

    return throwInternalServerError();
  }
);
