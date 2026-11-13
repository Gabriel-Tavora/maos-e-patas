import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LuUser, LuPlus, LuArrowLeft, LuCheck } from "react-icons/lu";
// components
import Button from "../../components/common/Button/Button.jsx";
import AnimalFields, { EMPTY_ANIMAL } from "../../components/Animals/AnimalFields.jsx";
import AnimalAvatar from "../../components/Animals/AnimalAvatar.jsx";
// context
import { useAuthValue } from "../../context/TokenContext.jsx";
// hooks
import { useFetch } from "../../hooks/useFetch.js";
import { usePageTitle } from "../../hooks/usePageTitle.js";
// services
import { getClient } from "../../services/clientData.js";
import { createAnimal } from "../../services/animalData.js";
// utils
import { getErrorMessage } from "../../utils/handleApiError.js";
import { Messages } from "../../utils/message.js";
import { validateAnimal } from "../../validations/animalValidation.js";

const STEPS = { FORM: "form", REVIEW: "review" };

const AnimalNew = () => {
  usePageTitle("Cadastrar animal");
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuthValue();

  const { data: client } = useFetch((authToken) => getClient(id, authToken), id);

  const [step, setStep] = useState(STEPS.FORM);
  const [form, setForm] = useState(EMPTY_ANIMAL);
  const [added, setAdded] = useState([]); // animais cadastrados nesta visita
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  // keepAdding = true  -> "Adicionar este e mais animais" (limpa o formulário)
  // keepAdding = false -> "Adicionar" (vai para a lista dos adicionados)
  const handleAdd = async (keepAdding) => {
    if (submitting) return;

    // formulário em branco depois de já ter adicionado algum: só avança
    if (!keepAdding && !form.name.trim() && added.length > 0) {
      setMessage(null);
      setStep(STEPS.REVIEW);
      return;
    }

    const error = validateAnimal(form);
    if (error) {
      setMessage({ type: "error", text: error });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const animal = await createAnimal({ ...form, client_id: Number(id) }, token);
      setAdded((prev) => [...prev, animal]);
      setForm(EMPTY_ANIMAL);

      if (keepAdding) {
        setMessage({ type: "success", text: Messages.ANIMAL_ADDED(animal.name) });
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setStep(STEPS.REVIEW);
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: getErrorMessage(err) });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <nav className="breadcrumb">
        <Link to="/clientes">Clientes</Link> /{" "}
        <Link to={`/clientes/${id}`}>{client?.name ?? "Cliente"}</Link> / Novo animal
      </nav>
      <div className="page-header">
        <div>
          <h1 className="page-title">Cadastrar Animal</h1>
          <p className="page-subtitle">Adicione os animais pertencentes ao tutor.</p>
        </div>
      </div>

      <div className="stack">
        <div className="card" style={{ background: "var(--bg-sidebar)", boxShadow: "none" }}>
          <p className="card-title" style={{ fontSize: "0.92rem" }}>
            <LuUser /> Tutor(a): {client?.name ?? "—"}
          </p>
          <p className="list-item-text">Código do cliente: {client?.code ?? "—"}</p>
        </div>

        {message && (
          <p
            role={message.type === "error" ? "alert" : "status"}
            className={message.type === "success" ? "form-success" : "form-error"}
          >
            {message.text}
          </p>
        )}

        {step === STEPS.FORM && (
          <>
            <section className="card">
              <h2 className="section-title">Informações do animal</h2>
              <AnimalFields data={form} onChange={setForm} />
            </section>

            <Button
              className="btn btn-outline btn-block"
              icon={LuPlus}
              buttonText="Adicionar este e mais animais"
              onClick={() => handleAdd(true)}
              disabled={submitting}
            />
            <Button
              className="btn btn-block"
              buttonText={submitting ? "Adicionando..." : "Adicionar"}
              onClick={() => handleAdd(false)}
              disabled={submitting}
            />
            <Button
              className="btn btn-outline btn-block"
              icon={LuArrowLeft}
              buttonText="Voltar"
              onClick={() => navigate(`/clientes/${id}`)}
            />
          </>
        )}

        {step === STEPS.REVIEW && (
          <>
            <section className="card">
              <h2 className="section-title">Animais adicionados</h2>
              <ul className="list">
                {added.map((animal) => (
                  <li key={animal.id} className="list-item">
                    <AnimalAvatar animal={animal} />
                    <div className="list-item-body">
                      <div className="list-item-title">{animal.name}</div>
                      <div className="list-item-text">
                        {animal.species} • {animal.breed || "Não informado"}
                      </div>
                    </div>
                    <LuCheck className="list-item-end" />
                  </li>
                ))}
              </ul>
            </section>

            <Button
              className="btn btn-outline btn-block"
              icon={LuPlus}
              buttonText="Adicionar novo animal"
              onClick={() => setStep(STEPS.FORM)}
            />
            <Button
              className="btn btn-block"
              buttonText="Salvar"
              onClick={() => navigate("/clientes")}
            />
          </>
        )}
      </div>
    </>
  );
};

export default AnimalNew;
