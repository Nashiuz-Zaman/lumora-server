// libraries
import { RequestHandler } from "express";

// types
import { ISecureRequest } from "@app/shared/types";

// services
import { updateCustomerAddress } from "../service";

// utils
import {
  catchAsync,
  sendSuccess,
  throwInternalServerError,
} from "@utils/index";

export const updateBillingAddressController: RequestHandler = catchAsync(
  async (req: ISecureRequest, res) => {
    const { userId } = req.decoded!;

    const updated = await updateCustomerAddress(
      userId!,
      "billingAddress",
      req.body
    );

    if (updated)
      return sendSuccess(res, {
        message: "Billing address updated successfully",
      });

    throwInternalServerError();
  }
);
