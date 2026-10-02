# 🛠 Setup & Installation Guide

This guide provides step-by-step instructions to set up, configure, seed, and run the **Mini E-Commerce Demo Project** locally.

---

## 1. Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: `v18.x` or `v20.x` LTS ([Download](https://nodejs.org/))
- **npm**: `v9.x` or higher (bundled with Node.js)
- **MongoDB**: Local MongoDB instance (`mongodb://localhost:27017`) OR a free [MongoDB Atlas](https://www.mongodb.com/atlas) connection URI.
- **Git**: For version control.

---

## 2. Server Setup (`/server`)

### 2.1 Dependencies Configuration
The backend server runs on Express.js and Mongoose.

#### Production Dependencies:
```bash
npm install express mongoose dotenv cors jsonwebtoken bcryptjs
```

#### Development Dependencies:
```bash
npm install -D nodemon
```

### 2.2 Environment Variables (`server/.env`)
Create a file named `.env` in the `/server` directory:

```env
# Server Port
PORT=5000

# MongoDB Connection String
# Local:
MONGODB_URI=mongodb://localhost:27017/mini-ecommerce
# OR MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/mini-ecommerce?retryWrites=true&w=majority

# JWT Authentication Secret
JWT_SECRET=supersecretjwtkey_1234567890_minicommerce

# Frontend Origin for CORS
CLIENT_URL=http://localhost:5173
```

### 2.3 `server/package.json` Scripts
Ensure the server `package.json` contains:
```json
{
  "name": "ecommerce-server",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "seed": "node utils/seeder.js"
  }
}
```

---

## 3. Database Seeder Script (`/server/utils/seeder.js`)

To fast-track development and evaluation, a database seeder script populates default records:

### Default Administrative Account:
- **Email**: `admin@ecommerce.com`
- **Password**: `admin123`
- **Role**: `admin`

### Default Customer Account:
- **Email**: `customer@ecommerce.com`
- **Password**: `customer123`
- **Role**: `customer`

### Seed Execution Command:
```bash
cd server
npm run seed
```

This will clear existing collections, hash default passwords with bcrypt, insert categories (`Electronics`, `Fashion`, `Shoes`), and populate initial products with stock.

---

## 4. Client Setup (`/client`)

### 4.1 Project Initialization & Dependencies
The client is scaffolded using Vite with React:

```bash
# In client/
npm install react-router-dom axios lucide-react
```

### 4.2 Tailwind CSS Configuration
Install Tailwind CSS and PostCSS:
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

#### `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
      },
    },
  },
  plugins: [],
}
```

#### `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background-color: #f8fafc;
  color: #0f172a;
}
```

### 4.3 Environment Variables (`client/.env`)
Create a file named `.env` in the `/client` directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 5. Running the Application Locally

### Terminal 1: Backend Server
```bash
cd server
npm install
npm run seed     # Run once to create sample admin & catalog
npm run dev      # Starts Express on http://localhost:5000
```

### Terminal 2: Frontend Client
```bash
cd client
npm install
npm run dev      # Starts Vite dev server on http://localhost:5173
```

Now open your browser and navigate to:
```text
http://localhost:5173
```

---

## 6. Troubleshooting & Common Questions

| Issue | Root Cause | Solution |
| :--- | :--- | :--- |
| **`MongooseServerSelectionError`** | MongoDB is not running or URI is invalid | Ensure local MongoDB service is started (`mongod`) or verify Atlas IP whitelist includes `0.0.0.0/0`. |
| **`CORS Error in Browser Console`** | Origin mismatch between client & server | Verify `CLIENT_URL` in `server/.env` exactly matches the Vite port (`http://localhost:5173`). |
| **`401 Unauthorized on Protected Routes`** | JWT token expired or missing | Re-login via `/login` to generate a fresh token stored in `localStorage`. |
| **`Port 5000 already in use`** | Another process is holding port 5000 | Kill the existing process or change `PORT=5001` in `.env` and `VITE_API_BASE_URL` in client. |
