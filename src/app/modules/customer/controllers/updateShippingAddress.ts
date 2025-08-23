// libraries
import { RequestHandler } from "express";

// types
import { ISecureRequest } from "@app/shared/types";

// services
import { updateCustomerAddress } from "../service/updateCustomerAddress";

// utils
import {
  catchAsync,
  sendSuccess,
  throwInternalServerError,
} from "@utils/index";

export const updateShippingAddressController: RequestHandler = catchAsync(
  async (req: ISecureRequest, res) => {
    const { userId } = req.decoded!;

    const updated = await updateCustomerAddress(
      userId!,
      "shippingAddress",
      req.body
    );

    if (updated)
      return sendSuccess(res, {
        message: "Shipping address updated successfully",
      });

    throwInternalServerError();
  }
);
