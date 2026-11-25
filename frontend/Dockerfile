# Imagem do frontend para o deploy: gera o build do Vite e serve com nginx.
# O nginx repassa /api para o backend (BACKEND_URL), como o Vite faz no PC.
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Qualquer valor aqui desliga o modo demonstracao; as chamadas vao para /api
ENV VITE_BACKEND_URL=producao
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
ENV PORT=80
ENV BACKEND_URL=http://localhost:8080
