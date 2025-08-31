// Classes
import { QueryBuilder } from "@app/classes";

// Utils
import { normalizeStatusFilter } from "@utils/index";

// Constants
import { CouponSearchableFields, CouponStatus } from "../coupon.constant";

// Models
import { CouponModel } from "../coupon.model";

// Types
import { ICoupon } from "../coupon.type";

export const getCoupons = async (queryObj: Record<string, any>) => {
  const newQueryObj = normalizeStatusFilter(queryObj, {
    ne: CouponStatus.Deleted,
  });

  const query = new QueryBuilder<ICoupon>(CouponModel, newQueryObj);

  const coupons = await query
    .filter()
    .search([...CouponSearchableFields])
    .sort()
    .paginate()
    .limitFields()
    .exec();

  const queryMeta = await query.getQueryMeta();

  return { coupons, queryMeta };
};
