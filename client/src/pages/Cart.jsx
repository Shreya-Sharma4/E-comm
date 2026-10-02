import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight, ShieldCheck, Truck, AlertTriangle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Toast from '../components/common/Toast';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, subtotal, shippingFee, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  const handleQtyChange = (productId, currentQty, delta, maxStock) => {
    const nextQty = currentQty + delta;
    if (nextQty > maxStock) {
      setToast({
        message: `Cannot exceed available inventory limit (${maxStock} units).`,
        type: 'warning',
      });
      return;
    }

    const res = updateQuantity(productId, nextQty);
    if (!res.success) {
      setToast({ message: res.message, type: 'warning' });
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-6 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm animate-fadeIn">
        <div className="w-20 h-20 rounded-full bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center">
          <ShoppingCart className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-800">Your Shopping Cart is Empty</h2>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Explore our curated catalog, add quality electronics, fashion, and shoes to your cart, and enjoy Cash on Delivery.
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
        >
          <span>Explore Products</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Cart Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Shopping Cart</h1>
          <p className="text-sm text-slate-500 mt-1">
            Review your items and adjust quantities. Stock limits are enforced in real time.
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-800 transition-colors self-start sm:self-auto"
        >
          Clear all items
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map(({ product, quantity }) => {
            const availableStock = product.stock ?? 0;
            const isAtMaxStock = quantity >= availableStock;

            return (
              <div
                key={product._id}
                className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 shadow-sm hover:border-indigo-100 transition-colors"
              >
                {/* Product Thumbnail */}
                <Link to={`/products/${product._id}`} className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                  <img
                    src={product.image || 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=300&auto=format&fit=crop&q=80'}
                    alt={product.name}
                    className="w-full h-full object-cover object-center"
                  />
                </Link>

                {/* Info & Title */}
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <Link to={`/products/${product._id}`}>
                    <h3 className="text-sm sm:text-base font-semibold text-slate-800 hover:text-indigo-600 transition-colors truncate">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Category: {typeof product.category === 'object' ? product.category?.name : product.category || 'General'}
                  </p>
                  <p className="text-sm font-bold text-slate-900 mt-1">
                    ${Number(product.price).toFixed(2)} each
                  </p>
                  {isAtMaxStock && (
                    <p className="text-[11px] font-semibold text-amber-600 mt-1 flex items-center justify-center sm:justify-start gap-1">
                      <AlertTriangle className="w-3 h-3" /> Max available stock reached ({availableStock})
                    </p>
                  )}
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                    <button
                      onClick={() => handleQtyChange(product._id, quantity, -1, availableStock)}
                      className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors shadow-sm"
                      title="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center text-sm font-bold text-slate-800">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQtyChange(product._id, quantity, 1, availableStock)}
                      disabled={isAtMaxStock}
                      className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-sm"
                      title={isAtMaxStock ? 'Max stock reached' : 'Increase quantity'}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Subtotal for line item */}
                  <div className="min-w-[70px] text-right font-bold text-slate-900 text-sm hidden sm:block">
                    ${(product.price * quantity).toFixed(2)}
                  </div>

                  {/* Trash remove button */}
                  <button
                    onClick={() => removeFromCart(product._id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Sidebar */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-sm sticky top-24">
          <h2 className="text-lg font-bold text-slate-800">Order Summary</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Items Total ({totalItems} pcs)</span>
              <span className="font-semibold text-slate-800">${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-indigo-600" />
                Shipping (COD)
              </span>
              <span className="font-bold text-emerald-600">FREE</span>
            </div>

            <div className="border-t border-slate-100 pt-3 flex justify-between text-base font-extrabold text-slate-900">
              <span>Total Price</span>
              <span className="text-xl text-indigo-600">${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600" /> Cash on Delivery (COD)
            </p>
            <p className="text-indigo-700">
              Pay in cash directly to the courier when your package arrives at your doorstep.
            </p>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-3.5 px-6 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 active:scale-[0.99] transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <Link
            to="/products"
            className="block text-center text-xs font-semibold text-slate-500 hover:text-indigo-600"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
