import { request } from "./api";
import { ENDPOINTS } from "./endpoints";
import { fromAnimal, toAnimalRequest } from "./adapters";

export const getAnimal = async (id, token) =>
  fromAnimal(await request(ENDPOINTS.animal(id), { token, fallbackMessage: "Erro ao buscar animal" }));

export const createAnimal = async (animal, clientId, token) =>
  fromAnimal(
    await request(ENDPOINTS.animals, { method: "POST", token, body: toAnimalRequest(animal, clientId) })
  );

// Vários animais do mesmo tutor numa só operação (RF30 / RN07)
export const createAnimals = async (animals, clientId, token) =>
  ((await request(ENDPOINTS.animalsBatch, {
    method: "POST",
    token,
    body: { animais: animals.map((animal) => toAnimalRequest(animal, clientId)) },
  })) ?? []).map(fromAnimal);

export const updateAnimal = async (id, animal, clientId, token) =>
  fromAnimal(
    await request(ENDPOINTS.animal(id), { method: "PUT", token, body: toAnimalRequest(animal, clientId) })
  );

export const deleteAnimal = (id, token) =>
  request(ENDPOINTS.animal(id), { method: "DELETE", token });
