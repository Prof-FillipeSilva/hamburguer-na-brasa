@echo off
cd /d "c:\Users\filli\OneDrive\Desktop\Projeto - Venda de Sites\sites_clientes\hamburguer-na-brasa-deploy"

set /p MSG="Mensagem do commit (Enter para usar padrao): "

if "%MSG%"=="" (
    powershell -NoProfile -ExecutionPolicy Bypass -File "deploy.ps1"
) else (
    powershell -NoProfile -ExecutionPolicy Bypass -File "deploy.ps1" -Message "%MSG%"
)

pause
