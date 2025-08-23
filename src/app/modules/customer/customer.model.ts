import { Schema, model } from "mongoose";
import { ICustomer } from "./customer.type";

const addressSchema = new Schema(
  {
    companyName: { type: String, default: "" },
    address: { type: String, default: "" },
    country: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    zipCode: { type: String, default: "" },
  },
  { _id: false }
);

const customerSchema = new Schema<ICustomer>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    billingAddress: {
      type: addressSchema,
      default: () => ({}), // create an address with all fields as ""
    },
    shippingAddress: {
      type: addressSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true, versionKey: false },
  }
);

// Export model
export const CustomerModel = model<ICustomer>("Customer", customerSchema);
