# Sync reportes PDF/XLSX desde MiroFish-Lite hacia Mega Dashboard
# Uso: .\scripts\sync_reports.ps1

$ErrorActionPreference = "Stop"

$DashboardRoot = Split-Path -Parent $PSScriptRoot
$MiroFishReports = "G:\Mi unidad\RR_Aliados\05_IA_Herramientas\mirofish_lite\output\reports"
$MiroFishOptim = "G:\Mi unidad\RR_Aliados\05_IA_Herramientas\mirofish_lite\output\optimizacion"
$PublicReports = Join-Path $DashboardRoot "public\reports"
$PublicOptim = Join-Path $DashboardRoot "public\optimizacion"

function Sync-Folder {
    param([string]$Source, [string]$Dest, [string]$Label)
    if (-not (Test-Path $Source)) {
        Write-Warning "Origen no encontrado ($Label): $Source"
        return 0
    }
    if (-not (Test-Path $Dest)) {
        New-Item -ItemType Directory -Path $Dest -Force | Out-Null
    }
    $files = Get-ChildItem -LiteralPath $Source -Recurse -File -ErrorAction SilentlyContinue |
        Where-Object { $_.Extension -in '.pdf', '.xlsx', '.json' }
    $count = 0
    foreach ($f in $files) {
        Copy-Item -Path $f.FullName -Destination (Join-Path $Dest $f.Name) -Force
        $count++
    }
    Write-Host "[$Label] $count archivos sincronizados -> $Dest"
    return $count
}

Write-Host "=== Sync Reportes Mega Dashboard ===" -ForegroundColor Cyan
Write-Host "Dashboard: $DashboardRoot"

$r1 = Sync-Folder -Source $MiroFishReports -Dest $PublicReports -Label "Predicciones"
$r2 = Sync-Folder -Source $MiroFishOptim -Dest $PublicOptim -Label "Optimizacion"

Write-Host ""
Write-Host "Total: $($r1 + $r2) archivos. Ejecuta 'vercel deploy --prod --yes' para publicar." -ForegroundColor Green
