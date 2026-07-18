@echo off
rem Usa a pasta do proprio script (funciona mesmo que o projeto seja movido)
cd /d "%~dp0"

set /p MSG="Mensagem do commit (Enter para usar padrao): "

if "%MSG%"=="" (
    powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0deploy.ps1"
) else (
    powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0deploy.ps1" -Message "%MSG%"
)

pause
