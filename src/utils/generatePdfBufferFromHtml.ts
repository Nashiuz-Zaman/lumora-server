import Chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

const viewport = {
  deviceScaleFactor: 1,
  hasTouch: false,
  height: 1080,
  isLandscape: true,
  isMobile: false,
  width: 1920,
};

export const generatePdfBufferFromHtml = async (
  html: string
): Promise<Buffer> => {
  // Launch Puppeteer with serverless-compatible Chromium
  const browser = await puppeteer.launch({
    headless: "shell",
    args: Chromium.args,
    defaultViewport: viewport,
    executablePath: await Chromium.executablePath(),
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
