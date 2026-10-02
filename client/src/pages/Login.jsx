import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Toast from '../components/common/Toast';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/products';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setToast({ message: 'Please enter both email and password', type: 'warning' });
      return;
    }

    setSubmitting(true);
    try {
      // Try hitting the real backend API
      const res = await api.post('/auth/login', formData);
      if (res.data?.data) {
        login(res.data.data.user, res.data.data.token);
        navigate(from, { replace: true });
        return;
      }
    } catch (err) {
      console.warn('Backend login unavailable or credentials rejected, checking fallback demo accounts:', err.message);

      // Graceful local demo fallback
      if (formData.email === 'admin@ecommerce.com' && formData.password === 'admin123') {
        login(
          { _id: 'admin_001', name: 'Store Administrator', email: 'admin@ecommerce.com', role: 'admin' },
          'mock_admin_jwt_token'
        );
        navigate('/admin', { replace: true });
        return;
      } else if (formData.email === 'customer@ecommerce.com' && formData.password === 'customer123') {
        login(
          { _id: 'cust_001', name: 'Alex Customer', email: 'customer@ecommerce.com', role: 'customer' },
          'mock_customer_jwt_token'
        );
        navigate(from, { replace: true });
        return;
      }

      setToast({
        message: err.response?.data?.message || 'Invalid email or password. Use demo buttons below.',
        type: 'danger',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickFill = (type) => {
    if (type === 'admin') {
      setFormData({ email: 'admin@ecommerce.com', password: 'admin123' });
    } else {
      setFormData({ email: 'customer@ecommerce.com', password: 'customer123' });
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 sm:py-12 animate-fadeIn">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-indigo-100">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Welcome Back</h1>
          <p className="text-xs text-slate-500">Sign in to your MiniShop account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-4 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 active:scale-[0.99] disabled:opacity-50 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
          >
            <span>{submitting ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Fill Buttons */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
            Quick Demo Autofill
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('customer')}
              className="py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5 text-slate-500" /> Customer
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('admin')}
              className="py-2 px-3 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" /> Admin
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 pt-2">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-indigo-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
