// core
import { RequestHandler } from "express";

// utils
import { catchAsync } from "../../../../utils/catchAsync";
import { sendSuccess } from "../../../../utils/sendSuccess";

// service
import { getAllRolesFromDb } from "../service/getAll.service";

export const getAllRoles: RequestHandler = catchAsync(
  async (_, res) => {
    const collections = await getAllRolesFromDb();
    return sendSuccess(res, { data: { collections } });
  }
);
