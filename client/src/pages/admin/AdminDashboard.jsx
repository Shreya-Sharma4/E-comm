import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Tags,
  Package,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Plus,
  Clock,
  CheckCircle,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { adminService } from '../../services/adminService';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    categories: 0,
    products: 0,
    orders: 0,
    revenue: 0,
    outOfStock: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [cats, prods, ords] = await Promise.all([
        adminService.getCategories(),
        adminService.getProducts(),
        adminService.getOrders(),
      ]);

      const totalRevenue = ords.reduce(
        (sum, o) => (o.status !== 'Cancelled' ? sum + (o.totalAmount || 0) : sum),
        0
      );

      const outOfStockCount = prods.filter((p) => p.stock === 0).length;

      setStats({
        categories: cats.length,
        products: prods.length,
        orders: ords.length,
        revenue: totalRevenue,
        outOfStock: outOfStockCount,
      });

      setRecentOrders(ords.slice(0, 5));
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const getStatusBadge = (status) => {
    const config = {
      Pending: 'bg-amber-100 text-amber-800 border-amber-200',
      Confirmed: 'bg-sky-100 text-sky-800 border-sky-200',
      Shipped: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      Delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      Cancelled: 'bg-rose-100 text-rose-800 border-rose-200',
    };
    return (
      <span
        className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
          config[status] || 'bg-slate-100 text-slate-700'
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Overview</h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time catalog metrics and customer order tracking.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              adminService.resetDemoData();
              loadDashboardData();
            }}
            className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors shadow-sm"
            title="Reset to sample demo data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-all shadow-md shadow-primary-200"
          >
            <Plus className="w-4 h-4" />
            <span>New Product</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Revenue
            </span>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold text-slate-900">
              ${stats.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <span className="block text-xs text-slate-500 mt-1">Cash on Delivery settled</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Customer Orders
            </span>
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold text-slate-900">{stats.orders}</span>
            <span className="block text-xs text-slate-500 mt-1">
              Active order lifecycles
            </span>
          </div>
        </div>

        {/* Total Products */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Catalog Items
            </span>
            <div className="p-2.5 bg-sky-50 text-sky-600 rounded-xl">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{stats.products}</span>
            {stats.outOfStock > 0 && (
              <span className="text-xs font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                {stats.outOfStock} out of stock
              </span>
            )}
          </div>
          <span className="block text-xs text-slate-500 mt-1">Across all categories</span>
        </div>

        {/* Categories */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Categories
            </span>
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
              <Tags className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold text-slate-900">{stats.categories}</span>
            <span className="block text-xs text-slate-500 mt-1">Storefront filter pills</span>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Customer Orders</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Latest transactions placed via Cash on Delivery
            </p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-slate-400">Loading orders...</div>
        ) : recentOrders.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-400">No orders placed yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3">Order ID</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Items</th>
                  <th className="px-6 py-3">Total</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-800">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {order.shippingAddress?.name || order.user?.name || 'Customer'}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {order.products?.length || 1} item(s)
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      ${(order.totalAmount || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to="/admin/orders"
                        className="text-xs font-semibold text-primary-600 hover:text-primary-700"
                      >
                        Manage &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
