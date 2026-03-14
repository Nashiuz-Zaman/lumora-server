// src/controllers/upload.controller.ts
import { RequestHandler } from "express";
import { getSignedUrl } from "../service/getSignedUrl";
import { catchAsync } from "@utils/catchAsync";
import { sendSuccess } from "@utils/sendSuccess";
import { throwInternalServerError } from "@utils/operationalErrors";

export const getSignedUrlController: RequestHandler = catchAsync((req, res) => {
  const folder =
    typeof req.query.folder === "string" ? req.query.folder : undefined;
  const signedUrl = getSignedUrl(folder);

  if (signedUrl) return sendSuccess(res, { data: signedUrl });

  return throwInternalServerError("Signed Url didn't generate, server error");
});
