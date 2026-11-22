import { request } from "./api";
import { ENDPOINTS } from "./endpoints";
import { fromAdmin } from "./adapters";

// TokenResponseDTO -> { id, token, user }
export async function login(email, password, remember = false) {
  const data = await request(ENDPOINTS.login, {
    method: "POST",
    body: { email, senha: password, lembrarDeMim: remember },
    fallbackMessage: "Email ou senha inválidos.",
  });
  return { id: data.administrador?.id, token: data.token, user: fromAdmin(data.administrador) };
}

export const sendEmail = (email) =>
  request(ENDPOINTS.recoverPassword, {
    method: "POST",
    body: { email },
    fallbackMessage: "Erro ao enviar email.",
  });

export const resetPassword = (email, code, password) =>
  request(ENDPOINTS.resetPassword, {
    method: "POST",
    body: { email, codigoVerificacao: code, novaSenha: password },
    fallbackMessage: "Código inválido ou expirado.",
  });
