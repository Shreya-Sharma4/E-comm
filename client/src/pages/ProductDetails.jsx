import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ShoppingCart, ShieldCheck, Truck, ArrowRight, Minus, Plus, AlertCircle } from 'lucide-react';
import { getProductById } from '../services/productService';
import { useCart } from '../context/CartContext';
import Toast from '../components/common/Toast';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-12 animate-pulse space-y-8">
        <div className="h-4 bg-slate-200 rounded w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="aspect-square bg-slate-200 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-8 bg-slate-200 rounded w-3/4" />
            <div className="h-6 bg-slate-200 rounded w-1/3" />
            <div className="h-24 bg-slate-100 rounded-2xl" />
            <div className="h-12 bg-slate-200 rounded-xl w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Product Not Found</h2>
        <p className="text-slate-500 text-sm">The product you are looking for does not exist or has been removed.</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Return to Catalog
        </Link>
      </div>
    );
  }

  const { name, price, description, image, category, stock = 0 } = product;
  const categoryName = typeof category === 'object' ? category?.name : category;
  const isOutOfStock = stock <= 0;

  const handleIncrement = () => {
    if (quantity < stock) {
      setQuantity((prev) => prev + 1);
    } else {
      setToast({
        message: `Maximum available inventory reached (${stock} units).`,
        type: 'warning',
      });
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const result = addToCart(product, quantity);
    setToast({
      message: result.message,
      type: result.success ? 'success' : 'warning',
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      {/* Toast Alert */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
        <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-indigo-600 transition-colors">Catalog</Link>
        {categoryName && (
          <>
            <span>/</span>
            <Link
              to={`/products?category=${encodeURIComponent(categoryName)}`}
              className="hover:text-indigo-600 transition-colors"
            >
              {categoryName}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-slate-800 font-semibold truncate max-w-xs">{name}</span>
      </nav>

      {/* Product Details Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm">
        {/* Product Image Section */}
        <div className="space-y-4">
          <div className="aspect-square bg-slate-100 rounded-2xl overflow-hidden border border-slate-100 shadow-inner">
            <img
              src={image || 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&auto=format&fit=crop&q=80'}
              alt={name}
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-500 justify-center">
            <span className="flex items-center gap-1.5"><Truck className="w-4 h-4 text-indigo-600" /> Cash on Delivery</span>
            <span>•</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-600" /> Authenticity Guaranteed</span>
          </div>
        </div>

        {/* Product Info Section */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {categoryName && (
              <span className="inline-block bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full">
                {categoryName}
              </span>
            )}

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {name}
            </h1>

            {/* Price & Stock Status */}
            <div className="flex items-baseline gap-4 pt-2">
              <span className="text-3xl font-extrabold text-slate-900">
                ${Number(price).toFixed(2)}
              </span>

              {isOutOfStock ? (
                <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1 rounded-full">
                  Out of Stock
                </span>
              ) : stock <= 5 ? (
                <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full">
                  Low Stock: Only {stock} left
                </span>
              ) : (
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                  In Stock ({stock} available)
                </span>
              )}
            </div>

            {/* Description */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Description</h3>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {description}
              </p>
            </div>
          </div>

          {/* Quantity Controls & Add to Cart Action */}
          <div className="pt-6 border-t border-slate-100 space-y-4">
            {!isOutOfStock ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">Quantity</span>
                  <span className="text-xs text-slate-400">Available: {stock} units</span>
                </div>

                <div className="flex items-center gap-4">
                  {/* Quantity Counter */}
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                    <button
                      onClick={handleDecrement}
                      disabled={quantity <= 1}
                      className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-colors shadow-sm"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center text-sm font-bold text-slate-800">
                      {quantity}
                    </span>
                    <button
                      onClick={handleIncrement}
                      disabled={quantity >= stock}
                      className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-colors shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Add to Cart CTA */}
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 py-3 px-6 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart • ${(price * quantity).toFixed(2)}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-center gap-3 text-rose-800 text-sm font-medium">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>This item is currently sold out. Please check back later.</span>
              </div>
            )}

            {/* Quick Actions: Go to Cart */}
            <div className="flex justify-between items-center pt-2">
              <Link
                to="/cart"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                Go to Shopping Cart <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/products"
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                Continue browsing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
