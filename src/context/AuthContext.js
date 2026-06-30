import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';
import { login as apiLogin } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  // Clear previous login every time the app starts
  localStorage.clear();

  setUser(null);
  setLoading(false);
}, []);

  const login = async (credentials) => {
    const { data } = await apiLogin(credentials);

    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.username);
    localStorage.setItem('role', data.role);

    setUser({
      token: data.token,
      username: data.username,
      role: data.role,
    });

    return data;
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  const isAdmin = () => user?.role === 'ROLE_ADMIN';
  const isManager = () =>
    ['ROLE_ADMIN', 'ROLE_MANAGER'].includes(user?.role);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        isAdmin,
        isManager,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);