// Core / Third-party
import { RequestHandler } from "express";

// Utilities
import { catchAsync } from "@utils/catchAsync";
import { sendSuccess } from "@utils/sendSuccess";
import { throwNotFound } from "@utils/operationalErrors";

// Services
import { getProduct } from "../service/getProduct";
import { getProductReviewsWithStats } from "@app/modules/review/service/getProductReviewsWithStats";

export const getProductForCustomerController: RequestHandler = catchAsync(
  async (req, res) => {
    const { slug } = req.params;

    // Filters (for findOne)
    const filters = { slug };

    // Options (populate, limitFields, etc.)
    const options: {
      limitFields?: string;
      populate?: string;
    } = {};

    if (req.query.limitFields) {
      options.limitFields = String(req.query.limitFields);
    }

    if (req.query.populate) {
      options.populate = String(req.query.populate);
    }

    // Fetch product
    const product = await getProduct(filters, options);
    if (!product) return throwNotFound("Product not found");

    // Conditionally fetch review stats
    if (req.query.reviewStats === "true") {
      const reviewsData = await getProductReviewsWithStats({
        product: product._id,
      });

      return sendSuccess(res, {
        data: {
          product,
          reviews: reviewsData.reviews,
          reviewStats: reviewsData.stats,
          reviewMeta: reviewsData.queryMeta,
        },
      });
    }

    return sendSuccess(res, { data: { product } });
  }
);
