// Tradução entre os DTOs do backend (Java, campos em português)
// e o formato usado pelas telas. As páginas só conhecem o formato da direita.

const pad = (id) => String(id ?? "").padStart(3, "0");
export const clientCode = (id) => `CLI-${pad(id)}`;
export const appointmentCode = (id) => `ATD-${pad(id)}`;

// campo opcional vazio vai como null (o microchip é UNIQUE no banco: "" repetido daria conflito)
const orNull = (value) => {
  if (value === undefined || value === null) return null;
  const text = String(value).trim();
  return text === "" ? null : text;
};

// "2026-11-12T09:30:00" -> "2026-11-12"
const dateOnly = (value) => (value ? String(value).slice(0, 10) : "");

// ---------------------------------------------------------------- administrador

export const fromAdmin = (dto) =>
  dto ? { id: dto.id, name: dto.nome, email: dto.email } : null;

export const toAdminUpdate = (user) => ({ nome: user.name?.trim(), email: user.email?.trim() });

// ---------------------------------------------------------------- tutor

const fromContact = (dto) => ({
  id: dto.id,
  // o backend ainda não guarda o tipo; telefone com 11 dígitos é celular
  type: dto.tipo ?? (String(dto.telefone ?? "").includes("@")
    ? "email"
    : String(dto.telefone ?? "").replace(/\D/g, "").length === 11
      ? "celular"
      : "telefone"),
  value: dto.telefone ?? "",
  whatsapp: !!dto.whatsapp,
  link: dto.linkWhatsapp ?? null,
});

const fromAddress = (dto = {}) => ({
  cep: dto.cep ?? "",
  street: dto.logradouro ?? "",
  number: dto.numero ?? "",
  complement: dto.complemento ?? "",
  district: dto.bairro ?? "",
  city: dto.cidade ?? "",
  state: dto.estado ?? "",
  reference: dto.pontoReferencia ?? "",
});

export const fromAnimalSummary = (dto) => ({
  id: dto.id,
  name: dto.nome,
  species: dto.especie ?? "",
  breed: dto.raca ?? "",
  sex: fromSex(dto.sexo),
  photo: dto.foto ?? "",
  created_at: dto.dataCadastro ?? "",
  client: dto.tutorId != null
    ? { id: dto.tutorId, name: dto.tutorNome, code: clientCode(dto.tutorId) }
    : null,
});

export const fromTutor = (dto) =>
  dto && {
    id: dto.id,
    code: clientCode(dto.id),
    name: dto.nome ?? "",
    cpf: dto.cpf ?? "",
    // campos da tela que o backend ainda não tem (ficam vazios até ele passar a devolver)
    nationality: dto.nacionalidade ?? "",
    sex: dto.sexo ?? "",
    rg: dto.rg ?? "",
    birth_date: dateOnly(dto.dataNascimento),
    created_at: dto.dataCadastro ?? "",
    contacts: (dto.contatos ?? []).map(fromContact),
    address: fromAddress(dto.endereco ?? {}),
    animals: (dto.animais ?? []).map(fromAnimalSummary),
  };

export const toTutorRequest = (client) => ({
  nome: client.name?.trim(),
  cpf: client.cpf,
  endereco: {
    cep: client.address.cep,
    logradouro: client.address.street?.trim(),
    numero: client.address.number?.trim(),
    complemento: orNull(client.address.complement),
    bairro: client.address.district?.trim(),
    cidade: client.address.city?.trim(),
    estado: client.address.state,
  },
  contatos: client.contacts.map((contact) => ({
    id: contact.id ?? null,
    telefone: contact.value.trim(),
    whatsapp: contact.type !== "email" && !!contact.whatsapp,
  })),
  // Nacionalidade, sexo, RG, nascimento, ponto de referência e tipo de contato
  // aparecem na tela, mas o backend ainda não tem essas colunas: não são enviados.
});

// ---------------------------------------------------------------- animal

const SEX_IN = { MACHO: "Macho", FEMEA: "Fêmea" };
const SEX_OUT = { Macho: "MACHO", "Fêmea": "FEMEA" };
export const fromSex = (value) => SEX_IN[value] ?? "";

const fromSterilization = (dto) => {
  if (dto.esterilizacao) return dto.esterilizacao;
  if (dto.esterilizado === true) return "Esterilizado";
  if (dto.esterilizado === false) return "Fértil";
  return "";
};

const fromAppointmentSummary = (dto) => ({
  id: dto.id,
  code: appointmentCode(dto.id),
  type: dto.tipo === "VACINA" ? "vacina" : "consulta",
  date: dateOnly(dto.dataAtendimento),
  description: dto.descricao ?? "",
  status: dto.realizado ? "realizado" : "agendado",
  animal_id: dto.animalId ?? dto.animal?.id,
  animal_name: dto.animalNome ?? dto.animal?.nome ?? "—",
  client_id: dto.tutorId ?? dto.tutor?.id,
  client_name: dto.tutorNome ?? dto.tutor?.nome ?? "—",
});

export const fromAnimal = (dto) =>
  dto && {
    id: dto.id,
    name: dto.nome ?? "",
    photo: dto.foto ?? "",
    sex: fromSex(dto.sexo),
    sterilization: fromSterilization(dto),
    species: dto.especie ?? "",
    breed: dto.raca ?? "",
    coat: dto.pelagem ?? "",
    birth_date: dateOnly(dto.dataNascimento),
    microchip: dto.microchip ?? "",
    notes: dto.observacoes ?? "",
    created_at: dto.dataCadastro ?? "",
    client: dto.tutor
      ? { id: dto.tutor.id, name: dto.tutor.nome, code: clientCode(dto.tutor.id) }
      : null,
    appointments: (dto.historicoAtendimentos ?? []).map(fromAppointmentSummary),
  };

export const toAnimalRequest = (animal, clientId) => ({
  nome: animal.name?.trim(),
  foto: orNull(animal.photo),
  sexo: SEX_OUT[animal.sex] ?? null,
  esterilizado: animal.sterilization !== "Fértil",
  especie: animal.species,
  raca: orNull(animal.breed),
  pelagem: orNull(animal.coat),
  dataNascimento: orNull(animal.birth_date),
  microchip: orNull(animal.microchip),
  tutorId: Number(clientId),
  // "esterilizacao" (Castrado/Vasectomizado/Fértil) e "observacoes" ainda não existem no backend
});

// ---------------------------------------------------------------- atendimento

export const fromAppointment = fromAppointmentSummary;

export const toAppointmentRequest = (appointment) => ({
  tipo: appointment.type === "vacina" ? "VACINA" : "CONSULTA",
  descricao: appointment.description.trim(),
  observacoes: null,
  // a tela só pede a data; o backend espera data e hora
  dataAtendimento: `${appointment.date}T00:00:00`,
  realizado: appointment.status === "realizado",
  animalId: Number(appointment.animal_id),
  tutorId: appointment.client_id ? Number(appointment.client_id) : null,
});

// ---------------------------------------------------------------- painel

export const fromDashboard = (dto) => ({
  totals: {
    appointments: dto?.totalAtendimentos ?? 0,
    done: dto?.atendimentosRealizados ?? 0,
    pending: dto?.atendimentosPendentes ?? 0,
    consultations: dto?.totalConsultas ?? 0,
    vaccines: dto?.totalVacinas ?? 0,
  },
  animals: (dto?.animaisRecentes ?? []).map(fromAnimalSummary),
  appointments: (dto?.atendimentosRecentes ?? []).map(fromAppointmentSummary),
});
