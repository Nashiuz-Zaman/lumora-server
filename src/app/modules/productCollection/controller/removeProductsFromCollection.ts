import { RequestHandler } from "express";

import {
  catchAsync,
  sendSuccess,
  throwInternalServerError,
} from "@utils/index";
import { removeProductsFromCollection } from "../service";
import { removeProductsFromBackupCollection } from "@app/modules/backupProductCollection/service";
import { ISecureRequest } from "@app/shared/types";
import { UserRoles } from "@app/modules/user/user.constants";

export const removeProductsFromCollectionController: RequestHandler =
  catchAsync(async (req: ISecureRequest, res) => {
    const { slug } = req.params;
    const { productIds } = req.body;
    const role = req.decoded?.role;

    if (role !== UserRoles.superAdmin) {
      const result = await removeProductsFromCollection(slug, productIds);
      if (result.success) return sendSuccess(res, { message: result.message });
    }

    const bothActions = [
      removeProductsFromCollection(slug, productIds),
      removeProductsFromBackupCollection(slug, productIds),
    ];

    const [removeResult, backupRemoveResult] = await Promise.all(bothActions);

    if (removeResult.success && backupRemoveResult.success) {
      return sendSuccess(res, { message: removeResult.message });
    }

    return throwInternalServerError();
  });
