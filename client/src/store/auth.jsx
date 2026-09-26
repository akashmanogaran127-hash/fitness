import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api';

const C = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (localStorage.getItem('fit_token')) {
      api('/auth/me')
        .then((x) => setUser(x.user))
        .catch(() => localStorage.removeItem('fit_token'));
    }
  }, []);

  const login = async (body) => {
    const x = await api('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    localStorage.setItem('fit_token', x.token);
    setUser(x.user);
  };

  const register = async (body) => {
    const x = await api('/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    localStorage.setItem('fit_token', x.token);
    setUser(x.user);
  };

  const logout = () => {
    localStorage.removeItem('fit_token');
    setUser(null);
  };

  return (
    <C.Provider value={{ user, login, register, logout }}>
      {children}
    </C.Provider>
  );
}

export const useAuth = () => useContext(C);