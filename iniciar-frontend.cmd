@echo off
rem Sobe o frontend (Vite) em http://localhost:5173 ligado ao backend
cd /d "%~dp0frontend"

if not exist node_modules (
  echo Instalando dependencias - so na primeira vez...
  call npm install
)

if not exist .env.local (
  > .env.local echo VITE_BACKEND_URL=http://localhost:8080
  echo Criado frontend\.env.local apontando para o backend.
)

call npm run dev
pause
