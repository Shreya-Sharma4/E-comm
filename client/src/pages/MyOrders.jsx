import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Package, Clock, Truck, CheckCircle2, ArrowRight, ShoppingBag, MapPin, Phone } from 'lucide-react';
import { getMyOrders } from '../services/orderService';
import Toast from '../components/common/Toast';

const STATUS_STYLES = {
  Pending: 'bg-amber-100 text-amber-800 border-amber-200',
  Confirmed: 'bg-sky-100 text-sky-800 border-sky-200',
  Shipped: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  Delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Cancelled: 'bg-rose-100 text-rose-800 border-rose-200',
};

const MyOrders = () => {
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(
    location.state?.newOrderSuccess
      ? { message: 'Order placed successfully via Cash on Delivery!', type: 'success' }
      : null
  );

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await getMyOrders();
        setOrders(data || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Toast Alert */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">My Orders</h1>
          <p className="text-sm text-slate-500 mt-1">
            Track your order fulfillment status and review order history.
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 self-start sm:self-auto"
        >
          <ShoppingBag className="w-4 h-4" /> Continue Shopping
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div key={n} className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 animate-pulse">
              <div className="h-6 bg-slate-200 rounded w-1/3" />
              <div className="h-16 bg-slate-100 rounded-xl" />
              <div className="h-6 bg-slate-200 rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">No orders placed yet</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            You haven't placed any orders yet. Browse our catalog to find items you love!
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Start Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const statusClass = STATUS_STYLES[order.status] || STATUS_STYLES.Pending;
            const items = order.products || [];
            const formattedDate = order.createdAt
              ? new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Recent Order';

            return (
              <div
                key={order._id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Order Card Header */}
                <div className="p-5 sm:p-6 bg-slate-50/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400">Order ID:</span>
                      <span className="text-xs font-mono font-bold text-slate-700">{order._id}</span>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> Placed on {formattedDate}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusClass}`}>
                      {order.status || 'Pending'}
                    </span>
                    <span className="text-base font-extrabold text-slate-900">
                      ${Number(order.totalAmount).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Ordered Items List */}
                <div className="p-5 sm:p-6 divide-y divide-slate-100">
                  {items.map((item, idx) => (
                    <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 text-indigo-600 font-bold text-xs">
                          {idx + 1}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">{item.name}</p>
                          <p className="text-xs text-slate-400">
                            Qty: {item.quantity} × ${Number(item.price).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-slate-900 whitespace-nowrap">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Shipping & Payment Footer */}
                {order.shippingAddress && (
                  <div className="p-5 sm:p-6 bg-slate-50/40 border-t border-slate-100 text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                      <span>
                        Shipping to: <strong className="text-slate-800">{order.shippingAddress.name}</strong>,{' '}
                        {order.shippingAddress.address}, {order.shippingAddress.city} - {order.shippingAddress.pincode}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 font-semibold text-slate-700">
                      <Truck className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                      <span>Payment: {order.paymentMethod || 'Cash on Delivery'}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
