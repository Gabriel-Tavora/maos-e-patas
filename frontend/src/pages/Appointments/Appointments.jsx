import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  LuPlus, LuX, LuClipboardList, LuCalendarCheck, LuCheck, LuTrash2, LuPencil,
} from "react-icons/lu";
// components
import Button from "../../components/common/Button/Button.jsx";
import Input, { Select, Textarea, RadioGroup } from "../../components/common/Inputs/Inputs.jsx";
import { ConfirmDialog } from "../../components/common/Modal/Modal.jsx";
import AppointmentCard from "../../components/common/AppointmentCard.jsx";
// config
import { APPOINTMENT_TYPES, APPOINTMENT_STATUS } from "../../config/options.js";
// context
import { useAuthValue } from "../../context/TokenContext.jsx";
// hooks
import { useFetch } from "../../hooks/useFetch.js";
import { usePageTitle } from "../../hooks/usePageTitle.js";
// services
import { getClients } from "../../services/clientData.js";
import {
  getAppointments, createAppointment, updateAppointment, deleteAppointment, markAppointmentDone,
} from "../../services/appointmentData.js";
// utils
import { today } from "../../utils/formatDate.js";
import { getErrorMessage } from "../../utils/handleApiError.js";
import { Messages } from "../../utils/message.js";
// css
import "./Appointments.css";

const FILTERS = [
  { value: "all", label: "Todos" },
  { value: "consulta", label: "Consultas" },
  { value: "vacina", label: "Vacinas" },
];

const STATUS_FILTERS = [
  { value: "all", label: "Todas as situações" },
  { value: "agendado", label: "Agendados" },
  { value: "realizado", label: "Realizados" },
];

const normalize = (text = "") =>
  String(text).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const emptyForm = (clientId = "", animalId = "") => ({
  type: "consulta",
  client_id: clientId,
  animal_id: animalId,
  date: today(),
  description: "",
  status: "agendado",
});

const Appointments = () => {
  usePageTitle("Atendimentos");
  const { token } = useAuthValue();

  // vindo da ficha do animal: /atendimentos?cliente=1&animal=2 já abre o cadastro preenchido
  const [params, setParams] = useSearchParams();
  const presetClient = params.get("cliente") ?? "";
  const presetAnimal = params.get("animal") ?? "";
  const openNew = params.get("novo") === "1";

  const appointments = useFetch(getAppointments);
  const clients = useFetch(getClients);

  const [formOpen, setFormOpen] = useState(!!presetAnimal || openNew);
  const [editingId, setEditingId] = useState(null); // preenchido = editando (RF43)
  const [form, setForm] = useState(() => emptyForm(presetClient, presetAnimal));
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [toDelete, setToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  const list = useMemo(() => appointments.data ?? [], [appointments.data]);
  const clientList = clients.data ?? [];
  const animalsOfClient =
    clientList.find((client) => String(client.id) === String(form.client_id))?.animals ?? [];

  const set = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const results = useMemo(() => {
    const term = normalize(search.trim());
    return list.filter((item) => {
      if (filter !== "all" && item.type !== filter) return false;
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (!term) return true;
      return [item.animal_name, item.client_name, item.code].some((text) =>
        normalize(text).includes(term)
      );
    });
  }, [list, search, filter, statusFilter]);

  const closeForm = () => {
    setFormOpen(false);
    setEditingId(null);
    setForm(emptyForm());
    if (presetAnimal || openNew) setParams({}, { replace: true });
  };

  const toggleForm = () => {
    setMessage(null);
    if (formOpen) closeForm();
    else setFormOpen(true);
  };

  const startEdit = (appointment) => {
    setMessage(null);
    setEditingId(appointment.id);
    setForm({
      type: appointment.type,
      client_id: String(appointment.client_id ?? ""),
      animal_id: String(appointment.animal_id ?? ""),
      date: appointment.date,
      description: appointment.description,
      status: appointment.status,
    });
    setFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (!form.client_id || !form.animal_id || !form.date) {
      setMessage({ type: "error", text: Messages.APPOINTMENT_REQUIRED });
      return;
    }
    if (!form.description.trim()) {
      setMessage({ type: "error", text: Messages.APPOINTMENT_DESCRIPTION });
      return;
    }

    setSubmitting(true);
    setMessage(null);
    try {
      const payload = {
        ...form,
        client_id: Number(form.client_id),
        animal_id: Number(form.animal_id),
        description: form.description.trim(),
      };
      if (editingId) await updateAppointment({ ...payload, id: editingId }, token);
      else await createAppointment(payload, token);

      await appointments.reload();
      const wasEditing = !!editingId;
      closeForm();
      setMessage({
        type: "success",
        text: wasEditing ? "Atendimento atualizado com sucesso." : "Atendimento salvo com sucesso.",
      });
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: getErrorMessage(err) });
    } finally {
      setSubmitting(false);
    }
  };

  const markDone = async (appointment) => {
    try {
      await markAppointmentDone(appointment.id, token);
      await appointments.reload();
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: getErrorMessage(err) });
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    setDeleteError("");
    try {
      await deleteAppointment(toDelete.id, token);
      await appointments.reload();
      setToDelete(null);
    } catch (err) {
      console.error(err);
      setDeleteError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Consultas e Vacinas</h1>
          <p className="page-subtitle">Gerencie os atendimentos dos animais cadastrados.</p>
        </div>
      </div>

      <div className="stack">
        <div className="stats">
          <div className="card">
            <div className="stat-label">Total de registros</div>
            <div className="stat-value">
              {list.length} <LuClipboardList />
            </div>
          </div>
          <div className="card">
            <div className="stat-label">Agendados</div>
            <div className="stat-value">
              {list.filter((item) => item.status === "agendado").length} <LuCalendarCheck />
            </div>
          </div>
        </div>

        <Button
          className="btn btn-block"
          icon={formOpen ? LuX : LuPlus}
          buttonText={formOpen ? (editingId ? "Cancelar edição" : "Fechar cadastro") : "Novo atendimento"}
          onClick={toggleForm}
        />

        {message && (
          <p
            role={message.type === "error" ? "alert" : "status"}
            className={message.type === "success" ? "form-success" : "form-error"}
          >
            {message.text}
          </p>
        )}

        {formOpen && (
          <form className="card card--outlined stack" onSubmit={handleSubmit} noValidate>
            <h2 className="section-title" style={{ margin: 0 }}>
              {editingId ? "Editar atendimento" : "Cadastrar atendimento"}
            </h2>

            <RadioGroup
              labelText="Tipo de atendimento"
              name="appointment-type"
              options={APPOINTMENT_TYPES}
              value={form.type}
              onChange={(value) => set("type", value)}
            />

            <Select
              labelText="Cliente (tutor)"
              placeholder={clients.loading ? "Carregando..." : "Selecione o cliente"}
              options={clientList.map((client) => ({
                value: String(client.id),
                label: `${client.name} — ${client.code}`,
              }))}
              value={String(form.client_id)}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, client_id: e.target.value, animal_id: "" }))
              }
              required
            />

            <Select
              labelText="Animal"
              placeholder={
                !form.client_id
                  ? "Selecione o cliente primeiro"
                  : animalsOfClient.length
                    ? "Selecione o animal"
                    : "Este cliente não tem animais cadastrados"
              }
              options={animalsOfClient.map((animal) => ({
                value: String(animal.id),
                label: animal.name,
              }))}
              value={String(form.animal_id)}
              onChange={(e) => set("animal_id", e.target.value)}
              disabled={!animalsOfClient.length}
              required
            />

            <Input
              labelText="Data do atendimento"
              type="date"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
              required
            />

            <Textarea
              labelText={
                form.type === "vacina" ? "Vacina / observações" : "Descrição / motivo da consulta"
              }
              placeholder={
                form.type === "vacina"
                  ? "Informe a vacina e as observações..."
                  : "Descreva o motivo e as observações..."
              }
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              maxLength={200}
              required
            />

            <Select
              labelText="Situação"
              options={APPOINTMENT_STATUS}
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
            />

            <Button
              className="btn btn-block"
              type="submit"
              buttonText={
                submitting ? "Salvando..." : editingId ? "Salvar alterações" : "Salvar atendimento"
              }
              disabled={submitting}
            />
          </form>
        )}

        <h2 className="section-title" style={{ margin: 0 }}>
          Registros cadastrados
        </h2>

        <div className="field">
          <input
            type="search"
            placeholder="Buscar por animal, tutor ou código..."
            aria-label="Buscar atendimento"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-bar">
          <div className="chips">
            {FILTERS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                className="chip"
                aria-pressed={filter === value}
                onClick={() => setFilter(value)}
              >
                {label}
              </button>
            ))}
          </div>
          <Select
            aria-label="Filtrar por situação"
            options={STATUS_FILTERS}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
        </div>

        {appointments.errorMessage && (
          <p role="alert" className="form-error">
            {appointments.errorMessage}
          </p>
        )}

        {results.length === 0 ? (
          <div className="card empty-state">
            <LuClipboardList />
            {appointments.loading
              ? "Carregando..."
              : list.length === 0
                ? "Nenhum atendimento registrado ainda."
                : "Nenhum atendimento encontrado para esta busca."}
          </div>
        ) : (
          <ul className="list">
            {results.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment}>
                <div className="appointment-actions">
                  {appointment.status === "agendado" && (
                    <Button
                      className="btn btn-outline btn-sm"
                      icon={LuCheck}
                      buttonText="Marcar como realizado"
                      onClick={() => markDone(appointment)}
                    />
                  )}
                  <Button
                    className="btn btn-outline btn-sm"
                    icon={LuPencil}
                    buttonText="Editar"
                    onClick={() => startEdit(appointment)}
                  />
                  <Button
                    className="btn btn-outline btn-sm"
                    icon={LuTrash2}
                    buttonText="Excluir"
                    onClick={() => {
                      setDeleteError("");
                      setToDelete(appointment);
                    }}
                  />
                </div>
              </AppointmentCard>
            ))}
          </ul>
        )}
      </div>

      <ConfirmDialog
        open={!!toDelete}
        title="Excluir atendimento?"
        text={
          toDelete
            ? `O registro ${toDelete.code} de ${toDelete.animal_name} será excluído.`
            : ""
        }
        confirmText="Excluir"
        danger
        loading={submitting}
        errorMessage={deleteError}
        onConfirm={handleDelete}
        onClose={() => setToDelete(null)}
      />
    </>
  );
};

export default Appointments;
