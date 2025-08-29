import { Schema, model } from "mongoose";
import { IReview } from "./review.type";
import { ReviewStatus } from "./review.constants";

const reviewSchema = new Schema<IReview>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    helpfulBy: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    status: {
      type: Number,
      enum: Object.values(ReviewStatus),
      default: ReviewStatus.Pending,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate reviews by the same user for a product
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

export const ReviewModel = model<IReview>("Review", reviewSchema);
