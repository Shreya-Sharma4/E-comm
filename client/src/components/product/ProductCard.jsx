import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product, onToast }) => {
  const { addToCart } = useCart();

  if (!product) return null;

  const { _id, name, price, image, category, stock = 0 } = product;
  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock <= 5;
  const categoryName = typeof category === 'object' ? category?.name : category;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;

    const result = addToCart(product, 1);
    if (onToast) {
      onToast(result.message, result.success ? 'success' : 'warning');
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 flex flex-col h-full">
      {/* Product Image Container */}
      <Link to={`/products/${_id}`} className="relative block overflow-hidden bg-slate-100 aspect-square">
        <img
          src={image || 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&auto=format&fit=crop&q=80'}
          alt={name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Category Pill Tag */}
        {categoryName && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-slate-700 text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
            {categoryName}
          </span>
        )}

        {/* Stock Badge */}
        <div className="absolute top-3 right-3">
          {isOutOfStock ? (
            <span className="bg-rose-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
              Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="bg-amber-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
              Only {stock} left
            </span>
          ) : (
            <span className="bg-emerald-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
              In Stock
            </span>
          )}
        </div>

        {/* Quick View Overlay Button */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="bg-white text-slate-800 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5" /> View Details
          </span>
        </div>
      </Link>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <Link to={`/products/${_id}`}>
            <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 hover:text-indigo-600 transition-colors title-clamp">
              {name}
            </h3>
          </Link>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <p className="text-xs text-slate-400">Price</p>
            <p className="text-lg font-bold text-slate-900">
              ${Number(price).toFixed(2)}
            </p>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-indigo-100'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
