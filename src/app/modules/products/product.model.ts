import { Schema, model, Types, CallbackError } from "mongoose";
import { IProduct, IVariant } from "./product.type";
import { generateSlug } from "@utils/index";
import { clientUrl } from "../../app";
import { ProductStatus } from "./product.constants";
import { getNextSequence } from "../counter/counter.util";

// Utility to convert numeric fields to 2 decimal places
const convertTo2DecNum = (v: string | number) => {
  const num = parseFloat(v.toString().replace(/[^\d.]/g, ""));
  if (isNaN(num)) return 0;
  return Number(num.toFixed(2));
};

// Variant schema
const variantSchema = new Schema<IVariant>(
  {
    sku: { type: String, required: true, trim: true },
    price: { type: Number, required: true, set: convertTo2DecNum },
    oldPrice: { type: Number, set: convertTo2DecNum },
    discountPercentage: Number,
    stock: { type: Number, required: true },
  },
  { _id: true, strict: false }
);

// Product schema
const productSchema = new Schema<IProduct>(
  {
    slug: { type: String, unique: true },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, trim: true, default: "" },
    brand: { type: String, trim: true, required: true },
    variants: { type: [variantSchema], required: true },
    images: { type: [String], default: [] },

    videos: {
      type: [
        {
          url: { type: String, required: true, trim: true },
        },
      ],
      default: [],
    },
    aboutProduct: { type: String, trim: true, default: "" },
    warrantyAndSupport: { type: String, trim: true, default: "" },
    specifications: {
      type: [
        {
          key: { type: String, trim: true, required: true },
          value: { type: String, trim: true, required: true },
        },
      ],
      default: [],
    },
    status: { type: Number, default: ProductStatus.Active },
    seoTitle: { type: String, trim: true, default: "" },
    seoDescription: { type: String, trim: true, default: "" },
    metaKeywords: { type: String, trim: true, default: "" },
    tags: { type: String, trim: true, default: "" },
    canonicalUrl: { type: String, trim: true, default: "" },
    topCategory: { type: Schema.Types.ObjectId, ref: "Category" },
    subCategory: { type: Schema.Types.ObjectId, ref: "Category" },
    defaultPrice: { type: Number, default: 0 },
    defaultImage: { type: String, default: "" },
    totalStock: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to set slug, canonicalUrl, defaultPrice, and defaultImage, totalStock
productSchema.pre("save", async function (next) {
  try {
    // Generate slug if not present
    if (!this.slug && this.title) {
      const seq = await getNextSequence("product");
      const paddedSeq = seq.toString().padStart(7, "0");
      this.slug = generateSlug(this.title) + `_${paddedSeq}`;
    }

    // Set canonical URL if empty
    if (!this.canonicalUrl || this.canonicalUrl.trim() === "") {
      this.canonicalUrl = `${clientUrl}/products/${this.slug}`;
    }

    // Set default price from first variant
    if (Array.isArray(this.variants) && this.variants.length > 0) {
      this.defaultPrice = this.variants[0].price;

      // Calculate total stock as sum of all variant stocks
      this.totalStock = this.variants
        .map((v) => v.stock)
        .reduce((acc, cur) => acc + cur, 0);
    } else {
      this.totalStock = 0;
    }

    // Set default image from first image
    if (Array.isArray(this.images) && this.images.length > 0) {
      this.defaultImage = this.images[0];
    } else {
      this.defaultImage = "";
    }

    next();
  } catch (err) {
    next(err as CallbackError);
  }
});

export const ProductModel = model<IProduct>("Product", productSchema);
