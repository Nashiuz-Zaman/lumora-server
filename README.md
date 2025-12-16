# Lumora

A full modern eCommerce platform built with a **Next.js 15 + React 19** frontend and a **Node.js/Express + TypeScript + MongoDB** backend — powered by **Redux Toolkit**, **TailwindCSS 4**, **Firebase Authentication**, **Cloudinary**, **JWT auth**, **Nodemailer**, and **SSLCommerz payments**.

Jump to: [Features](#-features) | [Client Setup](#client-how-to-run) |
[Server Setup](#server-how-to-run) | [Notes](#-notes)

## 🚀 Tech Stack

### Frontend

- **Next.js 15+** (App Router)
- **TypeScript**
- **React 19**
- **Redux Toolkit**
- **TailwindCSS 4**
- **Firebase Authentication**
- **GSAP**
- **React Hook Form**
- **Axios**
- **DND-Kit**

### Backend

- **Express**
- **TypeScript**
- **MongoDB**
- **Mongoose**
- **JWT Authentication**
- **Puppeteer**
- **Cloudinary**
- **Nodemailer**
- **SSLCommerz**

## 🧩 Features

### 🛠️ Admin Features

- Admin dashboard
- Advanced analytics, including:
  - Total Revenue
  - Average Order Total
  - Total Customers
  - Total Products Sold
  - Completed / Cancelled / Returned orders breakdown
  - Sales Breakdown by Category
  - Placed vs Cancelled Orders Chart
  - Payment vs Refund Comparison
  - Revenue Growth
  - Customer Growth
- Payment & Refund Management:
  - Issue full or partial refunds
  - View transaction history (payments & refunds)
- Product Management:
  - Create new products
  - Edit existing products
  - Manage variations
  - Clone products
  - Manage product collections on homepage (CMS)
- Coupon System:
  - Create & edit coupons
  - Percentage or flat discount
  - Expiration date
  - Usage limits
- Order Management:
  - Manage all orders
  - Update order statuses (Confirmed → Shipped → Delivered → Returned → Cancelled)
  - Review customer order requests and accept or reject based on admin judgment

### ✅ Customer Features

- Email & social authentication (Local and Firebase Both)
- Manage profile information including shipping and billing addresses
- View all products and categories
- Filter & search products
- Detailed product pages with reviews & related products
- Add to cart & place orders
- Cancel orders, request returns
- Write reviews on products
- Receive email notifications for:
  - Account confirmation after signup
  - Order placed
  - Order shipped
  - Order delivered
  - Refunds issued
- Customer dashboard with:
  - Order history
  - Filter & search own orders
  - Order tracking
  - Invoice download

---

# Client How to run

[Back to top](#-lumora)

## ⚙️ Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Nashiuz-Zaman/lumora-client.git
cd lumora-client
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Set up environment variables

Create `.env.local` in the project root:

```env
# API Server
NEXT_PUBLIC_SERVER=https://example-server.com/api/v1

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_OWN_VALUE
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_OWN_VALUE
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_OWN_VALUE
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_OWN_VALUE
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_OWN_VALUE
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_OWN_VALUE
```

---

### 4️⃣ Run the development server

```bash
npm run dev
```

Open your browser:  
🔗 **http://localhost:3000**

---

# Server How to run

[Back to top](#-lumora)

## ⚙️ Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Nashiuz-Zaman/lumora-server.git
cd lumora-server
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Set up environment variables

Create a `.env` file inside an env folder at project root (root > env > .env) and add the following:

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

### 💡 Initial Data Seeding

When running in **development**, the **superadmin** and **demo admin** accounts are automatically seeded.

Other initial data, such as **categories, product collections, and backup collections**, need to be seeded manually using the CLI scripts:

```bash
# Seed categories
npm run seed:categories

# Seed product collections
npm run seed:productCollections

# Seed backup product collections
npm run seed:backupProductCollections
```

> ⚠️ **Note:** In production, seeding is not automatic. Only run these scripts intentionally to avoid overwriting live data.

---

### 🏗️ Build and Run Production

```bash
npm run build
npm start
```

---

## 🧩 Notes

- Firebase handles **Google logins**.
- Ensure your `.env.local` is properly configured before running the app.
- Make sure MongoDB is running and accessible from your connection string.
- Configure your `.env` file carefully before deployment.
- Uses **module-alias** for clean imports (e.g. `@app`, `@utils`, etc.).

---

## 💻 Author

Developed by **Nashiuz Zaman**

[Back to top](#lumora)
