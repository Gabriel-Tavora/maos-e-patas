import { useId, useState } from "react";
import { LuCamera } from "react-icons/lu";
// components
import Input, { Select, Textarea, RadioGroup } from "../common/Inputs/Inputs.jsx";
// config
import { ANIMAL_SEX, STERILIZATION, SPECIES } from "../../config/options.js";
// utils
import { fileToPhoto } from "../../utils/photo.js";
import { today } from "../../utils/formatDate.js";
// css
import "./AnimalFields.css";

export const EMPTY_ANIMAL = {
  name: "",
  sex: "Macho",
  sterilization: "Castrado",
  species: "Cachorro",
  breed: "",
  coat: "",
  birth_date: "",
  microchip: "",
  notes: "",
  photo: "",
};

// Campos do animal, usados no cadastro e na edição da ficha
const AnimalFields = ({ data, onChange }) => {
  const breedListId = useId();
  const [photoError, setPhotoError] = useState("");
  const set = (field, value) => onChange({ ...data, [field]: value });

  const handlePhoto = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      setPhotoError("");
      set("photo", await fileToPhoto(file));
    } catch (err) {
      setPhotoError(err.message);
    }
  };

  return (
    <div className="stack">
      <div className="field">
        <span className="field-label">Foto do animal</span>
        <label className="photo-picker">
          <span className="icon-bubble icon-bubble--lg">
            {data.photo ? <img src={data.photo} alt="" /> : <LuCamera />}
          </span>
          {data.photo ? "Trocar foto" : "Adicionar foto do animal"}
          <input type="file" accept="image/*" onChange={handlePhoto} />
        </label>
        {photoError && (
          <p role="alert" className="form-error">
            {photoError}
          </p>
        )}
      </div>

      <Input
        labelText="Nome do animal"
        placeholder="Digite o nome do animal"
        value={data.name}
        onChange={(e) => set("name", e.target.value)}
        required
      />

      <RadioGroup
        labelText="Sexo"
        name={`${breedListId}-sex`}
        options={ANIMAL_SEX}
        value={data.sex}
        onChange={(value) => set("sex", value)}
        required
      />

      <RadioGroup
        labelText="Esterilização"
        name={`${breedListId}-sterilization`}
        options={STERILIZATION}
        value={data.sterilization}
        onChange={(value) => set("sterilization", value)}
        required
        column
      />

      <div className="form-grid">
        <Select
          labelText="Espécie"
          options={Object.keys(SPECIES)}
          value={data.species}
          onChange={(e) => onChange({ ...data, species: e.target.value, breed: "" })}
          required
        />
        <Input
          labelText="Raça"
          placeholder="Digite ou selecione a raça"
          list={breedListId}
          value={data.breed}
          onChange={(e) => set("breed", e.target.value)}
        />
        <datalist id={breedListId}>
          {(SPECIES[data.species] ?? []).map((breed) => (
            <option key={breed} value={breed} />
          ))}
        </datalist>
        <Input
          labelText="Pelagem"
          placeholder="Ex.: Curta, longa, branca..."
          value={data.coat}
          onChange={(e) => set("coat", e.target.value)}
        />
        <Input
          labelText="Data de nascimento"
          type="date"
          max={today()}
          value={data.birth_date}
          onChange={(e) => set("birth_date", e.target.value)}
        />
        <Input
          classNameIn="span-2"
          labelText="Microchip"
          placeholder="Número do microchip (se possuir)"
          value={data.microchip}
          onChange={(e) => set("microchip", e.target.value)}
        />
        <Textarea
          classNameIn="span-2"
          labelText="Observações"
          placeholder="Temperamento, alergias, cuidados..."
          value={data.notes}
          onChange={(e) => set("notes", e.target.value)}
        />
      </div>
    </div>
  );
};

export default AnimalFields;
