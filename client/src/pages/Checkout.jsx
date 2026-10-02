import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Truck, CheckCircle2, ShieldAlert, ArrowLeft, Loader2, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/orderService';
import Toast from '../components/common/Toast';

const Checkout = () => {
  const { cartItems, totalPrice, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800">Your cart is empty</h2>
        <p className="text-sm text-slate-500">Please add products to your cart before proceeding to checkout.</p>
        <Link
          to="/products"
          className="inline-block px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone.trim())) {
      errs.phone = 'Phone number must be exactly 10 digits';
    }
    if (!formData.address.trim()) errs.address = 'Street address is required';
    if (!formData.city.trim()) errs.city = 'City is required';
    if (!formData.pincode.trim()) {
      errs.pincode = 'Pincode / Postal code is required';
    } else if (!/^[0-9]{5,6}$/.test(formData.pincode.trim())) {
      errs.pincode = 'Valid 5 or 6 digit pincode is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setToast({ message: 'Please correct the errors in the shipping form.', type: 'warning' });
      return;
    }

    setSubmitting(true);
    try {
      const order = await createOrder({
        shippingAddress: {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          pincode: formData.pincode.trim(),
        },
        items: cartItems,
      });

      // Clear cart on successful order creation
      clearCart();

      // Navigate to My Orders page with success message
      navigate('/my-orders', {
        state: { newOrderSuccess: true, orderId: order._id },
      });
    } catch (err) {
      console.error('Error placing order:', err);
      setToast({
        message: err.message || 'Failed to place order. Please try again.',
        type: 'danger',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Back Link */}
      <div>
        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Cart
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
          Checkout & Shipping
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Shipping Address Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-800">1. Shipping Address</h2>
            <p className="text-xs text-slate-400 mt-0.5">Where should we deliver your order?</p>
          </div>

          <form onSubmit={handlePlaceOrder} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Recipient Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Alex Johnson"
                className={`w-full px-4 py-2.5 text-sm bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                  errors.name ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 focus:ring-indigo-500'
                }`}
              />
              {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone (10 digits) *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. 9876543210"
                maxLength={10}
                className={`w-full px-4 py-2.5 text-sm bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                  errors.phone ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 focus:ring-indigo-500'
                }`}
              />
              {errors.phone && <p className="text-xs text-rose-500 mt-1">{errors.phone}</p>}
            </div>

            {/* Street Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Street Address / Flat / Building *</label>
              <textarea
                name="address"
                rows={3}
                value={formData.address}
                onChange={handleChange}
                placeholder="e.g. 42 High Street, Apartment 3B"
                className={`w-full px-4 py-2.5 text-sm bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:bg-white transition-all resize-none ${
                  errors.address ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 focus:ring-indigo-500'
                }`}
              />
              {errors.address && <p className="text-xs text-rose-500 mt-1">{errors.address}</p>}
            </div>

            {/* City & Pincode Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Metropolis"
                  className={`w-full px-4 py-2.5 text-sm bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                    errors.city ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 focus:ring-indigo-500'
                  }`}
                />
                {errors.city && <p className="text-xs text-rose-500 mt-1">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pincode / Postal Code *</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="e.g. 100001"
                  maxLength={6}
                  className={`w-full px-4 py-2.5 text-sm bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                    errors.pincode ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 focus:ring-indigo-500'
                  }`}
                />
                {errors.pincode && <p className="text-xs text-rose-500 mt-1">{errors.pincode}</p>}
              </div>
            </div>

            {/* Payment Method Section (Fixed to Cash on Delivery) */}
            <div className="pt-6 border-t border-slate-100 space-y-3">
              <h2 className="text-lg font-bold text-slate-800">2. Payment Method</h2>

              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 flex items-start gap-3">
                <input
                  type="radio"
                  id="cod"
                  name="paymentMethod"
                  checked
                  readOnly
                  className="mt-1 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="cod" className="cursor-pointer">
                  <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-indigo-600" /> Cash on Delivery (COD)
                  </span>
                  <p className="text-xs text-slate-600 mt-0.5">
                    You only pay the total amount in cash directly to the delivery person upon receiving your package. No online payment required.
                  </p>
                </label>
              </div>
            </div>

            {/* Submit Order Action Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 px-6 bg-indigo-600 text-white font-bold text-base rounded-2xl hover:bg-indigo-700 active:scale-[0.99] disabled:opacity-50 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Verifying Stock & Placing Order...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Place Order (${totalPrice.toFixed(2)})</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Order Review Sidebar */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-sm sticky top-24">
          <h2 className="text-base font-bold text-slate-800">Items in Order ({cartItems.length})</h2>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {cartItems.map(({ product, quantity }) => (
              <div key={product._id} className="flex items-center gap-3 py-1">
                <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800 truncate">{product.name}</p>
                  <p className="text-[11px] text-slate-400">Qty: {quantity} × ${Number(product.price).toFixed(2)}</p>
                </div>
                <span className="text-xs font-bold text-slate-800">
                  ${(product.price * quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-3 space-y-2 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-800">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Shipping (COD)</span>
              <span className="font-bold text-emerald-600">FREE</span>
            </div>
            <div className="border-t border-slate-100 pt-2 flex justify-between text-sm font-extrabold text-slate-900">
              <span>Total Payable</span>
              <span className="text-indigo-600 text-base">${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
