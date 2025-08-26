import { HydratedDocument, Types } from "mongoose";

export interface ICategory {
  _id?: Types.ObjectId;
  title: string;
  slug: string;
  parentCategory?: Types.ObjectId | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICategoryTreeItem {
  topCategory: Partial<ICategory>;
  subCategories: Partial<ICategory>[];
}

export type TCategoryDoc = HydratedDocument<ICategory>;
