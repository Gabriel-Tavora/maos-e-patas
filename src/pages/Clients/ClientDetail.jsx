import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  LuUser, LuPencil, LuSmartphone, LuPhone, LuMail, LuChevronRight, LuPlus,
  LuArrowLeft, LuTrash2,
} from "react-icons/lu";
import { FaWhatsapp } from "react-icons/fa";
// components
import Button from "../../components/common/Button/Button.jsx";
import Modal, { ConfirmDialog } from "../../components/common/Modal/Modal.jsx";
import MoreMenu from "../../components/common/MoreMenu.jsx";
import AnimalAvatar from "../../components/Animals/AnimalAvatar.jsx";
import {
  PersonalFields, ContactsFields, AddressFields, EMPTY_ADDRESS, EMPTY_CONTACT,
} from "../../components/Clients/ClientFields.jsx";
// context
import { useAuthValue } from "../../context/TokenContext.jsx";
// hooks
import { useFetch } from "../../hooks/useFetch.js";
import { usePageTitle } from "../../hooks/usePageTitle.js";
// services
import { getClient, updateClient, deleteClient } from "../../services/clientData.js";
// utils
import { formatDate } from "../../utils/formatDate.js";
import { whatsappLink } from "../../utils/masks.js";
import { getErrorMessage } from "../../utils/handleApiError.js";
import { Messages } from "../../utils/message.js";
import {
  validatePersonal, validateContacts, validateAddress,
} from "../../validations/clientValidation.js";
// css
import "./Clients.css";

const CONTACT_INFO = {
  celular: { label: "Celular", icon: LuSmartphone },
  telefone: { label: "Telefone residencial", icon: LuPhone },
  email: { label: "E-mail", icon: LuMail },
};

// Cada seção editável: título da janela, como validar e o que enviar
const SECTIONS = {
  personal: {
    title: "Editar dados pessoais",
    validate: validatePersonal,
    initial: ({ name, nationality, sex, birth_date, cpf, rg }) => ({
      name, nationality, sex, birth_date, cpf, rg,
    }),
    payload: (draft) => draft,
  },
  contacts: {
    title: "Editar contatos",
    validate: validateContacts,
    initial: (client) =>
      client.contacts?.length ? client.contacts.map((c) => ({ ...c })) : [{ ...EMPTY_CONTACT }],
    payload: (draft) => ({ contacts: draft }),
  },
  address: {
    title: "Editar endereço",
    validate: validateAddress,
    initial: (client) => ({ ...EMPTY_ADDRESS, ...client.address }),
    payload: (draft) => ({ address: draft }),
  },
};

const Row = ({ label, value }) => (
  <div className="info-row">
    <dt>{label}</dt>
    <dd>{value || "—"}</dd>
  </div>
);

const EditButton = ({ onClick }) => (
  <Button className="btn btn-outline btn-sm" icon={LuPencil} buttonText="Editar" onClick={onClick} />
);

const ClientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuthValue();

  const { data: client, setData: setClient, loading, errorMessage } = useFetch(
    (authToken) => getClient(id, authToken),
    id
  );
  usePageTitle(client?.name ?? "Ficha do cliente");

  const [editing, setEditing] = useState(null); // "personal" | "contacts" | "address"
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  if (!client) {
    return errorMessage ? (
      <div className="stack">
        <p role="alert" className="form-error">
          {errorMessage}
        </p>
        <Link to="/clientes" className="btn btn-outline">
          <LuArrowLeft /> Voltar para clientes
        </Link>
      </div>
    ) : (
      <p className="hint">{loading ? "Carregando..." : ""}</p>
    );
  }

  const animals = client.animals ?? [];
  const address = client.address ?? {};

  const openEdit = (section) => {
    setDraft(SECTIONS[section].initial(client));
    setEditError("");
    setEditing(section);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (saving) return;

    const section = SECTIONS[editing];
    const error = section.validate(draft);
    if (error) {
      setEditError(error);
      return;
    }

    setSaving(true);
    setEditError("");
    try {
      setClient(await updateClient(client.id, section.payload(draft), token));
      setEditing(null);
    } catch (err) {
      console.error(err);
      setEditError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    setDeleteError("");
    try {
      await deleteClient(client.id, token);
      navigate("/clientes");
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
        <Link to="/clientes">Clientes</Link> / Ficha do cliente
      </nav>
      <div className="page-header">
        <div>
          <h1 className="page-title">{client.name}</h1>
          <p className="page-subtitle">Código: {client.code}</p>
        </div>
        <MoreMenu
          items={[
            {
              label: "Excluir ficha",
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
          <div className="client-card-head">
            <span className="icon-bubble">
              <LuUser />
            </span>
            <div className="list-item-body">
              <div className="list-item-title">{client.name}</div>
              <div className="list-item-text">Cliente cadastrado(a)</div>
            </div>
            <span className="badge badge--success">Ativo</span>
          </div>

          <div className="card-header">
            <h2 className="card-title">Dados pessoais</h2>
            <EditButton onClick={() => openEdit("personal")} />
          </div>
          <dl className="info-list">
            <Row label="Nome completo" value={client.name} />
            <Row label="Nacionalidade" value={client.nationality} />
            <Row label="Sexo" value={client.sex} />
            <Row label="CPF" value={client.cpf} />
            <Row label="RG" value={client.rg} />
            <Row label="Nascimento" value={formatDate(client.birth_date)} />
          </dl>
        </section>

        <section className="card">
          <div className="card-header">
            <h2 className="card-title">Contatos</h2>
            <EditButton onClick={() => openEdit("contacts")} />
          </div>
          {client.contacts?.length ? (
            client.contacts.map((contact, index) => {
              const { label, icon: Icon } = CONTACT_INFO[contact.type] ?? CONTACT_INFO.celular;
              return (
                <div className="contact-row" key={index}>
                  <Icon />
                  <div className="list-item-body">
                    <div className="list-item-title" style={{ fontSize: "0.9rem" }}>
                      {contact.value}
                    </div>
                    <div className="list-item-text">
                      {label}
                      {contact.whatsapp && " • WhatsApp"}
                    </div>
                  </div>
                  {contact.whatsapp && (
                    <a
                      className="badge badge--success"
                      href={whatsappLink(contact.value)}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Abrir conversa no WhatsApp com ${client.name}`}
                    >
                      <FaWhatsapp /> WhatsApp
                    </a>
                  )}
                </div>
              );
            })
          ) : (
            <p className="hint">Nenhum contato cadastrado.</p>
          )}
        </section>

        <section className="card">
          <div className="card-header">
            <h2 className="card-title">Endereço</h2>
            <EditButton onClick={() => openEdit("address")} />
          </div>
          <dl className="info-list">
            <Row label="CEP" value={address.cep} />
            <Row
              label="Endereço"
              value={[address.street, address.number].filter(Boolean).join(", ")}
            />
            <Row label="Complemento" value={address.complement} />
            <Row label="Bairro" value={address.district} />
            <Row label="Cidade" value={address.city} />
            <Row label="Estado" value={address.state} />
            <Row label="Ponto de referência" value={address.reference} />
          </dl>
        </section>

        <section className="card">
          <div className="card-header">
            <h2 className="card-title">Animais cadastrados</h2>
            <span className="badge badge--info">
              {animals.length} {animals.length === 1 ? "animal" : "animais"}
            </span>
          </div>
          <div className="stack">
            {animals.length === 0 ? (
              <p className="hint">Este tutor ainda não tem animais cadastrados.</p>
            ) : (
              <ul className="list">
                {animals.map((animal) => (
                  <li key={animal.id}>
                    <Link
                      to={`/clientes/${client.id}/animais/${animal.id}`}
                      className="list-item"
                    >
                      <AnimalAvatar animal={animal} />
                      <div className="list-item-body">
                        <div className="list-item-title">{animal.name}</div>
                        <div className="list-item-text">
                          {animal.species} • {animal.breed || "Não informado"}
                        </div>
                      </div>
                      <LuChevronRight className="list-item-end" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <Button
              className="btn btn-block"
              icon={LuPlus}
              buttonText="Adicionar novo animal"
              onClick={() => navigate(`/clientes/${client.id}/animais/novo`)}
            />
          </div>
        </section>

        <Button
          className="btn btn-outline btn-block"
          icon={LuArrowLeft}
          buttonText="Voltar para clientes"
          onClick={() => navigate("/clientes")}
        />
      </div>

      {/* edição de uma seção */}
      <Modal
        open={!!editing}
        title={editing ? SECTIONS[editing].title : ""}
        onClose={() => setEditing(null)}
      >
        {editing && (
          <form className="stack" onSubmit={handleSave} noValidate>
            {editing === "personal" && <PersonalFields data={draft} onChange={setDraft} />}
            {editing === "contacts" && <ContactsFields contacts={draft} onChange={setDraft} />}
            {editing === "address" && <AddressFields data={draft} onChange={setDraft} />}

            {editError && (
              <p role="alert" className="form-error">
                {editError}
              </p>
            )}
            <div className="modal-actions">
              <Button
                className="btn btn-outline"
                buttonText="Cancelar"
                onClick={() => setEditing(null)}
              />
              <Button
                className="btn"
                type="submit"
                buttonText={saving ? "Salvando..." : "Salvar"}
                disabled={saving}
              />
            </div>
          </form>
        )}
      </Modal>

      {/* exclusão: só é permitida depois de excluir os animais do tutor */}
      {animals.length > 0 ? (
        <Modal
          open={deleting}
          title="Não é possível excluir"
          onClose={() => setDeleting(false)}
          small
        >
          <p>{Messages.CLIENT_HAS_ANIMALS}</p>
          <div className="modal-actions">
            <Button className="btn" buttonText="Entendi" onClick={() => setDeleting(false)} />
          </div>
        </Modal>
      ) : (
        <ConfirmDialog
          open={deleting}
          title="Excluir ficha do cliente?"
          text={`A ficha de ${client.name} será excluída. Esta ação não pode ser desfeita.`}
          confirmText="Excluir"
          danger
          loading={saving}
          errorMessage={deleteError}
          onConfirm={handleDelete}
          onClose={() => setDeleting(false)}
        />
      )}
    </>
  );
};

export default ClientDetail;
