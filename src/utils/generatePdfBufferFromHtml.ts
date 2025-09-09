import puppeteer from "puppeteer";

export const generatePdfBufferFromHtml = async (
  html: string
): Promise<Buffer> => {
  // Launch Puppeteer (headless Chromium)
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();

    // Set the HTML content
    await page.setContent(html, {
      waitUntil: "networkidle0", // Wait for all resources (fonts, etc.)
    });

    // Generate PDF as buffer
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20px",
        bottom: "20px",
        left: "20px",
        right: "20px",
      },
    });

    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
};
