import { request } from "./api";
import { ENDPOINTS } from "./endpoints";
import { fromAppointment, toAppointmentRequest } from "./adapters";

export const getAppointments = async (token) =>
  ((await request(ENDPOINTS.appointments, {
    token,
    fallbackMessage: "Erro ao buscar atendimentos",
  })) ?? []).map(fromAppointment);

export const createAppointment = async (appointment, token) =>
  fromAppointment(
    await request(ENDPOINTS.appointments, {
      method: "POST",
      token,
      body: toAppointmentRequest(appointment),
    })
  );

// PUT com o atendimento completo
export const updateAppointment = async (appointment, token) =>
  fromAppointment(
    await request(ENDPOINTS.appointment(appointment.id), {
      method: "PUT",
      token,
      body: toAppointmentRequest(appointment),
    })
  );

// Só marca como realizado (RF41)
export const markAppointmentDone = async (id, token) =>
  fromAppointment(await request(ENDPOINTS.appointmentDone(id), { method: "PATCH", token }));

export const deleteAppointment = (id, token) =>
  request(ENDPOINTS.appointment(id), { method: "DELETE", token });
