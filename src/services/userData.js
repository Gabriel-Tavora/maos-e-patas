import { request } from "./api";
// /users

export const getCurrentUser = (token) =>
  request("/users/me", { token, fallbackMessage: "Erro ao buscar usuário" });

export function editUserData(userData, token) {
  const body = Object.fromEntries(
    Object.entries({
      name: userData?.name,
      email: userData?.email,
      role: userData?.role,
      password: userData?.password,
    }).filter(
      ([, value]) =>
        value !== undefined && value !== null && String(value).trim() !== ""
    )
  );

  return request("/users", {
    method: "PATCH",
    token,
    body,
    fallbackMessage: "Erro ao editar usuário",
  });
}
