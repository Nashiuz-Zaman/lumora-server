# ⚡ Lumora Server

A robust eCommerce backend built with **Express**, **TypeScript**, **Mongoose**, and **JWT Authentication**.
Handles user authentication, product management, orders, and payment integration.

---

## 🚀 Tech Stack

- **Node.js + Express**
- **TypeScript**
- **MongoDB (Mongoose)**
- **JWT Authentication**
- **Cloudinary** for image storage
- **Nodemailer** for emails
- **SSLCommerz** for payment gateway

---

## ⚙️ Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/lumora-server.git
cd lumora-server
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Set up environment variables

Create a `.env` file in the project root and add the following:

```env
# Client URLs
PROD_CLIENT_DOMAIN=YOUR_OWN_VALUE
PROD_CLIENT_URL=YOUR_OWN_VALUE
DEV_CLIENT_DOMAIN=YOUR_OWN_VALUE
DEV_CLIENT_URL=YOUR_OWN_VALUE

# Server Config
PORT=YOUR_OWN_VALUE
NODE_ENV=YOUR_OWN_VALUE

# MongoDB
MONGO_URI=YOUR_OWN_VALUE

# JWT Secrets
ACCESS_TOKEN_SECRET=YOUR_OWN_VALUE
REFRESH_TOKEN_SECRET=YOUR_OWN_VALUE
CART_TOKEN_SECRET=YOUR_OWN_VALUE

# SMTP / Email
SMTP_USER_EMAIL=YOUR_OWN_VALUE
SMTP_APP_PASSWORD=YOUR_OWN_VALUE

# API
API_VERSION=YOUR_OWN_VALUE

# Admin Credentials
SUPERADMIN_EMAIL=YOUR_OWN_VALUE
SUPERADMIN_PASSWORD=YOUR_OWN_VALUE
DEMOADMIN_EMAIL=YOUR_OWN_VALUE
DEMOADMIN_PASSWORD=YOUR_OWN_VALUE

# Cloudinary
CLOUDINARY_API_KEY=YOUR_OWN_VALUE
CLOUDINARY_API_SECRET=YOUR_OWN_VALUE
CLOUDINARY_CLOUD_NAME=YOUR_OWN_VALUE

# SSLCommerz
SSL_STORE_ID=YOUR_OWN_VALUE
SSL_STORE_PASS=YOUR_OWN_VALUE
```

---

### 4️⃣ Run the development server

```bash
npm run dev
```

---

### 🏗️ Build and Run Production

```bash
npm run build
npm start
```

---

## 🧩 Notes

- Make sure MongoDB is running and accessible from your connection string.
- Configure your `.env` file carefully before deployment.
- Uses **module-alias** for clean imports (e.g. `@app`, `@utils`, etc.).

---

## 💻 Author

Developed by **Nashiuz Zaman**
