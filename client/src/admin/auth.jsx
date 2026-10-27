import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api, tokenStore } from '../lib/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  const load = useCallback(async () => {
    if (!tokenStore.get()) {
      setUser(null);
      setChecking(false);
      return;
    }
    try {
      setUser(await api('/auth/me', { auth: true }));
    } catch {
      tokenStore.clear();
      setUser(null);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const login = async (email, password) => {
    const data = await api('/auth/login', { method: 'POST', body: { email, password } });
    tokenStore.set(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    tokenStore.clear();
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, checking, login, logout, reload: load }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
