import { RequestHandler } from "express";
import { createAdmin } from "../services/createAdmin";

import { catchAsync } from "@utils/catchAsync";
import { sendSuccess } from "@utils/sendSuccess";
import { throwInternalServerError } from "@utils/operationalErrors";

export const addAdminController: RequestHandler = catchAsync(
  async (req, res) => {
    const adminData = req.body;

    const result = await createAdmin(adminData);
    if (result)
      sendSuccess(res, {
        message: "Admin added",
      });

    return throwInternalServerError("Error creating new admin");
  }
);
