// Todas as rotas do backend em um lugar só, iguais aos controllers do
// repositório maosepatas (branch develop, commit 7fee1f3 de 20/11/2026).
// Se o backend mudar algum caminho, ajuste somente este arquivo.

export const ENDPOINTS = {
  // auth
  login: "/api/auth/login", //                      POST  LoginRequestDTO -> TokenResponseDTO
  recoverPassword: "/api/auth/recuperar-senha", //   POST  RecuperarSenhaRequestDTO
  resetPassword: "/api/auth/redefinir-senha", //     POST  RedefinirSenhaRequestDTO

  // administrador logado (identificado pelo token JWT)
  admin: "/api/administradores/perfil", //           GET -> AdministradorResponseDTO | PUT AdminstradorUpdateDTO
  adminPassword: "/api/administradores/senha", //    PATCH AlterarSenhaRequestDTO

  // painel
  dashboard: "/api/dashboard", //                    GET -> DashboardResponseDTO

  // tutores (clientes)
  tutors: "/api/tutores", //                         GET -> TutorResponseDTO[] | POST TutorResquestDTO
  tutor: (id) => `/api/tutores/${id}`, //            GET | PUT TutorResquestDTO | DELETE

  // animais
  animals: "/api/animais", //                        GET -> AnimalResumoDTO[] | POST AnimalRequestDTO
  animalsBatch: "/api/animais/lote", //              POST  AnimalLoteRequestDTO -> AnimalResponseDTO[]
  animal: (id) => `/api/animais/${id}`, //           GET -> AnimalResponseDTO | PUT AnimalRequestDTO | DELETE

  // atendimentos
  appointments: "/api/atendimentos", //              GET -> AtendimentoResumoDTO[] | POST AtendimentoRequestDTO
  appointment: (id) => `/api/atendimentos/${id}`, // GET | PUT AtendimentoRequestDTO | DELETE
  appointmentDone: (id) => `/api/atendimentos/${id}/realizar`, // PATCH -> AtendimentoResponseDTO
};
