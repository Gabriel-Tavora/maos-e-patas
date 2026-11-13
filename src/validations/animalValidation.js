import { Messages } from "../utils/message.js";
import { today } from "../utils/formatDate.js";

export function validateAnimal(animal) {
  if (!animal.name?.trim()) return Messages.ANIMAL_NAME_REQUIRED;
  if (!animal.sex || !animal.sterilization || !animal.species) return Messages.REQUIRED_FIELDS;
  if (animal.birth_date && animal.birth_date > today()) return Messages.BIRTH_FUTURE;
  return null;
}
