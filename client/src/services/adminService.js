import api from '../api/axios';

// Default mock seed data for standalone evaluation
const INITIAL_CATEGORIES = [
  { _id: 'cat_01', name: 'Electronics', description: 'Smartphones, audio, gadgets and computer accessories.', createdAt: new Date('2026-09-15') },
  { _id: 'cat_02', name: 'Fashion', description: 'Men and women apparel, jackets, streetwear and denim.', createdAt: new Date('2026-09-18') },
  { _id: 'cat_03', name: 'Shoes', description: 'Athletic sneakers, casual runners, boots and formal footwear.', createdAt: new Date('2026-09-20') },
];

const INITIAL_PRODUCTS = [
  {
    _id: 'prod_01',
    name: 'Ultra Wireless Noise-Cancelling Headphones',
    description: 'Studio-grade acoustic sound with active hybrid noise cancellation and 40-hour ultra battery life.',
    price: 199.99,
    stock: 15,
    category: { _id: 'cat_01', name: 'Electronics' },
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    createdAt: new Date('2026-09-22'),
  },
  {
    _id: 'prod_02',
    name: 'Smart OLED Fitness Watch v2',
    description: 'Always-on vibrant AMOLED display with continuous heart-rate tracking, GPS, and water resistance to 50m.',
    price: 149.50,
    stock: 24,
    category: { _id: 'cat_01', name: 'Electronics' },
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    createdAt: new Date('2026-09-23'),
  },
  {
    _id: 'prod_03',
    name: 'Vintage Distressed Denim Jacket',
    description: 'Crafted from 100% heavyweight organic cotton with antique brass button hardware and relaxed modern cut.',
    price: 89.00,
    stock: 4,
    category: { _id: 'cat_02', name: 'Fashion' },
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80',
    createdAt: new Date('2026-09-24'),
  },
  {
    _id: 'prod_04',
    name: 'Performance Running Ultralight Sneakers',
    description: 'Engineered responsive foam midsole providing maximum energy return on road and marathon tracks.',
    price: 129.99,
    stock: 0,
    category: { _id: 'cat_03', name: 'Shoes' },
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    createdAt: new Date('2026-09-25'),
  },
  {
    _id: 'prod_05',
    name: 'Minimalist Leather Urban Backpack',
    description: 'Weatherproof full-grain vegan leather with dedicated 16-inch padded laptop compartment and quick-access pockets.',
    price: 79.99,
    stock: 12,
    category: { _id: 'cat_02', name: 'Fashion' },
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    createdAt: new Date('2026-09-26'),
  }
];

const INITIAL_ORDERS = [
  {
    _id: 'ord_1001',
    user: { _id: 'u_101', name: 'Rahul Sharma', email: 'rahul.s@example.com' },
    products: [
      { product: 'prod_01', name: 'Ultra Wireless Noise-Cancelling Headphones', price: 199.99, quantity: 1, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200' },
      { product: 'prod_02', name: 'Smart OLED Fitness Watch v2', price: 149.50, quantity: 1, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200' }
    ],
    totalAmount: 349.49,
    shippingAddress: {
      name: 'Rahul Sharma',
      phone: '+91 9876543210',
      address: 'Flat 402, Sunshine Heights, MG Road',
      city: 'Bengaluru',
      pincode: '560001',
    },
    paymentMethod: 'Cash on Delivery',
    status: 'Pending',
    createdAt: new Date('2026-10-01T10:30:00Z'),
  },
  {
    _id: 'ord_1002',
    user: { _id: 'u_102', name: 'Priya Patel', email: 'priya.p@example.com' },
    products: [
      { product: 'prod_03', name: 'Vintage Distressed Denim Jacket', price: 89.00, quantity: 2, image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=200' }
    ],
    totalAmount: 178.00,
    shippingAddress: {
      name: 'Priya Patel',
      phone: '+91 9812345678',
      address: 'B-14, Green Park Society',
      city: 'Ahmedabad',
      pincode: '380015',
    },
    paymentMethod: 'Cash on Delivery',
    status: 'Confirmed',
    createdAt: new Date('2026-10-01T14:15:00Z'),
  },
  {
    _id: 'ord_1003',
    user: { _id: 'u_103', name: 'Amit Verma', email: 'amit.v@example.com' },
    products: [
      { product: 'prod_05', name: 'Minimalist Leather Urban Backpack', price: 79.99, quantity: 1, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200' }
    ],
    totalAmount: 79.99,
    shippingAddress: {
      name: 'Amit Verma',
      phone: '+91 9922334455',
      address: 'House #72, Sector 18',
      city: 'Noida',
      pincode: '201301',
    },
    paymentMethod: 'Cash on Delivery',
    status: 'Shipped',
    createdAt: new Date('2026-09-30T09:00:00Z'),
  },
  {
    _id: 'ord_1004',
    user: { _id: 'u_104', name: 'Sneha Deshmukh', email: 'sneha.d@example.com' },
    products: [
      { product: 'prod_04', name: 'Performance Running Ultralight Sneakers', price: 129.99, quantity: 1, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200' }
    ],
    totalAmount: 129.99,
    shippingAddress: {
      name: 'Sneha Deshmukh',
      phone: '+91 9123456780',
      address: 'Plot 45, Kothrud',
      city: 'Pune',
      pincode: '411038',
    },
    paymentMethod: 'Cash on Delivery',
    status: 'Delivered',
    createdAt: new Date('2026-09-28T16:20:00Z'),
  },
];

// LocalStorage helpers for mock persistence
const getLocal = (key, fallback) => {
  const item = localStorage.getItem(key);
  if (!item) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
  try {
    return JSON.parse(item);
  } catch (e) {
    return fallback;
  }
};

const setLocal = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const adminService = {
  // ================= CATEGORIES =================
  async getCategories() {
    try {
      const res = await api.get('/categories');
      return res.data?.data || res.data;
    } catch (err) {
      console.info('Backend unreachable, using local storage for categories');
      return getLocal('ecomm_categories', INITIAL_CATEGORIES);
    }
  },

  async createCategory(categoryData) {
    try {
      const res = await api.post('/categories', categoryData);
      return res.data?.data || res.data;
    } catch (err) {
      const cats = getLocal('ecomm_categories', INITIAL_CATEGORIES);
      const newCat = {
        _id: 'cat_' + Date.now(),
        ...categoryData,
        createdAt: new Date(),
      };
      const updated = [newCat, ...cats];
      setLocal('ecomm_categories', updated);
      return newCat;
    }
  },

  async updateCategory(id, categoryData) {
    try {
      const res = await api.put(`/categories/${id}`, categoryData);
      return res.data?.data || res.data;
    } catch (err) {
      const cats = getLocal('ecomm_categories', INITIAL_CATEGORIES);
      const updated = cats.map((c) => (c._id === id ? { ...c, ...categoryData } : c));
      setLocal('ecomm_categories', updated);
      return updated.find((c) => c._id === id);
    }
  },

  async deleteCategory(id) {
    try {
      const res = await api.delete(`/categories/${id}`);
      return res.data;
    } catch (err) {
      const cats = getLocal('ecomm_categories', INITIAL_CATEGORIES);
      const updated = cats.filter((c) => c._id !== id);
      setLocal('ecomm_categories', updated);
      return { success: true };
    }
  },

  // ================= PRODUCTS =================
  async getProducts() {
    try {
      const res = await api.get('/products');
      return res.data?.data || res.data;
    } catch (err) {
      console.info('Backend unreachable, using local storage for products');
      return getLocal('ecomm_products', INITIAL_PRODUCTS);
    }
  },

  async createProduct(productData) {
    try {
      const res = await api.post('/products', productData);
      return res.data?.data || res.data;
    } catch (err) {
      const prods = getLocal('ecomm_products', INITIAL_PRODUCTS);
      const cats = getLocal('ecomm_categories', INITIAL_CATEGORIES);
      const selectedCat = cats.find(c => c._id === productData.category) || { _id: productData.category, name: 'General' };

      const newProd = {
        _id: 'prod_' + Date.now(),
        ...productData,
        price: parseFloat(productData.price),
        stock: parseInt(productData.stock, 10),
        category: selectedCat,
        createdAt: new Date(),
      };
      const updated = [newProd, ...prods];
      setLocal('ecomm_products', updated);
      return newProd;
    }
  },

  async updateProduct(id, productData) {
    try {
      const res = await api.put(`/products/${id}`, productData);
      return res.data?.data || res.data;
    } catch (err) {
      const prods = getLocal('ecomm_products', INITIAL_PRODUCTS);
      const cats = getLocal('ecomm_categories', INITIAL_CATEGORIES);
      const selectedCat = typeof productData.category === 'object'
        ? productData.category
        : (cats.find(c => c._id === productData.category) || { _id: productData.category, name: 'General' });

      const updated = prods.map((p) =>
        p._id === id
          ? {
              ...p,
              ...productData,
              price: parseFloat(productData.price),
              stock: parseInt(productData.stock, 10),
              category: selectedCat,
            }
          : p
      );
      setLocal('ecomm_products', updated);
      return updated.find((p) => p._id === id);
    }
  },

  async deleteProduct(id) {
    try {
      const res = await api.delete(`/products/${id}`);
      return res.data;
    } catch (err) {
      const prods = getLocal('ecomm_products', INITIAL_PRODUCTS);
      const updated = prods.filter((p) => p._id !== id);
      setLocal('ecomm_products', updated);
      return { success: true };
    }
  },

  // ================= ORDERS =================
  async getOrders() {
    try {
      const res = await api.get('/admin/orders');
      return res.data?.data || res.data;
    } catch (err) {
      console.info('Backend unreachable, using local storage for orders');
      return getLocal('ecomm_orders', INITIAL_ORDERS);
    }
  },

  async updateOrderStatus(id, status) {
    try {
      const res = await api.patch(`/admin/orders/${id}/status`, { status });
      return res.data?.data || res.data;
    } catch (err) {
      const orders = getLocal('ecomm_orders', INITIAL_ORDERS);
      const updated = orders.map((o) => (o._id === id ? { ...o, status } : o));
      setLocal('ecomm_orders', updated);
      return updated.find((o) => o._id === id);
    }
  },

  // Reset to initial mock data (helpful for testing and demos)
  resetDemoData() {
    setLocal('ecomm_categories', INITIAL_CATEGORIES);
    setLocal('ecomm_products', INITIAL_PRODUCTS);
    setLocal('ecomm_orders', INITIAL_ORDERS);
  }
};
