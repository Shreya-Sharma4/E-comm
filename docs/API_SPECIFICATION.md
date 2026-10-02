# 📡 REST API Specification

This document provides the complete API reference for the **Mini E-Commerce Demo Project**. All requests and responses use JSON format.

---

## 1. Global Conventions

### Base URL
```text
http://localhost:5000/api
```

### Authentication Header
Endpoints requiring authentication must include the Bearer token in the `Authorization` header:
```text
Authorization: Bearer <jwt_token>
```

### Standard Success Response Format
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

### Standard Error Response Format
```json
{
  "success": false,
  "message": "Specific error explanation",
  "error": "Detailed validation error or exception message"
}
```

---

## 2. Authentication Endpoints

### 2.1 Register Customer
Create a new customer account.

- **Route**: `POST /api/auth/register`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "name": "Alex Johnson",
    "email": "alex@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }
  ```
- **Responses**:
  - `201 Created`:
    ```json
    {
      "success": true,
      "message": "Registration successful",
      "data": {
        "user": {
          "_id": "651a2b3c4d5e6f7a8b9c0d1e",
          "name": "Alex Johnson",
          "email": "alex@example.com",
          "role": "customer"
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      }
    }
    ```
  - `400 Bad Request`: Validation failure (e.g. password mismatch, email already registered, password < 6 chars).

---

### 2.2 User / Admin Login
Authenticate an existing customer or administrator.

- **Route**: `POST /api/auth/login`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "email": "alex@example.com",
    "password": "password123"
  }
  ```
- **Responses**:
  - `200 OK`:
    ```json
    {
      "success": true,
      "message": "Login successful",
      "data": {
        "user": {
          "_id": "651a2b3c4d5e6f7a8b9c0d1e",
          "name": "Alex Johnson",
          "email": "alex@example.com",
          "role": "customer"
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      }
    }
    ```
  - `401 Unauthorized`: Invalid email or password.

---

## 3. Category Endpoints

### 3.1 Get All Categories
Retrieve list of all product categories.

- **Route**: `GET /api/categories`
- **Access**: Public
- **Responses**:
  - `200 OK`:
    ```json
    {
      "success": true,
      "count": 3,
      "data": [
        {
          "_id": "651b11111111111111111111",
          "name": "Electronics",
          "description": "Gadgets, smartphones, and accessories",
          "createdAt": "2026-10-01T10:00:00.000Z"
        },
        {
          "_id": "651b22222222222222222222",
          "name": "Fashion",
          "description": "Apparel, clothing, and streetwear",
          "createdAt": "2026-10-01T10:05:00.000Z"
        }
      ]
    }
    ```

---

### 3.2 Create Category
Add a new category to the catalog.

- **Route**: `POST /api/categories`
- **Access**: Private (Admin Only)
- **Headers**: `Authorization: Bearer <admin_token>`
- **Request Body**:
  ```json
  {
    "name": "Shoes",
    "description": "Running sneakers, casual shoes, and athletic footwear"
  }
  ```
- **Responses**:
  - `201 Created`:
    ```json
    {
      "success": true,
      "message": "Category created successfully",
      "data": {
        "_id": "651b33333333333333333333",
        "name": "Shoes",
        "description": "Running sneakers, casual shoes, and athletic footwear",
        "createdAt": "2026-10-02T12:00:00.000Z"
      }
    }
    ```
  - `400 Bad Request`: Duplicate category name or missing name.
  - `403 Forbidden`: User role is not `admin`.

---

### 3.3 Update Category
Edit an existing category.

- **Route**: `PUT /api/categories/:id`
- **Access**: Private (Admin Only)
- **Headers**: `Authorization: Bearer <admin_token>`
- **Request Body**:
  ```json
  {
    "name": "Footwear & Shoes",
    "description": "All athletic, formal, and lifestyle footwear"
  }
  ```
- **Responses**:
  - `200 OK`:
    ```json
    {
      "success": true,
      "message": "Category updated successfully",
      "data": {
        "_id": "651b33333333333333333333",
        "name": "Footwear & Shoes",
        "description": "All athletic, formal, and lifestyle footwear",
        "updatedAt": "2026-10-02T12:15:00.000Z"
      }
    }
    ```
  - `404 Not Found`: Category ID does not exist.

---

### 3.4 Delete Category
Delete an existing category.

- **Route**: `DELETE /api/categories/:id`
- **Access**: Private (Admin Only)
- **Headers**: `Authorization: Bearer <admin_token>`
- **Responses**:
  - `200 OK`:
    ```json
    {
      "success": true,
      "message": "Category deleted successfully"
    }
    ```
  - `400 Bad Request`: Cannot delete category while products are assigned to it.
  - `404 Not Found`: Category not found.

---

## 4. Product Endpoints

### 4.1 Get All Products (Filter & Search)
Retrieve products with optional filtering by category and search keyword.

- **Route**: `GET /api/products`
- **Access**: Public
- **Query Parameters**:
  - `category` (optional): Category ID or slug
  - `search` (optional): Search keyword (matches name or description)
- **Example**: `GET /api/products?category=651b11111111111111111111&search=phone`
- **Responses**:
  - `200 OK`:
    ```json
    {
      "success": true,
      "count": 1,
      "data": [
        {
          "_id": "651c11111111111111111111",
          "name": "Smart Phone Pro",
          "description": "High resolution AMOLED screen with 128GB storage.",
          "price": 699.99,
          "image": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
          "category": {
            "_id": "651b11111111111111111111",
            "name": "Electronics"
          },
          "stock": 15,
          "createdAt": "2026-10-01T12:00:00.000Z"
        }
      ]
    }
    ```

---

### 4.2 Get Single Product by ID
Fetch complete details for a single product.

- **Route**: `GET /api/products/:id`
- **Access**: Public
- **Responses**:
  - `200 OK`:
    ```json
    {
      "success": true,
      "data": {
        "_id": "651c11111111111111111111",
        "name": "Smart Phone Pro",
        "description": "High resolution AMOLED screen with 128GB storage.",
        "price": 699.99,
        "image": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
        "category": {
          "_id": "651b11111111111111111111",
          "name": "Electronics"
        },
        "stock": 15
      }
    }
    ```
  - `404 Not Found`: Product not found.

---

### 4.3 Create Product
Add a new product with stock, image, and category reference.

- **Route**: `POST /api/products`
- **Access**: Private (Admin Only)
- **Headers**: `Authorization: Bearer <admin_token>`
- **Request Body**:
  ```json
  {
    "name": "Wireless Noise Cancelling Headphones",
    "description": "Premium over-ear headphones with 30-hour battery life and deep bass.",
    "price": 149.99,
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    "category": "651b11111111111111111111",
    "stock": 25
  }
  ```
- **Responses**:
  - `201 Created`:
    ```json
    {
      "success": true,
      "message": "Product created successfully",
      "data": {
        "_id": "651c22222222222222222222",
        "name": "Wireless Noise Cancelling Headphones",
        "price": 149.99,
        "stock": 25,
        "category": "651b11111111111111111111"
      }
    }
    ```
  - `400 Bad Request`: Validation failure (negative price, negative stock, invalid category ID).

---

### 4.4 Update Product
Modify product details, price, or inventory count.

- **Route**: `PUT /api/products/:id`
- **Access**: Private (Admin Only)
- **Headers**: `Authorization: Bearer <admin_token>`
- **Request Body**:
  ```json
  {
    "name": "Wireless Noise Cancelling Headphones v2",
    "price": 139.99,
    "stock": 30
  }
  ```
- **Responses**:
  - `200 OK`: Returns updated product object.
  - `404 Not Found`: Product not found.

---

### 4.5 Delete Product
Remove a product from the database.

- **Route**: `DELETE /api/products/:id`
- **Access**: Private (Admin Only)
- **Headers**: `Authorization: Bearer <admin_token>`
- **Responses**:
  - `200 OK`:
    ```json
    {
      "success": true,
      "message": "Product deleted successfully"
    }
    ```
  - `404 Not Found`: Product not found.

---

## 5. Order Endpoints

### 5.1 Create Order (Checkout)
Place a new order via Cash on Delivery. Prices are re-fetched and validated server-side.

- **Route**: `POST /api/orders`
- **Access**: Private (Customer)
- **Headers**: `Authorization: Bearer <customer_token>`
- **Request Body**:
  ```json
  {
    "shippingAddress": {
      "name": "Alex Johnson",
      "phone": "9876543210",
      "address": "42 High Street, Apt 3B",
      "city": "Metropolis",
      "pincode": "100001"
    },
    "items": [
      {
        "product": "651c11111111111111111111",
        "quantity": 1
      },
      {
        "product": "651c22222222222222222222",
        "quantity": 2
      }
    ]
  }
  ```
- **Responses**:
  - `201 Created`:
    ```json
    {
      "success": true,
      "message": "Order placed successfully via Cash on Delivery",
      "data": {
        "_id": "651d11111111111111111111",
        "user": "651a2b3c4d5e6f7a8b9c0d1e",
        "products": [
          {
            "product": "651c11111111111111111111",
            "name": "Smart Phone Pro",
            "price": 699.99,
            "quantity": 1
          },
          {
            "product": "651c22222222222222222222",
            "name": "Wireless Noise Cancelling Headphones",
            "price": 149.99,
            "quantity": 2
          }
        ],
        "totalAmount": 999.97,
        "shippingAddress": {
          "name": "Alex Johnson",
          "phone": "9876543210",
          "address": "42 High Street, Apt 3B",
          "city": "Metropolis",
          "pincode": "100001"
        },
        "paymentMethod": "Cash on Delivery",
        "status": "Pending",
        "createdAt": "2026-10-02T12:30:00.000Z"
      }
    }
    ```
  - `400 Bad Request`: Insufficient product stock or invalid shipping address.

---

### 5.2 Get Customer's Own Orders
Fetch all historical orders placed by the authenticated customer.

- **Route**: `GET /api/orders/my-orders`
- **Access**: Private (Customer)
- **Headers**: `Authorization: Bearer <customer_token>`
- **Responses**:
  - `200 OK`:
    ```json
    {
      "success": true,
      "count": 1,
      "data": [
        {
          "_id": "651d11111111111111111111",
          "products": [ ... ],
          "totalAmount": 999.97,
          "status": "Pending",
          "paymentMethod": "Cash on Delivery",
          "createdAt": "2026-10-02T12:30:00.000Z"
        }
      ]
    }
    ```

---

### 5.3 Get All Orders (Admin)
Retrieve all orders across all customers with full user details.

- **Route**: `GET /api/admin/orders`
- **Access**: Private (Admin Only)
- **Headers**: `Authorization: Bearer <admin_token>`
- **Responses**:
  - `200 OK`:
    ```json
    {
      "success": true,
      "count": 1,
      "data": [
        {
          "_id": "651d11111111111111111111",
          "user": {
            "_id": "651a2b3c4d5e6f7a8b9c0d1e",
            "name": "Alex Johnson",
            "email": "alex@example.com"
          },
          "products": [ ... ],
          "totalAmount": 999.97,
          "shippingAddress": { ... },
          "status": "Pending",
          "createdAt": "2026-10-02T12:30:00.000Z"
        }
      ]
    }
    ```

---

### 5.4 Update Order Status (Admin)
Transition an order through its lifecycle.

- **Route**: `PATCH /api/admin/orders/:id/status`
- **Access**: Private (Admin Only)
- **Headers**: `Authorization: Bearer <admin_token>`
- **Request Body**:
  ```json
  {
    "status": "Confirmed"
  }
  ```
  *(Allowed values: `"Pending"`, `"Confirmed"`, `"Shipped"`, `"Delivered"`, `"Cancelled"`)*
- **Responses**:
  - `200 OK`:
    ```json
    {
      "success": true,
      "message": "Order status updated successfully",
      "data": {
        "_id": "651d11111111111111111111",
        "status": "Confirmed",
        "updatedAt": "2026-10-02T12:45:00.000Z"
      }
    }
    ```
  - `400 Bad Request`: Invalid status value.
  - `404 Not Found`: Order ID not found.
