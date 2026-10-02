import React from 'react';
import { ShoppingBag, Truck, ShieldCheck, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20">
      {/* Trust Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-b border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 text-sm">Cash on Delivery</h4>
              <p className="text-xs text-slate-500">Pay conveniently in cash upon package arrival</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 text-sm">Verified Authentic Quality</h4>
              <p className="text-xs text-slate-500">Curated products directly from certified makers</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 text-sm">Real-time Order Updates</h4>
              <p className="text-xs text-slate-500">Track fulfillment status from pending to delivered</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Meta & Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center text-white">
            <ShoppingBag className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-slate-700">Mini E-Commerce Demo</span>
          <span>© 2026 MERN Stack Project</span>
        </div>

        <div className="flex items-center gap-6">
          <Link to="/products" className="hover:text-indigo-600 transition-colors">Products</Link>
          <Link to="/cart" className="hover:text-indigo-600 transition-colors">Cart</Link>
          <Link to="/my-orders" className="hover:text-indigo-600 transition-colors">My Orders</Link>
          <Link to="/admin" className="hover:text-indigo-600 transition-colors">Admin Portal</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
