import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LuUser, LuContact, LuMapPin, LuPawPrint } from "react-icons/lu";
// components
import Button from "../../components/common/Button/Button.jsx";
import {
  PersonalFields, ContactsFields, AddressFields,
  EMPTY_PERSONAL, EMPTY_CONTACT, EMPTY_ADDRESS,
} from "../../components/Clients/ClientFields.jsx";
// context
import { useAuthValue } from "../../context/TokenContext.jsx";
// hooks
import { usePageTitle } from "../../hooks/usePageTitle.js";
// services
import { createClient } from "../../services/clientData.js";
// utils
import { getErrorMessage } from "../../utils/handleApiError.js";
import {
  validatePersonal, validateContacts, validateAddress,
} from "../../validations/clientValidation.js";
// css
import "./Clients.css";

const SectionTitle = ({ icon: Icon, children }) => (
  <h2 className="card-title" style={{ marginBottom: 12 }}>
    <span className="icon-bubble icon-bubble--square icon-bubble--sm">
      <Icon />
    </span>
    {children}
  </h2>
);

const ClientNew = () => {
  usePageTitle("Adicionar cliente");
  const navigate = useNavigate();
  const { token } = useAuthValue();

  const [personal, setPersonal] = useState(EMPTY_PERSONAL);
  const [contacts, setContacts] = useState([{ ...EMPTY_CONTACT }]);
  const [address, setAddress] = useState(EMPTY_ADDRESS);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const error =
      validatePersonal(personal) || validateContacts(contacts) || validateAddress(address);
    if (error) {
      setErrorMessage(error);
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    try {
      const client = await createClient({ ...personal, contacts, address }, token);
      // depois do tutor, o cadastro segue para os animais dele
      navigate(`/clientes/${client.id}/animais/novo`);
    } catch (err) {
      console.error(err);
      setErrorMessage(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <nav className="breadcrumb">
        <Link to="/clientes">Clientes</Link> / Adicionar cliente
      </nav>
      <div className="page-header">
        <div>
          <h1 className="page-title">Adicionar Cliente</h1>
          <p className="page-subtitle">Preencha os dados para cadastrar um novo tutor.</p>
        </div>
      </div>

      <div className="stack">
        <section className="card">
          <SectionTitle icon={LuUser}>Informações pessoais</SectionTitle>
          <PersonalFields data={personal} onChange={setPersonal} />
        </section>

        <section className="card">
          <SectionTitle icon={LuContact}>Contatos</SectionTitle>
          <ContactsFields contacts={contacts} onChange={setContacts} />
        </section>

        <section className="card">
          <SectionTitle icon={LuMapPin}>Endereço</SectionTitle>
          <AddressFields data={address} onChange={setAddress} />
        </section>

        {errorMessage && (
          <p role="alert" className="form-error">
            {errorMessage}
          </p>
        )}

        <Button
          className="btn btn-block"
          type="submit"
          icon={LuPawPrint}
          buttonText={submitting ? "Salvando..." : "Salvar e cadastrar animais"}
          disabled={submitting}
        />
        <Button
          className="btn btn-outline btn-block"
          buttonText="Cancelar"
          onClick={() => navigate("/clientes")}
        />
      </div>
    </form>
  );
};

export default ClientNew;
