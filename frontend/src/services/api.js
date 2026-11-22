import { mockRequest } from "./mock/server.js";

// Em desenvolvimento o Vite repassa /api para VITE_BACKEND_URL (ver vite.config.js).
// Em produção, VITE_API_URL pode apontar direto para o backend.
export const API_URL = import.meta.env.VITE_API_URL ?? "";

// Sem backend configurado o app usa os dados de demonstração (services/mock)
export const USE_MOCK = !import.meta.env.VITE_BACKEND_URL && !import.meta.env.VITE_API_URL;

// ErrorResponse do backend: { status, error, message, fieldErrors: { campo: mensagem } }
function errorMessage(data, fallback) {
  const fieldMessages = data?.fieldErrors ? Object.values(data.fieldErrors) : [];
  if (fieldMessages.length) return fieldMessages.join(" ");
  return data?.message || data?.error || fallback || "Erro na requisição.";
}

/**
 * Wrapper de fetch usado por todos os services.
 * Em caso de erro lança { status, message } — status fica undefined em falha de rede.
 *
 * @example
 * const tutores = await request(ENDPOINTS.tutors, { token });
 * await request(ENDPOINTS.tutor(3), { method: "PUT", token, body });
 */
export async function request(path, { method = "GET", token, body, fallbackMessage } = {}) {
  if (USE_MOCK) return mockRequest(path, { method, token, body });

  const headers = { Accept: "application/json" };
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
    throw { status: response.status, message: errorMessage(data, fallbackMessage) };
  }

  return data;
}
