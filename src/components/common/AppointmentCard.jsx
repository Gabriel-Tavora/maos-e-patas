import { LuStethoscope, LuSyringe } from "react-icons/lu";
import { formatDate } from "../../utils/formatDate.js";

const TYPE = {
  consulta: { label: "Consulta", icon: LuStethoscope },
  vacina: { label: "Vacina", icon: LuSyringe },
};

export const StatusBadge = ({ status }) =>
  status === "realizado" ? (
    <span className="badge badge--success">Realizado</span>
  ) : (
    <span className="badge badge--info">Agendado</span>
  );

// Um atendimento (consulta ou vacina). `title` troca o nome do animal no topo.
const AppointmentCard = ({ appointment, title, children }) => {
  const { label, icon: Icon } = TYPE[appointment.type] ?? TYPE.consulta;

  return (
    <li className="card">
      <div className="card-header" style={{ marginBottom: 8 }}>
        <h3 className="card-title">{title ?? appointment.animal_name}</h3>
        <StatusBadge status={appointment.status} />
      </div>
      <div className="stack" style={{ gap: 6 }}>
        <p className="card-title" style={{ fontSize: "0.9rem", fontWeight: 600 }}>
          <Icon /> {label}
        </p>
        {appointment.client_name && (
          <p className="list-item-text">Tutor: {appointment.client_name}</p>
        )}
        <p className="list-item-text">
          {formatDate(appointment.date)} • {appointment.code}
        </p>
        {appointment.description && <p>{appointment.description}</p>}
        {children}
      </div>
    </li>
  );
};

export default AppointmentCard;
