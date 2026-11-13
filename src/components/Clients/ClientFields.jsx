import { LuPlus, LuTrash2 } from "react-icons/lu";
// components
import Input, { Select, Checkbox } from "../common/Inputs/Inputs.jsx";
import Button from "../common/Button/Button.jsx";
// config
import { SEX_OPTIONS, CONTACT_TYPES, STATES } from "../../config/options.js";
// utils
import { maskCPF, maskCEP, maskPhone } from "../../utils/masks.js";
import { today } from "../../utils/formatDate.js";

// Blocos de campos do cliente, usados no cadastro e nas janelas de edição.
// Todos recebem os dados e devolvem o objeto/lista atualizado em onChange.

export const EMPTY_PERSONAL = {
  name: "",
  nationality: "Brasileira",
  sex: "",
  birth_date: "",
  cpf: "",
  rg: "",
};

export const EMPTY_CONTACT = { type: "celular", value: "", whatsapp: true };

export const EMPTY_ADDRESS = {
  cep: "",
  street: "",
  number: "",
  complement: "",
  district: "",
  city: "",
  state: "",
  reference: "",
};

export const PersonalFields = ({ data, onChange }) => {
  const set = (field, value) => onChange({ ...data, [field]: value });

  return (
    <div className="form-grid">
      <Input
        classNameIn="span-2"
        labelText="Nome completo"
        placeholder="Digite o nome completo"
        value={data.name}
        onChange={(e) => set("name", e.target.value)}
        autoComplete="off"
        required
      />
      <Input
        classNameIn="span-2"
        labelText="Nacionalidade"
        placeholder="Ex.: Brasileira"
        value={data.nationality}
        onChange={(e) => set("nationality", e.target.value)}
        required
      />
      <Select
        labelText="Sexo"
        placeholder="Selecionar"
        options={SEX_OPTIONS}
        value={data.sex}
        onChange={(e) => set("sex", e.target.value)}
        required
      />
      <Input
        labelText="Data de nascimento"
        type="date"
        max={today()}
        value={data.birth_date}
        onChange={(e) => set("birth_date", e.target.value)}
        required
      />
      <Input
        labelText="CPF"
        placeholder="000.000.000-00"
        inputMode="numeric"
        value={data.cpf}
        onChange={(e) => set("cpf", maskCPF(e.target.value))}
        required
      />
      <Input
        labelText="RG"
        placeholder="00.000.000-0"
        maxLength={14}
        value={data.rg}
        onChange={(e) => set("rg", e.target.value)}
        required
      />
    </div>
  );
};

export const ContactsFields = ({ contacts, onChange }) => {
  const update = (index, changes) =>
    onChange(contacts.map((contact, i) => (i === index ? { ...contact, ...changes } : contact)));

  return (
    <div className="stack">
      {contacts.map((contact, index) => {
        const isEmail = contact.type === "email";
        return (
          <div className="stack" key={index}>
            {index > 0 && (
              <div className="card-header" style={{ margin: 0 }}>
                <span className="field-label">Contato adicional</span>
                <button
                  type="button"
                  className="btn-icon"
                  aria-label="Remover contato"
                  onClick={() => onChange(contacts.filter((_, i) => i !== index))}
                >
                  <LuTrash2 />
                </button>
              </div>
            )}
            <Select
              labelText="Tipo de contato"
              options={CONTACT_TYPES}
              value={contact.type}
              onChange={(e) =>
                update(index, {
                  type: e.target.value,
                  value: "",
                  whatsapp: e.target.value === "celular",
                })
              }
              required
            />
            <Input
              labelText={isEmail ? "E-mail" : "Número de contato"}
              type={isEmail ? "email" : "tel"}
              placeholder={isEmail ? "nome@email.com" : "(00) 00000-0000"}
              value={contact.value}
              onChange={(e) =>
                update(index, {
                  value: isEmail ? e.target.value : maskPhone(e.target.value),
                })
              }
              required
            />
            {!isEmail && (
              <Checkbox
                labelText="Este número possui WhatsApp"
                checked={!!contact.whatsapp}
                onChange={(checked) => update(index, { whatsapp: checked })}
              />
            )}
          </div>
        );
      })}

      <Button
        className="btn btn-outline btn-block btn-sm"
        icon={LuPlus}
        buttonText="Adicionar outro contato"
        onClick={() => onChange([...contacts, { ...EMPTY_CONTACT }])}
      />
    </div>
  );
};

export const AddressFields = ({ data, onChange }) => {
  const set = (field, value) => onChange({ ...data, [field]: value });

  return (
    <div className="form-grid">
      <Input
        classNameIn="span-2"
        labelText="CEP"
        placeholder="00000-000"
        inputMode="numeric"
        value={data.cep}
        onChange={(e) => set("cep", maskCEP(e.target.value))}
        required
      />
      <Input
        classNameIn="span-2"
        labelText="Endereço"
        placeholder="Rua, avenida, etc."
        value={data.street}
        onChange={(e) => set("street", e.target.value)}
        required
      />
      <Input
        labelText="Número"
        placeholder="Nº"
        value={data.number}
        onChange={(e) => set("number", e.target.value)}
        required
      />
      <Input
        labelText="Complemento"
        placeholder="Apartamento, casa..."
        value={data.complement}
        onChange={(e) => set("complement", e.target.value)}
      />
      <Input
        classNameIn="span-2"
        labelText="Bairro"
        placeholder="Digite o bairro"
        value={data.district}
        onChange={(e) => set("district", e.target.value)}
        required
      />
      <Input
        labelText="Cidade"
        placeholder="Cidade"
        value={data.city}
        onChange={(e) => set("city", e.target.value)}
        required
      />
      <Select
        labelText="Estado"
        placeholder="UF"
        options={STATES}
        value={data.state}
        onChange={(e) => set("state", e.target.value)}
        required
      />
      <Input
        classNameIn="span-2"
        labelText="Ponto de referência"
        placeholder="Ex.: Próximo à praça..."
        value={data.reference}
        onChange={(e) => set("reference", e.target.value)}
      />
    </div>
  );
};
