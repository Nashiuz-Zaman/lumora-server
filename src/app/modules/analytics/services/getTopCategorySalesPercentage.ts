import { OrderStatus } from "@app/modules/order/order.constants";
import { CategoryModel } from "@app/modules/category/category.model";
import { throwInternalServerError } from "@utils/operationalErrors";

export const getTopCategorySalesPercentage = async () => {
  const result = await CategoryModel.aggregate([
    {
      $match: {
        parentCategory: null,
      },
    },
    {
      $lookup: {
        from: "orders",
        let: { categoryId: "$_id" },
        pipeline: [
          {
            $match: {
              status: { $nin: [OrderStatus.Cancelled, OrderStatus.Pending] },
            },
          },
          { $unwind: "$items" },
          {
            $lookup: {
              from: "products",
              localField: "items.product._id",
              foreignField: "_id",
              as: "productInfo",
            },
          },
          { $unwind: "$productInfo" },
          {
            $match: {
              $expr: { $eq: ["$productInfo.topCategory", "$$categoryId"] },
            },
          },
          {
            $group: {
              _id: null,
              totalSold: { $sum: "$items.quantity" },
            },
          },
        ],
        as: "salesData",
      },
    },

    // Extract totalSold or default to 0 if no sales
    {
      $addFields: {
        totalSold: { $ifNull: [{ $first: "$salesData.totalSold" }, 0] },
      },
    },
    { $unset: "salesData" },

    // Compute grand total of all sales (for percentage)
    {
      $group: {
        _id: null,
        categories: {
          $push: {
            categoryName: "$title",
            totalSold: "$totalSold",
            createdAt: "$createdAt",
          },
        },
        grandTotal: { $sum: "$totalSold" },
      },
    },

    // Expand to compute percentages
    { $unwind: "$categories" },
    {
      $addFields: {
        "categories.percentage": {
          $cond: [
            { $eq: ["$grandTotal", 0] },
            0,
            {
              $round: [
                {
                  $multiply: [
                    { $divide: ["$categories.totalSold", "$grandTotal"] },
                    100,
                  ],
                },
                2,
              ],
            },
          ],
        },
      },
    },

    // Sort by creation date ascending
    {
      $sort: { "categories.createdAt": 1 },
    },
    {
      $replaceRoot: { newRoot: "$categories" },
    },
    {
      $project: {
        categoryName: 1,
        percentage: 1,
      },
    },
  ]);

  if (!result) return throwInternalServerError();

  return result;
};
