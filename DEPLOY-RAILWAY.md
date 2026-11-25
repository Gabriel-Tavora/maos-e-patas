# Publicar no Railway

Deixa o sistema no ar 24 horas, com backend, frontend e banco MySQL no mesmo painel.

```
navegador ──► frontend (nginx) ──/api──► backend (Spring Boot) ──► MySQL
```

O frontend repassa tudo que começa com `/api` para o backend, como o Vite faz no PC. O nginx
também remove o cabeçalho `Origin`: o `SecurityConfig` do backend só libera CORS para
`http://localhost:5173`, e sem isso o login era recusado no site publicado. Assim não é preciso
mudar o Java.

**Custo:** plano Hobby, US$ 5/mês com US$ 5 de uso incluídos. O uso acima disso é cobrado à
parte; para este projeto, a estimativa é de US$ 10 a 15 no mês. Coloque um limite de gasto
(passo 1) e cancele depois da apresentação (passo 8).

## 0. Envie o projeto para o GitHub

Faça commit e push de tudo, incluindo os arquivos novos:

- `backend/Dockerfile` e `backend/.dockerignore`
- `frontend/Dockerfile`, `frontend/nginx.conf.template` e `frontend/.dockerignore`

## 1. Conta

1. Entre em **railway.com** e faça login com o GitHub.
2. Assine o plano **Hobby**. Se no topo do painel aparecer "30 days or $5.00 left", você ainda
   está no período de teste: dá para montar tudo, mas o crédito pode acabar antes de 30 dias com o
   Java e o MySQL ligados direto.
3. Nas configurações de uso (*Usage*) da conta, defina um limite de gasto, por exemplo US$ 15.

## 2. Banco MySQL

1. **New Project** → **Database** → **MySQL**.
2. Espere o serviço ficar verde. Ele se chama `MySQL`; não mude o nome, porque as variáveis abaixo
   usam esse nome. Não ative o *Public access*: o backend usa a rede interna do Railway.

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

4. **Settings** → **Networking** → **Generate Domain**. Se pedir a porta, use `8080`. Não crie
   *TCP proxy*; se tiver criado, apague na lixeira.
5. Clique em **Deploy** (botão roxo no alto, que aplica as mudanças pendentes).
6. Aba **Deployments** → **View logs**. O primeiro build demora alguns minutos. Está pronto quando
   aparecer `Started MaosepatasApplication`.
7. Teste abrindo `https://<domínio-do-backend>/api/dashboard`. Um JSON com `"status":401` quer
   dizer que está funcionando (só pede login).

As tabelas são criadas sozinhas, e o `DataInitializer` cria o administrador
`admin@maosepatas.com.br` / `admin123`.

## 4. Frontend

1. No projeto: **Create** → **GitHub Repo** → o mesmo repositório.
2. **Settings** → **Root Directory:** `/frontend`. Renomeie para `frontend`.
3. **Variables** → **Raw Editor**:

   ```
   BACKEND_URL=https://${{backend.RAILWAY_PUBLIC_DOMAIN}}
   ```

4. **Settings** → **Networking** → **Generate Domain**. Se pedir a porta, use `80`. Clique em
   **Deploy**.
5. Para trocar o nome do site: no mesmo lugar, clique no lápis ao lado do domínio e escolha um
   nome livre, por exemplo `maosepatas.up.railway.app`. Nada mais precisa mudar.
6. Abra o domínio gerado, algo como `https://frontend-production-xxxx.up.railway.app`. A tela de
   login deve aparecer.

## 5. Dados de teste

No seu PC, abra a pasta do projeto, clique com o botão direito num espaço vazio → **Abrir no
Terminal**, e rode com o link do **frontend**:

```powershell
.\criar-dados-teste.cmd https://frontend-production-xxxx.up.railway.app
```

São criados 4 clientes, 5 animais e 5 atendimentos. Rodar de novo não duplica nada.

Não use dois cliques aqui: sem o link, o script cadastra no backend do seu PC
(`localhost:8080`), não no site.

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
| "Email ou senha inválidos." (sem hífen) com a senha certa | A resposta não veio do backend: confira `/api/dashboard` pelo link do frontend e se o `nginx.conf.template` tem a linha `proxy_set_header Origin "";` |
| "E-mail ou senha inválidos" (com hífen) | Veio do backend: confira se o log mostrou `Started MaosepatasApplication`; o administrador é criado nesse momento |
| `criar-dados-teste.cmd` pede e-mail e senha | Foi aberto sem o link (usou o backend do PC) ou o login no site ainda não funciona |
| Atualizar a página em `/clientes` dá 404 | O frontend não está usando o `nginx.conf.template`; confira o Root Directory `/frontend` |
