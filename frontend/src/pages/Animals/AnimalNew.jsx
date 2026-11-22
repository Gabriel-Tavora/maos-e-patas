import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LuUser, LuPlus, LuArrowLeft, LuTrash2, LuListChecks } from "react-icons/lu";
// components
import Button from "../../components/common/Button/Button.jsx";
import { ConfirmDialog } from "../../components/common/Modal/Modal.jsx";
import AnimalFields, { EMPTY_ANIMAL } from "../../components/Animals/AnimalFields.jsx";
import AnimalAvatar from "../../components/Animals/AnimalAvatar.jsx";
// context
import { useAuthValue } from "../../context/TokenContext.jsx";
// hooks
import { useFetch } from "../../hooks/useFetch.js";
import { usePageTitle } from "../../hooks/usePageTitle.js";
// services
import { getClient } from "../../services/clientData.js";
import { createAnimals } from "../../services/animalData.js";
// utils
import { getErrorMessage } from "../../utils/handleApiError.js";
import { Messages } from "../../utils/message.js";
import { validateAnimal } from "../../validations/animalValidation.js";

const STEPS = { FORM: "form", REVIEW: "review" };

// RF30 / RN07: os animais vão para uma lista e só são gravados juntos, no "Salvar"
const AnimalNew = () => {
  usePageTitle("Cadastrar animal");
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuthValue();

  const { data: client } = useFetch((authToken) => getClient(id, authToken), id);

  const [step, setStep] = useState(STEPS.FORM);
  const [form, setForm] = useState(EMPTY_ANIMAL);
  const [pending, setPending] = useState([]); // ainda não salvos
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [confirmLeave, setConfirmLeave] = useState(false);

  const showError = (text) => setMessage({ type: "error", text });

  // valida o formulário e coloca o animal na lista; devolve false se tiver erro
  const addToList = () => {
    const error = validateAnimal(form);
    if (error) {
      showError(error);
      return false;
    }
    const chip = form.microchip.trim();
    if (chip && pending.some((animal) => animal.microchip.trim() === chip)) {
      showError(Messages.MICROCHIP_REPEATED);
      return false;
    }
    setPending((prev) => [...prev, { ...form, key: crypto.randomUUID() }]);
    setForm(EMPTY_ANIMAL);
    return true;
  };

  // "Adicionar este e mais animais"
  const handleAddMore = () => {
    if (!addToList()) return;
    setMessage({ type: "success", text: Messages.ANIMAL_ADDED(form.name.trim()) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // "Adicionar": coloca na lista (se o formulário estiver preenchido) e vai para a revisão
  const handleAdd = () => {
    const formIsEmpty = !form.name.trim();
    if (formIsEmpty && pending.length === 0) return showError(Messages.ANIMAL_NAME_REQUIRED);
    if (!formIsEmpty && !addToList()) return;
    setMessage(null);
    setStep(STEPS.REVIEW);
  };

  const handleSave = async () => {
    if (saving) return;
    if (pending.length === 0) return showError(Messages.ANIMAL_LIST_EMPTY);

    setSaving(true);
    setMessage(null);
    try {
      const saved = await createAnimals(pending, id, token);
      navigate(`/clientes/${id}`, {
        state: { flash: Messages.ANIMALS_SAVED(saved.length || pending.length) },
      });
    } catch (err) {
      console.error(err);
      showError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const leave = () => navigate(`/clientes/${id}`);
  const handleBack = () => (pending.length ? setConfirmLeave(true) : leave());

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
        {pending.length > 0 && step === STEPS.FORM && (
          <button type="button" className="badge badge--info" onClick={() => setStep(STEPS.REVIEW)}>
            <LuListChecks /> {pending.length} na lista
          </button>
        )}
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
              onClick={handleAddMore}
            />
            <Button className="btn btn-block" buttonText="Adicionar" onClick={handleAdd} />
            <Button
              className="btn btn-outline btn-block"
              icon={LuArrowLeft}
              buttonText="Voltar"
              onClick={handleBack}
            />
          </>
        )}

        {step === STEPS.REVIEW && (
          <>
            <section className="card">
              <div className="card-header">
                <h2 className="card-title">Animais adicionados</h2>
                <span className="badge">Ainda não salvos</span>
              </div>
              {pending.length === 0 ? (
                <p className="hint">A lista está vazia.</p>
              ) : (
                <ul className="list">
                  {pending.map((animal) => (
                    <li key={animal.key} className="list-item">
                      <AnimalAvatar animal={animal} />
                      <div className="list-item-body">
                        <div className="list-item-title">{animal.name}</div>
                        <div className="list-item-text">
                          {animal.species} • {animal.breed || "Não informado"} • {animal.sex}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn-icon"
                        aria-label={`Tirar ${animal.name} da lista`}
                        onClick={() =>
                          setPending((prev) => prev.filter((item) => item.key !== animal.key))
                        }
                      >
                        <LuTrash2 />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <Button
              className="btn btn-outline btn-block"
              icon={LuPlus}
              buttonText="Adicionar novo animal"
              onClick={() => {
                setMessage(null);
                setStep(STEPS.FORM);
              }}
            />
            <Button
              className="btn btn-block"
              buttonText={saving ? "Salvando..." : `Salvar ${pending.length} animal(is)`}
              onClick={handleSave}
              disabled={saving || pending.length === 0}
            />
          </>
        )}
      </div>

      <ConfirmDialog
        open={confirmLeave}
        title="Descartar animais da lista?"
        text={`${pending.length} animal(is) ainda não foram salvos e serão perdidos.`}
        confirmText="Descartar e sair"
        danger
        onConfirm={leave}
        onClose={() => setConfirmLeave(false)}
      />
    </>
  );
};

export default AnimalNew;
