import { request } from "./api";
import { ENDPOINTS } from "./endpoints";
import { fromTutor, toTutorRequest } from "./adapters";

export const getClients = async (token) =>
  ((await request(ENDPOINTS.tutors, { token, fallbackMessage: "Erro ao buscar clientes" })) ?? [])
    .map(fromTutor);

export const getClient = async (id, token) =>
  fromTutor(await request(ENDPOINTS.tutor(id), { token, fallbackMessage: "Erro ao buscar cliente" }));

export const createClient = async (client, token) =>
  fromTutor(await request(ENDPOINTS.tutors, { method: "POST", token, body: toTutorRequest(client) }));

// O backend recebe o cadastro completo (PUT): passe o cliente inteiro já com as alterações
export const updateClient = async (id, client, token) =>
  fromTutor(await request(ENDPOINTS.tutor(id), { method: "PUT", token, body: toTutorRequest(client) }));

export const deleteClient = (id, token) =>
  request(ENDPOINTS.tutor(id), { method: "DELETE", token });
