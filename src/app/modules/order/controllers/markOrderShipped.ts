import { RequestHandler } from "express";
import { catchAsync } from "@utils/catchAsync";
import { sendSuccess } from "@utils/sendSuccess";
import { throwInternalServerError } from "@utils/operationalErrors";
import { updateShippingDetails } from "../services/updateShippingDetails";
import { sendOrderShippedEmail } from "@app/modules/email/service/sendOrderShippedEmail";

export const markOrderShippedController: RequestHandler = catchAsync(
  async (req, res) => {
    const { _id, ...rest } = req.body;
    const newOrder = await updateShippingDetails(_id, rest);

    if (newOrder?._id) {
      try {
        await sendOrderShippedEmail(newOrder);
      } catch (err) {
        console.error("Failed to send order shipped email:", err);
      }

      return sendSuccess(res, {
        message: "Shipping updated successfully",
      });
    }

    return throwInternalServerError();
  }
);
