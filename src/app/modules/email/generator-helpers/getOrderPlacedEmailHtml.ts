import { IOrder } from "@app/modules/order/order.type";
import { formatPrice } from "@utils/index";
import {
  getEmailWrapperStart,
  emailWrapperEnd,
  getEmailHeader,
  getEmailFooter,
} from "./commonEmailParts";

// Basic fields to ignore when extracting specs
const BASIC_VARIANT_KEYS = [
  "_id",
  "id",
  "sku",
  "stock",
  "price",
  "oldPrice",
  "discountPercentage",
];

export const getOrderPlacedEmailHtml = (order: IOrder, year: number) => {
  const itemsHtml = order.items
    .map((item) => {
      const variantSpecs = item.variant
        ? Object.entries(item.variant).filter(
            ([key]) => !BASIC_VARIANT_KEYS.includes(key)
          )
        : [];

      const specsHtml = variantSpecs.length
        ? `
          <h3 style="font-size:12px; color:#6F2794; font-weight:700; margin:8px 0 4px 0;">
            Chosen Specs
          </h3>
          <ul style="margin:0 0 10px 0; padding-left:5px; line-height:1.4;">
            ${variantSpecs
              .map(
                ([key, val]) => `
                  <li style="font-size:12px;">
                    <span style="text-transform: capitalize;">${key}:</span> ${val}
                  </li>
                `
              )
              .join("")}
          </ul>
        `
        : "";

      return `
        <tr>
          <td>
            <table class="product-table" width="100%" cellpadding="20" cellspacing="0" style="border-bottom:1px solid #e2e2e2;">
              <tr>
                <td class="product-image" style="width:100px;" valign="top">
                  <img src="${
                    item.product?.defaultImage ?? ""
                  }" alt="Product Image" width="80" />
                </td>
                <td style="width:400px;" valign="top">
                  <p style="margin:0; font-size:13px; font-weight:600; line-height:1.4;">
                    ${item.product?.title ?? "Product"}
                  </p>
                  ${specsHtml}
                </td>
                <td style="width:150px; font-size:12px; line-height:1;" valign="top" align="right">
                  <p>Qty: ${item.quantity}</p>
                  <p>Price: ${formatPrice(item.variant?.price ?? 0)}</p>
                  <p>Subtotal: ${formatPrice(
                    (item.variant?.price ?? 0) * item.quantity
                  )}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      `;
    })
    .join("");

  return `
${getEmailWrapperStart("Order Confirmed")}
  ${getEmailHeader(
    "Thank you for your purchase! Your order has been successfully confirmed."
  )}

  <!-- Invoice Button -->
  ${
    order.invoice
      ? `
      <tr>
        <td style="text-align:center; padding:20px;">
          <a href="${order.invoice}" style="
            display:inline-block;
            padding:12px 20px;
            background-color:#16a34a;
            color:#ffffff;
            text-decoration:none;
            border-radius:6px;
            font-size:14px;
            font-weight:600;"
            target="_blank" rel="noopener noreferrer">
            Download Invoice (PDF)
          </a>
        </td>
      </tr>`
      : ""
  }

  <!-- Items -->
  ${itemsHtml}

  <!-- Totals -->
  <tr>
    <td style="padding-top:20px;">
      <table width="100%" cellpadding="5" cellspacing="0" style="font-size:13px;">
        <tr>
          <td align="right">Subtotal:</td>
          <td align="right">${formatPrice(order.subtotal)}</td>
        </tr>
        <tr>
          <td align="right">Shipping Fee:</td>
          <td align="right">${formatPrice(order.shippingFee ?? 0)}</td>
        </tr>
        <tr>
          <td align="right">Tax:</td>
          <td align="right">${formatPrice(order.tax ?? 0)}</td>
        </tr>
        <tr>
          <td align="right">Discount:</td>
          <td align="right" style="color:#e11d48;">-${formatPrice(
            order.discount ?? 0
          )}</td>
        </tr>
        <tr>
          <td align="right" style="font-size:15px; font-weight:bold;">Total:</td>
          <td align="right" style="font-size:15px; font-weight:bold;">${formatPrice(
            order.total
          )}</td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Footer -->
  ${getEmailFooter(year)}

${emailWrapperEnd}
  `;
};
