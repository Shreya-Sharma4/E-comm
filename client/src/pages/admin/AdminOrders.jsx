import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Eye,
  Filter,
  Search,
  MapPin,
  Phone,
  User,
  CheckCircle,
  Truck,
  Clock,
  XCircle,
  Calendar,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { Modal } from '../../components/common/Modal';
import { Toast } from '../../components/common/Toast';

export const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Order for Details Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await adminService.getOrders();
      setOrders(data);
    } catch (err) {
      showToast('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await adminService.updateOrderStatus(orderId, newStatus);
      showToast(`Order status updated to "${newStatus}"`);
      await loadOrders();
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

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

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    const customerName = (o.shippingAddress?.name || o.user?.name || '').toLowerCase();
    const orderId = (o._id || '').toLowerCase();
    const city = (o.shippingAddress?.city || '').toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesSearch =
      customerName.includes(query) || orderId.includes(query) || city.includes(query);

    return matchesStatus && matchesSearch;
  });

  const statuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

  return (
    <div className="space-y-6 animate-fade-in">
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Order Management</h1>
          <p className="text-sm text-slate-500 mt-1">
            Track customer orders, review shipping addresses, and advance fulfillment statuses.
          </p>
        </div>
      </div>

      {/* Status Filter Pills & Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              statusFilter === 'ALL'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All ({orders.length})
          </button>
          {statuses.map((st) => {
            const count = orders.filter((o) => o.status === st).length;
            const isActive = statusFilter === st;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {st} ({count})
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="bg-white px-3.5 py-2 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-2 max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by customer or order #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-transparent outline-none placeholder:text-slate-400 text-slate-800"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-sm text-slate-400">Loading customer orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-700">No orders match criteria</p>
            <p className="text-xs text-slate-400 mt-1">
              Select another status filter or clear your search term.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">Order ID</th>
                  <th className="px-6 py-3.5">Customer & City</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5">Items</th>
                  <th className="px-6 py-3.5">Total Amount</th>
                  <th className="px-6 py-3.5">Lifecycle Status</th>
                  <th className="px-6 py-3.5 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-md">
                        #{order._id.slice(-6).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">
                        {order.shippingAddress?.name || order.user?.name || 'Customer'}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {order.shippingAddress?.city || 'India'}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <span className="font-medium text-slate-800">
                        {order.products?.reduce((s, p) => s + (p.quantity || 1), 0) || 1} units
                      </span>{' '}
                      <span className="text-slate-400">
                        ({order.products?.length || 1} distinct)
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      ${(order.totalAmount || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`text-xs font-semibold px-2.5 py-1.5 rounded-xl border outline-none cursor-pointer transition-all ${
                          order.status === 'Pending'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : order.status === 'Confirmed'
                            ? 'bg-sky-50 text-sky-800 border-sky-300'
                            : order.status === 'Shipped'
                            ? 'bg-indigo-50 text-indigo-800 border-indigo-300'
                            : order.status === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-rose-50 text-rose-800 border-rose-300'
                        }`}
                      >
                        {statuses.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsDetailsOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <Modal
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          title={`Order #${selectedOrder._id.slice(-6).toUpperCase()}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6">
            {/* Header info bar */}
            <div className="flex flex-wrap items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200/80 gap-3">
              <div>
                <span className="block text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
                  Order Status
                </span>
                <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
              </div>
              <div>
                <span className="block text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
                  Date Placed
                </span>
                <span className="text-xs font-medium text-slate-800 mt-1 block">
                  {new Date(selectedOrder.createdAt).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="block text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
                  Payment Method
                </span>
                <span className="text-xs font-medium text-slate-800 mt-1 block">
                  {selectedOrder.paymentMethod || 'Cash on Delivery'}
                </span>
              </div>
            </div>

            {/* Customer & Shipping Section */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Shipping Information
              </h4>
              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-800 font-semibold">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedOrder.shippingAddress?.name || selectedOrder.user?.name}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedOrder.shippingAddress?.phone || 'Not provided'}</span>
                </div>
                <div className="flex items-start gap-2 text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>
                    {selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city} -{' '}
                    {selectedOrder.shippingAddress?.pincode}
                  </span>
                </div>
              </div>
            </div>

            {/* Products List */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Order Items ({selectedOrder.products?.length || 0})
              </h4>
              <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden">
                {selectedOrder.products?.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3.5 text-xs">
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                        />
                      )}
                      <div>
                        <p className="font-semibold text-slate-900">{item.name}</p>
                        <p className="text-slate-400 mt-0.5">
                          ${item.price?.toFixed(2)} &times; {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900">
                      ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Summary */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-sm font-semibold text-slate-700">Total Order Amount</span>
              <span className="text-xl font-bold text-slate-900">
                ${(selectedOrder.totalAmount || 0).toFixed(2)}
              </span>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Quick Status Change:</span>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                >
                  {statuses.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => setIsDetailsOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
