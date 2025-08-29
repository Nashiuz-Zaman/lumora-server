import { HydratedDocument } from "mongoose";
import { Types } from "mongoose";
import { TReviewStatusValue } from "./review.constants";

export interface IReview {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  name: string;
  product: Types.ObjectId;
  title: string;
  rating: number; // 1 to 5
  comment?: string;
  status: TReviewStatusValue;
  helpfulBy?: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IWriteReviewInput {
  name: string;
  title: string;
  product: string;
  rating: number;
  comment?: string;
}

export type TReviewDoc = HydratedDocument<IReview>;
