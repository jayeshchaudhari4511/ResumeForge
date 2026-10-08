import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('resumeforge_token');
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Hydrate user on mount if token exists
  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      const storedToken = localStorage.getItem('resumeforge_token');
      if (!storedToken) {
        if (isMounted) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        const response = await authApi.getMe();
        if (isMounted && response.success && response.user) {
          setUser(response.user);
          setToken(storedToken);
        }
      } catch (err) {
        console.warn('[Auth] Session expired or invalid token:', err.message);
        if (isMounted) {
          localStorage.removeItem('resumeforge_token');
          setToken(null);
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email, password) => {
    const data = await authApi.login(email, password);
    if (data.token && data.user) {
      localStorage.setItem('resumeforge_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return data.user;
    }
    throw new Error(data.error || 'Login failed');
  };

  const register = async (name, email, password) => {
    const data = await authApi.register(name, email, password);
    if (data.token && data.user) {
      localStorage.setItem('resumeforge_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return data.user;
    }
    throw new Error(data.error || 'Registration failed');
  };

  const logout = () => {
    localStorage.removeItem('resumeforge_token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      token: null,
      loading: false,
      isAuthenticated: false,
      login: async () => {},
      register: async () => {},
      logout: () => {},
    };
  }
  return context;
}

export default AuthContext;
