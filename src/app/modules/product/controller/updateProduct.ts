// Core / Third-party
import { RequestHandler } from "express";

// Utilities
import { sendSuccess } from "@utils/sendSuccess";
import { catchAsync } from "@utils/catchAsync";
import { throwInternalServerError } from "@utils/operationalErrors";
import { toObjectId } from "@utils/objectIdUtils";

// Services
import { updateProduct } from "../service/updateProduct";

/**
 * Controller to update an existing product
 */
export const updateProductController: RequestHandler = catchAsync(
  async (req, res) => {
    const _id = req.params.id;

    const product = req.body;

    const success = await updateProduct({ _id: toObjectId(_id) }, product);

    if (!success) return throwInternalServerError();

    return sendSuccess(res, { message: "Product Updated" });
  }
);
