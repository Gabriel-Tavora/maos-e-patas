import { useCallback, useEffect, useRef, useState } from "react";
import { useAuthValue } from "../context/TokenContext.jsx";
import { getErrorMessage } from "../utils/handleApiError.js";

/**
 * Busca dados com o token do usuário e controla loading/erro.
 * `key` muda quando a busca precisa ser refeita (ex.: id da rota).
 *
 * @example
 * const { data, loading, errorMessage, reload } = useFetch((token) => getClient(id, token), id);
 */
export function useFetch(fetcher, key = "") {
  const { token, logout } = useAuthValue();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // sempre a versão mais recente da função, sem refazer a busca a cada render
  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  const load = useCallback(async () => {
    if (!token) return;
    setErrorMessage("");
    try {
      setData(await fetcherRef.current(token));
    } catch (err) {
      console.error(err);
      if (err?.status === 401) logout();
      setErrorMessage(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [token, logout, key]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    load();
  }, [load]);

  return { data, setData, loading, errorMessage, reload: load };
}
