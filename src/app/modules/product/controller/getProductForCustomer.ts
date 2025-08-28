// Core / Third-party
import { RequestHandler } from "express";

// Utilities
import { catchAsync, sendSuccess, throwNotFound } from "@utils/index";

// Services
import { getProduct } from "../service";
import { getProductReviewsWithStats } from "@app/modules/review/service";

export const getProductForCustomerController: RequestHandler = catchAsync(
  async (req, res) => {
    const { slug } = req.params;
    const queryObj = { slug };

    // Fetch product
    const product = await getProduct(queryObj);
    if (!product) return throwNotFound("Product not found");

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
);
