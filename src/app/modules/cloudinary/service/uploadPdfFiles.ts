import { config } from "@config/env";
import { v2 as cloudinary } from "cloudinary";

const cloudName = config.cloudinaryCloud;
const apiSecret = config.cloudinaryApiSecret;
const apiKey = config.cloudinaryApiKey;

type TUploadInput = { buffer: Buffer; filename: string; mimetype: string };

// Configure Cloudinary
cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

export const uploadPdfFiles = async (
  files: TUploadInput[],
  folder: string = "project-uploads"
): Promise<string[] | null> => {
  try {
    const urls: string[] = [];

    for (const file of files) {
      if (file.mimetype !== "application/pdf") {
        throw new Error(
          `Invalid file type: ${file.filename}. Only PDFs are allowed.`
        );
      }

      const base64 = file.buffer.toString("base64");
      const dataUri = `data:${file.mimetype};base64,${base64}`;

      const result = await cloudinary.uploader.upload(dataUri, {
        folder,
        public_id: file.filename.replace(/\.[^/.]+$/, ""),
        resource_type: "raw", // PDF must be uploaded as raw
        format: "pdf",
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      });

      urls.push(result.secure_url);
    }

    return urls;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return null;
  }
};
