/**
 * Automation script to batch-create Chunked Epic GitHub Issues
 * with randomly assigned collaborators for Shreya-Sharma4/E-comm.
 * 
 * Usage:
 *   node scripts/create_chunked_issues.js <GITHUB_TOKEN> [collaborator1] [collaborator2] ...
 * 
 * Example:
 *   node scripts/create_chunked_issues.js ghp_xxx Shreya-Sharma4 kedar1330
 */

const https = require('https');

const REPO_OWNER = 'Shreya-Sharma4';
const REPO_NAME = 'E-comm';

const TOKEN = process.argv[2] || process.env.GH_TOKEN;
const rawCollaborators = process.argv.slice(3);
const collaborators = rawCollaborators.length > 0 
  ? rawCollaborators.map(c => c.replace(/^@/, '')) 
  : ['Shreya-Sharma4', 'kedar1330'];

if (!TOKEN) {
  console.error('\x1b[31mError: GitHub Personal Access Token is required.\x1b[0m');
  console.log('\nUsage:');
  console.log('  node scripts/create_chunked_issues.js <YOUR_GITHUB_TOKEN> [collab1] [collab2]');
  process.exit(1);
}

// Shuffle collaborators randomly
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const shuffledCollabs = shuffle(collaborators);

const chunks = [
  {
    title: '[CHUNK-A] 🔐 Authentication & Core System Architecture',
    labels: ['chunk', 'backend', 'frontend', 'auth'],
    tasks: ['TASK-01', 'TASK-02', 'TASK-07', 'TASK-08'],
    body: `## 📦 Chunk A Overview
**Focus**: Establish backend infrastructure, MongoDB connection, Vite client setup, and end-to-end JWT authentication.

### 📋 Included Tasks
- [ ] **TASK-01**: Express Server, MongoDB Connection & Error Middleware (\`server/server.js\`)
- [ ] **TASK-02**: User Model, bcrypt Password Hashing, JWT Auth Endpoints & Middlewares
- [ ] **TASK-07**: Vite + React Setup, Tailwind Config, Colors & Base Layouts (\`client/\`)
- [ ] **TASK-08**: AuthContext, Token Storage, User/Admin Route Guards, Login & Register UI

### 🎯 Acceptance Criteria
1. Server boots on port 5000 and connects to MongoDB.
2. Register and Login endpoints return signed JWTs.
3. Protected routes block unauthenticated visitors (401/403).
4. Storefront has responsive base shell.

📖 **Full Spec**: See \`docs/TASK_ASSIGNMENTS.md#chunk-a\``
  },
  {
    title: '[CHUNK-B] 🛍 Categories, Products & Public Storefront Catalog',
    labels: ['chunk', 'backend', 'frontend', 'catalog'],
    tasks: ['TASK-03', 'TASK-04', 'TASK-09'],
    body: `## 📦 Chunk B Overview
**Focus**: Category & Product management APIs and a dynamic, responsive public storefront.

### 📋 Included Tasks
- [ ] **TASK-03**: Category Model & CRUD Endpoints (\`/api/categories\`)
- [ ] **TASK-04**: Product Model, CRUD Endpoints, Search & Category Filter Query API (\`/api/products\`)
- [ ] **TASK-09**: Public Storefront: Navbar with search bar, category pills filter, responsive product card grid

### 🎯 Acceptance Criteria
1. Categories can be listed publicly and created/edited by Admin.
2. Products support real-time keyword search and category query params (\`?category=...&search=...\`).
3. Out-of-stock products display red badge and disabled "Add to Cart" button.

📖 **Full Spec**: See \`docs/TASK_ASSIGNMENTS.md#chunk-b\``
  },
  {
    title: '[CHUNK-C] 🛒 Shopping Cart & Cash on Delivery Checkout Flow',
    labels: ['chunk', 'backend', 'frontend', 'orders'],
    tasks: ['TASK-05', 'TASK-10', 'TASK-11'],
    body: `## 📦 Chunk C Overview
**Focus**: Cart state management, inventory stock bounds, and server-validated Cash on Delivery orders.

### 📋 Included Tasks
- [ ] **TASK-05**: Order Model, Server-side Stock/Price Validation & Order Placement API (\`/api/orders\`)
- [ ] **TASK-10**: Product Details Page, CartContext with Stock Bounds, and Shopping Cart View (\`/cart\`)
- [ ] **TASK-11**: Cash on Delivery Checkout Form, Cart Clearance, and "My Orders" Customer History

### 🎯 Acceptance Criteria
1. Cart quantity cannot exceed available stock.
2. Backend re-queries MongoDB for true prices (never trusts client price).
3. Stock is atomically decremented upon order placement.
4. User can view order history with status badges in "My Orders".

📖 **Full Spec**: See \`docs/TASK_ASSIGNMENTS.md#chunk-c\``
  },
  {
    title: '[CHUNK-D] 📊 Admin Dashboard, Database Seeder & Order Lifecycle',
    labels: ['chunk', 'backend', 'frontend', 'admin'],
    tasks: ['TASK-06', 'TASK-12', 'TASK-13', 'TASK-14'],
    body: `## 📦 Chunk D Overview
**Focus**: Administrative management dashboard, sample catalog seeder, and order status fulfillment.

### 📋 Included Tasks
- [ ] **TASK-06**: Database Seeder Script (\`server/utils/seeder.js\`) for admin, customer, categories, & products
- [ ] **TASK-12**: Admin Dashboard Layout, Sidebar Navigation, Summary Metrics & Admin Route Guard
- [ ] **TASK-13**: Admin Category & Product Management Tables with Modals & Delete Confirmation
- [ ] **TASK-14**: Admin Order Fulfillment Panel & Status Transition Dropdown (Pending ➔ Delivered)

### 🎯 Acceptance Criteria
1. \`npm run seed\` sets up initial demo data cleanly.
2. Admin dashboard protected from non-admin accounts.
3. Admin can view all customer orders and patch status in real time.

📖 **Full Spec**: See \`docs/TASK_ASSIGNMENTS.md#chunk-d\``
  }
];

function createIssue(chunk, assignee) {
  return new Promise((resolve, reject) => {
    const payload = {
      title: chunk.title,
      body: `**Assigned Collaborator**: @${assignee}\n\n` + chunk.body,
      labels: chunk.labels,
      assignees: [assignee]
    };

    const postData = JSON.stringify(payload);

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
      res.on('data', (c) => { data += c; });
      res.on('end', () => {
        if (res.statusCode === 201) {
          resolve(JSON.parse(data));
        } else {
          // If assignee fails (e.g. not a collaborator on github yet), retry without assignee
          if (res.statusCode === 422 && payload.assignees) {
            delete payload.assignees;
            const fallbackData = JSON.stringify(payload);
            options.headers['Content-Length'] = Buffer.byteLength(fallbackData);
            const retryReq = https.request(options, (retryRes) => {
              let rData = '';
              retryRes.on('data', (c) => { rData += c; });
              retryRes.on('end', () => {
                if (retryRes.statusCode === 201) resolve(JSON.parse(rData));
                else reject(new Error(`Status ${retryRes.statusCode}: ${rData}`));
              });
            });
            retryReq.on('error', (e) => reject(e));
            retryReq.write(fallbackData);
            retryReq.end();
          } else {
            reject(new Error(`Status ${res.statusCode}: ${data}`));
          }
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.write(postData);
    req.end();
  });
}

async function run() {
  console.log(`\x1b[36m🎲 Randomly assigning ${chunks.length} task chunks to collaborators: ${shuffledCollabs.map(c => '@' + c).join(', ')}...\x1b[0m\n`);

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const assignee = shuffledCollabs[i % shuffledCollabs.length];
    try {
      const issue = await createIssue(chunk, assignee);
      console.log(`\x1b[32m✔ Created Issue #${issue.number}: ${chunk.title}\x1b[0m`);
      console.log(`   └─ Assigned: @${assignee} | URL: ${issue.html_url}`);
    } catch (err) {
      console.error(`\x1b[31m✖ Failed to create ${chunk.title}: ${err.message}\x1b[0m`);
    }
  }
  console.log('\n\x1b[32m✨ Done! All chunked tasks have been randomly assigned via GitHub Issues.\x1b[0m');
}

run();
