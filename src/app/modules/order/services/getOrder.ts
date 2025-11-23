// services/order.service.ts

import { OrderModel } from "../order.model";
import { FilterQuery } from "mongoose";
import { IOrder } from "../order.type";
import { throwNotFound } from "@utils/index";

const populateableFields = ["user"] as const;

export const getOrder = async (
  filters: FilterQuery<IOrder>,
  options?: {
    populate?: (typeof populateableFields)[number][];
    limitFields?: (keyof IOrder)[];
  }
) => {
  let query = OrderModel.findOne(filters);

  // --- Apply typed population ---
  if (options?.populate && options.populate.length > 0) {
    options.populate.forEach((key) => {
      if (populateableFields.includes(key)) {
        query = query.populate(key);
      }
    });
  }

  // --- Apply typed field limiting ---
  if (options?.limitFields && options.limitFields.length > 0) {
    query = query.select(options.limitFields.join(" "));
  }

  const order = await query.exec();

  if (!order) return throwNotFound("Order not found");

  return order;
};
