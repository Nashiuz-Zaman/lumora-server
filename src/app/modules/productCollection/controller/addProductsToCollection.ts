import { RequestHandler } from "express";

import { catchAsync } from "@utils/catchAsync";
import { sendSuccess } from "@utils/sendSuccess";
import { throwInternalServerError } from "@utils/operationalErrors";
import { addProductsToCollection } from "../service/addProductsToCollection";
import { ISecureRequest } from "@app/shared/types";
import { UserRoles } from "@app/modules/user/user.constants";
import { addProductsToBackupCollection } from "@app/modules/backupProductCollection/service/addProductsToBackupCollection";

export const addProductsToCollectionController: RequestHandler = catchAsync(
  async (req: ISecureRequest, res) => {
    const { slug } = req.params;
    const { productIds } = req.body;
    const role = req.decoded?.role;

    if (role !== UserRoles.superAdmin) {
      const result = await addProductsToCollection(slug, productIds);
      if (result.success) return sendSuccess(res, { message: result.message });
    }

    const bothActions = [
      addProductsToCollection(slug, productIds),
      addProductsToBackupCollection(slug, productIds),
    ];

    const [addResult, backupAddResult] = await Promise.all(bothActions);

    if (addResult.success && backupAddResult.success) {
      return sendSuccess(res, { message: addResult.message });
    }

    return throwInternalServerError();
  }
);
