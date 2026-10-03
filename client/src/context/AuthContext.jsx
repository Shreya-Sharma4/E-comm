import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ecomm_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      _id: 'admin_user_001',
      name: 'Store Administrator',
      email: 'admin@ecommerce.com',
      role: 'admin',
    };
  });

  const [token, setToken] = useState(() => localStorage.getItem('ecomm_token') || '');

  // Synchronize a real MongoDB JWT token automatically if token is missing or mock
  useEffect(() => {
    const ensureRealToken = async () => {
      const storedToken = localStorage.getItem('ecomm_token');
      if (!storedToken || storedToken.startsWith('demo_') || storedToken.startsWith('mock_')) {
        try {
          const res = await axios.post('/api/auth/login', {
            email: 'admin@ecommerce.com',
            password: 'admin123',
          });

          if (res.data?.data) {
            setUser(res.data.data.user);
            setToken(res.data.data.token);
            localStorage.setItem('ecomm_token', res.data.data.token);
            localStorage.setItem('ecomm_user', JSON.stringify(res.data.data.user));
          }
        } catch (err) {
          console.warn('Backend login unavailable:', err.message);
        }
      }
    };

    ensureRealToken();
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('ecomm_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ecomm_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('ecomm_token', token);
    } else {
      localStorage.removeItem('ecomm_token');
    }
  }, [token]);

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('ecomm_user', JSON.stringify(userData));
    localStorage.setItem('ecomm_token', jwtToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('ecomm_user');
    localStorage.removeItem('ecomm_token');
  };

  const toggleRole = () => {
    setUser((prev) => {
      if (!prev) return null;
      const nextRole = prev.role === 'admin' ? 'customer' : 'admin';
      return { ...prev, role: nextRole };
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        toggleRole,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
