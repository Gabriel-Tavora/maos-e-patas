import { request } from "./api";
// /appointments — consultas e vacinas. Vêm com animal_name e client_name.

export const getAppointments = (token) =>
  request("/appointments", { token, fallbackMessage: "Erro ao buscar atendimentos" });

export const createAppointment = (data, token) =>
  request("/appointments", { method: "POST", token, body: data });

export const updateAppointment = (id, data, token) =>
  request(`/appointments/${id}`, { method: "PATCH", token, body: data });

export const deleteAppointment = (id, token) =>
  request(`/appointments/${id}`, { method: "DELETE", token });
