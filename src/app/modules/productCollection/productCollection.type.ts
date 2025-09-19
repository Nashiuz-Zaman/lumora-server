import { IProduct } from "./../product/product.type";
import { Types, HydratedDocument } from "mongoose";

// product
export interface IProductInCollection<P = Types.ObjectId> {
  product: P;
  serial: number;
}
export type TPopulatedProductInCollection = IProductInCollection<IProduct>;

export type TPopulatedProductInCollectionWithReviewStats =
  TPopulatedProductInCollection & {
    reviewStats: {
      averageRating: number;
      totalReviews: number;
    };
  };

// collcetion
export interface IProductCollection<T = IProductInCollection> {
  _id?: Types.ObjectId;
  title: string;
  slug: string;
  page?: string;
  products: T[];
  createdAt?: Date;
  updatedAt?: Date;
}
export type TPopulatedProductCollection =
  IProductCollection<TPopulatedProductInCollection>;

// mongoose docs
export type TProductCollectionDoc = HydratedDocument<IProductCollection>;
export type TPopulatedProductCollectionDoc =
  HydratedDocument<TPopulatedProductCollection>;
