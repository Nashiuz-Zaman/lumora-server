// core
import { RequestHandler } from "express";

// utils
import {
  catchAsync,
  sendSuccess,
  throwInternalServerError,
} from "@utils/index";
import { createCustomer } from "../service";

export const signupCustomerController: RequestHandler = catchAsync(
  async (req, res) => {
    const user = req.body;

    const result = await createCustomer(req, user);

    if (result)
      return sendSuccess(res, {
        message: "Signup successful",
        data: { email: result.email },
      });

    throwInternalServerError();
  }
);
