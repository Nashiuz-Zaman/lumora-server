import { model, Schema } from "mongoose";
import { IProductCollection } from "./productCollection.type";

const ProductCollectionSchema = new Schema<IProductCollection>(
  {
    title: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    products: [{ type: Schema.Types.ObjectId, ref: "Product", default: [] }],
  },
  { timestamps: true }
);

export const ProductCollectionModel = model<IProductCollection>(
  "ProductCollection",
  ProductCollectionSchema
);
