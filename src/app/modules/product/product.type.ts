import { HydratedDocument, Types } from "mongoose";
import { TProductStatusValue } from "./product.constants";

export interface IVariant {
  _id: Types.ObjectId;
  id: string;
  sku: string;
  stock: number;
  price: number;
  oldPrice?: number;
  discountPercentage?: number;
  [key: string]: unknown;
}

export interface IProduct {
  _id?: Types.ObjectId;
  slug: string;
  title: string;
  subtitle: string;
  defaultPrice: number;
  defaultImage: string;
  totalStock: number;
  brand: string;
  variants: IVariant[];
  videos: { url: string }[];
  images?: string[];
  warrantyAndSupport: string;
  aboutProduct: string;
  status: TProductStatusValue;
  specifications: { key: string; value: string }[];
  seoTitle?: string;
  seoDescription?: string;
  metaKeywords?: string;
  tags?: string;
  canonicalUrl?: string;
  topCategory?: Types.ObjectId;
  subCategory?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

// Mongoose hydrated document type
export type TProductDoc = HydratedDocument<IProduct>;
