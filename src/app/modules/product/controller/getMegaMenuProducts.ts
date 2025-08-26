import { RequestHandler } from "express";

import {
  catchAsync,
  sendSuccess,
  throwInternalServerError,
} from "@utils/index";
import { getMegaMenuData } from "../service";

export const getMegaMenuDataController: RequestHandler = catchAsync(
  async (_req, res) => {
    const megaMenu = await getMegaMenuData();

    if (megaMenu) return sendSuccess(res, { data: megaMenu });

    return throwInternalServerError();
  }
);
