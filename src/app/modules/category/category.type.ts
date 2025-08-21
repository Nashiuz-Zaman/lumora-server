import { HydratedDocument, Types } from "mongoose";

export interface ICategory {
  title: string;
  slug: string;
  parentCategory?: Types.ObjectId | null;
  products: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export type TCategoryDoc = HydratedDocument<ICategory>;
