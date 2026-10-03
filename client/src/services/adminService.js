import api from '../api/axios';

// Default initial category ObjectIds matching MongoDB Atlas seeded records
const INITIAL_CATEGORIES = [
  { _id: '6ac0c105ad2be9dc892fcfd3', name: 'Electronics', description: 'Smartphones, audio, gadgets and computer accessories.', createdAt: new Date('2026-09-15') },
  { _id: '6ac0c105ad2be9dc892fcfd4', name: 'Fashion', description: 'Men and women apparel, jackets, streetwear and denim.', createdAt: new Date('2026-09-18') },
  { _id: '6ac0c105ad2be9dc892fcfd5', name: 'Shoes', description: 'Athletic sneakers, casual runners, boots and formal footwear.', createdAt: new Date('2026-09-20') },
];

const INITIAL_PRODUCTS = [
  {
    _id: 'prod_01',
    name: 'Ultra Wireless Noise-Cancelling Headphones',
    description: 'Studio-grade acoustic sound with active hybrid noise cancellation and 40-hour ultra battery life.',
    price: 199.99,
    stock: 15,
    category: { _id: '6ac0c105ad2be9dc892fcfd3', name: 'Electronics' },
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    createdAt: new Date('2026-09-22'),
  },
  {
    _id: 'prod_02',
    name: 'Smart OLED Fitness Watch v2',
    description: 'Always-on vibrant AMOLED display with continuous heart-rate tracking, GPS, and water resistance to 50m.',
    price: 149.50,
    stock: 24,
    category: { _id: '6ac0c105ad2be9dc892fcfd3', name: 'Electronics' },
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    createdAt: new Date('2026-09-23'),
  },
  {
    _id: 'prod_03',
    name: 'Vintage Distressed Denim Jacket',
    description: 'Crafted from 100% heavyweight organic cotton with antique brass button hardware and relaxed modern cut.',
    price: 89.00,
    stock: 4,
    category: { _id: '6ac0c105ad2be9dc892fcfd4', name: 'Fashion' },
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80',
    createdAt: new Date('2026-09-24'),
  },
  {
    _id: 'prod_04',
    name: 'Performance Running Ultralight Sneakers',
    description: 'Engineered responsive foam midsole providing maximum energy return on road and marathon tracks.',
    price: 129.99,
    stock: 0,
    category: { _id: '6ac0c105ad2be9dc892fcfd5', name: 'Shoes' },
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    createdAt: new Date('2026-09-25'),
  },
  {
    _id: 'prod_05',
    name: 'Minimalist Leather Urban Backpack',
    description: 'Weatherproof full-grain vegan leather with dedicated 16-inch padded laptop compartment and quick-access pockets.',
    price: 79.99,
    stock: 12,
    category: { _id: '6ac0c105ad2be9dc892fcfd4', name: 'Fashion' },
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    createdAt: new Date('2026-09-26'),
  }
];

// LocalStorage helpers for caching
const getLocal = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
};

const setLocal = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving to localStorage:', e);
  }
};

export const adminService = {
  // ================= CATEGORIES =================
  async getCategories() {
    try {
      const res = await api.get('/categories');
      const cats = res.data?.data || res.data || [];
      setLocal('ecomm_categories', cats);
      return cats;
    } catch (err) {
      console.warn('Backend categories unreachable, using local storage:', err.message);
      return getLocal('ecomm_categories', INITIAL_CATEGORIES);
    }
  },

  async createCategory(categoryData) {
    try {
      const res = await api.post('/categories', categoryData);
      const newCat = res.data?.data || res.data;
      const cats = getLocal('ecomm_categories', INITIAL_CATEGORIES);
      setLocal('ecomm_categories', [newCat, ...cats]);
      return newCat;
    } catch (err) {
      console.error('Create category error:', err.response?.data || err.message);
      throw new Error(err.response?.data?.message || 'Failed to save category to MongoDB');
    }
  },

  async updateCategory(id, categoryData) {
    try {
      const res = await api.put(`/categories/${id}`, categoryData);
      const updatedCat = res.data?.data || res.data;
      const cats = getLocal('ecomm_categories', INITIAL_CATEGORIES);
      setLocal('ecomm_categories', cats.map((c) => (c._id === id ? updatedCat : c)));
      return updatedCat;
    } catch (err) {
      console.error('Update category error:', err.response?.data || err.message);
      throw new Error(err.response?.data?.message || 'Failed to update category in MongoDB');
    }
  },

  async deleteCategory(id) {
    try {
      const res = await api.delete(`/categories/${id}`);
      const cats = getLocal('ecomm_categories', INITIAL_CATEGORIES);
      setLocal('ecomm_categories', cats.filter((c) => c._id !== id));
      return res.data;
    } catch (err) {
      console.error('Delete category error:', err.response?.data || err.message);
      throw new Error(err.response?.data?.message || 'Failed to delete category from MongoDB');
    }
  },

  // ================= PRODUCTS =================
  async getProducts() {
    try {
      const res = await api.get('/products');
      const prods = res.data?.data || res.data || [];
      setLocal('ecomm_products', prods);
      return prods;
    } catch (err) {
      console.warn('Backend products unreachable, using local storage:', err.message);
      return getLocal('ecomm_products', INITIAL_PRODUCTS);
    }
  },

  async createProduct(productData) {
    try {
      const res = await api.post('/products', productData);
      const newProd = res.data?.data || res.data;
      
      // Update local storage cache
      const prods = getLocal('ecomm_products', []);
      setLocal('ecomm_products', [newProd, ...prods.filter((p) => p._id !== newProd._id)]);
      return newProd;
    } catch (err) {
      console.error('Create product error:', err.response?.data || err.message);
      throw new Error(err.response?.data?.message || 'Failed to save product to MongoDB');
    }
  },

  async updateProduct(id, productData) {
    try {
      const res = await api.put(`/products/${id}`, productData);
      const updatedProd = res.data?.data || res.data;
      
      const prods = getLocal('ecomm_products', []);
      setLocal('ecomm_products', prods.map((p) => (p._id === id ? updatedProd : p)));
      return updatedProd;
    } catch (err) {
      console.error('Update product error:', err.response?.data || err.message);
      throw new Error(err.response?.data?.message || 'Failed to update product in MongoDB');
    }
  },

  async deleteProduct(id) {
    try {
      const res = await api.delete(`/products/${id}`);
      const prods = getLocal('ecomm_products', []);
      setLocal('ecomm_products', prods.filter((p) => p._id !== id));
      return res.data;
    } catch (err) {
      console.error('Delete product error:', err.response?.data || err.message);
      throw new Error(err.response?.data?.message || 'Failed to delete product from MongoDB');
    }
  },

  // ================= ORDERS =================
  async getOrders() {
    try {
      const res = await api.get('/admin/orders');
      return res.data?.data || res.data || [];
    } catch (err) {
      console.warn('Backend orders unreachable, using local storage:', err.message);
      return getLocal('ecomm_orders', []);
    }
  },

  async updateOrderStatus(id, status) {
    try {
      const res = await api.patch(`/admin/orders/${id}/status`, { status });
      return res.data?.data || res.data;
    } catch (err) {
      console.error('Update order status error:', err.response?.data || err.message);
      throw new Error(err.response?.data?.message || 'Failed to update order status in MongoDB');
    }
  },

  // Reset to initial mock data (helpful for testing and demos)
  resetDemoData() {
    setLocal('ecomm_categories', INITIAL_CATEGORIES);
    setLocal('ecomm_products', INITIAL_PRODUCTS);
    setLocal('ecomm_orders', []);
  }
};
