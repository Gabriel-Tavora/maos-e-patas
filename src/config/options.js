// Opções das caixas de seleção dos formulários

export const SEX_OPTIONS = ["Feminino", "Masculino", "Outro"];

export const CONTACT_TYPES = [
  { value: "celular", label: "Celular" },
  { value: "telefone", label: "Telefone residencial" },
  { value: "email", label: "E-mail" },
];

export const STATES = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA",
  "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

export const ANIMAL_SEX = ["Macho", "Fêmea"];

export const STERILIZATION = ["Castrado", "Vasectomizado", "Fértil"];

// Espécie -> sugestões de raça (o campo de raça também aceita texto livre)
export const SPECIES = {
  Cachorro: [
    "SRD", "Golden Retriever", "Labrador", "Poodle", "Shih Tzu", "Yorkshire",
    "Bulldog Francês", "Pinscher", "Pastor Alemão", "Dachshund", "Border Collie", "Pug",
  ],
  Gato: ["SRD", "Siamês", "Persa", "Maine Coon", "Angorá", "Bengal", "Sphynx", "Ragdoll"],
  Ave: ["Calopsita", "Periquito", "Papagaio", "Canário"],
  Coelho: ["SRD", "Mini Lop", "Lion Head", "Nova Zelândia"],
  Roedor: ["Hamster", "Porquinho-da-índia", "Chinchila"],
  Equino: ["SRD", "Quarto de Milha", "Mangalarga", "Crioulo"],
  Bovino: [],
  Exótico: [],
  Outro: [],
};

export const APPOINTMENT_TYPES = [
  { value: "consulta", label: "Consulta" },
  { value: "vacina", label: "Vacina" },
];

export const APPOINTMENT_STATUS = [
  { value: "agendado", label: "Agendado" },
  { value: "realizado", label: "Realizado" },
];
