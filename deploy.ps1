param(
    [string]$Message
)

# Usa a pasta do próprio script (funciona mesmo que o projeto seja movido)
Set-Location -Path $PSScriptRoot

if (-not $Message) {
    $Message = "Atualizacao $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
}

Write-Host "Verificando alteracoes..." -ForegroundColor Cyan
git status --short

$changes = git status --porcelain
if (-not $changes) {
    Write-Host "`nNenhuma alteracao para enviar. Repositorio ja esta atualizado." -ForegroundColor Yellow
    exit 0
}

Write-Host "`nAdicionando alteracoes..." -ForegroundColor Cyan
git add -A

Write-Host "Criando commit: `"$Message`"" -ForegroundColor Cyan
git commit -m "$Message"

Write-Host "Enviando para o GitHub..." -ForegroundColor Cyan
git push origin main

Write-Host "`nDeploy enviado! A Vercel vai buildar e publicar automaticamente." -ForegroundColor Green
Write-Host "Acompanhe em: https://vercel.com/dashboard"
