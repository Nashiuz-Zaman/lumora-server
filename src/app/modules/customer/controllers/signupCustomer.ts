// core
import { RequestHandler } from "express";

// utils
import { catchAsync } from "@utils/catchAsync";
import { sendSuccess } from "@utils/sendSuccess";
import { throwInternalServerError } from "@utils/operationalErrors";
import { createCustomer } from "../service/createCustomer";

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
