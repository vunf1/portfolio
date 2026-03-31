# Portfolio - Management Console (thin wrapper)
# Launches the Node.js TUI: node scripts/manage.mjs [action]
# Usage: .\manage.ps1         (interactive menu)
#        .\manage.ps1 3       (run action directly, e.g. 3 = Start dev server)

param([Parameter(Position = 0)][string]$Action = "")

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Node.js not found. Install Node and ensure it is on PATH." -ForegroundColor Red
    exit 1
}

if ($Action -ne "") {
    & node scripts/manage.mjs $Action
} else {
    & node scripts/manage.mjs
}

exit $LASTEXITCODE
