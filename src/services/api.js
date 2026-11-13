import { mockRequest } from "./mock/server.js";

export const API_URL = import.meta.env.VITE_API_URL ?? "";

// Sem VITE_API_URL o app usa os dados de demonstração (services/mock)
export const USE_MOCK = !API_URL;

/**
 * Wrapper de fetch usado por todos os services.
 * Em caso de erro lança { status, message } — status fica undefined em falha de rede.
 *
 * @example
 * const clients = await request("/clients", { token });
 * await request("/clients/3", { method: "PATCH", token, body: { name } });
 */
export async function request(path, { method = "GET", token, body, fallbackMessage } = {}) {
  if (USE_MOCK) return mockRequest(path, { method, token, body });

  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw { status: undefined, message: "Não foi possível conectar ao servidor." };
  }

  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    throw {
      status: response.status,
      message: data?.message || data?.error || fallbackMessage || "Erro na requisição.",
    };
  }

  return data;
}
