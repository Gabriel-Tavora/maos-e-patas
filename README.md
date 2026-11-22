# Mãos e Patas — Sistema Veterinário

Projeto da disciplina de Desenvolvimento Web (ADS — UNIFOR), Grupo 34.

```
maos-e-patas/
├── backend/               API REST em Java 21 + Spring Boot 4 + MySQL (JWT)
├── frontend/              Telas em React 19 + Vite
├── iniciar-backend.cmd    sobe o backend em http://localhost:8080
├── iniciar-frontend.cmd   sobe o frontend em http://localhost:5173
└── README.md
```

## Pré-requisitos

- **Java 21** ou mais novo (`java -version`)
- **Node.js 20** ou mais novo (`node -v`)
- **MySQL** rodando na porta 3306 (no XAMPP: *Start* no MySQL)

## Como rodar

1. Ligue o **MySQL** (XAMPP Control Panel → *Start*).
2. Dê dois cliques em **`iniciar-backend.cmd`** e espere aparecer `Started MaosepatasApplication`.
   Na primeira vez o Maven baixa as dependências, o que demora alguns minutos.
3. Dê dois cliques em **`iniciar-frontend.cmd`**. Na primeira vez ele roda o `npm install` e cria o
   `frontend/.env.local`.
4. Abra **http://localhost:5173**.

Deixe as duas janelas abertas enquanto usa o sistema.

### Senha do MySQL

O `iniciar-backend.cmd` usa a senha **vazia**, que é o padrão do XAMPP. Se o seu `root` tiver
senha, rode pelo terminal:

```powershell
.\iniciar-backend.cmd minhaSenha
```

### Rodando sem os atalhos

```powershell
# backend
cd backend
.\mvnw.cmd spring-boot:run '-Dspring-boot.run.arguments=--spring.datasource.password='

# frontend (outro terminal)
cd frontend
npm install
npm run dev
```

O frontend só fala com o backend se existir o arquivo `frontend/.env.local` com:

```
VITE_BACKEND_URL=http://localhost:8080
```

Sem esse arquivo, o frontend roda em **modo demonstração**: os dados ficam salvos no navegador e
o backend não é usado.

## Login

| Situação | E-mail | Senha |
| --- | --- | --- |
| Banco novo: o `DataInitializer` cria o administrador | `admin@maosepatas.com.br` | `admin123` |
| Modo demonstração | `admin@maosepatas.com.br` | `admin123` |

Se o banco já tinha um administrador antigo com a senha em texto puro, o login falha, porque as
senhas agora usam BCrypt. O comando para corrigir está em `backend/CORRECOES.md`.

**Recuperar senha:** o código de 6 dígitos aparece no terminal do backend (o projeto ainda não
envia e-mail).

## Como o frontend fala com o backend

- O navegador chama `http://localhost:5173/api/...`, e o Vite repassa para `http://localhost:8080`
  (`frontend/vite.config.js`). Por isso não há problema de CORS.
- As rotas estão em `frontend/src/services/endpoints.js` e seguem os controllers de
  `backend/src/main/java/.../controller`.
- `frontend/src/services/adapters.js` converte os DTOs do Java para o formato das telas.

A documentação de cada lado está em `frontend/README.md` e `backend/README.MD`.

## Banco de dados

- Nome: `maosepatas`. É criado sozinho na primeira execução, junto com as tabelas
  (`ddl-auto: update`).
- Tabelas: `tb_administrador`, `tb_tutor`, `tb_contato`, `tb_animal` e `tb_atendimento`.
- Usuário e senha padrão do backend: `root` / `1234`. Dá para trocar pelas variáveis `DB_USER` e
  `DB_PASSWORD`, ou pela linha de comando, como acima.
