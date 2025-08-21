import { Schema, model } from "mongoose";
import { ICategory } from "./category.type";

const CategorySchema = new Schema<ICategory>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    parentCategory: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    products: [{ type: Schema.Types.ObjectId, ref: "Product", default: [] }],
  },
  { timestamps: true }
);

export const CategoryModel = model<ICategory>("Category", CategorySchema);
