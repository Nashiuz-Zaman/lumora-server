// getOrderCancelledEmailHtml.ts
import {
  getEmailWrapperStart,
  emailWrapperEnd,
  getEmailHeader,
  getEmailFooter,
} from "./commonEmailParts";

interface IOrderCancelledEmailProps {
  orderId: string;
  customerName: string;
  reason?: string;
  year: number;
}

export const getOrderCancelledEmailHtml = ({
  orderId,
  customerName,
  reason,
  year,
}: IOrderCancelledEmailProps): string => {
  return `
${getEmailWrapperStart("Order Cancelled")}
  ${getEmailHeader("Order Cancelled")}

  <!-- Main Message -->
  <tr>
    <td style="padding:30px; text-align:center; font-size:16px; color:#333; line-height:1.5;">
      <p style="margin:0 0 15px 0; font-size:16px;">
        Hello <strong>${customerName}</strong>,
      </p>
      <p style="margin:0 0 15px 0;">
        We wanted to let you know that your order <strong>#${orderId}</strong> has been cancelled successfully.
      </p>
      ${
        reason
          ? `<p style="margin:0 0 15px 0; font-style:italic; color:#555;">Reason: ${reason}</p>`
          : ""
      }
      <p style="margin:20px 0 0 0; font-size:14px; color:#555;">
        If you have any questions or need assistance, please contact our support team.
      </p>
    </td>
  </tr>

  <!-- Highlight Box -->
  <tr>
    <td style="padding:20px;">
      <table width="100%" cellpadding="15" cellspacing="0" style="background-color:#fdecea; border:1px solid #f5c2c7; border-radius:8px;">
        <tr>
          <td style="text-align:center; font-size:16px; color:#b91c1c; font-weight:600;">
            Order Cancelled
          </td>
        </tr>
        <tr>
          <td style="text-align:center; font-size:14px; color:#333;">
            Order ID: <strong>${orderId}</strong><br/>
            Customer: <strong>${customerName}</strong>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Footer Message -->
  <tr>
    <td style="padding:30px; text-align:center; font-size:13px; color:#888;">
      Thank you for being with Lumora. We hope to serve you again in the future.
    </td>
  </tr>

  ${getEmailFooter(year)}
${emailWrapperEnd}
  `;
};
