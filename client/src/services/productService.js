import api from '../api/axios';
import { adminService } from './adminService';

export const getCategories = async () => {
  try {
    const res = await api.get('/categories');
    if (res.data && res.data.data) {
      return res.data.data;
    }
    return res.data;
  } catch (err) {
    console.warn('API error fetching categories, falling back to local store:', err.message);
    return await adminService.getCategories();
  }
};

export const getProducts = async ({ category = '', search = '' } = {}) => {
  try {
    const params = {};
    if (category && category !== 'All') params.category = category;
    if (search && search.trim()) params.search = search.trim();

    const res = await api.get('/products', { params });
    if (res.data && res.data.data) {
      return res.data.data;
    }
    return res.data;
  } catch (err) {
    console.warn('API error fetching products, filtering local store fallback:', err.message);
    const allProducts = await adminService.getProducts();
    
    return allProducts.filter((product) => {
      // Category Filter
      let matchesCategory = true;
      if (category && category !== 'All') {
        const productCatId = product.category?._id || product.category;
        const productCatName = product.category?.name || product.category;
        matchesCategory = productCatId === category || productCatName?.toLowerCase() === category.toLowerCase();
      }

      // Keyword Search Filter
      let matchesSearch = true;
      if (search && search.trim()) {
        const query = search.toLowerCase().trim();
        const inName = product.name?.toLowerCase().includes(query);
        const inDesc = product.description?.toLowerCase().includes(query);
        matchesSearch = inName || inDesc;
      }

      return matchesCategory && matchesSearch;
    });
  }
};

export const getProductById = async (id) => {
  try {
    const res = await api.get(`/products/${id}`);
    if (res.data && res.data.data) {
      return res.data.data;
    }
    return res.data;
  } catch (err) {
    console.warn(`API error fetching product ${id}, looking in local store:`, err.message);
    const allProducts = await adminService.getProducts();
    const found = allProducts.find((p) => p._id === id);
    if (!found) {
      throw new Error('Product not found');
    }
    return found;
  }
};
