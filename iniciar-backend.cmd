@echo off
rem Sobe o backend (Spring Boot) em http://localhost:8080
rem Uso: iniciar-backend.cmd            -> senha do MySQL vazia (padrao do XAMPP)
rem      iniciar-backend.cmd minhaSenha -> outra senha
set "SENHA=%~1"

powershell -NoProfile -Command "if (-not (Test-NetConnection localhost -Port 3306 -InformationLevel Quiet -WarningAction SilentlyContinue)) { exit 1 }"
if errorlevel 1 (
  echo.
  echo O MySQL nao esta ligado na porta 3306.
  echo Abra o XAMPP Control Panel e clique em Start no MySQL. Depois rode este arquivo de novo.
  echo.
  pause
  exit /b 1
)

cd /d "%~dp0backend"

rem Recria a configuracao do Maven Wrapper se ela nao existir
if not exist .mvn\wrapper\maven-wrapper.properties (
  mkdir .mvn\wrapper 2>nul
  (
    echo wrapperVersion=3.3.4
    echo distributionType=only-script
    echo distributionUrl=https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.10.0/apache-maven-3.10.0-bin.zip
  ) > .mvn\wrapper\maven-wrapper.properties
)

call mvnw.cmd spring-boot:run "-Dspring-boot.run.arguments=--spring.datasource.password=%SENHA%"
pause
