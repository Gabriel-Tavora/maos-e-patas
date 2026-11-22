# Mãos e Patas — Sistema Veterinário

Sistema da clínica Mãos e Patas, feito a partir do projeto
[time-management](https://github.com/Gabriel-Tavora/time-management): mesma stack
(Vite + React 19 + React Router 7 + oxlint) e a mesma organização `pages -> hooks -> services`.
O visual segue a tela de login das referências (verde-petróleo `#075765`, botões pretos, fundo claro).

## Rodando

Pelo atalho `iniciar-frontend.cmd` na raiz do projeto (veja o `README.md` de lá), ou:

```bash
npm install
npm run dev
```

### Modo demonstração (sem `.env.local`)

O frontend usa um backend falso que guarda os dados no navegador (`src/services/mock`). Ele
responde às mesmas rotas e com os mesmos DTOs do Spring Boot.

- Login: `admin@maosepatas.com.br` / `admin123`
- Código de recuperação de senha: `123456`

### Com o backend (pasta `../backend`)

Crie `.env.local` com `VITE_BACKEND_URL=http://localhost:8080` (o `iniciar-frontend.cmd` faz
isso sozinho) e reinicie o `npm run dev`. O Vite repassa as chamadas `/api` para o backend.

## Telas

| Rota | Tela |
| --- | --- |
| `/` | Login (com "Lembrar de mim") |
| `/ForgotPassword` | Recuperar senha (e-mail → código + nova senha) |
| `/painel` | Painel de Controle: últimos animais e últimos atendimentos |
| `/clientes` | Lista de clientes, busca por nome/código/CPF e filtro com/sem animais |
| `/clientes/novo` | Adicionar cliente: informações pessoais, contatos (WhatsApp, vários contatos) e endereço |
| `/clientes/:id` | Ficha do cliente: dados, contatos com link do WhatsApp, endereço, animais; edição por seção em janela; excluir pelos três pontinhos (bloqueado se o tutor ainda tiver animais) |
| `/clientes/:id/animais/novo` | Cadastrar animal: foto, sexo, esterilização, espécie, raça, pelagem, nascimento, microchip; "Adicionar este e mais animais" / "Adicionar" → lista dos adicionados → "Salvar" |
| `/clientes/:id/animais/:animalId` | Ficha do animal: dados, edição, tutor, histórico, excluir pelos três pontinhos e "Acessar ficha de atendimento" |
| `/atendimentos` | Consultas e Vacinas: contadores, cadastro, busca, filtro e marcar como realizado |
| `/perfil` | Editar perfil do administrador e alterar senha |

## Estrutura

```
src/
  main.jsx                 rotas
  config/app.js            nome, rodapé, itens do menu
  config/options.js        opções dos selects (espécies e raças, estados, tipos de contato...)
  context/                 TokenContext (auth), privateRoutex
  services/
    api.js                 request() + troca automática para o modo demonstração
    login.js userData.js clientData.js animalData.js appointmentData.js
    mock/                  backend de demonstração (seed.js tem os dados iniciais)
  hooks/                   useFetch, usePasswordReset, usePageTitle
  components/
    common/                Button, Inputs (Input, Select, Textarea, RadioGroup, Checkbox), Modal, MoreMenu, AppointmentCard
    Layouts/               AppLayout, AuthLayout, TopBar (+ rodapé), SideBar
    Clients/ClientFields   blocos de campos do cliente (cadastro e edição)
    Animals/               AnimalFields, AnimalAvatar
  pages/                   Auth, Dashboard, Clients, Animals, Appointments, Profile, NotFound
  validations/             clientValidation (CPF, contatos, endereço), animalValidation
  utils/                   masks (CPF, CEP, telefone, WhatsApp), formatDate, photo, message, handleApiError
```

## Requisitos atendidos

Todos os RF01–RF47, RNF01–RNF15 e RN01–RN08 do documento de requisitos. Os menos óbvios:

| Requisito | Onde |
| --- | --- |
| RF10 – acesso às funções principais | atalhos no Painel de Controle |
| RF20 / RN04 – excluir cliente sem animais | três pontinhos na ficha do cliente |
| RF30 / RN07 – vários animais numa operação | Cadastrar Animal: os animais vão para uma lista e só são gravados no "Salvar" (`/api/animais/lote`) |
| RF36 – ficha de atendimento do animal | botão na ficha do animal, abre o cadastro já preenchido |
| RF40 – filtrar atendimentos | por tipo (Consultas/Vacinas) e por situação (Agendados/Realizados) |
| RF43 – editar atendimentos | botão "Editar" em cada registro |
| RNF10 – modo demonstração | `src/services/mock` |
| RNF15 – navegação inválida | página "Página não encontrada" e aviso quando o registro não existe |
| RN08 – animais mais recentes primeiro | ordem da API, mantida pelas telas |

## Integração com o backend

- `src/services/endpoints.js`: as rotas, iguais aos controllers do backend (`develop`, commit `7fee1f3`).
- `src/services/adapters.js`: converte os DTOs do Java (`nome`, `endereco.logradouro`,
  `sexo: "FEMEA"`, `dataAtendimento`...) para o formato das telas e vice-versa.
- Login com JWT (`Authorization: Bearer <token>`). Um 401 leva de volta ao login.
- Os erros do `GlobalExceptionHandler` (`message` e `fieldErrors`) aparecem direto nos formulários.

| Método | Rota usada pelo front | Tela |
| --- | --- | --- |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/recuperar-senha` e `/api/auth/redefinir-senha` | Recuperar senha (o código aparece no console do backend) |
| GET / PUT | `/api/administradores/perfil` | Barra superior e Editar perfil |
| PATCH | `/api/administradores/senha` | Editar perfil |
| GET | `/api/dashboard` | Painel de Controle |
| GET / POST | `/api/tutores` | Clientes / Adicionar cliente |
| GET / PUT / DELETE | `/api/tutores/{id}` | Ficha do cliente |
| POST | `/api/animais/lote` | Cadastrar animal (vários de uma vez) |
| GET / PUT / DELETE | `/api/animais/{id}` | Ficha do animal |
| GET / POST | `/api/atendimentos` | Consultas e Vacinas |
| PUT / DELETE | `/api/atendimentos/{id}` | Editar / excluir atendimento |
| PATCH | `/api/atendimentos/{id}/realizar` | Marcar como realizado |

A busca e os filtros de clientes e atendimentos são feitos na tela, sobre a lista completa.
As rotas `/pesquisar`, `/filtro` e `/filtrar` do backend ficam disponíveis, mas não são usadas.

### Campos da tela que o backend ainda não guarda

Aparecem nos formulários (estão nas telas de referência), mas **não são enviados**, porque os DTOs
não têm esses campos:

- **Tutor:** nacionalidade, sexo, RG, data de nascimento e ponto de referência.
- **Contato:** tipo (celular, telefone ou e-mail). Só o número e o WhatsApp são salvos. A coluna
  `telefone` tem 20 caracteres, então um e-mail como contato não cabe.
- **Animal:** observações e o detalhe da esterilização. Só vai `esterilizado: true/false`: Castrado e
  Vasectomizado viram `true`, Fértil vira `false`.

Quando o backend criar essas colunas, basta incluir os campos em `toTutorRequest` e
`toAnimalRequest` (em `adapters.js`).

## O que saiu do projeto base

Horas extras, calendário, PDFs, perfis por cargo (team leader, coordenador...), tema claro/escuro,
relógio analógico, avatares externos, `react-helmet-async`, `@tanstack/react-table`, `sweetalert2`
e `react-time-picker`.
