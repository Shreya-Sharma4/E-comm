# PowerShell script to create GitHub Issues using gh CLI or GitHub REST API
param (
    [string]$Token = $env:GH_TOKEN
)

$tasks = @(
    @{ Title = "[TASK-01] Express Server, MongoDB Connection & Error Middleware"; Labels = @("backend", "setup"); Body = "Express setup, MongoDB connection with Mongoose, 404 & error handlers. See docs/TASK_ASSIGNMENTS.md." },
    @{ Title = "[TASK-02] User Model, JWT Authentication & Role Middlewares"; Labels = @("backend", "auth"); Body = "User schema, bcrypt hashing, /api/auth/register, /api/auth/login, auth & admin middlewares." },
    @{ Title = "[TASK-03] Category Model & CRUD REST Endpoints"; Labels = @("backend", "api"); Body = "Category schema, public GET, admin POST/PUT/DELETE. See docs/TASK_ASSIGNMENTS.md." },
    @{ Title = "[TASK-04] Product Model, CRUD Endpoints & Search/Filter API"; Labels = @("backend", "api"); Body = "Product schema, search & category filtering, positive price/stock validation." },
    @{ Title = "[TASK-05] Order Model, Stock/Price Validation & COD API"; Labels = @("backend", "orders"); Body = "Order schema, COD flow, server-side price check, atomic stock reduction, status updates." },
    @{ Title = "[TASK-06] Database Seeder Script"; Labels = @("backend", "database"); Body = "utils/seeder.js for admin, customer, default categories and products." },
    @{ Title = "[TASK-07] Vite + React Setup & Tailwind Design Tokens"; Labels = @("frontend", "setup"); Body = "Scaffold Vite React in client/, configure Tailwind colors, MainLayout & Footer." },
    @{ Title = "[TASK-08] AuthContext, Token Storage & Protected Routes"; Labels = @("frontend", "auth"); Body = "AuthContext, axios interceptors, login/register forms, user & admin protected routes." },
    @{ Title = "[TASK-09] Storefront: Navbar, Responsive Grid & Search/Filter"; Labels = @("frontend", "ui"); Body = "Navbar with search, category pills, responsive product cards with stock badges." },
    @{ Title = "[TASK-10] Product Details Page & Shopping Cart Logic"; Labels = @("frontend", "cart"); Body = "CartContext, stock-bounded quantity logic, ProductDetails.jsx and Cart.jsx." },
    @{ Title = "[TASK-11] COD Checkout Form, Order Creation & My Orders Page"; Labels = @("frontend", "orders"); Body = "Checkout.jsx with shipping address, COD order placement, MyOrders.jsx view." },
    @{ Title = "[TASK-12] Admin Dashboard Shell & Sidebar"; Labels = @("frontend", "admin"); Body = "AdminLayout.jsx with responsive sidebar, stats overview cards, admin route guard." },
    @{ Title = "[TASK-13] Admin Category & Product Management UI"; Labels = @("frontend", "admin"); Body = "AdminCategories.jsx and AdminProducts.jsx tables with add/edit modals and delete dialogs." },
    @{ Title = "[TASK-14] Admin Order Fulfillment Panel & Status Workflow"; Labels = @("frontend", "admin"); Body = "AdminOrders.jsx table, order details modal, and order status transition dropdown." }
)

Write-Host "Creating GitHub Issues for Shreya-Sharma4/E-comm..." -ForegroundColor Cyan

foreach ($t in $tasks) {
    if (Get-Command gh -ErrorAction SilentlyContinue) {
        Write-Host "Creating: $($t.Title)" -ForegroundColor Yellow
        gh issue create --repo "Shreya-Sharma4/E-comm" --title $t.Title --body $t.Body --label ($t.Labels -join ",")
    } else {
        Write-Host "gh CLI not detected. Run 'node scripts/create_github_issues.js <TOKEN>' instead." -ForegroundColor Red
        break
    }
}
