import { createContext, useCallback, useContext, useEffect, useState } from "react";

const TokenContext = createContext();

const KEYS = ["token", "userId"];

// "Lembrar de mim" marcado -> localStorage; desmarcado -> só enquanto a aba estiver aberta
const read = (key) => localStorage.getItem(key) ?? sessionStorage.getItem(key);
const clear = () =>
  KEYS.forEach((key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = read("token");
    const savedId = read("userId");

    if (savedToken) setToken(savedToken);
    if (savedId) setId(Number(savedId));

    setLoading(false);
  }, []);

  const login = useCallback((id, token, remember = true) => {
    clear();
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem("userId", id);
    storage.setItem("token", token);
    setId(id);
    setToken(token);
  }, []);

  const logout = useCallback(() => {
    clear();
    setId(null);
    setToken(null);
  }, []);

  return (
    <TokenContext.Provider
      value={{ id, token, authenticated: !!token, loading, login, logout }}
    >
      {children}
    </TokenContext.Provider>
  );
}

export const useAuthValue = () => useContext(TokenContext);
