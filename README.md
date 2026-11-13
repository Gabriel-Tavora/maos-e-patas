# Mãos e Patas — Sistema Veterinário

Sistema da clínica Mãos e Patas, feito a partir do projeto
[time-management](https://github.com/Gabriel-Tavora/time-management): mesma stack
(Vite + React 19 + React Router 7 + oxlint) e a mesma organização `pages -> hooks -> services`.
O visual segue a tela de login das referências (verde-petróleo `#075765`, botões pretos, fundo claro).

## Rodando

```bash
npm install
npm run dev
```

Sem `VITE_API_URL` o app roda em **modo demonstração**: os dados ficam no navegador
(`src/services/mock`), com os mesmos clientes e animais das telas de referência.

- Login: `admin@maosepatas.com` / `admin123`
- Código de recuperação de senha: `123456`

Para usar o backend real, copie `.env.example` para `.env.local` e informe `VITE_API_URL`.

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

## API esperada pelo backend

| Método | Rota | Observação |
| --- | --- | --- |
| POST | `/login` | `{ email, password }` → `{ id, token }` |
| POST / PATCH | `/password` | envia código / redefine com `{ code, password }` |
| GET / PATCH | `/users/me`, `/users` | perfil do administrador |
| GET / POST | `/clients` | cliente com `contacts[]`, `address{}`; a lista vem com `animals[]` |
| GET / PATCH / DELETE | `/clients/:id` | DELETE deve responder 409 se houver animais |
| GET / POST | `/animals` | lista mais recentes primeiro, com `client{ id, name, code }` |
| GET / PATCH / DELETE | `/animals/:id` | com `appointments[]` |
| GET / POST | `/appointments` | com `animal_name` e `client_name` |
| PATCH / DELETE | `/appointments/:id` | |

O formato exato de cada objeto está em `src/services/mock/seed.js`.

## O que saiu do projeto base

Horas extras, calendário, PDFs, perfis por cargo (team leader, coordenador...), tema claro/escuro,
relógio analógico, avatares externos, `react-helmet-async`, `@tanstack/react-table`, `sweetalert2`
e `react-time-picker`.
