# Valida los artefactos de reportes ya sincronizados por los generadores MiroFish.
# Uso: .\scripts\sync_reports.ps1
# Los scripts enhanced_report.py y reporte_optimizacion_estrategica.py escriben
# directamente en public/.

$ErrorActionPreference = "Stop"

$DashboardRoot = Split-Path -Parent $PSScriptRoot
$PublicReports = Join-Path $DashboardRoot "public\reports"

function Test-ReportIndex {
    param([string]$IndexPath, [string]$Root, [string]$Label)

    if (-not (Test-Path -LiteralPath $IndexPath)) {
        throw "[$Label] Índice no encontrado: $IndexPath"
    }
    $index = Get-Content -LiteralPath $IndexPath -Raw | ConvertFrom-Json
    $entries = @($index.reports)
    if ($entries.Count -eq 0) {
        throw "[$Label] El índice no tiene reportes."
    }
    foreach ($entry in $entries) {
        if (-not $entry.pdf) { continue }
        $relative = $entry.pdf.TrimStart('/').Replace('/', '\')
        $artifact = Join-Path (Join-Path $DashboardRoot "public") $relative
        if (-not (Test-Path -LiteralPath $artifact) -or (Get-Item $artifact).Length -eq 0) {
            throw "[$Label] Artefacto faltante o vacío: $artifact"
        }
    }
    Write-Host "[$Label] Índice y artefactos válidos." -ForegroundColor Green
}

Write-Host "=== Sync Reportes Mega Dashboard ===" -ForegroundColor Cyan
Write-Host "Dashboard: $DashboardRoot"
Write-Host "Inicio: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"

Test-ReportIndex -IndexPath (Join-Path $PublicReports "predicciones_index.json") -Root $PublicReports -Label "Predicciones"
Test-ReportIndex -IndexPath (Join-Path $PublicReports "estrategicos_index.json") -Root $PublicReports -Label "Estrategia"

$ActionLedger = Join-Path $DashboardRoot "public\data\action_ledger.json"
if (-not (Test-Path -LiteralPath $ActionLedger)) {
    throw "[Acciones] Ledger no encontrado: $ActionLedger (reporte_optimizacion_estrategica.py debe publicarlo)"
}
$ledger = Get-Content -LiteralPath $ActionLedger -Raw | ConvertFrom-Json
$actionCount = @($ledger.actions).Count
if ($actionCount -eq 0) {
    Write-Warning "[Acciones] action_ledger.json existe pero no tiene acciones."
} else {
    Write-Host "[Acciones] Ledger válido: $actionCount acciones (updated_at=$($ledger.updated_at))." -ForegroundColor Green
}

Write-Host ""
Write-Host "Validación de reportes completada." -ForegroundColor Green
Write-Host "Salud en prod: GET /api/automation (stale >24h = warning)." -ForegroundColor DarkGray
Write-Host "Siguiente: vercel deploy --prod --yes" -ForegroundColor Green
