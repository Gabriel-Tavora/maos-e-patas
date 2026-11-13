import { Messages } from "../utils/message.js";
import { onlyDigits } from "../utils/masks.js";
import { today } from "../utils/formatDate.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const filled = (value) => String(value ?? "").trim() !== "";

export function isValidCPF(value) {
  const cpf = onlyDigits(value);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  for (const size of [9, 10]) {
    let sum = 0;
    for (let i = 0; i < size; i++) sum += Number(cpf[i]) * (size + 1 - i);
    let remainder = (sum * 10) % 11;
    if (remainder === 10) remainder = 0;
    if (remainder !== Number(cpf[size])) return false;
  }
  return true;
}

// Cada função devolve a mensagem de erro ou null

export function validatePersonal(data) {
  const required = ["name", "nationality", "sex", "birth_date", "cpf", "rg"];
  if (!required.every((field) => filled(data[field]))) return Messages.REQUIRED_FIELDS;
  if (data.name.trim().split(/\s+/).length < 2) return Messages.NAME_SHORT;
  if (!isValidCPF(data.cpf)) return Messages.CPF_INVALID;
  if (data.birth_date > today()) return Messages.BIRTH_FUTURE;
  return null;
}

export function validateContacts(contacts) {
  if (!contacts?.length) return Messages.CONTACT_REQUIRED;

  for (const contact of contacts) {
    if (!filled(contact.value)) return Messages.REQUIRED_FIELDS;
    if (contact.type === "email") {
      if (!EMAIL_REGEX.test(contact.value.trim())) return Messages.EMAIL_INVALID;
    } else {
      const digits = onlyDigits(contact.value);
      if (digits.length !== 10 && digits.length !== 11) return Messages.PHONE_INVALID;
    }
  }
  return null;
}

export function validateAddress(address) {
  const required = ["cep", "street", "number", "district", "city", "state"];
  if (!required.every((field) => filled(address[field]))) return Messages.REQUIRED_FIELDS;
  if (onlyDigits(address.cep).length !== 8) return Messages.CEP_INVALID;
  return null;
}
