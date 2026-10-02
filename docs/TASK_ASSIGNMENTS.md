# 📋 Task Assignments & Work Breakdown Structure (WBS)

This document outlines the modular task division for the **Mini E-Commerce Demo Project (MERN Stack)**. Tasks are structured to enable parallel collaboration, clear ownership, and seamless pull request reviews.

---

## 👥 Task Overview & Assignment Matrix

| Task ID | Component | Task Title | Estimated Effort | Suggested Role | Assigned Collaborator | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TASK-01** | Backend | Express Server, MongoDB Connection & Error Middleware | 2 hrs | Backend Lead | `[Unassigned]` | ⏳ Ready |
| **TASK-02** | Backend | User Model, JWT Authentication & Role Middlewares | 3 hrs | Backend Dev | `[Unassigned]` | ⏳ Ready |
| **TASK-03** | Backend | Category Model & CRUD REST Endpoints | 2 hrs | Backend Dev | `[Unassigned]` | ⏳ Ready |
| **TASK-04** | Backend | Product Model, CRUD Endpoints & Search/Filter API | 4 hrs | Backend Dev | `[Unassigned]` | ⏳ Ready |
| **TASK-05** | Backend | Order Model, Server-side Stock/Price Validation & COD API | 4 hrs | Backend Lead | `[Unassigned]` | ⏳ Ready |
| **TASK-06** | Backend | Database Seeder Script (Initial Admin, Customer & Catalog) | 2 hrs | Fullstack Dev | `[Unassigned]` | ⏳ Ready |
| **TASK-07** | Frontend | Vite + React Project Init, Tailwind Design Tokens & Layouts | 2 hrs | Frontend Lead | `[Unassigned]` | ⏳ Ready |
| **TASK-08** | Frontend | AuthContext, Token Storage, Protected Routes & Axios Setup | 3 hrs | Frontend Dev | `[Unassigned]` | ⏳ Ready |
| **TASK-09** | Frontend | Public Storefront: Navbar, Responsive Grid, Search & Category Filter | 4 hrs | Frontend Dev | `[Unassigned]` | ⏳ Ready |
| **TASK-10** | Frontend | Product Details Page, CartContext & Stock-Bounded Quantity Logic | 3 hrs | Frontend Dev | `[Unassigned]` | ⏳ Ready |
| **TASK-11** | Frontend | COD Checkout Form, Order Creation Flow & My Orders Page | 4 hrs | Frontend Dev | `[Unassigned]` | ⏳ Ready |
| **TASK-12** | Frontend | Admin Dashboard Shell, Sidebar & Admin Route Protection | 3 hrs | Frontend Dev | `[Unassigned]` | ⏳ Ready |
| **TASK-13** | Frontend | Admin Category & Product Management Tables with Modals | 4 hrs | Fullstack Dev | `[Unassigned]` | ⏳ Ready |
| **TASK-14** | Frontend | Admin Order Fulfillment Panel & Status Update Workflow | 3 hrs | Fullstack Dev | `[Unassigned]` | ⏳ Ready |

---

## 📌 Detailed Task Specifications

### 🔹 TASK-01: Express Server, MongoDB Connection & Error Middleware
- **Module**: `server/`
- **Scope**:
  - Set up `server.js` with Express, CORS, JSON body parser.
  - Connect to MongoDB using Mongoose with proper logging.
  - Implement centralized 404 route handler and global asynchronous error handling middleware.
  - Setup `.env.example` file.
- **Acceptance Criteria**:
  - `npm run dev` boots Express on port 5000 without warnings.
  - Database connection status is logged in console.
  - Uncaught exceptions return consistent `{ success: false, message: ... }` JSON.

---

### 🔹 TASK-02: User Model, JWT Authentication & Role Middlewares
- **Module**: `server/`
- **Scope**:
  - Implement `User` Mongoose schema (name, email, password, role: `customer` | `admin`).
  - Add bcrypt pre-save password hashing.
  - Implement `POST /api/auth/register` (validate name, email, password min 6 chars, unique email).
  - Implement `POST /api/auth/login` (validate credentials, return JWT + sanitized user data).
  - Create `authMiddleware` (verify Bearer JWT) and `adminMiddleware` (verify role === `'admin'`).
- **Acceptance Criteria**:
  - Passwords are never saved in plain text.
  - Valid tokens allow access to protected routes; invalid/missing tokens return 401 Unauthorized.
  - Non-admin tokens hitting admin routes return 403 Forbidden.

---

### 🔹 TASK-03: Category Model & CRUD REST Endpoints
- **Module**: `server/`
- **Scope**:
  - Implement `Category` Mongoose schema (name, description).
  - `GET /api/categories` (public access for storefront & admin).
  - `POST /api/categories` (admin only, unique category name validation).
  - `PUT /api/categories/:id` (admin only, update category).
  - `DELETE /api/categories/:id` (admin only, remove category).
- **Acceptance Criteria**:
  - Duplicate category names are rejected with 400 Bad Request.
  - Non-admin cannot create, edit, or delete categories.

---

### 🔹 TASK-04: Product Model, CRUD Endpoints & Search/Filter API
- **Module**: `server/`
- **Scope**:
  - Implement `Product` Mongoose schema (name, description, price, image, category ObjectId, stock).
  - `GET /api/products` supporting `?category=<id>&search=<query>` query params.
  - `GET /api/products/:id` returning product details with populated category name.
  - `POST /api/products` (admin only, validate price > 0, stock >= 0, valid category).
  - `PUT /api/products/:id` (admin only, update product fields).
  - `DELETE /api/products/:id` (admin only, remove product).
- **Acceptance Criteria**:
  - Stock cannot be set below 0; price cannot be <= 0.
  - Filtering by category and search keyword returns matched results accurately.

---

### 🔹 TASK-05: Order Model, Server-side Stock/Price Validation & COD API
- **Module**: `server/`
- **Scope**:
  - Implement `Order` Mongoose schema (`user`, `products`, `totalAmount`, `shippingAddress`, `status`, `paymentMethod: "Cash on Delivery"`).
  - `POST /api/orders`:
    - Fetch product prices from MongoDB (never trust client price).
    - Check available stock >= requested quantity.
    - Atomically decrement product stock.
    - Save order with initial status `Pending`.
  - `GET /api/orders/my-orders`: Retrieve logged-in customer's orders.
  - `GET /api/admin/orders`: Retrieve all customer orders (admin only).
  - `PATCH /api/admin/orders/:id/status`: Update status (`Pending`, `Confirmed`, `Shipped`, `Delivered`, `Cancelled`).
- **Acceptance Criteria**:
  - Orders cannot be placed if stock is insufficient.
  - Stock is accurately reduced after order creation.
  - Customers can only see their own orders; admins can see all orders.

---

### 🔹 TASK-06: Database Seeder Script
- **Module**: `server/utils/seeder.js`
- **Scope**:
  - Create standalone script to wipe existing data and seed initial records.
  - Seed default admin: `admin@ecommerce.com` / `admin123`.
  - Seed default customer: `customer@ecommerce.com` / `customer123`.
  - Seed 3 default categories (`Electronics`, `Fashion`, `Shoes`).
  - Seed 6+ demo products with high quality Unsplash image URLs and realistic stock.
- **Acceptance Criteria**:
  - Running `npm run seed` populates DB cleanly within seconds.

---

### 🔹 TASK-07: Vite + React Setup & Tailwind Design Tokens
- **Module**: `client/`
- **Scope**:
  - Initialize Vite React project in `client/`.
  - Configure Tailwind CSS with customized color palette (`primary`, `slate`, status colors).
  - Create base layout components (`MainLayout.jsx`, `Footer.jsx`).
  - Implement modern typography and global reset styles in `index.css`.
- **Acceptance Criteria**:
  - Vite dev server boots cleanly on port 5173.
  - Tailwind utility classes render accurately.

---

### 🔹 TASK-08: AuthContext, Token Storage, Protected Routes & Axios Setup
- **Module**: `client/`
- **Scope**:
  - Create centralized `api/axios.js` with Bearer token request interceptor.
  - Build `context/AuthContext.jsx` with `user`, `token`, `login`, `register`, `logout` states.
  - Store token and user object in `localStorage`.
  - Build `UserProtectedRoute.jsx` and `AdminProtectedRoute.jsx` components.
  - Create `Login.jsx` and `Register.jsx` pages with validation and toast alerts.
- **Acceptance Criteria**:
  - Authenticated user session persists across page refreshes.
  - Non-authenticated visitors are redirected to `/login` when accessing protected routes.

---

### 🔹 TASK-09: Public Storefront: Navbar, Responsive Grid & Search/Filter
- **Module**: `client/`
- **Scope**:
  - Build `Navbar.jsx` with brand logo, live search bar, category navigation, cart badge counter, and user menu dropdown.
  - Build `Products.jsx` product catalog view.
  - Implement category filter pill buttons (`All`, `Electronics`, `Fashion`, `Shoes`).
  - Render product cards with image, category badge, price, stock badge, and "Add to Cart" button.
- **Acceptance Criteria**:
  - Filtering by category updates grid instantly.
  - Searching keyword debounces and filters products accurately.
  - Out of stock products display disabled button with `Out of Stock` badge.

---

### 🔹 TASK-10: Product Details Page & Shopping Cart Logic
- **Module**: `client/`
- **Scope**:
  - Build `context/CartContext.jsx` with `addToCart`, `updateQuantity`, `removeFromCart`, `clearCart`.
  - Prevent quantity from exceeding available stock.
  - Build `ProductDetails.jsx` page with full image, detailed description, and quantity selector.
  - Build `Cart.jsx` page displaying line items, quantity modifiers, subtotal, and checkout CTA.
- **Acceptance Criteria**:
  - User cannot increase cart quantity beyond available product stock.
  - Cart item counts update immediately in the Navbar badge.

---

### 🔹 TASK-11: COD Checkout Form, Order Creation & My Orders Page
- **Module**: `client/`
- **Scope**:
  - Build `Checkout.jsx` page with required inputs: Name, Phone, Address, City, Pincode.
  - Set fixed payment method: "Cash on Delivery".
  - Handle order placement: call `POST /api/orders`, clear cart upon success, show toast.
  - Build `MyOrders.jsx` page displaying order ID, date, status badge, items summary, and total amount.
- **Acceptance Criteria**:
  - Checkout validates required address fields.
  - On order submission, cart is cleared and user is redirected to `/my-orders`.

---

### 🔹 TASK-12: Admin Dashboard Shell & Sidebar
- **Module**: `client/`
- **Scope**:
  - Build `AdminLayout.jsx` with a responsive sidebar and topbar.
  - Sidebar links: `Categories`, `Products`, `Orders`, and `Exit to Store`.
  - Add summary dashboard metrics cards: Total Categories, Total Products, Total Orders, Total Revenue.
  - Guard entire `/admin/*` routes with `AdminProtectedRoute`.
- **Acceptance Criteria**:
  - Non-admin users cannot access any `/admin` route.
  - Sidebar collapses smoothly on mobile viewports.

---

### 🔹 TASK-13: Admin Category & Product Management UI
- **Module**: `client/`
- **Scope**:
  - Build `AdminCategories.jsx`: table view, "Add Category" modal, edit modal, delete confirmation dialog.
  - Build `AdminProducts.jsx`: table view with thumbnail, price, stock badge, edit modal, delete confirmation dialog.
  - Forms validate positive price and non-negative stock.
- **Acceptance Criteria**:
  - Changes made by admin reflect immediately in the public catalog.
  - Delete actions require explicit confirmation prompt.

---

### 🔹 TASK-14: Admin Order Fulfillment Panel & Status Workflow
- **Module**: `client/`
- **Scope**:
  - Build `AdminOrders.jsx` displaying all customer orders.
  - Order details modal showing shipping address and ordered products list.
  - Status change dropdown with values: `Pending`, `Confirmed`, `Shipped`, `Delivered`, `Cancelled`.
  - Immediate toast notification upon status change.
- **Acceptance Criteria**:
  - Updating status triggers `PATCH /api/admin/orders/:id/status` and updates UI status badge in real time.

---

## 🚀 How Collaborators Claim or Self-Assign Tasks

1. Review the tasks above and pick an open task marked `[Unassigned]`.
2. Create a new git branch from `main`:
   ```bash
   git checkout -b feature/TASK-XX-brief-description
   ```
3. Commit your work following conventional commits:
   ```bash
   git commit -m "feat(module): implement TASK-XX brief description"
   ```
4. Push your branch and open a Pull Request against `main`.
