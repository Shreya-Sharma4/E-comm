import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Package, Tags, ShoppingBag, Sparkles } from 'lucide-react';

export const Home = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between">
      {/* Top Bar */}
      <header className="px-8 py-6 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center font-black">
            M
          </div>
          <span className="font-bold text-lg tracking-tight">MiniShop MERN</span>
        </div>
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-primary-600 hover:bg-primary-500 rounded-xl transition-all shadow-md shadow-primary-900/50"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Open Admin Dashboard</span>
        </Link>
      </header>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-6 py-20 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-medium text-primary-300">
          <Sparkles className="w-3.5 h-3.5 text-primary-400" />
          <span>MERN Mini E-Commerce Demo</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
          Admin Dashboard & Store Management Portal
        </h1>

        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Manage product inventory, create custom category filters, and regulate real-time order lifecycle statuses via Cash on Delivery fulfillment.
        </p>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-primary-600 hover:bg-primary-500 text-white font-semibold text-sm transition-all shadow-xl shadow-primary-900/40"
          >
            <span>Launch Admin Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-all border border-slate-700"
          >
            <Package className="w-4 h-4 text-primary-400" />
            <span>Manage Products</span>
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-12 text-left">
          <Link
            to="/admin/categories"
            className="p-6 bg-slate-800/60 rounded-2xl border border-slate-700/80 hover:border-primary-500/50 transition-all group"
          >
            <div className="w-10 h-10 bg-amber-500/10 text-amber-400 rounded-xl flex items-center justify-center mb-4">
              <Tags className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base group-hover:text-primary-400 transition-colors">
              Category CRUD
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Create and maintain product category filters with duplicate prevention.
            </p>
          </Link>

          <Link
            to="/admin/products"
            className="p-6 bg-slate-800/60 rounded-2xl border border-slate-700/80 hover:border-primary-500/50 transition-all group"
          >
            <div className="w-10 h-10 bg-sky-500/10 text-sky-400 rounded-xl flex items-center justify-center mb-4">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base group-hover:text-primary-400 transition-colors">
              Product Inventory
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Live stock boundaries, image previews, and price validation.
            </p>
          </Link>

          <Link
            to="/admin/orders"
            className="p-6 bg-slate-800/60 rounded-2xl border border-slate-700/80 hover:border-primary-500/50 transition-all group"
          >
            <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center mb-4">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base group-hover:text-primary-400 transition-colors">
              Order Fulfillment
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Advance order statuses: Pending ➔ Confirmed ➔ Shipped ➔ Delivered.
            </p>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-8 py-6 text-center text-xs text-slate-500 border-t border-slate-800">
        Mini E-Commerce Demo &bull; MERN Stack Architecture
      </footer>
    </div>
  );
};
