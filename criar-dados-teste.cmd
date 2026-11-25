@echo off
rem Cria dados de teste (4 clientes, 5 animais e 5 atendimentos) no backend.
rem Uso: criar-dados-teste.cmd                      -> backend local (http://localhost:8080)
rem      criar-dados-teste.cmd https://seu-site.com -> site publicado (ex.: Railway)
rem Pode rodar mais de uma vez: nada e duplicado.
if "%~1"=="" (
  powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\dados-teste.ps1"
) else (
  powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\dados-teste.ps1" -Api "%~1"
)
