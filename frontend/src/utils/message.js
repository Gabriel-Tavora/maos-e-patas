export const Messages = {
  SUCCESS: "Registro salvo com sucesso.",
  EDIT_SUCCESS: "Alterações salvas com sucesso.",
  DUPLICATED: "Já existe um registro igual a este.",
  NOT_FOUND: "Registro não encontrado. Ele pode ter sido removido ou alterado.",

  SESSION: "Sua sessão expirou. Faça login novamente para continuar.",
  FORBIDDEN: "Você não tem permissão para realizar esta ação.",
  RATE_LIMITED:
    "Muitas tentativas em pouco tempo. Aguarde alguns instantes e tente novamente.",
  NETWORK:
    "Não foi possível conectar ao servidor. Verifique sua internet e tente novamente.",
  VALIDATION:
    "Não foi possível validar os dados informados. Revise os campos e tente novamente.",
  SERVER: "Ocorreu um erro no servidor. Tente novamente em instantes.",
  UNKNOWN:
    "Algo deu errado. Tente novamente ou entre em contato com o suporte se o problema persistir.",

  // clientes
  REQUIRED_FIELDS: "Preencha todos os campos obrigatórios (*).",
  NAME_SHORT: "Informe o nome completo.",
  CPF_INVALID: "Informe um CPF válido.",
  BIRTH_FUTURE: "A data de nascimento não pode ser futura.",
  PHONE_INVALID: "O telefone deve possuir 10 ou 11 números.",
  EMAIL_INVALID: "Informe um endereço de email válido.",
  CONTACT_REQUIRED: "Informe pelo menos um contato.",
  CEP_INVALID: "O CEP deve possuir 8 números.",
  CLIENT_HAS_ANIMALS:
    "Este tutor ainda tem animais cadastrados. Exclua os animais antes de excluir o tutor.",

  // animais
  ANIMAL_NAME_REQUIRED: "Informe o nome do animal.",
  ANIMAL_ADDED: (name) =>
    `${name} foi para a lista. Cadastre o próximo animal ou clique em "Adicionar" para revisar e salvar.`,
  ANIMALS_SAVED: (count) => `${count} animal(is) salvo(s) com sucesso.`,
  ANIMAL_LIST_EMPTY: "Adicione pelo menos um animal antes de salvar.",
  MICROCHIP_REPEATED: "Este microchip já está em outro animal da lista.",

  // atendimentos
  APPOINTMENT_REQUIRED: "Selecione o cliente, o animal e a data do atendimento.",
  APPOINTMENT_DESCRIPTION: "Preencha a descrição antes de salvar.",

  // perfil
  PASSWORD_SHORT: "A nova senha deve ter pelo menos 8 caracteres.",
  PASSWORD_MISMATCH: "As senhas não coincidem.",
};
