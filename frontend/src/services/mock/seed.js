// Dados iniciais do modo demonstração, no mesmo formato das entidades do backend
// (tb_administrador, tb_tutor, tb_contato, tb_animal, tb_atendimento).

// mesmo administrador padrão do backend (DataInitializer)
export const MOCK_LOGIN = { email: "admin@maosepatas.com.br", password: "admin123" };
export const MOCK_RESET_CODE = "123456";

const endereco = (logradouro, numero, bairro, extra = {}) => ({
  cep: "60000-000",
  logradouro,
  numero,
  complemento: null,
  bairro,
  cidade: "Fortaleza",
  estado: "CE",
  ...extra,
});

export const seed = () => ({
  administrador: {
    id: 1,
    nome: "Administrador",
    email: MOCK_LOGIN.email,
    senha: MOCK_LOGIN.password,
  },
  tutores: [
    {
      id: 1, nome: "Maria Oliveira", cpf: "123.456.789-09", dataCadastro: "2026-11-01T10:00:00",
      endereco: endereco("Rua das Flores", "150", "Centro", {
        complemento: "Apartamento 202",
        pontoReferencia: "Próximo à praça",
      }),
      contatos: [
        { id: 1, telefone: "(85) 99999-1234", whatsapp: true, tipo: "celular" },
        { id: 2, telefone: "(85) 3333-1234", whatsapp: false, tipo: "telefone" },
      ],
      nacionalidade: "Brasileira", sexo: "Feminino", rg: "12.345.678-9", dataNascimento: "1990-04-15",
    },
    {
      id: 2, nome: "João Santos", cpf: "529.982.247-25", dataCadastro: "2026-11-02T10:00:00",
      endereco: endereco("Av. Beira Mar", "1020", "Meireles"),
      contatos: [{ id: 3, telefone: "(85) 98888-4321", whatsapp: true, tipo: "celular" }],
      nacionalidade: "Brasileira", sexo: "Masculino", rg: "23.456.789-0", dataNascimento: "1985-09-02",
    },
    {
      id: 3, nome: "Ana Costa", cpf: "111.444.777-35", dataCadastro: "2026-11-03T10:00:00",
      endereco: endereco("Rua do Sol", "48", "Aldeota"),
      contatos: [{ id: 4, telefone: "(85) 99777-1111", whatsapp: true, tipo: "celular" }],
      nacionalidade: "Brasileira", sexo: "Feminino", rg: "34.567.890-1", dataNascimento: "1996-01-23",
    },
    {
      id: 4, nome: "Carlos Almeida", cpf: "390.533.447-05", dataCadastro: "2026-11-04T10:00:00",
      endereco: endereco("Rua das Acácias", "7", "Benfica"),
      contatos: [{ id: 5, telefone: "(85) 3222-9090", whatsapp: false, tipo: "telefone" }],
      nacionalidade: "Brasileira", sexo: "Masculino", rg: "45.678.901-2", dataNascimento: "1978-11-30",
    },
  ],
  animais: [
    {
      id: 1, tutorId: 1, nome: "Mel", sexo: "FEMEA", esterilizado: true, esterilizacao: "Castrado",
      especie: "Cachorro", raca: "Golden Retriever", pelagem: "Dourada", dataNascimento: "2022-06-15",
      microchip: null, foto: null, observacoes: "Animal dócil e sociável.",
      dataCadastro: "2026-11-05T12:00:00",
    },
    {
      id: 2, tutorId: 1, nome: "Bidu", sexo: "MACHO", esterilizado: false, esterilizacao: "Fértil",
      especie: "Cachorro", raca: null, pelagem: null, dataNascimento: null, microchip: null,
      foto: null, observacoes: null, dataCadastro: "2026-11-01T12:00:00",
    },
    {
      id: 3, tutorId: 2, nome: "Luna", sexo: "FEMEA", esterilizado: true, esterilizacao: "Castrado",
      especie: "Gato", raca: "Siamês", pelagem: "Curta", dataNascimento: "2023-02-10", microchip: null,
      foto: null, observacoes: null, dataCadastro: "2026-11-04T12:00:00",
    },
    {
      id: 4, tutorId: 3, nome: "Thor", sexo: "MACHO", esterilizado: false, esterilizacao: "Fértil",
      especie: "Cachorro", raca: "Labrador", pelagem: "Preta", dataNascimento: "2021-08-21",
      microchip: null, foto: null, observacoes: null, dataCadastro: "2026-11-03T12:00:00",
    },
    {
      id: 5, tutorId: 3, nome: "Nina", sexo: "FEMEA", esterilizado: true, esterilizacao: "Castrado",
      especie: "Gato", raca: "SRD", pelagem: "Rajada", dataNascimento: "2024-03-05", microchip: null,
      foto: null, observacoes: null, dataCadastro: "2026-11-02T12:00:00",
    },
  ],
  atendimentos: [
    { id: 1, tipo: "CONSULTA", animalId: 1, tutorId: 1, dataAtendimento: "2026-11-10T00:00:00", descricao: "Avaliação de rotina", observacoes: null, realizado: true, dataCadastro: "2026-11-09T10:00:00" },
    { id: 2, tipo: "VACINA", animalId: 3, tutorId: 2, dataAtendimento: "2026-11-12T00:00:00", descricao: "Vacina antirrábica", observacoes: null, realizado: false, dataCadastro: "2026-11-10T10:00:00" },
    { id: 3, tipo: "CONSULTA", animalId: 4, tutorId: 3, dataAtendimento: "2026-11-13T00:00:00", descricao: "Avaliação clínica", observacoes: null, realizado: false, dataCadastro: "2026-11-11T10:00:00" },
    { id: 4, tipo: "VACINA", animalId: 2, tutorId: 1, dataAtendimento: "2026-11-05T00:00:00", descricao: "Vacina V8", observacoes: null, realizado: true, dataCadastro: "2026-11-04T10:00:00" },
  ],
});
