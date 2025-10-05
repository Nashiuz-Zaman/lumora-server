// getOrderShippedEmailHtml.ts
import {
  getEmailWrapperStart,
  emailWrapperEnd,
  getEmailHeader,
  getEmailFooter,
} from "./commonEmailParts";

export const getOrderShippedEmailHtml = (
  orderId: string,
  customerName: string,
  shippingTrackingNumber: string,
  shippingCarrier: string,
  estimatedDelivery: Date,
  year: number
): string => {
  const formattedDelivery = estimatedDelivery.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return `
  ${getEmailWrapperStart("Your Order Has Shipped")}
  ${getEmailHeader("Exciting news — your order is on the way!")}
  
  <!-- Body -->
  <tr>
    <td style="padding:30px; color:#374151; font-size:16px; line-height:1.5;">
      <p style="margin:0 0 10px 0;">Hi ${customerName},</p>
      <p style="margin:0 0 20px 0;">
        Your order <strong>#${orderId}</strong> has been shipped!
      </p>

      <table
        role="presentation"
        cellspacing="0"
        cellpadding="0"
        border="0"
        width="100%"
        style="margin:20px 0; background:#f9fafb; border-radius:6px;"
      >
        <tr>
          <td style="padding:16px;">
            <p style="margin:0 0 8px 0; font-weight:600;">Shipping Details:</p>
            <p style="margin:0;">Carrier: <strong>${shippingCarrier}</strong></p>
            <p style="margin:0;">Tracking Number: <strong>${shippingTrackingNumber}</strong></p>
            <p style="margin:0;">Estimated Delivery: <strong>${formattedDelivery}</strong></p>
          </td>
        </tr>
      </table>

      <!-- Tracking button -->
      <table
        role="presentation"
        cellspacing="0"
        cellpadding="0"
        border="0"
        align="center"
        style="margin:35px auto 35px auto;"
      >
        <tr>
          <td align="center" bgcolor="#10b981" style="border-radius:9999px;">
            <a
              href="https://tracking.example.com/${shippingTrackingNumber}"
              target="_blank"
              style="display:inline-block; padding:14px 32px; font-size:16px; font-weight:600; color:#ffffff; text-decoration:none; background-color:#10b981; border-radius:9999px;"
            >
              Track My Order
            </a>
          </td>
        </tr>
      </table>

      <p style="margin:30px 0 0 0; font-size:14px; color:#6b7280; text-align:center;">
        Thanks for shopping with Lumora. We hope you enjoy your purchase!
      </p>
    </td>
  </tr>

  ${getEmailFooter(year)}
${emailWrapperEnd}
  `;
};
