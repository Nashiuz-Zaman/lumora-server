import { RequestHandler } from "express";
import { createAdmin } from "../services/createAdmin"; // Update path if needed
import {
  catchAsync,
  sendSuccess,
  throwInternalServerError,
} from "@utils/index";

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
