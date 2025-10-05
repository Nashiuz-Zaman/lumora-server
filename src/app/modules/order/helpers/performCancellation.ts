import { OrderStatus } from "../order.constants";
import { TOrderDoc } from "../order.type";

export const performCancellation = async (
  order: TOrderDoc,
  cancellationReason: string = "No specific reason"
) => {
  order.status = OrderStatus.Cancelled;
  order.cancellationReason = cancellationReason;

  await order.save();
};
