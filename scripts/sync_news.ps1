# Sync Google News RSS → public/data/news_feed.json
# Uso: .\scripts\sync_news.ps1
# Cron: diario 07:00 (junto a sync_reports)

$ErrorActionPreference = "Stop"
$DashboardRoot = Split-Path -Parent $PSScriptRoot
$OutFile = Join-Path $DashboardRoot "public\data\news_feed.json"
$OutDir = Split-Path -Parent $OutFile
if (-not (Test-Path -LiteralPath $OutDir)) {
    New-Item -ItemType Directory -Path $OutDir -Force | Out-Null
}

$queries = @(
    "RR ALIADOS",
    "posicionamiento digital Colombia",
    "IA marketing Colombia",
    "startups Medellín"
)

function Get-RssItems {
    param([string]$Query)
    $url = "https://news.google.com/rss/search?q=$([uri]::EscapeDataString($Query))&hl=es-419&gl=CO&ceid=CO:es"
    try {
        $resp = Invoke-WebRequest -Uri $url -UseBasicParsing -Headers @{ "User-Agent" = "RR-Aliados-MegaDashboard/1.0" }
        [xml]$xml = $resp.Content
        $items = @()
        foreach ($item in @($xml.rss.channel.item | Select-Object -First 6)) {
            $title = [string]$item.title
            if (-not $title) { continue }
            $pub = $null
            try { $pub = ([datetime]$item.pubDate).ToString("o") } catch { }
            $items += [ordered]@{
                id          = ("{0}-{1}" -f $Query, ($title.GetHashCode()))
                title       = $title
                source      = if ($item.source.'#text') { [string]$item.source.'#text' } else { "Google News" }
                link        = [string]$item.link
                publishedAt = $pub
                query       = $Query
            }
        }
        return $items
    } catch {
        Write-Warning "Fallo query '$Query': $_"
        return @()
    }
}

Write-Host "=== Sync News Mega Dashboard ===" -ForegroundColor Cyan
$all = @()
$seen = @{}
foreach ($q in $queries) {
    foreach ($it in (Get-RssItems -Query $q)) {
        $key = $it.title.ToLowerInvariant()
        if ($seen.ContainsKey($key)) { continue }
        $seen[$key] = $true
        $all += $it
    }
}

$payload = [ordered]@{
    updatedAt = (Get-Date).ToUniversalTime().ToString("o")
    source    = "cache"
    demo      = $false
    queries   = $queries
    items     = @($all | Select-Object -First 12)
    message   = "Generado por scripts/sync_news.ps1"
}

$json = $payload | ConvertTo-Json -Depth 6
[System.IO.File]::WriteAllText($OutFile, $json, [System.Text.UTF8Encoding]::new($false))
Write-Host "Escrito $($payload.items.Count) items -> $OutFile" -ForegroundColor Green
Write-Host "Prod también puede usar GET /api/news (RSS live)." -ForegroundColor DarkGray
