import { LuLayoutGrid, LuUsers, LuClipboardList } from "react-icons/lu";

export const APP_NAME = "Mãos e Patas";
export const APP_SUBTITLE = "Clínica Veterinária";
export const APP_FOOTER = "Mãos e Patas • Sistema Veterinário";

// Rota aberta depois do login
export const HOME_PATH = "/painel";

// Itens da sidebar
export const MENU_ITEMS = [
  { to: "/painel", label: "Painel de Controle", icon: LuLayoutGrid },
  { to: "/clientes", label: "Clientes", icon: LuUsers },
  { to: "/atendimentos", label: "Atendimentos", icon: LuClipboardList },
];
