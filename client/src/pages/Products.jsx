import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, PackageX, Sparkles } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import { getCategories, getProducts } from '../services/productService';
import Toast from '../components/common/Toast';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Fetch Categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats || []);
      } catch (err) {
        console.error('Error loading categories:', err);
      }
    };
    loadCategories();
  }, []);

  // Fetch Products whenever filters change
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await getProducts({
          category: selectedCategory === 'All' ? '' : selectedCategory,
          search: searchTerm,
        });
        setProducts(data || []);
      } catch (err) {
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      loadProducts();
    }, 200);

    return () => clearTimeout(debounceTimer);
  }, [selectedCategory, searchTerm]);

  const handleCategorySelect = (catName) => {
    setSelectedCategory(catName);
    const newParams = new URLSearchParams(searchParams);
    if (catName === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', catName);
    }
    setSearchParams(newParams);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    const newParams = new URLSearchParams(searchParams);
    if (val.trim()) {
      newParams.set('search', val);
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSelectedCategory('All');
    setSearchTerm('');
    setSearchParams({});
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Hero Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-8 sm:p-12 shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold backdrop-blur-sm border border-indigo-400/20">
            <Sparkles className="w-3.5 h-3.5" />
            Curated MERN E-Commerce Store
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Discover Quality Products with Real-time Stock
          </h1>
          <p className="text-sm sm:text-base text-indigo-200">
            Enjoy full category filtering, live keyword search, dynamic stock limits, and Cash on Delivery fulfillment.
          </p>
        </div>

        {/* Decorative blur shapes */}
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-40 bottom-0 -mb-10 w-60 h-60 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Filter and Search Bar Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Category Filter Pills Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            <button
              onClick={() => handleCategorySelect('All')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shadow-sm ${
                selectedCategory === 'All'
                  ? 'bg-indigo-600 text-white shadow-indigo-200'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              All Products
            </button>

            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => handleCategorySelect(cat.name)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shadow-sm ${
                  selectedCategory === cat.name
                    ? 'bg-indigo-600 text-white shadow-indigo-200'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search Input Filter */}
          <div className="relative min-w-[240px]">
            <input
              type="text"
              placeholder="Search in catalog..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Active Filter Indicators */}
        {(selectedCategory !== 'All' || searchTerm.trim()) && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Filtering by:</span>
            {selectedCategory !== 'All' && (
              <span className="bg-indigo-50 text-indigo-700 font-semibold px-2.5 py-0.5 rounded-full">
                {selectedCategory}
              </span>
            )}
            {searchTerm.trim() && (
              <span className="bg-slate-100 text-slate-700 font-medium px-2.5 py-0.5 rounded-full">
                "{searchTerm}"
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-rose-600 hover:underline font-semibold ml-2"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Products Grid / Skeletons / Empty State */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div
              key={n}
              className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4 animate-pulse"
            >
              <div className="aspect-square bg-slate-200 rounded-xl" />
              <div className="h-4 bg-slate-200 rounded w-3/4" />
              <div className="h-3 bg-slate-100 rounded w-1/2" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-5 bg-slate-200 rounded w-1/4" />
                <div className="h-8 bg-slate-200 rounded-xl w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onToast={(msg, type) => setToast({ message: msg, type })}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <PackageX className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No matching products found</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            We couldn't find any products matching your current category or search criteria. Try resetting filters.
          </p>
          <button
            onClick={clearAllFilters}
            className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Show All Products
          </button>
        </div>
      )}
    </div>
  );
};

export default Products;
