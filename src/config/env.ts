import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), "env/.env") });

export const config = {
  port: (process.env.PORT || "5000") as string,
  mongoUri: process.env.MONGO_URI as string,
  smtpUser: process.env.SMTP_USER_EMAIL as string,
  emailSender: process.env.SMTP_USER_EMAIL as string,
  smtpPass: process.env.SMTP_APP_PASSWORD as string,
  environment: process.env.NODE_ENV as string,
  devClientDomain: process.env.DEV_CLIENT_DOMAIN as string,
  devClientURL: process.env.DEV_CLIENT_URL as string,
  prodClientDomain: process.env.PROD_CLIENT_DOMAIN as string,
  prodClientURL: process.env.PROD_CLIENT_URL as string,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET as string,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET as string,
  cartTokenSecret: process.env.CART_TOKEN_SECRET as string,
  apiVersion: process.env.API_VERSION as string,
  superadminEmail: process.env.SUPERADMIN_EMAIL as string,
  superadminPassword: process.env.SUPERADMIN_PASSWORD as string,
};
