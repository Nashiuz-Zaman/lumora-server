import { IOrder } from "@app/modules/order/order.type";
import { payViaSslCommerz } from "@app/modules/payment/service/payViaSslCommerz";

export const initiateOrderPayment = async (
  order: IOrder,
  serverUrl: string
) => {
  const paymentUrl = await payViaSslCommerz(
    {
      order,
      shippingAddress: order.shippingAddress,
      name: order.name,
      email: order.email,
      phone: order.phone,
    },
    serverUrl
  );

  return paymentUrl;
};
