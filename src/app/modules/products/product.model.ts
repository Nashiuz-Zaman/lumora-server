import { CallbackError, model, Schema } from "mongoose";
import { IProduct, IVariant } from "./product.type";
import { generateSlug } from "../../../utils/generateSlug";

import { clientUrl } from "../../app";
import { ProductStatus } from "./product.constants";
import { CounterModel } from "../counter/model/counter.model";

const convertTo2DecNum = (v: string) => {
  const num = parseFloat(v.toString().replace(/[^\d.]/g, ""));
  if (isNaN(num)) return 0;
  return Number(num.toFixed(2)); // ← rounds to 2 decimal places
};

// Variant schema
const variantSchema = new Schema<IVariant>(
  {
    sku: { type: String, required: true, trim: true },
    price: {
      type: Number,
      required: true,
      set: convertTo2DecNum,
    },
    discountPercentage: { type: Number, set: convertTo2DecNum },
    oldPrice: { type: Number, set: convertTo2DecNum },
    stock: { type: Number, required: true },
    width: { type: Number, set: convertTo2DecNum },
    length: { type: Number, set: convertTo2DecNum },
    height: { type: Number, set: convertTo2DecNum },
    weight: { type: Number, set: convertTo2DecNum },
  },
  {
    strict: false,
  }
);

// Product schema
export const productSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    subtitle: { type: String, trim: true, default: "" },
    images: { type: [String], default: [] },
    brand: { type: String, trim: true, default: "Generic" },
    store: { type: String, trim: true, default: "" },

    variants: {
      type: [variantSchema],
      required: true,
    },
    aboutProduct: { type: String, trim: true, default: "" },
    warrantySupport: { type: String, trim: true, default: "" },
    productVideos: {
      type: [String],
      default: [],
      set: (arr: string[]) =>
        arr.map((s) => (typeof s === "string" ? s.trim() : s)),
    },
    specifications: {
      type: [
        {
          key: String,
          value: String,
        },
      ],
      default: [],
    },

    status: {
      type: Number,
      enum: Object.values(ProductStatus),
      default: ProductStatus.Active,
    },
    seoTitle: { type: String, trim: true, default: "" },
    seoDescription: { type: String, trim: true, default: "" },
    metaKeywords: [{ type: String, trim: true, default: [] }],
    canonicalUrl: { type: String, trim: true, default: "" },
    tags: [{ type: String, trim: true }],
    totalStock: { type: Number },
    frequentlyBoughtTogetherProducts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product", // replace with the actual model name you reference
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
    },
    toObject: {
      virtuals: true,
      versionKey: false,
    },
  }
);

productSchema.virtual("defaultImage").get(function () {
  if (Array.isArray(this.images) && this.images.length > 0) {
    return this.images[0];
  }
  return null;
});

productSchema.virtual("defaultPrice").get(function () {
  if (Array.isArray(this.variants) && this.variants.length > 0) {
    return this.variants[0].price;
  }
  return null;
});

productSchema.pre("findOne", function (next) {
  const isPublic = this.getOptions()?.isPublic;

  if (isPublic) {
    this.merge({ isDeleted: false });
  }

  next();
});

// generate slug, canonical url and total stock before saving
productSchema.pre("save", async function (next) {
  try {
    if (!this.slug && this.title) {
      // Atomically increment the product counter
      const counter = await CounterModel.findByIdAndUpdate(
        "product",
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );

      // Zero pad the counter, e.g. 1 => "0000001"
      const paddedSeq = counter.seq.toString().padStart(7, "0");

      this.slug = generateSlug(this.title) + paddedSeq;
    }

    if (this.isNew && this.canonicalUrl?.trim() === "") {
      this.canonicalUrl = `${clientUrl}/products/${this.slug}`;
    }

    if (this?.variants.length) {
      this.totalStock = this.variants
        .map((v) => v.stock)
        .reduce((acc, cur) => acc + cur, 0);
    }

    next();
  } catch (error) {
    next(error as CallbackError);
  }
});

productSchema.post("aggregate", function (result) {
  result.forEach((doc) => {
    if (doc.images) {
      doc.defaultImage = doc.images[0];
      delete doc.images;
    }

    if (doc.variants && doc.variants[0]) {
      doc.defaultPrice = doc.variants[0].price;

      if (doc.variants[0].oldPrice) {
        doc.oldPrice = doc.variants[0].oldPrice;
      }
    }

    delete doc.variants;
  });
});

export const ProductModel = model<IProduct>("Product", productSchema);
