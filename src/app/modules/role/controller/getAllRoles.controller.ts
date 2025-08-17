// core
import { RequestHandler } from "express";

// utils
import { catchAsync, sendSuccess } from "../../../../utils";

// service
import { getAllRolesFromDb } from "../service/getAll.service";

export const getAllRoles: RequestHandler = catchAsync(
  async (_, res) => {
    const collections = await getAllRolesFromDb();
    return sendSuccess(res, { data: { collections } });
  }
);
