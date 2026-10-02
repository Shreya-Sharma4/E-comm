# 🎨 UI/UX Design & Layout Specification

This document outlines the visual design system, UI component wireframes, responsive breakpoints, and interaction design for the **Mini E-Commerce Demo Project** using **Tailwind CSS**.

---

## 1. Visual Design System

### 1.1 Color Palette

The project utilizes an elegant, clean palette featuring deep slates, clean whites, vibrant indigo/blue accents, and semantic status indicators:

```text
Primary Brand:
  - primary-600: #4F46E5 (Indigo - Primary CTAs, active pills)
  - primary-700: #4338CA (Hover state)
  - primary-50:  #EEF2FF (Light backgrounds, active item tints)

Neutral / Grayscale:
  - slate-900:   #0F172A (Headings, primary typography)
  - slate-600:   #475569 (Body text, subtext)
  - slate-400:   #94A3B8 (Borders, placeholder text)
  - slate-100:   #F1F5F9 (Background accents, table zebra stripes)
  - slate-50:    #F8FAFC (Page background)

Order Status Badges:
  - Pending:     Amber   (bg-amber-100 text-amber-800 border-amber-200)
  - Confirmed:   Sky     (bg-sky-100 text-sky-800 border-sky-200)
  - Shipped:     Indigo  (bg-indigo-100 text-indigo-800 border-indigo-200)
  - Delivered:   Emerald (bg-emerald-100 text-emerald-800 border-emerald-200)
  - Cancelled:   Rose    (bg-rose-100 text-rose-800 border-rose-200)
```

### 1.2 Typography & Sizing
- **Font Family**: Modern sans-serif stack (`Inter`, system-ui, -apple-system, sans-serif).
- **Headings**: Semi-bold to Bold (`font-semibold` / `font-bold`), clear hierarchy (`text-3xl`, `text-2xl`, `text-xl`).
- **Body**: Regular font weight (`text-sm` or `text-base`), relaxed line height (`leading-relaxed`).

### 1.3 Responsive Breakpoints
- **Mobile (`< 640px`)**: Single-column product grid, collapsible mobile drawer navigation, full-width checkout inputs.
- **Tablet (`640px - 1024px`)**: 2-column product grid, condensed admin sidebar, split checkout review.
- **Desktop (`> 1024px`)**: 3 to 4-column product grid, fixed administrative sidebar, sticky order summary.

---

## 2. Public Storefront Layouts

### 2.1 Navigation Bar (`Navbar.jsx`)

```text
+-----------------------------------------------------------------------------------+
|  [Logo] MiniShop     [ Search products...       (Q) ]    Cart (3)   Alex v        |
+-----------------------------------------------------------------------------------+
|  Categories:  ( All )  ( Electronics )  ( Fashion )  ( Shoes )                    |
+-----------------------------------------------------------------------------------+
```

- **Brand**: Clickable logo redirecting to `/`.
- **Search Bar**: Centered on desktop, collapsable on mobile. Triggers real-time debounced query to `/api/products?search=...`.
- **Cart Badge**: Displays real-time quantity indicator with transition animation.
- **User Menu**: Dropdown showing user name, link to `My Orders`, and `Logout` (or `Login / Register` buttons for guests).
- **Category Bar**: Horizontal scrolling pills for quick filtering.

---

### 2.2 Product Catalog Grid (`Products.jsx`)

```text
+-----------------------------------------------------------------------------------+
| Showing all products (12 items)                                Sort: Featured v   |
+-----------------------------------------------------------------------------------+
| +---------------------+ +---------------------+ +---------------------+           |
| | [ Product Image ]   | | [ Product Image ]   | | [ Product Image ]   |           |
| | Category: Fashion   | | Category: Electr.   | | Category: Shoes     |           |
| | Classic Denim Jacket| | Smart Watch V2      | | Pro Running Kicks   |           |
| | In Stock (8 left)   | | In Stock (25 left)  | | Out of Stock        |           |
| | $59.99              | | $129.99             | | $89.99              |           |
| | [ + Add to Cart ]   | | [ + Add to Cart ]   | | [ Out of Stock ]    |           |
| +---------------------+ +---------------------+ +---------------------+           |
+-----------------------------------------------------------------------------------+
```

- **Product Card**:
  - Rounded corners (`rounded-xl`), subtle border (`border border-slate-200`), smooth shadow on hover (`hover:shadow-lg transition-all`).
  - Image with fixed aspect ratio (`aspect-square` or `aspect-[4/3]`) and `object-cover`.
  - Stock indicator:
    - `Stock > 5`: Green badge (`In Stock`).
    - `1 <= Stock <= 5`: Orange badge (`Only X left`).
    - `Stock === 0`: Red badge (`Out of Stock`) and disabled "Add to Cart" button.

---

### 2.3 Product Details Page (`ProductDetails.jsx`)

```text
+-----------------------------------------------------------------------------------+
| < Back to Products                                                                |
|                                                                                   |
| +-----------------------------+   Category: Electronics                           |
| |                             |   Wireless Noise Cancelling Headphones            |
| |                             |   $149.99                                         |
| |      [ Large Image ]        |                                                   |
| |                             |   Description:                                    |
| |                             |   Experience pristine audio fidelity with 30-hour |
| |                             |   battery life and active noise cancellation.     |
| +-----------------------------+                                                   |
|                                   Stock: 12 available                             |
|                                   Quantity: [ - ]  2  [ + ] (Max: 12)             |
|                                                                                   |
|                                   [   🛒 Add to Cart - $299.98   ]                |
+-----------------------------------------------------------------------------------+
```

---

### 2.4 Shopping Cart (`Cart.jsx`)

```text
+-----------------------------------------------------------------------------------+
| Shopping Cart (2 items)                                                           |
|                                                                                   |
| Product                          Price      Quantity           Total      Action  |
| --------------------------------------------------------------------------------- |
| [Img] Wireless Headphones        $149.99    [ - ]  2  [ + ]    $299.98    [ Trash]|
| [Img] Classic Denim Jacket       $59.99     [ - ]  1  [ + ]    $59.99     [ Trash]|
| --------------------------------------------------------------------------------- |
|                                             Subtotal:          $359.97            |
|                                             Shipping (COD):    FREE               |
|                                             Order Total:       $359.97            |
|                                                                                   |
|                                             [ Proceed to Checkout -> ]            |
+-----------------------------------------------------------------------------------+
```

- **Stock Guard**: The `+` button is disabled immediately when `item.quantity === product.stock`.
- **Empty State**: Displays when item count is 0 with friendly icon and "Explore Catalog" button.

---

### 2.5 Checkout Page (`Checkout.jsx`)

```text
+-----------------------------------------------------------------------------------+
| Checkout & Shipping Details                                                       |
|                                                                                   |
| [ Shipping Information ]                  [ Order Summary ]                       |
| Full Name:      [ Alex Johnson        ]    - Wireless Headphones x2    $299.98    |
| Phone Number:   [ 9876543210          ]    - Classic Denim Jacket x1    $59.99    |
| Street Address: [ 42 High Street, 3B  ]    -----------------------------------    |
| City:           [ Metropolis          ]    Total Amount:               $359.97    |
| Postal Code:    [ 100001              ]                                           |
|                                            Payment Method:                        |
|                                            (*) Cash on Delivery (COD)             |
|                                                                                   |
| [ Confirm & Place Order ]                  (Pay with cash upon package delivery)  |
+-----------------------------------------------------------------------------------+
```

---

### 2.6 Customer Order History (`MyOrders.jsx`)

```text
+-----------------------------------------------------------------------------------+
| My Orders                                                                         |
|                                                                                   |
| Order #651d11111111111111111111   Placed: Oct 2, 2026   [ Status: Confirmed ]     |
| --------------------------------------------------------------------------------- |
| - Wireless Headphones (Qty: 2) - $299.98                                          |
| - Classic Denim Jacket (Qty: 1) - $59.99                                          |
| --------------------------------------------------------------------------------- |
| Shipping to: Alex Johnson, 42 High Street, Metropolis, 100001 (Phone: 9876543210) |
| Total Paid via COD: $359.97                                                       |
+-----------------------------------------------------------------------------------+
```

---

## 3. Admin Dashboard Layouts (`/admin`)

### 3.1 Admin Layout & Sidebar (`AdminLayout.jsx`)

- **Sidebar (Fixed Desktop / Collapsible Mobile)**:
  - Brand: `Store Admin`
  - Navigation Links:
    - 📊 Dashboard Overview
    - 📁 Categories
    - 📦 Products
    - 🛍 Orders
  - Bottom Utility: `Exit to Store` & `Logout`.

---

### 3.2 Category Management View (`AdminCategories.jsx`)

```text
+-----------------------------------------------------------------------------------+
| Categories Management                             [ + Add New Category Button ]   |
|                                                                                   |
| Category Name       Description                           Products Count  Actions |
| --------------------------------------------------------------------------------- |
| Electronics         Gadgets, smartphones, accessories     12              [Edit]  |
|                                                                           [Delete]|
| Fashion             Apparel, jackets, streetwear          18              [Edit]  |
|                                                                           [Delete]|
+-----------------------------------------------------------------------------------+
```

- **Add / Edit Modal**: Modal dialog with Name, Description, and Save button.
- **Delete Confirmation Modal**: Prevents accidental deletion with "Are you sure?" modal prompt.

---

### 3.3 Product Management View (`AdminProducts.jsx`)

```text
+-----------------------------------------------------------------------------------+
| Products Inventory                                [ + Add New Product Button ]    |
|                                                                                   |
| Product            Category     Price     Stock     Status          Actions       |
| --------------------------------------------------------------------------------- |
| [Img] Smart Phone  Electronics  $699.99   15        [ In Stock ]    [Edit] [Delete|
| [Img] Denim Jacket Fashion      $59.99    3         [ Low Stock ]   [Edit] [Delete|
| [Img] Runner Pro   Shoes        $89.99    0         [ Out of Stock] [Edit] [Delete|
+-----------------------------------------------------------------------------------+
```

---

### 3.4 Order Management View (`AdminOrders.jsx`)

```text
+-----------------------------------------------------------------------------------+
| Customer Orders                                                                   |
|                                                                                   |
| Order ID    Customer       Date         Total     Status Selector         Actions |
| --------------------------------------------------------------------------------- |
| #651d11..   Alex Johnson   02/10/2026   $359.97   [ Confirmed        v ]  [View]  |
| #651d22..   Sara Connor    01/10/2026   $129.99   [ Shipped          v ]  [View]  |
| #651d33..   John Doe       01/10/2026   $45.00    [ Delivered        v ]  [View]  |
+-----------------------------------------------------------------------------------+
```

- **Real-Time Status Selector**: Changing dropdown immediately triggers `PATCH /api/admin/orders/:id/status` and updates the color-coded pill.
- **Order Details Modal**: Inspect full shipping address, line items, and customer contact information.

---

## 4. UI States & Feedback

| State | Implementation |
| :--- | :--- |
| **Loading Skeletons** | Animated pulse placeholders (`animate-pulse bg-slate-200`) representing product cards and table rows. |
| **Empty States** | Clean illustrated SVG icons with descriptive message (e.g. "No products match your search", "Your cart is empty"). |
| **Toast Notifications** | Dismissible popups for `Item added to cart`, `Logged in successfully`, `Order placed!`, and `Status updated`. |
| **Destructive Actions** | Two-step confirmation modal before deleting a product or category. |
