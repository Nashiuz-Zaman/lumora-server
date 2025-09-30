import { TOrderDoc } from "@app/modules/order/order.type";
import { payViaSslCommerz } from "@app/modules/payment/service/payViaSslCommerz";

export const initiateOrderPayment = async (
  order: TOrderDoc & { city?: string; zipCode?: string },
  serverUrl: string
) => {
  const paymentUrl = await payViaSslCommerz(
    {
      order,
      deliveryAddress: order.deliveryAddress,
      name: order.name,
      email: order.email,
      city: order.city || "Dhaka",
      zipCode: order.zipCode || "1212",
      phone: order.phone || "",
    },
    serverUrl
  );

  return paymentUrl;
};
