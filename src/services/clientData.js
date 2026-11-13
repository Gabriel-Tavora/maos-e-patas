import { request } from "./api";
// /clients — tutores. Cada cliente vem com contacts[], address{} e animals[].

export const getClients = (token) =>
  request("/clients", { token, fallbackMessage: "Erro ao buscar clientes" });

export const getClient = (id, token) =>
  request(`/clients/${id}`, { token, fallbackMessage: "Erro ao buscar cliente" });

export const createClient = (data, token) =>
  request("/clients", { method: "POST", token, body: data });

export const updateClient = (id, data, token) =>
  request(`/clients/${id}`, { method: "PATCH", token, body: data });

// O backend deve recusar (409) enquanto o tutor tiver animais cadastrados
export const deleteClient = (id, token) =>
  request(`/clients/${id}`, { method: "DELETE", token });
