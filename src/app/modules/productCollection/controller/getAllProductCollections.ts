import { RequestHandler } from "express";
import {
  catchAsync,
  sendSuccess,
  throwInternalServerError,
} from "@utils/index";
import { getAllProductCollections } from "../service";

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
