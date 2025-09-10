import { model, Schema } from "mongoose";
import { IProductCollection } from "./productCollection.type";

const ProductCollectionSchema = new Schema<IProductCollection>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    page: { type: String },
    products: [{ type: Schema.Types.ObjectId, ref: "Product", default: [] }],
  },
  { timestamps: true }
);

ProductCollectionSchema.pre("save", function (next) {
  // If no page is set, default it
  if (!this.page) {
    this.page = "homepage";
  }

  // Ensure slug has page suffix only once
  if (!this.slug.endsWith(`-${this.page}`)) {
    this.slug = `${this.slug}-${this.page}`;
  }

  next();
});

export const ProductCollectionModel = model<IProductCollection>(
  "ProductCollection",
  ProductCollectionSchema
);
