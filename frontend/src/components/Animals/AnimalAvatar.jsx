import { LuPawPrint } from "react-icons/lu";

// Foto do animal ou, sem foto, o ícone de pata
const AnimalAvatar = ({ animal, size = "" }) => (
  <span className={`icon-bubble icon-bubble--square ${size ? `icon-bubble--${size}` : ""}`}>
    {animal?.photo ? <img src={animal.photo} alt="" /> : <LuPawPrint />}
  </span>
);

export default AnimalAvatar;
