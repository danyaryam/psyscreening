$ErrorActionPreference = "Stop"

$serviceName = "Postgres"
$environmentName = "production"
$backendDir = Resolve-Path (Join-Path $PSScriptRoot "..")

$variablesJson = npx.cmd @railway/cli variable list --service $serviceName --environment $environmentName --json
$variables = $variablesJson | ConvertFrom-Json

$databaseUrl = $null
foreach ($candidate in @("DATABASE_PUBLIC_URL", "POSTGRES_PUBLIC_URL", "DATABASE_URL")) {
  if ($variables.PSObject.Properties.Name -contains $candidate -and $variables.$candidate) {
    $databaseUrl = $variables.$candidate
    break
  }
}

if (-not $databaseUrl) {
  throw "Public PostgreSQL URL tidak ditemukan di Railway variables."
}

Push-Location $backendDir
try {
  $previousDatabaseUrl = $env:DATABASE_URL
  $env:DATABASE_URL = $databaseUrl
  npm.cmd run db:seed
}
finally {
  if ($null -ne $previousDatabaseUrl) {
    $env:DATABASE_URL = $previousDatabaseUrl
  }
  else {
    Remove-Item Env:\DATABASE_URL -ErrorAction SilentlyContinue
  }

  Pop-Location
}
