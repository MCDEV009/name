import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../config/axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    // Token bor bo'lsa, user ma'lumotlarini olish
    if (token) {
      fetchUser();
    } else {
      // Token yo'q bo'lsa, faqat username bilan kirish
      const username = localStorage.getItem('username');
      if (username) {
        setUser({ username, role: 'user', quota: 100, usedQuota: 0 });
      }
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await apiClient.get('/api/auth/me');
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await apiClient.post('/api/auth/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Kirishda xatolik yuz berdi' 
      };
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await apiClient.post('/api/auth/register', { 
        username, 
        email, 
        password 
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Ro\'yxatdan o\'tishda xatolik' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setUser(null);
  };

  // Faqat ism bilan kirish funksiyasi
  const simpleLogin = async (username) => {
    if (!username || !username.trim()) {
      return { success: false, message: 'Ismni kiriting' };
    }

    try {
      const response = await apiClient.post('/api/auth/simple-login', { 
        username: username.trim() 
      });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('username', username.trim());
      setToken(token);
      setUser(user);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Kirishda xatolik yuz berdi' 
      };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, simpleLogin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
