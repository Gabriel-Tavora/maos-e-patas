// Backend de demonstração: responde às mesmas rotas (services/endpoints.js) e com os
// mesmos DTOs do Spring Boot, guardando tudo no localStorage. Serve também como
// exemplo executável do contrato. Não é usado quando há backend configurado.
import { seed, MOCK_RESET_CODE } from "./seed.js";

const DB_KEY = "maosepatas:demo:v3";
const TOKEN = "demo-token";

const fail = (status, message, fieldErrors) => {
  throw { status, message: fieldErrors ? Object.values(fieldErrors).join(" ") : message };
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

const now = () => new Date().toISOString().slice(0, 19);
const nextId = (list) => list.reduce((max, item) => Math.max(max, item.id), 0) + 1;
const find = (list, id, what) =>
  list.find((item) => item.id === Number(id)) ?? fail(404, `${what} não encontrado(a) com id ${id}`);

// ---------- montagem dos DTOs de resposta (igual aos mappers do backend) ----------

const contatoDTO = (c) => ({
  ...c,
  linkWhatsapp: c.whatsapp ? `https://wa.me/55${c.telefone.replace(/\D/g, "")}` : null,
});

const tutorResumo = (t) => t && { id: t.id, nome: t.nome, cpf: t.cpf, contatos: t.contatos.map(contatoDTO) };

const animalResumo = (db, a) => {
  const tutor = db.tutores.find((t) => t.id === a.tutorId);
  return {
    id: a.id, nome: a.nome, especie: a.especie, raca: a.raca, sexo: a.sexo, foto: a.foto,
    tutorId: a.tutorId, tutorNome: tutor?.nome ?? null, dataCadastro: a.dataCadastro,
  };
};

const atendimentoResumo = (db, at) => ({
  id: at.id, tipo: at.tipo, descricao: at.descricao, dataAtendimento: at.dataAtendimento,
  realizado: at.realizado, animalId: at.animalId,
  animalNome: db.animais.find((a) => a.id === at.animalId)?.nome ?? null,
  tutorId: at.tutorId, tutorNome: db.tutores.find((t) => t.id === at.tutorId)?.nome ?? null,
});

const atendimentoResponse = (db, at) => ({
  id: at.id, tipo: at.tipo, descricao: at.descricao, observacoes: at.observacoes,
  dataAtendimento: at.dataAtendimento, realizado: at.realizado, dataCadastro: at.dataCadastro,
  animal: animalResumo(db, find(db.animais, at.animalId, "Animal")),
  tutor: tutorResumo(db.tutores.find((t) => t.id === at.tutorId)),
});

const tutorResponse = (db, t) => {
  const animais = db.animais
    .filter((a) => a.tutorId === t.id)
    .sort((a, b) => b.dataCadastro.localeCompare(a.dataCadastro))
    .map((a) => animalResumo(db, a));
  return { ...t, contatos: t.contatos.map(contatoDTO), quantidadeAnimais: animais.length, animais };
};

const animalResponse = (db, a) => {
  const { tutorId: _tutorId, ...fields } = a;
  return {
    ...fields,
    tutor: tutorResumo(db.tutores.find((t) => t.id === a.tutorId)),
    historicoAtendimentos: db.atendimentos
      .filter((at) => at.animalId === a.id)
      .sort((x, y) => y.dataAtendimento.localeCompare(x.dataAtendimento))
      .map((at) => atendimentoResumo(db, at)),
  };
};

// ---------- validações (as mesmas anotações @NotBlank/@NotNull dos DTOs) ----------

const blank = (v) => v === undefined || v === null || String(v).trim() === "";

function validateTutor(body) {
  const e = {};
  if (blank(body.nome)) e.nome = "O nome do cliente é obrigatório";
  if (blank(body.cpf)) e.cpf = "O CPF é obrigatório";
  const end = body.endereco ?? {};
  if (blank(end.cep)) e["endereco.cep"] = "O CEP é obrigatório";
  if (blank(end.logradouro)) e["endereco.logradouro"] = "O logradouro é obrigatório";
  if (blank(end.numero)) e["endereco.numero"] = "O número é obrigatório";
  if (blank(end.bairro)) e["endereco.bairro"] = "O bairro é obrigatório";
  if (blank(end.cidade)) e["endereco.cidade"] = "A cidade é obrigatória";
  if (blank(end.estado) || end.estado.length !== 2) e["endereco.estado"] = "O estado deve conter 2 caracteres";
  if (!body.contatos?.length) e.contatos = "Informe ao menos um contato para o cliente";
  if (Object.keys(e).length) fail(400, "Um ou mais campos estão inválidos", e);
}

function validateAnimal(db, body, currentId) {
  const e = {};
  if (blank(body.nome)) e.nome = "O nome do animal é obrigatório";
  if (!body.sexo) e.sexo = "O sexo do animal é obrigatório";
  if (body.esterilizado == null) e.esterilizado = "Informe se o animal é esterilizado";
  if (blank(body.especie)) e.especie = "A espécie é obrigatória";
  if (body.tutorId == null) e.tutorId = "O tutor do animal é obrigatório";
  if (Object.keys(e).length) fail(400, "Um ou mais campos estão inválidos", e);
  find(db.tutores, body.tutorId, "Tutor");
  if (body.microchip && db.animais.some((a) => a.microchip === body.microchip && a.id !== currentId)) {
    fail(409, "Já existe um animal com este microchip.");
  }
}

function validateAtendimento(db, body) {
  const e = {};
  if (!body.tipo) e.tipo = "O tipo do atendimento é obrigatório";
  if (blank(body.descricao)) e.descricao = "A descrição é obrigatória";
  if (!body.dataAtendimento) e.dataAtendimento = "A data e hora do atendimento são obrigatórias";
  if (body.animalId == null) e.animalId = "O animal é obrigatório";
  if (Object.keys(e).length) fail(400, "Um ou mais campos estão inválidos", e);
  return find(db.animais, body.animalId, "Animal");
}

const withContactIds = (db, contatos) => {
  let id = db.tutores.flatMap((t) => t.contatos).reduce((m, c) => Math.max(m, c.id), 0);
  return contatos.map((c) => ({ ...c, id: c.id ?? ++id }));
};

// ---------- rotas ----------

const routes = [
  ["POST", /^\/api\/auth\/login$/, (db, _m, body) => {
    const ok = body.email?.trim().toLowerCase() === db.administrador.email.toLowerCase() &&
      body.senha === db.administrador.senha;
    if (!ok) fail(401, "E-mail ou senha inválidos");
    const { senha: _s, ...administrador } = db.administrador;
    return { token: TOKEN, tipo: "Bearer", expiracaoEmMs: 86400000, administrador };
  }, { open: true }],
  ["POST", /^\/api\/auth\/recuperar-senha$/, () => null, { open: true }],
  ["POST", /^\/api\/auth\/redefinir-senha$/, (db, _m, body) => {
    if (body.email?.trim().toLowerCase() !== db.administrador.email.toLowerCase() ||
        body.codigoVerificacao !== MOCK_RESET_CODE) {
      fail(400, "Código inválido ou expirado");
    }
    db.administrador.senha = body.novaSenha;
    return null;
  }, { open: true }],

  ["GET", /^\/api\/administradores\/perfil$/, (db) => {
    const { senha: _s, ...admin } = db.administrador;
    return admin;
  }],
  ["PUT", /^\/api\/administradores\/perfil$/, (db, _m, body) => {
    db.administrador.nome = body.nome;
    db.administrador.email = body.email;
    const { senha: _s, ...admin } = db.administrador;
    return admin;
  }],
  ["PATCH", /^\/api\/administradores\/senha$/, (db, _m, body) => {
    if (body.senhaAtual !== db.administrador.senha) fail(400, "A senha atual está incorreta");
    db.administrador.senha = body.novaSenha;
    return null;
  }],

  ["GET", /^\/api\/dashboard$/, (db) => {
    const at = db.atendimentos;
    return {
      totalAtendimentos: at.length,
      atendimentosRealizados: at.filter((a) => a.realizado).length,
      atendimentosPendentes: at.filter((a) => !a.realizado).length,
      totalConsultas: at.filter((a) => a.tipo === "CONSULTA").length,
      totalVacinas: at.filter((a) => a.tipo === "VACINA").length,
      animaisRecentes: [...db.animais]
        .sort((a, b) => b.dataCadastro.localeCompare(a.dataCadastro))
        .slice(0, 5)
        .map((a) => animalResumo(db, a)),
      atendimentosRecentes: [...at]
        .sort((a, b) => b.dataCadastro.localeCompare(a.dataCadastro))
        .slice(0, 5)
        .map((a) => atendimentoResumo(db, a)),
    };
  }],

  ["GET", /^\/api\/tutores$/, (db) =>
    [...db.tutores].sort((a, b) => a.nome.localeCompare(b.nome)).map((t) => tutorResponse(db, t))],
  ["POST", /^\/api\/tutores$/, (db, _m, body) => {
    validateTutor(body);
    if (db.tutores.some((t) => t.cpf === body.cpf)) fail(409, "Já existe um cliente com este CPF.");
    const tutor = {
      ...body,
      id: nextId(db.tutores),
      dataCadastro: now(),
      contatos: withContactIds(db, body.contatos),
    };
    db.tutores.push(tutor);
    return tutorResponse(db, tutor);
  }],
  ["GET", /^\/api\/tutores\/(\d+)$/, (db, [, id]) => tutorResponse(db, find(db.tutores, id, "Tutor"))],
  ["PUT", /^\/api\/tutores\/(\d+)$/, (db, [, id], body) => {
    const tutor = find(db.tutores, id, "Tutor");
    validateTutor(body);
    if (db.tutores.some((t) => t.cpf === body.cpf && t.id !== tutor.id)) {
      fail(409, "Já existe um cliente com este CPF.");
    }
    Object.assign(tutor, body, {
      id: tutor.id,
      dataCadastro: tutor.dataCadastro,
      contatos: withContactIds(db, body.contatos),
    });
    return tutorResponse(db, tutor);
  }],
  ["DELETE", /^\/api\/tutores\/(\d+)$/, (db, [, id]) => {
    const tutor = find(db.tutores, id, "Tutor");
    if (db.animais.some((a) => a.tutorId === tutor.id)) {
      fail(400, "Não é possível excluir um cliente que possui animais cadastrados");
    }
    db.tutores = db.tutores.filter((t) => t.id !== tutor.id);
    db.atendimentos = db.atendimentos.filter((a) => a.tutorId !== tutor.id);
    return null;
  }],

  ["GET", /^\/api\/animais$/, (db) =>
    [...db.animais]
      .sort((a, b) => b.dataCadastro.localeCompare(a.dataCadastro))
      .map((a) => animalResumo(db, a))],
  ["POST", /^\/api\/animais$/, (db, _m, body) => {
    validateAnimal(db, body);
    const animal = { ...body, id: nextId(db.animais), tutorId: Number(body.tutorId), dataCadastro: now() };
    db.animais.push(animal);
    return animalResponse(db, animal);
  }],
  ["POST", /^\/api\/animais\/lote$/, (db, _m, body) => {
    if (!body.animais?.length) fail(400, "A lista de animais não pode estar vazia");
    const chips = body.animais.map((a) => a.microchip).filter(Boolean);
    if (new Set(chips).size !== chips.length) fail(409, "Há microchips repetidos na lista.");
    // valida todos antes de gravar: ou salva todos, ou nenhum
    body.animais.forEach((a) => validateAnimal(db, a));
    return body.animais.map((a) => {
      const animal = { ...a, id: nextId(db.animais), tutorId: Number(a.tutorId), dataCadastro: now() };
      db.animais.push(animal);
      return animalResponse(db, animal);
    });
  }],
  ["GET", /^\/api\/animais\/(\d+)$/, (db, [, id]) => animalResponse(db, find(db.animais, id, "Animal"))],
  ["PUT", /^\/api\/animais\/(\d+)$/, (db, [, id], body) => {
    const animal = find(db.animais, id, "Animal");
    validateAnimal(db, body, animal.id);
    Object.assign(animal, body, { id: animal.id, dataCadastro: animal.dataCadastro });
    return animalResponse(db, animal);
  }],
  ["DELETE", /^\/api\/animais\/(\d+)$/, (db, [, id]) => {
    const animal = find(db.animais, id, "Animal");
    db.animais = db.animais.filter((a) => a.id !== animal.id);
    db.atendimentos = db.atendimentos.filter((a) => a.animalId !== animal.id);
    return null;
  }],

  ["GET", /^\/api\/atendimentos$/, (db) =>
    [...db.atendimentos]
      .sort((a, b) => b.dataAtendimento.localeCompare(a.dataAtendimento) || b.id - a.id)
      .map((at) => atendimentoResumo(db, at))],
  ["POST", /^\/api\/atendimentos$/, (db, _m, body) => {
    const animal = validateAtendimento(db, body);
    const atendimento = {
      ...body,
      id: nextId(db.atendimentos),
      realizado: !!body.realizado,
      tutorId: animal.tutorId,
      dataCadastro: now(),
    };
    db.atendimentos.push(atendimento);
    return atendimentoResponse(db, atendimento);
  }],
  ["PUT", /^\/api\/atendimentos\/(\d+)$/, (db, [, id], body) => {
    const atendimento = find(db.atendimentos, id, "Atendimento");
    const animal = validateAtendimento(db, body);
    Object.assign(atendimento, body, {
      id: atendimento.id,
      tutorId: animal.tutorId,
      dataCadastro: atendimento.dataCadastro,
    });
    return atendimentoResponse(db, atendimento);
  }],
  ["PATCH", /^\/api\/atendimentos\/(\d+)\/realizar$/, (db, [, id]) => {
    const atendimento = find(db.atendimentos, id, "Atendimento");
    atendimento.realizado = true;
    return atendimentoResponse(db, atendimento);
  }],
  ["DELETE", /^\/api\/atendimentos\/(\d+)$/, (db, [, id]) => {
    find(db.atendimentos, id, "Atendimento");
    db.atendimentos = db.atendimentos.filter((a) => a.id !== Number(id));
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
    // cópia do corpo, como se tivesse passado pela rede
    const result = handler(db, match, body ? JSON.parse(JSON.stringify(body)) : {});
    if (method !== "GET") save(db);
    return result == null ? null : JSON.parse(JSON.stringify(result));
  }

  return fail(404, "Rota não encontrada.");
}

// Apaga os dados de demonstração e volta ao estado inicial
export function resetMockData() {
  localStorage.removeItem(DB_KEY);
}
