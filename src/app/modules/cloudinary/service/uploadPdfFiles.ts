import axios from "axios";
import FormData from "form-data";
import { getSignedUrl } from "./getSignedUrl";

type TUploadInput = { buffer: Buffer; filename: string; mimetype: string };

export const uploadPdfFiles = async (
  files: TUploadInput[],
  folder: string = "project-uploads"
): Promise<string[] | null> => {
  try {
    const uploadPromises = files.map(async (file) => {
      if (file.mimetype !== "application/pdf") {
        throw new Error(
          `Invalid file type: ${file.filename}. Only PDFs are allowed.`
        );
      }

      // Generate a signed URL for THIS file/upload
      const signedUrl = getSignedUrl(folder);

      const formData = new FormData();
      formData.append("file", file.buffer, {
        filename: file.filename,
        contentType: file.mimetype,
      });

      const { data } = await axios.post(signedUrl, formData, {
        headers: formData.getHeaders(),
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      });

      return data.secure_url as string;
    });

    // If any upload rejects, Promise.all will reject
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};
