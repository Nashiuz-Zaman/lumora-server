import { v4 as uuidv4 } from "uuid";
import SSLCommerzPayment from "sslcommerz-lts";
import { config } from "../../../../config/env";
import { TOrderDoc } from "@app/modules/order/order.type";

const store_id = config.sslStoreId;
const store_passwd = config.sslStorePass;
const is_live = config.environment === "production"; // Set true for production

export const payViaSslCommerz = async (
  payload: {
    order: TOrderDoc;
    deliveryAddress: string;
    city?: string;
    zipCode?: string;
    name: string;
    email: string;
    phone?: string;
  },
  serverUrl: string
) => {
  const { order, deliveryAddress, city, zipCode, name, email, phone } = payload;

  // if order found Add latest phone number customer provided
  order.phone = phone;
  await order.save();

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
    ipn_url: `${serverUrl}/payments/ipn`,
    shipping_method: "Courier",
    product_name: productName,
    product_category: "Ecommerce",
    product_profile: "general",
    cus_name: name,
    cus_email: email,
    cus_add1: "",
    cus_add2: "",
    cus_city: city,
    cus_state: "",
    cus_postcode: zipCode,
    cus_country: "Bangladesh",
    cus_phone: phone,
    cus_fax: phone,
    ship_name: name,
    ship_add1: deliveryAddress,
    ship_add2: "",
    ship_city: city,
    ship_state: "",
    ship_postcode: zipCode,
    ship_country: "Bangladesh",
    value_a: name,
    value_b: email,
  };

  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  const apiResponse = await sslcz.init(data);

  return apiResponse.GatewayPageURL as string;
};
