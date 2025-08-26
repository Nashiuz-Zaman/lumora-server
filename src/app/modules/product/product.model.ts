import { Schema, model, Types, CallbackError } from "mongoose";
import { IProduct, IVariant } from "./product.type";
import { generateSlug } from "@utils/index";

import { ProductStatus } from "./product.constants";
import { getNextSequence } from "../counter/counter.util";
import { config } from "@config/env";

// Utility to convert numeric fields to 2 decimal places
const convertTo2DecNum = (v: string | number) => {
  const num = parseFloat(v.toString().replace(/[^\d.]/g, ""));
  if (isNaN(num)) return 0;
  return Number(num.toFixed(2));
};

// Variant schema
const variantSchema = new Schema<IVariant>(
  {
    sku: { type: String, required: false, trim: true },
    price: { type: Number, required: false, set: convertTo2DecNum },
    oldPrice: { type: Number, set: convertTo2DecNum },
    discountPercentage: Number,
    stock: { type: Number, required: false },
  },
  { _id: true, strict: false }
);

// Product schema
const productSchema = new Schema<IProduct>(
  {
    slug: { type: String, unique: true },
    title: { type: String, required: false, trim: true },
    subtitle: { type: String, trim: true, default: "" },
    brand: { type: String, trim: true, required: false },
    variants: { type: [variantSchema], required: false },
    images: { type: [String], default: [] },

    videos: {
      type: [
        {
          url: { type: String, required: false, trim: true },
        },
      ],
      default: [],
    },
    aboutProduct: { type: String, trim: true, default: "" },
    warrantyAndSupport: { type: String, trim: true, default: "" },
    specifications: {
      type: [
        {
          key: { type: String, trim: true, required: false },
          value: { type: String, trim: true, required: false },
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
// temp disabled -- remove this later
function disableRequired(schema: Schema) {
  Object.keys(schema.paths).forEach((path) => {
    if (schema.paths[path].isRequired) {
      schema.paths[path].options.required = false;
    }
  });
}

disableRequired(productSchema);
disableRequired(variantSchema);

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
      this.canonicalUrl = `${config.prodClientURL}/products/${this.slug}`;
    }

    if (!this.seoTitle) {
      this.seoTitle = this.title;
    }

    // Set default price from first variant
    // if (Array.isArray(this.variants) && this.variants.length > 0) {
    //   this.defaultPrice = this.variants[0].price;

    //   // Calculate total stock as sum of all variant stocks
    //   this.totalStock = this.variants
    //     .map((v) => v.stock)
    //     .reduce((acc, cur) => acc + cur, 0);
    // } else {
    //   this.totalStock = 0;
    // }

    // ---------------------- Dummy Data Generator (for dev/testing) ----------------------
    // Uncomment the block below to auto-generate dummy SKUs, prices, stock, and discount

    /**
     * Helper: robust empty check for both strings & numbers
     */

    if (Array.isArray(this.variants) && this.variants.length > 0) {
      for (const variant of this.variants) {
        // ------------------- SKU Generation -------------------
        const words = this.title ? this.title.split(" ") : [];
        const prefix = (words[0]?.[0] ?? "") + (words[1]?.[0] ?? "");
        const prefixLower = prefix.toLowerCase();

        const numberUnitMatch = this.title?.match(
          /(\d+(?:\.\d+)?)\s?(GB|TB|inch|")/i
        );
        const numberUnit = numberUnitMatch
          ? numberUnitMatch[0].replace(/\s/, "")
          : "";

        const seq = await getNextSequence("sku");
        const paddedSeq = seq.toString().padStart(4, "0");

        variant.sku = `${prefixLower}${numberUnit}${paddedSeq}`;

        // ------------------- Price Generation -------------------
        const price = Math.round(300 + Math.random() * (6000 - 300));
        const oldPrice = price + Math.round(Math.random() * 300 + 50);

        variant.price = price;
        variant.oldPrice = oldPrice;

        // ------------------- Stock Generation -------------------

        variant.stock = Math.floor(10 + Math.random() * (300 - 10));

        // ------------------- Discount -------------------

        variant.discountPercentage = Math.round(
          ((oldPrice - price) / oldPrice) * 100
        );
      }
    }

    // Update default price from first variant after generation
    this.defaultPrice = this.variants[0].price;

    // Recalculate total stock
    this.totalStock = this.variants
      .map((v) => v.stock)
      .reduce((acc, cur) => acc + cur, 0);

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
