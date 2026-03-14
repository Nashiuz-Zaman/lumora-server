import { RequestHandler } from "express";

import { catchAsync } from "@utils/catchAsync";
import { sendSuccess } from "@utils/sendSuccess";
import { throwInternalServerError } from "@utils/operationalErrors";
import { getMegaMenuData } from "../service/getMegaMenuData";

export const getMegaMenuDataController: RequestHandler = catchAsync(
  async (_req, res) => {
    const megaMenu = await getMegaMenuData();

    if (megaMenu) return sendSuccess(res, { data: megaMenu });

    return throwInternalServerError();
  }
);
