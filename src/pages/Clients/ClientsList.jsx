import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LuPlus, LuSearch, LuFilter, LuUser, LuChevronRight, LuIdCard, LuPawPrint, LuUsers,
} from "react-icons/lu";
// components
import Button from "../../components/common/Button/Button.jsx";
import { Select } from "../../components/common/Inputs/Inputs.jsx";
// hooks
import { useFetch } from "../../hooks/useFetch.js";
import { usePageTitle } from "../../hooks/usePageTitle.js";
// services
import { getClients } from "../../services/clientData.js";
// utils
import { onlyDigits } from "../../utils/masks.js";
// css
import "./Clients.css";

const FILTERS = [
  { value: "all", label: "Todos os clientes" },
  { value: "with", label: "Com animais" },
  { value: "without", label: "Sem animais" },
];

const normalize = (text = "") =>
  String(text).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const ClientsList = () => {
  usePageTitle("Clientes");
  const navigate = useNavigate();

  const { data, loading, errorMessage } = useFetch(getClients);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");


  const clients = useMemo(() => data ?? [], [data]);

  const results = useMemo(() => {
    const term = normalize(search.trim());
    const digits = onlyDigits(search);

    return clients.filter((client) => {
      const count = client.animals?.length ?? 0;
      if (filter === "with" && count === 0) return false;
      if (filter === "without" && count > 0) return false;
      if (!term) return true;

      return (
        normalize(client.name).includes(term) ||
        normalize(client.code).includes(term) ||
        (digits && onlyDigits(client.cpf).includes(digits))
      );
    });
  }, [clients, search, filter]);

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Clientes</h1>
          <p className="page-subtitle">Gerencie os clientes e seus respectivos animais.</p>
        </div>
      </div>

      <div className="clients-summary">
        <div>
          <div className="clients-count">{clients.length}</div>
          <div className="hint">Clientes cadastrados</div>
        </div>
        <Button
          className="btn"
          icon={LuPlus}
          buttonText="Adicionar cliente"
          onClick={() => navigate("/clientes/novo")}
        />
      </div>

      <div className="card card--outlined search-box">
        <LuSearch />
        <input
          type="search"
          placeholder="Buscar por nome, código ou CPF..."
          aria-label="Buscar cliente"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="filter-row">
        <span>
          <LuFilter /> Filtrar:
        </span>
        <Select
          aria-label="Filtrar clientes"
          options={FILTERS}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <div className="card-header">
        <h2 className="section-title" style={{ margin: 0 }}>
          Lista de clientes
        </h2>
        <span className="hint">{results.length} resultado(s)</span>
      </div>

      {errorMessage && (
        <p role="alert" className="form-error">
          {errorMessage}
        </p>
      )}

      {results.length === 0 ? (
        <div className="card empty-state">
          <LuUsers />
          {loading
            ? "Carregando..."
            : clients.length === 0
              ? "Nenhum cliente cadastrado ainda."
              : "Nenhum cliente encontrado para esta busca."}
        </div>
      ) : (
        <ul className="list">
          {results.map((client) => (
            <li key={client.id}>
              <Link to={`/clientes/${client.id}`} className="card card--outlined client-card">
                <div className="client-card-head">
                  <span className="icon-bubble">
                    <LuUser />
                  </span>
                  <div className="list-item-body">
                    <div className="list-item-title">{client.name}</div>
                    <div className="list-item-text">{client.code}</div>
                  </div>
                  <LuChevronRight className="list-item-end" />
                </div>
                <div className="client-card-line">
                  <LuIdCard /> CPF: {client.cpf}
                </div>
                <div className="client-card-line">
                  <LuPawPrint /> Animais:{" "}
                  {client.animals?.length
                    ? client.animals.map((animal) => animal.name).join(", ")
                    : "Nenhum animal cadastrado"}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default ClientsList;
