import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), "env/.env") });

export const config = {
  port: process.env.PORT || "5000",
  mongoUri: process.env.MONGO_URI,
  smtpUser: process.env.SMTP_USER_EMAIL,
  emailSender: process.env.SMTP_USER_EMAIL,
  smtpPass: process.env.SMTP_APP_PASSWORD,
  environment: process.env.NODE_ENV,
  devClientDomain: process.env.DEV_CLIENT_DOMAIN,
  devClientURL: process.env.DEV_CLIENT_URL,
  prodClientDomain: process.env.PROD_CLIENT_DOMAIN,
  prodClientURL: process.env.PROD_CLIENT_URL,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  cartTokenSecret: process.env.CART_TOKEN_SECRET,
  apiVersion: process.env.API_VERSION,
  superadminEmail: process.env.SUPERADMIN_EMAIL,
  superadminPassword: process.env.SUPERADMIN_PASSWORD,
  demoadminEmail: process.env.DEMOADMIN_EMAIL,
  demoadminPassword: process.env.DEMOADMIN_PASSWORD,
  cloudinaryCloud: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  sslStoreId: process.env.SSL_STORE_ID,
  sslStorePass: process.env.SSL_STORE_PASS,
};
