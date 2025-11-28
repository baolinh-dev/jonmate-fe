import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user khi app khởi động
  const loadUser = async () => {
    try {
      const res = await api.get('/users/me'); // cookie tự gửi
      setUser(res.data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  // Logout
  const logout = async () => {
    try {
      await api.post('/users/logout'); // gọi backend xóa cookie
    } catch (err) {
      console.error(err);
    } finally {
      setUser(null); // cập nhật context
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loadUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook dùng trong component
export const useAuth = () => useContext(AuthContext);
