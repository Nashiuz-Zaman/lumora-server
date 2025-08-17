import { Schema, model } from "mongoose";

import { ICounter } from "../type/counter.type";

const counterSchema = new Schema<ICounter>(
  {
    _id: {
      type: String,
      required: true,
      default: "order",
    },
    seq: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    toJSON: { versionKey: false },
    toObject: { versionKey: false },
  }
);

export const CounterModel = model<ICounter>("Counter", counterSchema);
