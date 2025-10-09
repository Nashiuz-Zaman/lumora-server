// core
import { RequestHandler } from "express";

// utils
import { catchAsync } from "@utils/index";
import {
  verifyUserAccountEmail,
  TVerifyUserAccountResult,
} from "@app/modules/user/services/verifyUserAccountEmail";
import { setAuthCookies } from "@app/modules/auth/services";
import { clientUrl } from "index";

export const verifyUserAccountController: RequestHandler = catchAsync(
  async (req, res) => {
    const { token, email } = req.query;

    const result: TVerifyUserAccountResult = await verifyUserAccountEmail(
      req,
      email as string,
      token as string
    );

    switch (result?.status) {
      case "redirect":
        return res.redirect(result?.url);

      case "success":
        // Set auth cookies
        setAuthCookies(res, result?.authData);

        // Redirect to dashboard (or customer page)
        return res.redirect(`${clientUrl}/customer`);

      case "verification-email-sent":
        const encodedEmail = encodeURIComponent(result?.email);
        const encodedToken = encodeURIComponent(false);
        return res.redirect(
          `${clientUrl}/auth/confirmation-email-sent?email=${encodedEmail}&oldToken=${encodedToken}`
        );

      default:
        // Fallback for type safety
        return res.redirect(clientUrl);
    }
  }
);
