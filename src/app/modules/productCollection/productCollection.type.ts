import { Types, HydratedDocument } from "mongoose";

export interface IProductCollection {
  _id?: Types.ObjectId;
  title: string;
  slug: string;
  products: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

export type TProductCollectionDoc = HydratedDocument<IProductCollection>;
