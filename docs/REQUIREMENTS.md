# 📋 Requirements Specification

This document defines the functional and non-functional requirements for the **Mini E-Commerce Demo Project** built using the MERN stack.

---

## 1. Functional Requirements

### 1.1 Authentication & User Management

#### Customer Registration
- **Fields**:
  - `name` (String, required, trimmed, 2-50 chars)
  - `email` (String, required, trimmed, lowercase, valid email format, unique)
  - `password` (String, required, min 6 characters)
  - `confirmPassword` (String, required, must match `password` on frontend & validated before submission)
- **Role Assignment**: Newly registered users automatically receive the role `customer`.
- **Password Security**: Passwords must be hashed using `bcrypt` (minimum 10 salt rounds) prior to persisting in MongoDB.

#### User Login
- **Fields**:
  - `email` (String, required)
  - `password` (String, required)
- **Behavior**:
  - Validates credentials against stored hash.
  - On success, issues a signed JSON Web Token (JWT) containing `userId` and `role`.
  - Returns user profile data (id, name, email, role) alongside the token.
- **Error Handling**: Generic message for failed authentication (`Invalid email or password`) to prevent account harvesting.

#### Admin Login & Role Guard
- Uses the same `/api/auth/login` endpoint or dedicated admin portal entry.
- Admin user possesses `role: "admin"`.
- Requests to administrative endpoints must be verified with:
  1. `authMiddleware`: Confirms valid JWT token.
  2. `adminMiddleware`: Confirms decoded token role equals `"admin"`. Unauthorized requests return HTTP 403 Forbidden.

#### Logout
- Clears local storage / auth state in client.
- Terminates active session context.

---

### 1.2 Category Management (Admin Only)

- **Fields**:
  - `name` (String, required, unique, trimmed, e.g., "Electronics", "Fashion", "Shoes")
  - `description` (String, optional, up to 300 characters)
- **Operations**:
  - **Create**: Add a new category.
  - **Read**: Fetch all categories (publicly accessible for storefront filters and admin table).
  - **Update**: Edit existing category name or description.
  - **Delete**: Remove category with frontend confirmation dialog.
- **Constraints**: Prevent deleting a category if active products are assigned to it, or handle cascading warning.

---

### 1.3 Product Management (Admin Only)

- **Fields**:
  - `name` (String, required, trimmed, 3-100 characters)
  - `description` (String, required, 10-1000 characters)
  - `price` (Number, required, minimum: 0.01, positive float)
  - `image` (String, required, valid URL format pointing to an image asset)
  - `category` (ObjectId referencing `Category`, required)
  - `stock` (Integer, required, minimum: 0, default: 0)
- **Operations**:
  - **Create**: Add a product with image, category selection, price, and initial stock.
  - **Read**: List products in tabular format with thumbnail, stock badge, and action buttons.
  - **Update**: Edit all product fields (price, stock, image, name, category).
  - **Delete**: Soft or hard delete product with confirmation modal.
- **Stock Integrity**: Stock cannot be negative. If stock is 0, product should indicate "Out of Stock".

---

### 1.4 Public Storefront & Product Browsing

- **Product Catalog View**:
  - Responsive grid layout displaying product cards.
  - Card components must show:
    - High-resolution product image
    - Category tag/badge
    - Product title
    - Price formatted in currency (e.g., `$XX.XX` or `₹XX.XX`)
    - Stock status (`In Stock` / `Only X left` / `Out of Stock`)
    - "Add to Cart" button (disabled if out of stock).
- **Filtering & Search**:
  - **Category Pills**: Quick category selector (`All`, `Electronics`, `Fashion`, `Shoes`, etc.).
  - **Search Bar**: Debounced or instant keyword search querying product name and description.
  - Query parameters must be supported: `/api/products?category=<catId>&search=<query>`.
- **Product Details Page**:
  - Full product image preview.
  - Complete product description.
  - Real-time stock availability counter.
  - Quantity selector bounded between `1` and available `stock`.
  - Add to cart action with immediate feedback (toast alert).

---

### 1.5 Shopping Cart Management

- **Storage**: Client-side state managed via React Context and synchronized with `localStorage`.
- **Capabilities**:
  - **Add to Cart**: Adds 1 unit of product or increases quantity if already present.
  - **Quantity Controls**: `+` and `-` buttons.
    - Decrementing at quantity 1 triggers removal prompt or removes item.
    - Incrementing is strictly bounded by `product.stock`. Disabled when `quantity === stock`.
  - **Remove Item**: Directly deletes line item from cart.
  - **Subtotal & Total Calculation**: Dynamic, real-time recalculation of order total.
- **Empty State**: Displays visually appealing empty-cart illustration with "Continue Shopping" CTA.

---

### 1.6 Checkout & Cash on Delivery (COD)

- **Prerequisites**: User must be authenticated to complete checkout. Redirect to Login with return URL if guest.
- **Shipping Address Form**:
  - `name` (Full recipient name, required)
  - `phone` (10-digit mobile number, required, validated via regex)
  - `address` (Street address / flat / building, required)
  - `city` (City name, required)
  - `pincode` (Postal code, required, numeric format)
- **Payment Method**: Strictly **Cash on Delivery (COD)**.
- **Order Placement Protocol**:
  1. Frontend submits shipping address and array of `{ product: productId, quantity }`.
  2. Backend looks up each product directly in MongoDB to obtain authoritative current price.
  3. Backend verifies that current `stock >= requested quantity` for every item.
  4. Backend creates an `Order` document with status `"Pending"`.
  5. Backend atomically decrements each product's stock count.
  6. Backend returns the created order details (HTTP 201).
  7. Frontend receives success, clears local cart state, and redirects to Order Confirmation / "My Orders".

---

### 1.7 Order Tracking & Management

#### Customer ("My Orders" View)
- Displays all orders placed by the authenticated customer in descending chronological order.
- Each order card displays:
  - Order ID & placement date
  - List of purchased products (thumbnail, name, unit price, quantity)
  - Shipping address summary
  - Total order amount
  - Payment method (`Cash on Delivery`)
  - Current order status pill with distinct styling (`Pending`, `Confirmed`, `Shipped`, `Delivered`, `Cancelled`).

#### Admin (Order Management Table)
- Comprehensive table listing all orders from all customers.
- Displays: Customer Name, Date, Item Count, Total Price, Shipping City, and Status.
- Status Update Control: Dropdown selector allowing the admin to update status directly via `PATCH /api/admin/orders/:id/status`:
  - `Pending`
  - `Confirmed`
  - `Shipped`
  - `Delivered`
  - `Cancelled`

---

## 2. Non-Functional Requirements

### 2.1 Security
- **Never trust client-side prices**: Order total must be computed on the server using database prices.
- **Authentication**: Stateless JWT tokens passed via HTTP `Authorization: Bearer <token>` headers.
- **Password Security**: Bcrypt with salt factor 10. Passwords must never be returned in API responses (`select: -password`).
- **Input Sanitization**: Trim whitespace and validate required fields on both client and server layers.

### 2.2 Performance & Responsiveness
- **Fast Load Times**: Vite bundle optimization with code-splitting and asset minification.
- **Mobile First**: Fluid Tailwind CSS layout adapted for Mobile (<640px), Tablet (640-1024px), and Desktop (>1024px).
- **Graceful Loading**: Skeleton loaders and spinners during API calls.
- **Instant Feedback**: Toast notifications for cart actions, auth state changes, and error warnings.

### 2.3 Data Consistency
- Atomic operations for stock decrementing to prevent race conditions during checkout.
- Foreign key reference integrity (`User`, `Category`, `Product` ObjectIds in `Order`).

---

## 3. Out-of-Scope Items

To maintain a lean, robust demo project, the following are deliberately omitted:
- Online payment gateways (Stripe, PayPal, Razorpay).
- Email dispatch services (SendGrid, Mailgun) for password resets or order confirmation emails.
- Multi-seller / Multi-vendor permissions.
- Product reviews, ratings, and comments.
- Coupon codes, vouchers, or promotional discounts.
- Complex analytics or revenue charts.
