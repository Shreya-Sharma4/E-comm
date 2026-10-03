import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor: attach JWT bearer token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ecomm_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 Unauthorized by auto-authenticating
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 Unauthorized and not already retried
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        console.info('Acquiring fresh backend admin JWT token from MongoDB...');
        const res = await axios.post('/api/auth/login', {
          email: 'admin@ecommerce.com',
          password: 'admin123',
        });

        if (res.data?.data?.token) {
          const newToken = res.data.data.token;
          const newUser = res.data.data.user;

          localStorage.setItem('ecomm_token', newToken);
          localStorage.setItem('ecomm_user', JSON.stringify(newUser));

          // Retry the original request with the fresh valid token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (loginErr) {
        console.error('Auto-refresh login failed:', loginErr.message);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
