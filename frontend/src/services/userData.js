import { request } from "./api";
import { ENDPOINTS } from "./endpoints";
import { fromAdmin, toAdminUpdate } from "./adapters";

export const getCurrentUser = async (token) =>
  fromAdmin(await request(ENDPOINTS.admin, { token, fallbackMessage: "Erro ao buscar usuário" }));

export const editUserData = async (user, token) =>
  fromAdmin(
    await request(ENDPOINTS.admin, {
      method: "PUT",
      token,
      body: toAdminUpdate(user),
      fallbackMessage: "Erro ao editar usuário",
    })
  );

export const changePassword = (currentPassword, newPassword, token) =>
  request(ENDPOINTS.adminPassword, {
    method: "PATCH",
    token,
    body: { senhaAtual: currentPassword, novaSenha: newPassword },
    fallbackMessage: "Não foi possível alterar a senha.",
  });
