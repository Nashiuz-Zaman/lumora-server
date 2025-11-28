import { HydratedDocument, Types } from "mongoose";

export interface ICategory {
  _id?: Types.ObjectId;
  title: string;
  slug: string;
  parentCategory?: Types.ObjectId | null;
  categoryImages?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICategoryTreeItem {
  topCategory: ICategory;
  subCategories: ICategory[];
}

export type TCategoryDoc = HydratedDocument<ICategory>;
