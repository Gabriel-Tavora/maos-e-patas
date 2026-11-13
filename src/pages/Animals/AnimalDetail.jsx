import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  LuPencil, LuX, LuUser, LuClipboardList, LuTrash2, LuArrowLeft,
} from "react-icons/lu";
// components
import Button from "../../components/common/Button/Button.jsx";
import { ConfirmDialog } from "../../components/common/Modal/Modal.jsx";
import MoreMenu from "../../components/common/MoreMenu.jsx";
import AnimalAvatar from "../../components/Animals/AnimalAvatar.jsx";
import AnimalFields, { EMPTY_ANIMAL } from "../../components/Animals/AnimalFields.jsx";
import AppointmentCard from "../../components/common/AppointmentCard.jsx";
// context
import { useAuthValue } from "../../context/TokenContext.jsx";
// hooks
import { useFetch } from "../../hooks/useFetch.js";
import { usePageTitle } from "../../hooks/usePageTitle.js";
// services
import { getAnimal, updateAnimal, deleteAnimal } from "../../services/animalData.js";
// utils
import { formatDate } from "../../utils/formatDate.js";
import { getErrorMessage } from "../../utils/handleApiError.js";
import { validateAnimal } from "../../validations/animalValidation.js";

const Item = ({ label, value }) => (
  <div>
    <dt>{label}</dt>
    <dd>{value || "Não informado"}</dd>
  </div>
);

const AnimalDetail = () => {
  const { id: clientId, animalId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuthValue();

  const { data: animal, setData: setAnimal, loading, errorMessage } = useFetch(
    (authToken) => getAnimal(animalId, authToken),
    animalId
  );
  usePageTitle(animal?.name ?? "Ficha do animal");

  const [draft, setDraft] = useState(null); // preenchido = modo edição
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  if (!animal) {
    return errorMessage ? (
      <div className="stack">
        <p role="alert" className="form-error">
          {errorMessage}
        </p>
        <Link to={`/clientes/${clientId}`} className="btn btn-outline">
          <LuArrowLeft /> Voltar para o cliente
        </Link>
      </div>
    ) : (
      <p className="hint">{loading ? "Carregando..." : ""}</p>
    );
  }

  const editing = draft !== null;
  const client = animal.client;
  const appointments = animal.appointments ?? [];

  const startEdit = () => {
    const fields = Object.fromEntries(
      Object.keys(EMPTY_ANIMAL).map((key) => [key, animal[key] ?? EMPTY_ANIMAL[key]])
    );
    setFormError("");
    setDraft(fields);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (saving) return;

    const error = validateAnimal(draft);
    if (error) {
      setFormError(error);
      return;
    }

    setSaving(true);
    setFormError("");
    try {
      setAnimal(await updateAnimal(animal.id, draft, token));
      setDraft(null);
    } catch (err) {
      console.error(err);
      setFormError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    setDeleteError("");
    try {
      await deleteAnimal(animal.id, token);
      navigate(`/clientes/${clientId}`);
    } catch (err) {
      console.error(err);
      setDeleteError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <nav className="breadcrumb">
        <Link to="/clientes">Clientes</Link> /{" "}
        <Link to={`/clientes/${clientId}`}>{client?.name ?? "Cliente"}</Link> / Animais /{" "}
        {animal.name}
      </nav>
      <div className="page-header">
        <div>
          <h1 className="page-title">Ficha do animal</h1>
          <p className="page-subtitle">Visualização e edição dos dados</p>
        </div>
        <MoreMenu
          items={[
            {
              label: "Excluir animal",
              icon: LuTrash2,
              danger: true,
              onClick: () => {
                setDeleteError("");
                setDeleting(true);
              },
            },
          ]}
        />
      </div>

      <div className="stack">
        <section className="card">
          <div className="list-item" style={{ background: "none", padding: 0 }}>
            <AnimalAvatar animal={animal} size="lg" />
            <div className="list-item-body">
              <h2 className="page-title" style={{ fontSize: "1.2rem" }}>
                {animal.name}
              </h2>
              <p className="list-item-text">
                {animal.species} • {animal.breed || "Não informado"}
              </p>
              <span className="badge badge--success">Animal cadastrado</span>
            </div>
            {editing ? (
              <Button
                className="btn btn-outline btn-sm"
                icon={LuX}
                buttonText="Cancelar"
                onClick={() => setDraft(null)}
              />
            ) : (
              <Button className="btn btn-sm" icon={LuPencil} buttonText="Editar" onClick={startEdit} />
            )}
          </div>
        </section>

        <section className="card">
          <h2 className="section-title">Dados do animal</h2>

          {editing ? (
            <form className="stack" onSubmit={handleSave} noValidate>
              <AnimalFields data={draft} onChange={setDraft} />
              {formError && (
                <p role="alert" className="form-error">
                  {formError}
                </p>
              )}
              <div className="modal-actions">
                <Button
                  className="btn btn-outline"
                  buttonText="Cancelar"
                  onClick={() => setDraft(null)}
                />
                <Button
                  className="btn"
                  type="submit"
                  buttonText={saving ? "Salvando..." : "Salvar alterações"}
                  disabled={saving}
                />
              </div>
            </form>
          ) : (
            <>
              <dl className="info-grid">
                <Item label="Espécie" value={animal.species} />
                <Item label="Sexo" value={animal.sex} />
                <Item label="Raça" value={animal.breed} />
                <Item label="Pelagem" value={animal.coat} />
                <Item
                  label="Nascimento"
                  value={animal.birth_date ? formatDate(animal.birth_date) : ""}
                />
                <Item label="Esterilização" value={animal.sterilization} />
                <Item label="Microchip" value={animal.microchip} />
              </dl>
              <h3 className="section-title" style={{ marginTop: 16 }}>
                Observações
              </h3>
              <p className="list-item-text">{animal.notes || "Nenhuma observação."}</p>
            </>
          )}
        </section>

        <section className="card">
          <h2 className="section-title">Tutor(a) responsável</h2>
          <Link
            to={`/clientes/${clientId}`}
            className="list-item"
            style={{ background: "none", padding: 0 }}
          >
            <span className="icon-bubble">
              <LuUser />
            </span>
            <div className="list-item-body">
              <div className="list-item-title">{client?.name ?? "—"}</div>
              <div className="list-item-text">Código {client?.code ?? "—"}</div>
            </div>
            <span className="badge badge--success">Vinculado</span>
          </Link>
        </section>

        <section className="card">
          <div className="card-header">
            <h2 className="card-title">Histórico de atendimentos</h2>
            <span className="badge">
              {appointments.length} {appointments.length === 1 ? "registro" : "registros"}
            </span>
          </div>
          {appointments.length === 0 ? (
            <div className="empty-state">
              <LuClipboardList />
              Nenhum atendimento registrado para este animal.
            </div>
          ) : (
            <ul className="list">
              {appointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  title={appointment.type === "vacina" ? "Vacina" : "Consulta"}
                />
              ))}
            </ul>
          )}
        </section>

        <Button
          className="btn btn-block"
          icon={LuClipboardList}
          buttonText="Acessar ficha de atendimento"
          onClick={() => navigate(`/atendimentos?cliente=${clientId}&animal=${animal.id}`)}
        />
      </div>

      <ConfirmDialog
        open={deleting}
        title="Excluir animal?"
        text={`${animal.name} e o histórico de atendimentos dele(a) serão excluídos. Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        danger
        loading={saving}
        errorMessage={deleteError}
        onConfirm={handleDelete}
        onClose={() => setDeleting(false)}
      />
    </>
  );
};

export default AnimalDetail;
