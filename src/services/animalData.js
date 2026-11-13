import { request } from "./api";
// /animals — cada animal vem com client{ id, name, code } e appointments[].

export const getAnimals = (token) =>
  request("/animals", { token, fallbackMessage: "Erro ao buscar animais" });

export const getAnimal = (id, token) =>
  request(`/animals/${id}`, { token, fallbackMessage: "Erro ao buscar animal" });

export const createAnimal = (data, token) =>
  request("/animals", { method: "POST", token, body: data });

export const updateAnimal = (id, data, token) =>
  request(`/animals/${id}`, { method: "PATCH", token, body: data });

export const deleteAnimal = (id, token) =>
  request(`/animals/${id}`, { method: "DELETE", token });
