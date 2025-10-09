// src/types/env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    MONGO_URI: string;
    SMTP_USER_EMAIL: string;
    SMTP_APP_PASSWORD: string;
    NODE_ENV: "development" | "production";

    DEV_CLIENT_DOMAIN: string;
    DEV_CLIENT_URL: string;
    PROD_CLIENT_DOMAIN: string;
    PROD_CLIENT_URL: string;

    ACCESS_TOKEN_SECRET: string;
    REFRESH_TOKEN_SECRET: string;
    CART_TOKEN_SECRET: string;

    API_VERSION: string;

    SUPERADMIN_EMAIL: string;
    SUPERADMIN_PASSWORD: string;

    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_SECRET: string;
    CLOUDINARY_API_KEY: string;

    SSL_STORE_ID: string;
    SSL_STORE_PASS: string;
  }
}
