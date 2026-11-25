# Publicar no Railway

Deixa o sistema no ar 24 horas, com backend, frontend e banco MySQL no mesmo painel.

```
navegador ──► frontend (nginx) ──/api──► backend (Spring Boot) ──► MySQL
```

O frontend repassa tudo que começa com `/api` para o backend, como o Vite faz no PC. Por isso
não é preciso liberar CORS nem mudar código.

**Custo:** plano Hobby, US$ 5/mês com US$ 5 de uso incluídos. O uso acima disso é cobrado à
parte; para este projeto, a estimativa é de US$ 10 a 15 no mês. Coloque um limite de gasto
(passo 1) e cancele depois da apresentação (passo 8).

## 0. Envie o projeto para o GitHub

Faça commit e push de tudo, incluindo os arquivos novos:

- `backend/Dockerfile` e `backend/.dockerignore`
- `frontend/Dockerfile`, `frontend/nginx.conf.template` e `frontend/.dockerignore`

## 1. Conta

1. Entre em **railway.com** e faça login com o GitHub.
2. Assine o plano **Hobby**.
3. Nas configurações de uso (*Usage*) da conta, defina um limite de gasto, por exemplo US$ 15.

## 2. Banco MySQL

1. **New Project** → **Database** → **MySQL**.
2. Espere o serviço ficar verde. Ele se chama `MySQL`; não mude o nome, porque as variáveis abaixo
   usam esse nome.

## 3. Backend

1. Dentro do mesmo projeto: **Create** (ou **+ New**) → **GitHub Repo** → escolha o repositório.
2. Clique no serviço criado → **Settings**:
   - **Root Directory:** `/backend`
   - Renomeie o serviço para `backend` (o frontend usa esse nome).
3. Aba **Variables** → **Raw Editor**, cole e salve:

   ```
   SPRING_DATASOURCE_URL=jdbc:mysql://${{MySQL.MYSQLHOST}}:${{MySQL.MYSQLPORT}}/${{MySQL.MYSQLDATABASE}}?serverTimezone=UTC&allowPublicKeyRetrieval=true&useSSL=false
   DB_USER=${{MySQL.MYSQLUSER}}
   DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
   JWT_SECRET=troque-por-um-texto-longo-e-aleatorio-com-mais-de-32-caracteres
   ```

4. **Settings** → **Networking** → **Generate Domain**. Se pedir a porta, use `8080`.
5. Aba **Deployments** → **View logs**. O primeiro build demora alguns minutos. Está pronto quando
   aparecer `Started MaosepatasApplication`.

As tabelas são criadas sozinhas, e o `DataInitializer` cria o administrador
`admin@maosepatas.com.br` / `admin123`.

## 4. Frontend

1. No projeto: **Create** → **GitHub Repo** → o mesmo repositório.
2. **Settings** → **Root Directory:** `/frontend`. Renomeie para `frontend`.
3. **Variables** → **Raw Editor**:

   ```
   BACKEND_URL=https://${{backend.RAILWAY_PUBLIC_DOMAIN}}
   ```

4. **Settings** → **Networking** → **Generate Domain**. Se pedir a porta, use `80`.
5. Abra o domínio gerado, algo como `https://frontend-production-xxxx.up.railway.app`. A tela de
   login deve aparecer.

## 5. Dados de teste

No seu PC, dentro da pasta do projeto, abra o terminal e rode com o link do **frontend**:

```powershell
.\criar-dados-teste.cmd https://frontend-production-xxxx.up.railway.app
```

São criados 4 clientes, 5 animais e 5 atendimentos. Rodar de novo não duplica nada.

## 6. Envie para o professor

- Link: o domínio do frontend
- Login: `admin@maosepatas.com.br` / `admin123`

## 7. Atualizações

Cada `git push` na branch conectada refaz o deploy sozinho. Os dados do banco continuam.

## 8. Depois da apresentação

Para não ser cobrado no mês seguinte: apague o projeto (**Settings** → **Danger** → **Delete
Project**) e cancele o plano Hobby nas configurações da conta.

## Problemas comuns

| Sintoma | Causa provável |
| --- | --- |
| Log do backend: `Access denied` ou `Public Key Retrieval is not allowed` | Variáveis do passo 3 coladas erradas, ou o banco não se chama `MySQL` |
| Log do backend: `Communications link failure` | O MySQL ainda estava subindo; clique em **Redeploy** no backend |
| Tela de login abre, mas o login dá erro de conexão ou 502 | `BACKEND_URL` errado, backend sem domínio gerado ou backend ainda subindo |
| "E-mail ou senha inválidos" | Confira se o log mostrou `Started MaosepatasApplication`; o administrador é criado nesse momento |
| Atualizar a página em `/clientes` dá 404 | O frontend não está usando o `nginx.conf.template`; confira o Root Directory `/frontend` |
