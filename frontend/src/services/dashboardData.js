import { request } from "./api";
import { ENDPOINTS } from "./endpoints";
import { fromDashboard } from "./adapters";

export const getDashboard = async (token) =>
  fromDashboard(await request(ENDPOINTS.dashboard, { token, fallbackMessage: "Erro ao carregar o painel" }));
