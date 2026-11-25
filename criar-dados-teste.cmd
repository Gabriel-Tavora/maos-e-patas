@echo off
rem Cria dados de teste (4 clientes, 5 animais e 5 atendimentos) no backend.
rem O backend precisa estar rodando (iniciar-backend.cmd). Pode rodar mais de uma vez: nada e duplicado.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\dados-teste.ps1"
