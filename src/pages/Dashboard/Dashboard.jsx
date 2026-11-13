import { Link } from "react-router-dom";
import { LuPawPrint, LuClipboardList, LuChevronRight } from "react-icons/lu";
// components
import AnimalAvatar from "../../components/Animals/AnimalAvatar.jsx";
import { StatusBadge } from "../../components/common/AppointmentCard.jsx";
// hooks
import { useFetch } from "../../hooks/useFetch.js";
import { usePageTitle } from "../../hooks/usePageTitle.js";
// services
import { getAnimals } from "../../services/animalData.js";
import { getAppointments } from "../../services/appointmentData.js";
// utils
import { formatDate } from "../../utils/formatDate.js";

const LIMIT = 5;
const TYPE_LABEL = { consulta: "Consulta", vacina: "Vacina" };

const Dashboard = () => {
  usePageTitle("Painel de Controle");

  const animals = useFetch(getAnimals);
  const appointments = useFetch(getAppointments);

  const lastAnimals = (animals.data ?? []).slice(0, LIMIT);
  const lastAppointments = (appointments.data ?? []).slice(0, LIMIT);
  const errorMessage = animals.errorMessage || appointments.errorMessage;

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
        <section className="card">
          <h2 className="section-title">Últimos animais cadastrados</h2>
          {lastAnimals.length === 0 ? (
            <div className="empty-state">
              <LuPawPrint />
              {animals.loading ? "Carregando..." : "Nenhum animal cadastrado ainda."}
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
              {appointments.loading ? "Carregando..." : "Nenhum atendimento registrado ainda."}
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
