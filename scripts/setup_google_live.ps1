# Setup Google Calendar LIVE for RR ALIADOS Mega Dashboard
# Interactive — needs browser login as rraliadosteam@gmail.com
#
#   .\scripts\setup_google_live.ps1
#   .\scripts\setup_google_live.ps1 -PushToVercel
#
# Google Cloud prerequisites:
#   1) Enable Google Calendar API
#   2) OAuth consent screen + test user rraliadosteam@gmail.com
#   3) Create OAuth client type "Desktop app" (or Web with redirect http://127.0.0.1:8765/)
#   4) Copy Client ID + Client Secret

param(
    [string]$ClientId = $env:GOOGLE_CALENDAR_CLIENT_ID,
    [string]$ClientSecret = $env:GOOGLE_CALENDAR_CLIENT_SECRET,
    [string]$CalendarId = "rraliadosteam@gmail.com",
    [int]$ListenPort = 8765,
    [switch]$PushToVercel
)

$ErrorActionPreference = "Stop"
$Scope = "https://www.googleapis.com/auth/calendar.readonly"
$Redirect = "http://127.0.0.1:$ListenPort/"

Write-Host "=== RR ALIADOS — Google Calendar LIVE ===" -ForegroundColor Cyan
Write-Host "Cuenta: rraliadosteam@gmail.com"
Write-Host "Redirect URI que debes tener en el OAuth client: $Redirect"
Write-Host ""

if (-not $ClientId) { $ClientId = Read-Host "GOOGLE_CALENDAR_CLIENT_ID" }
if (-not $ClientSecret) { $ClientSecret = Read-Host "GOOGLE_CALENDAR_CLIENT_SECRET" }
if (-not $ClientId -or -not $ClientSecret) {
    Write-Host "Faltan Client ID/Secret." -ForegroundColor Red
    exit 1
}

$authUrl = "https://accounts.google.com/o/oauth2/v2/auth" +
    "?client_id=$([uri]::EscapeDataString($ClientId))" +
    "&redirect_uri=$([uri]::EscapeDataString($Redirect))" +
    "&response_type=code" +
    "&scope=$([uri]::EscapeDataString($Scope))" +
    "&access_type=offline" +
    "&prompt=consent"

Write-Host "Abriendo navegador para autorizar..." -ForegroundColor Yellow
Write-Host $authUrl
Start-Process $authUrl

# Local listener for OAuth redirect
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($Redirect)
try {
    $listener.Start()
} catch {
    Write-Host "No se pudo abrir puerto $ListenPort. Cierra lo que lo use o pasa -ListenPort 9876" -ForegroundColor Red
    exit 1
}

Write-Host "Esperando callback OAuth en $Redirect ..." -ForegroundColor Cyan
$ctx = $listener.GetContext()
$req = $ctx.Request
$code = $req.QueryString["code"]
$err = $req.QueryString["error"]
$html = if ($code) {
    "<html><body style='font-family:sans-serif;padding:2rem'><h1>OK</h1><p>Puedes cerrar esta pestana y volver a PowerShell.</p></body></html>"
} else {
    "<html><body style='font-family:sans-serif;padding:2rem'><h1>Error</h1><p>$err</p></body></html>"
}
$buf = [Text.Encoding]::UTF8.GetBytes($html)
$ctx.Response.ContentType = "text/html; charset=utf-8"
$ctx.Response.OutputStream.Write($buf, 0, $buf.Length)
$ctx.Response.Close()
$listener.Stop()

if ($err -or -not $code) {
    Write-Host "OAuth fallo: $err" -ForegroundColor Red
    exit 1
}

Write-Host "Intercambiando code por tokens..."
$body = @{
    code          = $code
    client_id     = $ClientId
    client_secret = $ClientSecret
    redirect_uri  = $Redirect
    grant_type    = "authorization_code"
}
$tokenResp = Invoke-RestMethod -Method Post -Uri "https://oauth2.googleapis.com/token" -Body $body -ContentType "application/x-www-form-urlencoded"
if (-not $tokenResp.refresh_token) {
    Write-Host "Sin refresh_token. Asegurate prompt=consent y access_type=offline." -ForegroundColor Red
    exit 1
}

$refresh = [string]$tokenResp.refresh_token
Write-Host "refresh_token OK" -ForegroundColor Green

$envDir = Split-Path -Parent $PSScriptRoot
$envLocal = Join-Path $envDir ".env.local"
$lines = @()
if (Test-Path $envLocal) {
    Get-Content $envLocal | Where-Object {
        $_ -notmatch '^GOOGLE_CALENDAR_(CLIENT_ID|CLIENT_SECRET|REFRESH_TOKEN|ID)='
    } | ForEach-Object { $lines += $_ }
}
$lines += ""
$lines += "# Google Calendar LIVE"
$lines += "GOOGLE_CALENDAR_CLIENT_ID=$ClientId"
$lines += "GOOGLE_CALENDAR_CLIENT_SECRET=$ClientSecret"
$lines += "GOOGLE_CALENDAR_REFRESH_TOKEN=$refresh"
$lines += "GOOGLE_CALENDAR_ID=$CalendarId"
Set-Content -Path $envLocal -Value ($lines -join "`r`n") -Encoding UTF8
Write-Host "Guardado en .env.local (gitignored)" -ForegroundColor Green

if ($PushToVercel) {
    Write-Host "Subiendo a Vercel Production..." -ForegroundColor Cyan
    $map = [ordered]@{
        GOOGLE_CALENDAR_CLIENT_ID     = $ClientId
        GOOGLE_CALENDAR_CLIENT_SECRET = $ClientSecret
        GOOGLE_CALENDAR_REFRESH_TOKEN = $refresh
        GOOGLE_CALENDAR_ID            = $CalendarId
    }
    foreach ($name in $map.Keys) {
        $tmp = [System.IO.Path]::GetTempFileName()
        Set-Content -Path $tmp -Value $map[$name] -NoNewline -Encoding ascii
        # vercel env add reads from stdin in non-interactive when piped
        Get-Content $tmp -Raw | vercel env add $name production --force
        Remove-Item $tmp -Force
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  OK $name" -ForegroundColor Green
        } else {
            Write-Host "  Manual: pega $name en Vercel UI" -ForegroundColor Yellow
        }
    }
    Write-Host "Siguiente: vercel deploy --prod --yes" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== GA4 (service account — no automatizable sin tu JSON) ===" -ForegroundColor Cyan
Write-Host @"
1) Cloud Console → Service Account → Key JSON
2) GA4 Property Access → add client_email como Viewer
3) Vercel Production:
   GOOGLE_ANALYTICS_PROPERTY_ID=<id numerico>
   GOOGLE_SERVICE_ACCOUNT_KEY=<JSON completo en una linea>
4) vercel deploy --prod --yes
5) GET /api/analytics y /api/calendar deben dejar de ser DEMO
"@
