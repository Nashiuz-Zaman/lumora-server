import { model, Schema } from "mongoose";
import { IProductCollection } from "../productCollection/productCollection.type";

const BackupProductCollectionSchema = new Schema<IProductCollection>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    page: { type: String },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        serial: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

// Pre-save middleware to handle default page and slug
BackupProductCollectionSchema.pre("save", function (next) {
  if (!this.page) this.page = "homepage";

  if (!this.slug.endsWith(`-${this.page}`)) {
    this.slug = `${this.slug}-${this.page}`;
  }

  next();
});

export const BackupProductCollectionModel = model<IProductCollection>(
  "BackupProductCollection",
  BackupProductCollectionSchema
);
