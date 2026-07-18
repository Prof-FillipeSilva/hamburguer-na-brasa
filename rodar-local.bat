@echo off
rem Instala dependencias (1a vez) e roda o site local em http://localhost:3000
cd /d "%~dp0"
if not exist node_modules ( echo Instalando dependencias... & call npm install )
call npm run dev
