import { Messages } from "./message.js";

// Converte o erro lançado por services/api.js em uma mensagem para o usuário.
export function getErrorMessage(err) {
  switch (err?.status) {
    case 400:
    case 422:
      return err.message || Messages.VALIDATION;
    case 401:
      return Messages.SESSION;
    case 403:
      return Messages.FORBIDDEN;
    case 404:
      return Messages.NOT_FOUND;
    case 409:
      return err.message || Messages.DUPLICATED;
    case 429:
      return Messages.RATE_LIMITED;
    case 500:
      return Messages.SERVER;
    case undefined:
      return Messages.NETWORK;
    default:
      return Messages.UNKNOWN;
  }
}
