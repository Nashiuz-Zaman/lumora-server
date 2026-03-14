import { Response, Request, NextFunction } from "express";
import { config } from "../../config/env";
import { ISecureRequest } from "@app/shared/types";
import { accessTokenName, refreshTokenName, setAuthCookies } from "@app/modules/auth/services/manageAuthCookies";

import { verifyToken } from "@utils/verifyToken";
import { catchAsync } from "@utils/catchAsync";
import { getUserWithProfile } from "@app/modules/user/services/getUserWithProfile";
import { UserStatus } from "@app/modules/user/user.constants";

export const optionalAuthMiddleware = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies?.[accessTokenName];
    const refreshToken = req.cookies?.[refreshTokenName];

    const tryAuth = async (
      token: string,
      secret: string,
      refreshFlow = false,
    ) => {
      const result = await verifyToken(token, secret);
      if (!result?.valid) return false;

      const decoded = result.decoded;
      const { email, userId } = decoded || {};

      if (!email || !userId) return false;

      const user = await getUserWithProfile({ email });

      if (!user || user.status !== UserStatus.active) return false;

      const role = user.role.name;

      decoded.role = role;

      if (refreshFlow) {
        setAuthCookies(res, { email, role, userId });
      }

      (req as ISecureRequest).decoded = decoded;

      return true;
    };

    // Try access token
    if (accessToken) {
      const success = await tryAuth(accessToken, config.accessTokenSecret!);
      if (success) return next();
    }

    // Try refresh token
    if (refreshToken) {
      const success = await tryAuth(
        refreshToken,
        config.refreshTokenSecret!,
        true,
      );
      if (success) return next();
    }

    // No valid auth, continue as guest
    next();
  },
);
