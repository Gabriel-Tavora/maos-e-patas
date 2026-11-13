import { request } from "./api";

export const login = (email, password) =>
  request("/login", {
    method: "POST",
    body: { email, password },
    fallbackMessage: "Email ou senha inválidos.",
  });

export const sendEmail = (email) =>
  request("/password", {
    method: "POST",
    body: { email },
    fallbackMessage: "Erro ao enviar email.",
  });

export const resetPassword = (code, password) =>
  request("/password", {
    method: "PATCH",
    body: { code, password },
    fallbackMessage: "Código inválido ou expirado.",
  });
