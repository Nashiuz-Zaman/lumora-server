// core
import { RequestHandler } from "express";

// utils
import { catchAsync, sendSuccess } from "@utils/index";
import { clientUrl } from "@app/app";
import { resendAccountVerificationEmail } from "@app/modules/email/service";

export const requestNewVerificationEmail: RequestHandler = catchAsync(
  async (req, res) => {
    const email = req.body.email;

    if (!email) {
      res.redirect(clientUrl);
      return;
    }

    const result = await resendAccountVerificationEmail(req, email);

    if (!result) {
      res.redirect(clientUrl);
      return;
    }

    if (result) return sendSuccess(res, { message: "Confirmation email sent" });
  }
);
