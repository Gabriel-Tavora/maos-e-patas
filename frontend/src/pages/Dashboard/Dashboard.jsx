import { Link } from "react-router-dom";
import {
  LuPawPrint, LuClipboardList, LuChevronRight, LuUserPlus, LuUsers, LuCalendarPlus,
} from "react-icons/lu";
// components
import AnimalAvatar from "../../components/Animals/AnimalAvatar.jsx";
import { StatusBadge } from "../../components/common/AppointmentCard.jsx";
// hooks
import { useFetch } from "../../hooks/useFetch.js";
import { usePageTitle } from "../../hooks/usePageTitle.js";
// services
import { getDashboard } from "../../services/dashboardData.js";
// utils
import { formatDate } from "../../utils/formatDate.js";

const LIMIT = 5;

// RF10: acesso às principais funcionalidades
const SHORTCUTS = [
  { to: "/clientes/novo", label: "Adicionar cliente", icon: LuUserPlus, primary: true },
  { to: "/atendimentos?novo=1", label: "Novo atendimento", icon: LuCalendarPlus },
  { to: "/clientes", label: "Clientes", icon: LuUsers },
  { to: "/atendimentos", label: "Consultas e vacinas", icon: LuClipboardList },
];
const TYPE_LABEL = { consulta: "Consulta", vacina: "Vacina" };

const Dashboard = () => {
  usePageTitle("Painel de Controle");

  const { data, loading, errorMessage } = useFetch(getDashboard);

  const lastAnimals = (data?.animals ?? []).slice(0, LIMIT);
  const lastAppointments = (data?.appointments ?? []).slice(0, LIMIT);

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Painel de Controle</h1>
          <p className="page-subtitle">Bem-vindo ao sistema!</p>
        </div>
      </div>

      {errorMessage && (
        <p role="alert" className="form-error" style={{ marginBottom: 12 }}>
          {errorMessage}
        </p>
      )}

      <div className="stack">
        <nav className="shortcuts" aria-label="Atalhos">
          {SHORTCUTS.map(({ to, label, icon: Icon, primary }) => (
            <Link key={to} to={to} className={primary ? "shortcut shortcut--primary" : "shortcut"}>
              <span className="icon-bubble icon-bubble--sm">
                <Icon />
              </span>
              {label}
            </Link>
          ))}
        </nav>

        {data && (
          <p className="hint">
            {data.totals.appointments} atendimento(s) registrado(s) • {data.totals.pending} agendado(s) •{" "}
            {data.totals.done} realizado(s)
          </p>
        )}

        <section className="card">
          <h2 className="section-title">Últimos animais cadastrados</h2>
          {lastAnimals.length === 0 ? (
            <div className="empty-state">
              <LuPawPrint />
              {loading ? "Carregando..." : "Nenhum animal cadastrado ainda."}
            </div>
          ) : (
            <ul className="list" style={{ gap: 0 }}>
              {lastAnimals.map((animal) => (
                <li key={animal.id}>
                  <Link
                    to={`/clientes/${animal.client?.id}/animais/${animal.id}`}
                    className="list-item list-item--plain"
                  >
                    <AnimalAvatar animal={animal} />
                    <div className="list-item-body">
                      <div className="list-item-title">{animal.name}</div>
                      <div className="list-item-text">Tutor: {animal.client?.name ?? "—"}</div>
                    </div>
                    <LuChevronRight className="list-item-end" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card">
          <h2 className="section-title">Últimos atendimentos</h2>
          {lastAppointments.length === 0 ? (
            <div className="empty-state">
              <LuClipboardList />
              {loading ? "Carregando..." : "Nenhum atendimento registrado ainda."}
            </div>
          ) : (
            <ul className="list" style={{ gap: 0 }}>
              {lastAppointments.map((appointment) => (
                <li key={appointment.id} className="list-item list-item--plain">
                  <div className="list-item-body">
                    <div className="list-item-title">{appointment.animal_name}</div>
                    <div className="list-item-text">
                      {TYPE_LABEL[appointment.type] ?? "Atendimento"} •{" "}
                      {formatDate(appointment.date)}
                    </div>
                  </div>
                  <StatusBadge status={appointment.status} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
};

export default Dashboard;
