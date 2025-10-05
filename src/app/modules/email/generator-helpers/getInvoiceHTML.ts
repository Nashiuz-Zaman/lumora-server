import { IOrder } from "@app/modules/order/order.type";
import { TPopulatedCartItem } from "@app/modules/cart/cart.type";
import { formatPrice } from "@utils/index";

export const getInvoiceHTML = (order: IOrder): string => {
  const escapeHtml = (unsafe: unknown) => {
    if (unsafe === null || unsafe === undefined) return "";
    const s = String(unsafe);
    return s
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  };

  const itemsHtml = (order.items || [])
    .map((item: TPopulatedCartItem) => {
      const {
        product = {} as any,
        variant = {} as any,
        quantity = 0,
      } = item as any;

      const unitPrice = Number(variant.price ?? product.defaultPrice ?? 0);
      const lineTotal = unitPrice * Number(quantity || 0);
      const title = product.title ?? product.slug ?? "Untitled product";

      return `
        <tr>
          <td style="width:55%;">${escapeHtml(title)}</td>
          <td style="width:15%;">${Number(quantity || 0)}</td>
          <td style="width:15%;">${formatPrice(unitPrice)}</td>
          <td style="width:15%;">${formatPrice(lineTotal)}</td>
        </tr>
      `;
    })
    .join("");

  const subtotal = Number(order.subtotal ?? 0);
  const shippingFee = Number(order.shippingFee ?? 0);
  const tax = Number(order.tax ?? 0);
  const discount = Number(order.discount ?? 0);
  const total = Number(order.total ?? subtotal + shippingFee + tax - discount);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Invoice</title>
    <style>
      * { font-family: Arial, sans-serif; margin: 0; box-sizing: border-box; }
      body { margin: 0; padding: 40px; background-color: #ffffff; font-size: 12px; color: #333; width: 210mm; height: 297mm; display: flex; flex-direction: column; }
      .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 50px; }
      .logo { max-width: 160px; height: auto; }
      .invoice-id { font-weight: bold; font-size: 14px; color: #222; }
      h2 { margin: 0; margin-bottom: 15px; color: #16a34a; }
      h2+p { margin: 0; margin-bottom: 30px; }
      table { width: 100%; border-collapse: collapse; margin-top: 20px; }
      th, td { text-align: left; padding: 8px; font-size: 12px; border: 1px solid #ddd; vertical-align: top; }
      .totals-table td { border: none; }
      .store-info { text-align: center; font-size: 11px; color: #444; line-height: 1.4; max-width: 220px; }
      .store-name { font-weight: bold; font-size: 13px; color: #111; margin-bottom: 4px; }
      .company-address { margin-top: 40px; font-size: 11px; color: #555; text-align: center; }
      .signature-section { margin-top: auto; text-align: right }
      .footer-note { margin-top: 50px; font-size: 10px; color: #777; text-align: center; line-height: 1.4; }
      .totals-table td:last-child { text-align: right; }
    </style>
  </head>
  <body>
    <div class="header">
      <div style="font-size:36px; font-weight:bold; color:#a439da; font-family:'Poppins', Arial, sans-serif;">LUMORA</div>
      <div class="store-info">
        <div class="store-address">
          456 Market Street, Floor 12 <br />
          San Francisco, CA 94111 <br />
          United States
        </div>
      </div>
      <div class="invoice-id">Invoice-${escapeHtml(order.orderId ?? "")}</div>
    </div>

    <h2>Order Confirmation</h2>
    <p>Thank you for your purchase! Your order has been successfully confirmed and is now being processed.</p>

    <table>
      <thead>
        <tr>
          <th style="width:55%;">Product</th>
          <th style="width:15%;">Qty</th>
          <th style="width:15%;">Price</th>
          <th style="width:15%;">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>

    <div style="display:flex; justify-content:flex-end; margin-top:30px;">
      <table class="totals-table" style="width:300px;">
        <tr><td align="right">Sub Total:</td><td align="right">${formatPrice(
          subtotal
        )}</td></tr>
        <tr><td align="right">Shipping Fee:</td><td align="right">${formatPrice(
          shippingFee
        )}</td></tr>
        <tr><td align="right">Tax:</td><td align="right">${formatPrice(
          tax
        )}</td></tr>
        <tr><td align="right">Discount:</td><td align="right">-${formatPrice(
          discount
        )}</td></tr>
        <tr><td align="right"><strong>Total:</strong></td><td align="right"><strong>${formatPrice(
          total
        )}</strong></td></tr>
      </table>
    </div>

    <div class="signature-section">
      <p style="margin-bottom:40px; font-size:11px; color:#444;">Signed by,</p>
      <p>Nashiuz Zaman</p>
      <div style="font-size:11px; margin-top:40px; color:#222;">Authorized Representative</div>
    </div>

    <div class="footer-note">
      <p>This invoice is required for submitting any return requests. Products must be returned within 15 days from the purchase date. Warranty will be void in case of any physical damage.</p>
    </div>
  </body>
</html>`;
};
