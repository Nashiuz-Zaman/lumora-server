// core
import { RequestHandler } from "express";

// utils
import { catchAsync, sendSuccess } from "@utils/index";
import { clientUrl } from "index";
import { resendAccountVerificationEmail } from "@app/modules/email/service";

export const requestNewVerificationEmailController: RequestHandler = catchAsync(
  async (req, res) => {
    const email = req.body.email;

    if (!email) {
      res.redirect(clientUrl);
      return;
    }

    const result = await resendAccountVerificationEmail(req, email);

    if (!result) {
      return res.redirect(clientUrl);
    }

    if (result) return sendSuccess(res, { message: "Confirmation email sent" });
  }
);
