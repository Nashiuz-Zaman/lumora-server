import { Response, Request, NextFunction } from "express";
import { config } from "../../config/env";
import { IRole } from "../modules/role/type/role.type";
import {
  TPermittedUserRoles,
  UserStatus,
} from "@app/modules/user/user.constants";
import { ISecureRequest } from "@app/shared/types";
import {
  setAuthCookies,
  cleanAuthCookies,
  accessTokenName,
  refreshTokenName,
} from "@app/modules/auth/services";

import {
  verifyToken,
  catchAsync,
  throwNotFound,
  throwUnauthorized,
  throwForbidden,
} from "@utils/index";
import { getUserWithProfile } from "@app/modules/user/services/getUserWithProfile";

const validateUserAccess = async (
  res: Response,
  email: string,
  permittedRoles: TPermittedUserRoles
): Promise<{ role: IRole["name"] }> => {
  const user = await getUserWithProfile({ email });

  if (!user) {
    cleanAuthCookies(res);
    return throwNotFound("User not found");
  }

  const populatedRole = user.role.name;

  if (permittedRoles !== "ALL" && !permittedRoles.includes(populatedRole)) {
    return throwUnauthorized("User not authorized");
  }

  if (user.status !== UserStatus.active) {
    cleanAuthCookies(res);
    return throwForbidden("User Not Active");
  }

  return { role: populatedRole };
};

export const userAuthMiddleware = (
  permittedRoles: TPermittedUserRoles = "ALL"
) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies?.[accessTokenName];
    const refreshToken = req.cookies?.[refreshTokenName];

    // Check presence
    if (!accessToken && !refreshToken) {
      return throwUnauthorized();
    }

    // Try auth
    const tryAuth = async (
      token: string,
      secret: string,
      refreshFlow = false
    ) => {
      const result = await verifyToken(token, secret);
      if (!result?.valid) return null;

      const decoded = result?.decoded;

      const { email, userId } = decoded;

      if (!email || !userId) {
        return throwUnauthorized();
      }

      const { role } = await validateUserAccess(res, email!, permittedRoles);
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
        true
      );
      if (success) return next();
    }

    // ❌ Both tokens invalid or missing
    return throwUnauthorized("Invalid or expired token");
  });
};
