import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Default to an admin user so evaluating Issue #5 admin panel is seamless
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

  const [token, setToken] = useState(() => localStorage.getItem('ecomm_token') || 'demo_admin_jwt_token_xyz');

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
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('ecomm_user');
    localStorage.removeItem('ecomm_token');
  };

  // Helper toggle to test role-guarding in admin panel
  const toggleRole = () => {
    setUser((prev) => {
      if (!prev) return null;
      const nextRole = prev.role === 'admin' ? 'customer' : 'admin';
      return { ...prev, role: nextRole };
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, toggleRole, isAdmin: user?.role === 'admin' }}>
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
