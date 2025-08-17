import { HydratedDocument, Types } from "mongoose";
import { TProductStatusValue } from "./product.constants";

export interface IVariant {
  _id: Types.ObjectId;
  sku: string;
  price: number;
  discountPercentage?: number;
  oldPrice?: number;
  stock: number;
  width?: number;
  length?: number;
  height?: number;
  weight?: number;
  [key: string]: string | number | undefined | Types.ObjectId;
}

export interface IProduct {
  _id?: Types.ObjectId;
  slug?: string;
  title: string;
  store?: string;
  brand?: string;
  subtitle?: string;
  images?: string[];
  variants: IVariant[];
  createdAt?: Date;
  updatedAt?: Date;
  specifications?: Record<string, string>;
  status: TProductStatusValue;
  seoTitle?: string;
  seoDescription?: string;
  metaKeywords?: string[];
  canonicalUrl?: string;
  tags?: string[];
  totalStock?: number;
  aboutProduct?: string; // Added
  warrantySupport?: string; // Added
  productVideos?: string[]; // Added
  frequentlyBoughtTogetherProducts: Types.ObjectId[];
}

// images and the collection tables where the product is added besides the main product table
export type TRawProduct = Partial<IProduct> & {
  images?: (Express.Multer.File | string)[];
  collections?: { label: string; value: string }[];
};

export type TProductDoc = HydratedDocument<IProduct>;

export type TBatchUpdateBody = {
  selectedProducts: string[];
  selectedCollections: string[];
  operation: "clone" | "move";
};

export type TSoftDeleteRequestBody = {
  productIds: string[];
};
