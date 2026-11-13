// Backend de demonstração: responde às mesmas rotas que os services chamam,
// guardando os dados no localStorage. Não é usado quando VITE_API_URL está definida.
import { seed, MOCK_RESET_CODE } from "./seed.js";

const DB_KEY = "maosepatas:demo:v1";
const TOKEN = "demo-token";

const fail = (status, message) => {
  throw { status, message };
};

function load() {
  try {
    const saved = localStorage.getItem(DB_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // localStorage indisponível
  }
  return seed();
}

function save(db) {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch {
    fail(500, "Não foi possível salvar (armazenamento do navegador cheio).");
  }
}

const nextId = (list) => list.reduce((max, item) => Math.max(max, item.id), 0) + 1;
const code = (prefix, id) => `${prefix}-${String(id).padStart(3, "0")}`;
const find = (list, id) => list.find((item) => item.id === Number(id)) ?? fail(404, "Registro não encontrado.");

const publicUser = ({ password: _password, ...user }) => user;

const withAnimals = (db, client) => ({
  ...client,
  animals: db.animals
    .filter((animal) => animal.client_id === client.id)
    .map(({ id, name, species, breed, photo }) => ({ id, name, species, breed, photo })),
});

const withNames = (db, appointment) => ({
  ...appointment,
  animal_name: db.animals.find((a) => a.id === appointment.animal_id)?.name ?? "—",
  client_name: db.clients.find((c) => c.id === appointment.client_id)?.name ?? "—",
});

const withClient = (db, animal) => {
  const client = db.clients.find((c) => c.id === animal.client_id);
  return {
    ...animal,
    client: client ? { id: client.id, name: client.name, code: client.code } : null,
    appointments: db.appointments
      .filter((a) => a.animal_id === animal.id)
      .sort((a, b) => b.date.localeCompare(a.date)),
  };
};

const routes = [
  // -------- auth --------
  ["POST", /^\/login$/, (db, _m, body) => {
    const ok = body?.email?.trim().toLowerCase() === db.user.email.toLowerCase() &&
      body?.password === db.user.password;
    if (!ok) fail(401, "Email ou senha inválidos.");
    return { id: db.user.id, token: TOKEN };
  }, { open: true }],
  ["POST", /^\/password$/, () => null, { open: true }],
  ["PATCH", /^\/password$/, (db, _m, body) => {
    if (body?.code !== MOCK_RESET_CODE) fail(400, "Código inválido ou expirado.");
    db.user.password = body.password;
    return null;
  }, { open: true }],

  // -------- usuário --------
  ["GET", /^\/users\/me$/, (db) => publicUser(db.user)],
  ["PATCH", /^\/users$/, (db, _m, body) => {
    Object.assign(db.user, body);
    return publicUser(db.user);
  }],

  // -------- clientes --------
  ["GET", /^\/clients$/, (db) => db.clients.map((client) => withAnimals(db, client))],
  ["POST", /^\/clients$/, (db, _m, body) => {
    if (db.clients.some((c) => c.cpf === body.cpf)) fail(409, "Já existe um cliente com este CPF.");
    const id = nextId(db.clients);
    const client = { ...body, id, code: code("CLI", id) };
    db.clients.push(client);
    return withAnimals(db, client);
  }],
  ["GET", /^\/clients\/(\d+)$/, (db, [, id]) => withAnimals(db, find(db.clients, id))],
  ["PATCH", /^\/clients\/(\d+)$/, (db, [, id], body) => {
    const client = find(db.clients, id);
    Object.assign(client, body, { id: client.id, code: client.code });
    return withAnimals(db, client);
  }],
  ["DELETE", /^\/clients\/(\d+)$/, (db, [, id]) => {
    const client = find(db.clients, id);
    if (db.animals.some((animal) => animal.client_id === client.id)) {
      fail(409, "Exclua todos os animais deste tutor antes de excluir o cadastro.");
    }
    db.clients = db.clients.filter((c) => c.id !== client.id);
    db.appointments = db.appointments.filter((a) => a.client_id !== client.id);
    return null;
  }],

  // -------- animais --------
  ["GET", /^\/animals$/, (db) =>
    [...db.animals]
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .map((animal) => withClient(db, animal))],
  ["POST", /^\/animals$/, (db, _m, body) => {
    find(db.clients, body.client_id);
    const animal = {
      ...body,
      id: nextId(db.animals),
      client_id: Number(body.client_id),
      created_at: new Date().toISOString(),
    };
    db.animals.push(animal);
    return withClient(db, animal);
  }],
  ["GET", /^\/animals\/(\d+)$/, (db, [, id]) => withClient(db, find(db.animals, id))],
  ["PATCH", /^\/animals\/(\d+)$/, (db, [, id], body) => {
    const animal = find(db.animals, id);
    Object.assign(animal, body, { id: animal.id, client_id: animal.client_id });
    return withClient(db, animal);
  }],
  ["DELETE", /^\/animals\/(\d+)$/, (db, [, id]) => {
    const animal = find(db.animals, id);
    db.animals = db.animals.filter((a) => a.id !== animal.id);
    db.appointments = db.appointments.filter((a) => a.animal_id !== animal.id);
    return null;
  }],

  // -------- atendimentos --------
  ["GET", /^\/appointments$/, (db) =>
    [...db.appointments]
      .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id)
      .map((appointment) => withNames(db, appointment))],
  ["POST", /^\/appointments$/, (db, _m, body) => {
    const animal = find(db.animals, body.animal_id);
    const id = nextId(db.appointments);
    const appointment = {
      ...body,
      id,
      code: code("ATD", id),
      animal_id: animal.id,
      client_id: animal.client_id,
    };
    db.appointments.push(appointment);
    return withNames(db, appointment);
  }],
  ["PATCH", /^\/appointments\/(\d+)$/, (db, [, id], body) => {
    const appointment = find(db.appointments, id);
    Object.assign(appointment, body, { id: appointment.id, code: appointment.code });
    return withNames(db, appointment);
  }],
  ["DELETE", /^\/appointments\/(\d+)$/, (db, [, id]) => {
    find(db.appointments, id);
    db.appointments = db.appointments.filter((a) => a.id !== Number(id));
    return null;
  }],
];

export async function mockRequest(path, { method = "GET", token, body } = {}) {
  await new Promise((resolve) => setTimeout(resolve, 120));

  const pathname = path.split("?")[0];
  for (const [routeMethod, pattern, handler, options] of routes) {
    const match = routeMethod === method && pathname.match(pattern);
    if (!match) continue;

    if (!options?.open && token !== TOKEN) fail(401, "Sessão expirada.");

    const db = load();
    const result = handler(db, match, body ?? {});
    if (method !== "GET") save(db);
    // devolve uma cópia, como uma resposta de rede faria
    return result == null ? null : JSON.parse(JSON.stringify(result));
  }

  return fail(404, "Rota não encontrada.");
}

// Apaga os dados de demonstração e volta ao estado inicial
export function resetMockData() {
  localStorage.removeItem(DB_KEY);
}
