// Dados iniciais do modo demonstração (os mesmos das telas de referência)

export const MOCK_LOGIN = { email: "admin@maosepatas.com", password: "admin123" };
export const MOCK_RESET_CODE = "123456";

const address = (street, number, district) => ({
  cep: "60000-000",
  street,
  number,
  complement: "",
  district,
  city: "Fortaleza",
  state: "CE",
  reference: "",
});

export const seed = () => ({
  user: {
    id: 1,
    name: "Administrador",
    email: MOCK_LOGIN.email,
    role: "Responsável pela clínica",
    password: MOCK_LOGIN.password,
  },
  clients: [
    {
      id: 1, code: "CLI-001", name: "Maria Oliveira", nationality: "Brasileira",
      sex: "Feminino", cpf: "123.456.789-09", rg: "12.345.678-9", birth_date: "1990-04-15",
      contacts: [
        { type: "celular", value: "(85) 99999-1234", whatsapp: true },
        { type: "telefone", value: "(85) 3333-1234", whatsapp: false },
        { type: "email", value: "maria@email.com", whatsapp: false },
      ],
      address: {
        ...address("Rua das Flores", "150", "Centro"),
        complement: "Apartamento 202",
        reference: "Próximo à praça",
      },
    },
    {
      id: 2, code: "CLI-002", name: "João Santos", nationality: "Brasileira",
      sex: "Masculino", cpf: "529.982.247-25", rg: "23.456.789-0", birth_date: "1985-09-02",
      contacts: [{ type: "celular", value: "(85) 98888-4321", whatsapp: true }],
      address: address("Av. Beira Mar", "1020", "Meireles"),
    },
    {
      id: 3, code: "CLI-003", name: "Ana Costa", nationality: "Brasileira",
      sex: "Feminino", cpf: "111.444.777-35", rg: "34.567.890-1", birth_date: "1996-01-23",
      contacts: [{ type: "email", value: "ana@email.com", whatsapp: false }],
      address: address("Rua do Sol", "48", "Aldeota"),
    },
    {
      id: 4, code: "CLI-004", name: "Carlos Almeida", nationality: "Brasileira",
      sex: "Masculino", cpf: "390.533.447-05", rg: "45.678.901-2", birth_date: "1978-11-30",
      contacts: [{ type: "telefone", value: "(85) 3222-9090", whatsapp: false }],
      address: address("Rua das Acácias", "7", "Benfica"),
    },
  ],
  animals: [
    {
      id: 1, client_id: 1, name: "Mel", sex: "Fêmea", sterilization: "Castrado",
      species: "Cachorro", breed: "Golden Retriever", coat: "Dourada",
      birth_date: "2022-06-15", microchip: "", notes: "Animal dócil e sociável.",
      photo: "", created_at: "2026-11-05T12:00:00Z",
    },
    {
      id: 2, client_id: 1, name: "Bidu", sex: "Macho", sterilization: "Fértil",
      species: "Cachorro", breed: "", coat: "", birth_date: "", microchip: "", notes: "",
      photo: "", created_at: "2026-11-01T12:00:00Z",
    },
    {
      id: 3, client_id: 2, name: "Luna", sex: "Fêmea", sterilization: "Castrado",
      species: "Gato", breed: "Siamês", coat: "Curta", birth_date: "2023-02-10",
      microchip: "", notes: "", photo: "", created_at: "2026-11-04T12:00:00Z",
    },
    {
      id: 4, client_id: 3, name: "Thor", sex: "Macho", sterilization: "Fértil",
      species: "Cachorro", breed: "Labrador", coat: "Preta", birth_date: "2021-08-21",
      microchip: "", notes: "", photo: "", created_at: "2026-11-03T12:00:00Z",
    },
    {
      id: 5, client_id: 3, name: "Nina", sex: "Fêmea", sterilization: "Castrado",
      species: "Gato", breed: "SRD", coat: "Rajada", birth_date: "2024-03-05",
      microchip: "", notes: "", photo: "", created_at: "2026-11-02T12:00:00Z",
    },
  ],
  appointments: [
    { id: 1, code: "ATD-001", type: "consulta", client_id: 1, animal_id: 1, date: "2026-11-10", description: "Avaliação de rotina", status: "realizado" },
    { id: 2, code: "ATD-002", type: "vacina", client_id: 2, animal_id: 3, date: "2026-11-12", description: "Vacina antirrábica", status: "agendado" },
    { id: 3, code: "ATD-003", type: "consulta", client_id: 3, animal_id: 4, date: "2026-11-13", description: "Avaliação clínica", status: "agendado" },
    { id: 4, code: "ATD-004", type: "vacina", client_id: 1, animal_id: 2, date: "2026-11-05", description: "Vacina V8", status: "realizado" },
  ],
});
