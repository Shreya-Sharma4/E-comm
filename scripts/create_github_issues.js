/**
 * Automation script to batch-create GitHub Issues for all 14 project tasks.
 * 
 * Usage:
 *   node scripts/create_github_issues.js <YOUR_GITHUB_PERSONAL_ACCESS_TOKEN>
 * 
 * Or set environment variable:
 *   $env:GH_TOKEN="your_token"
 *   node scripts/create_github_issues.js
 */

const https = require('https');

const REPO_OWNER = 'Shreya-Sharma4';
const REPO_NAME = 'E-comm';
const TOKEN = process.argv[2] || process.env.GH_TOKEN;

if (!TOKEN) {
  console.error('\x1b[31mError: GitHub Personal Access Token is required.\x1b[0m');
  console.log('\nUsage:');
  console.log('  node scripts/create_github_issues.js <YOUR_GITHUB_TOKEN>');
  console.log('Or set GH_TOKEN environment variable.\n');
  process.exit(1);
}

const tasks = [
  {
    title: '[TASK-01] Express Server, MongoDB Connection & Error Middleware',
    labels: ['backend', 'setup'],
    body: `### 📋 Scope
- Setup \`server.js\` with Express, CORS, body parser.
- Connect to MongoDB via Mongoose.
- Centralized 404 handler & global error middleware.
- Configure \`.env.example\`.

### 🎯 Acceptance Criteria
- [ ] Server boots on port 5000 cleanly.
- [ ] MongoDB connection logged.
- [ ] Errors return standardized JSON structure.
- Reference: \`docs/TASK_ASSIGNMENTS.md\` (TASK-01)`
  },
  {
    title: '[TASK-02] User Model, JWT Authentication & Role Middlewares',
    labels: ['backend', 'auth'],
    body: `### 📋 Scope
- User Mongoose schema (name, email, password, role).
- bcrypt password hashing pre-save.
- \`POST /api/auth/register\` & \`POST /api/auth/login\`.
- \`authMiddleware\` and \`adminMiddleware\`.

### 🎯 Acceptance Criteria
- [ ] Password hashed with bcrypt (salt rounds 10).
- [ ] JWT tokens issued on register/login.
- [ ] Admin routes guarded and reject non-admin users with 403.
- Reference: \`docs/TASK_ASSIGNMENTS.md\` (TASK-02)`
  },
  {
    title: '[TASK-03] Category Model & CRUD REST Endpoints',
    labels: ['backend', 'api'],
    body: `### 📋 Scope
- Category Mongoose schema (name, description).
- Public \`GET /api/categories\`.
- Admin-only \`POST\`, \`PUT\`, \`DELETE /api/categories/:id\`.

### 🎯 Acceptance Criteria
- [ ] Duplicate category names rejected with 400.
- [ ] Unauthorized users cannot mutate categories.
- Reference: \`docs/TASK_ASSIGNMENTS.md\` (TASK-03)`
  },
  {
    title: '[TASK-04] Product Model, CRUD Endpoints & Search/Filter API',
    labels: ['backend', 'api'],
    body: `### 📋 Scope
- Product Mongoose schema (name, description, price, image, category, stock).
- \`GET /api/products?category=...&search=...\`.
- \`GET /api/products/:id\` with category populated.
- Admin-only CRUD for products.

### 🎯 Acceptance Criteria
- [ ] Stock cannot be negative; price must be positive.
- [ ] Search queries filter title and description accurately.
- Reference: \`docs/TASK_ASSIGNMENTS.md\` (TASK-04)`
  },
  {
    title: '[TASK-05] Order Model, Stock/Price Validation & COD API',
    labels: ['backend', 'orders'],
    body: `### 📋 Scope
- Order schema with shippingAddress, items, totalAmount, status.
- \`POST /api/orders\` with server-side price check and atomic stock decrement.
- \`GET /api/orders/my-orders\` & \`GET /api/admin/orders\`.
- \`PATCH /api/admin/orders/:id/status\`.

### 🎯 Acceptance Criteria
- [ ] Never trusts client-side price; fetches fresh from DB.
- [ ] Prevents orders if stock < requested quantity.
- [ ] Decrements stock atomically upon order creation.
- Reference: \`docs/TASK_ASSIGNMENTS.md\` (TASK-05)`
  },
  {
    title: '[TASK-06] Database Seeder Script',
    labels: ['backend', 'database'],
    body: `### 📋 Scope
- \`server/utils/seeder.js\` to clear and populate database.
- Default admin (\`admin@ecommerce.com\` / \`admin123\`).
- Default customer (\`customer@ecommerce.com\` / \`customer123\`).
- Default categories (Electronics, Fashion, Shoes) and products with stock.

### 🎯 Acceptance Criteria
- [ ] Running \`npm run seed\` executes cleanly.
- Reference: \`docs/TASK_ASSIGNMENTS.md\` (TASK-06)`
  },
  {
    title: '[TASK-07] Vite + React Setup & Tailwind Design Tokens',
    labels: ['frontend', 'setup'],
    body: `### 📋 Scope
- Initialize Vite React project in \`client/\`.
- Configure Tailwind CSS color palette, fonts, breakpoints.
- Build MainLayout and Footer components.

### 🎯 Acceptance Criteria
- [ ] Vite dev server runs cleanly on port 5173.
- [ ] Tailwind styling renders properly.
- Reference: \`docs/TASK_ASSIGNMENTS.md\` (TASK-07)`
  },
  {
    title: '[TASK-08] AuthContext, Token Storage & Protected Routes',
    labels: ['frontend', 'auth'],
    body: `### 📋 Scope
- Setup \`api/axios.js\` with Bearer token interceptor.
- Create \`AuthContext.jsx\` with login/register/logout.
- Build \`Login.jsx\` and \`Register.jsx\` with toast alerts.
- Build protected route wrappers for customer and admin.

### 🎯 Acceptance Criteria
- [ ] Auth state persists across refreshes via localStorage.
- [ ] Redirects unauthorized users to \`/login\`.
- Reference: \`docs/TASK_ASSIGNMENTS.md\` (TASK-08)`
  },
  {
    title: '[TASK-09] Storefront: Navbar, Responsive Grid & Search/Filter',
    labels: ['frontend', 'ui'],
    body: `### 📋 Scope
- Navbar with logo, live search, cart counter, auth dropdown.
- Category filter pills (\`All\`, \`Electronics\`, \`Fashion\`, \`Shoes\`).
- Responsive product card grid with stock badges and "Add to Cart".

### 🎯 Acceptance Criteria
- [ ] Category filter and keyword search filter grid in real-time.
- [ ] Out of stock badge disables "Add to Cart" button.
- Reference: \`docs/TASK_ASSIGNMENTS.md\` (TASK-09)`
  },
  {
    title: '[TASK-10] Product Details Page & Shopping Cart Logic',
    labels: ['frontend', 'cart'],
    body: `### 📋 Scope
- \`CartContext.jsx\` with stock-bounded quantity modifier.
- \`ProductDetails.jsx\` page with full image and description.
- \`Cart.jsx\` page with line items, subtotal, and checkout button.

### 🎯 Acceptance Criteria
- [ ] Prevents adding more than available stock to cart.
- [ ] Real-time total calculation.
- Reference: \`docs/TASK_ASSIGNMENTS.md\` (TASK-10)`
  },
  {
    title: '[TASK-11] COD Checkout Form, Order Creation & My Orders Page',
    labels: ['frontend', 'orders'],
    body: `### 📋 Scope
- \`Checkout.jsx\` with shipping address fields (Name, Phone, Address, City, Pincode).
- Payment method locked to "Cash on Delivery".
- Clear cart on success and redirect to \`MyOrders.jsx\`.

### 🎯 Acceptance Criteria
- [ ] Validates all shipping address fields.
- [ ] Order saved and visible in order history.
- Reference: \`docs/TASK_ASSIGNMENTS.md\` (TASK-11)`
  },
  {
    title: '[TASK-12] Admin Dashboard Shell & Sidebar',
    labels: ['frontend', 'admin'],
    body: `### 📋 Scope
- \`AdminLayout.jsx\` with responsive sidebar navigation.
- Key metrics summary cards (Total Categories, Products, Orders).
- Guard with admin role protection.

### 🎯 Acceptance Criteria
- [ ] Non-admin redirected away with warning.
- [ ] Responsive on mobile and desktop.
- Reference: \`docs/TASK_ASSIGNMENTS.md\` (TASK-12)`
  },
  {
    title: '[TASK-13] Admin Category & Product Management UI',
    labels: ['frontend', 'admin'],
    body: `### 📋 Scope
- \`AdminCategories.jsx\` table + create/edit modal + delete dialog.
- \`AdminProducts.jsx\` table with thumbnails, stock badges, edit modal.
- Input validation for positive prices and non-negative stock.

### 🎯 Acceptance Criteria
- [ ] Immediate reflection of created/updated products in storefront.
- [ ] Delete confirmation prevents accidental deletions.
- Reference: \`docs/TASK_ASSIGNMENTS.md\` (TASK-13)`
  },
  {
    title: '[TASK-14] Admin Order Fulfillment Panel & Status Workflow',
    labels: ['frontend', 'admin'],
    body: `### 📋 Scope
- \`AdminOrders.jsx\` displaying table of customer orders.
- Order details view (customer address & line items).
- Order status dropdown (\`Pending\`, \`Confirmed\`, \`Shipped\`, \`Delivered\`, \`Cancelled\`).

### 🎯 Acceptance Criteria
- [ ] Status updates trigger PATCH request and update UI badge instantly.
- Reference: \`docs/TASK_ASSIGNMENTS.md\` (TASK-14)`
  }
];

function createIssue(task) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      title: task.title,
      body: task.body,
      labels: task.labels
    });

    const options = {
      hostname: 'api.github.com',
      port: 443,
      path: `/repos/${REPO_OWNER}/${REPO_NAME}/issues`,
      method: 'POST',
      headers: {
        'User-Agent': 'Node-GitHub-Issue-Creator',
        'Authorization': `Bearer ${TOKEN}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 201) {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } else {
          reject(new Error(`Status ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.write(postData);
    req.end();
  });
}

async function run() {
  console.log(`\x1b[36m🚀 Creating ${tasks.length} GitHub Issues for ${REPO_OWNER}/${REPO_NAME}...\x1b[0m\n`);
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    try {
      const issue = await createIssue(task);
      console.log(`\x1b[32m✔ Created Issue #${issue.number}: ${task.title}\x1b[0m (URL: ${issue.html_url})`);
    } catch (err) {
      console.error(`\x1b[31m✖ Failed to create ${task.title}: ${err.message}\x1b[0m`);
    }
  }
  console.log('\n\x1b[32m✨ Done creating task issues!\x1b[0m');
}

run();
