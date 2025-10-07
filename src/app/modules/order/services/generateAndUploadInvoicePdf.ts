import { generatePdfBufferFromHtml } from "@utils/index";
import { uploadPdfFiles } from "@app/modules/cloudinary/service";
import { IOrder } from "../order.type";
import { getInvoiceHTML } from "@app/modules/email/generator-helpers";

export const generateAndUploadInvoicePdf = async (order: IOrder) => {
  const html = getInvoiceHTML(order);

  // Generate PDF buffer from HTML
  const pdfBuffer = await generatePdfBufferFromHtml(html);

  // Prepare file object
  const pdfFile = {
    buffer: pdfBuffer,
    filename: `invoice-${order.orderId}.pdf`,
    mimetype: "application/pdf", // enforce PDF only
  };

  // Upload PDF to Cloudinary
  const uploadedUrls = await uploadPdfFiles([pdfFile], "invoices");

  // Return buffer and uploaded URL
  return {
    buffer: pdfBuffer,
    uploadedUrl: uploadedUrls?.[0] || null,
  };
};
