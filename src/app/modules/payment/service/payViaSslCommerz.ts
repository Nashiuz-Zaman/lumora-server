import { v4 as uuidv4 } from "uuid";
import SSLCommerzPayment from "sslcommerz-lts";
import { config } from "../../../../config/env";
import { IPayPayload } from "../payment.type";

const store_id = config.sslStoreId;
const store_passwd = config.sslStorePass;
const is_live = false; // always false for demo/sandbox

export const payViaSslCommerz = async (
  payload: IPayPayload,
  serverUrl: string
) => {
  const { order, shippingAddress, name, email, phone } = payload;

  const productName = `${order.items.length} Products from Lumora`;
  const transactionId = `${order._id}_${uuidv4()}`;
  const paymentResultEndpoint = `${serverUrl}/payments/result`;

  const data = {
    total_amount: order.total,
    currency: "BDT",
    tran_id: transactionId,
    success_url: `${paymentResultEndpoint}?status=success&orderId=${order.orderId}`,
    fail_url: `${paymentResultEndpoint}?status=fail&orderId=${order.orderId}`,
    cancel_url: `${paymentResultEndpoint}?status=cancel&orderId=${order.orderId}`,
    ipn_url: `${
      process.env.NODE_ENV !== "production"
        ? "https://a57444b245cc.ngrok-free.app/api/v1"
        : serverUrl
    }/payments/ipn`,
    shipping_method: "Courier",
    product_name: productName,
    product_category: "Ecommerce",
    product_profile: "general",
    cus_name: name,
    cus_email: email,
    cus_add1: "N/A",
    cus_add2: "",
    cus_city: shippingAddress?.city || "Dhaka",
    cus_state: "N/A",
    cus_postcode: shippingAddress?.zipCode || "0000",
    cus_country: shippingAddress?.country || "Bangladesh",
    cus_phone: phone || "0000000000",
    cus_fax: phone || "0000000000",
    ship_name: name,
    ship_add1: shippingAddress?.address || "N/A",
    ship_add2: "",
    ship_city: shippingAddress?.city || "Dhaka",
    ship_state: shippingAddress?.state || "Dhaka",
    ship_postcode: shippingAddress?.zipCode || "0000",
    ship_country: shippingAddress?.country || "Bangladesh",
    value_a: name,
    value_b: email,
  };

  try {
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const apiResponse = await sslcz.init(data);

    if (!apiResponse?.GatewayPageURL) {
      console.error("SSLCommerz API Response:", apiResponse);
      throw new Error("Failed to get payment URL from SSLCommerz");
    }

    return apiResponse.GatewayPageURL as string;
  } catch (err) {
    console.error("SSLCommerz Init Error:", err);
    throw new Error(
      `Error initiating payment via SSLCommerz: ${(err as Error).message}`
    );
  }
};
