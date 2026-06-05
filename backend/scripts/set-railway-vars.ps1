$ErrorActionPreference = "Stop"

$serviceName = "psyscreening-api"
$projectId = "512429de-0833-4789-a818-64d15b636957"
$environmentId = "f28aaf5d-9401-4877-8a5c-e8e1acc10b98"
$backendDir = Resolve-Path (Join-Path $PSScriptRoot "..")
$envPath = Join-Path $backendDir ".env"

function Read-LocalEnv {
  param([string] $Path)

  $envValues = @{}
  if (-not (Test-Path $Path)) {
    return $envValues
  }

  Get-Content $Path | ForEach-Object {
    $line = $_.Trim()
    if (-not $line -or $line.StartsWith("#") -or -not $line.Contains("=")) {
      return
    }

    $separatorIndex = $line.IndexOf("=")
    $key = $line.Substring(0, $separatorIndex).Trim()
    $value = $line.Substring($separatorIndex + 1).Trim()

    if (($value.StartsWith('"') -and $value.EndsWith('"')) -or ($value.StartsWith("'") -and $value.EndsWith("'"))) {
      $value = $value.Substring(1, $value.Length - 2)
    }

    $envValues[$key] = $value
  }

  return $envValues
}

function Get-EnvValue {
  param(
    [hashtable] $Values,
    [string] $Key,
    [string] $Fallback = ""
  )

  if ($Values.ContainsKey($Key) -and $Values[$Key]) {
    return $Values[$Key]
  }

  return $Fallback
}

$localEnv = Read-LocalEnv -Path $envPath
$variables = [ordered]@{
  NODE_ENV = "production"
  DATABASE_URL = '$' + "{{Postgres.DATABASE_URL}}"
  CORS_ORIGIN = "https://psyscreening.vercel.app"
  FRONTEND_URL = "https://psyscreening.vercel.app"
  JWT_SECRET = Get-EnvValue $localEnv "JWT_SECRET"
  JWT_EXPIRES_IN = Get-EnvValue $localEnv "JWT_EXPIRES_IN" "7d"
  MAILTRAP_HOST = Get-EnvValue $localEnv "MAILTRAP_HOST" "sandbox.smtp.mailtrap.io"
  MAILTRAP_PORT = Get-EnvValue $localEnv "MAILTRAP_PORT" "2525"
  MAILTRAP_USER = Get-EnvValue $localEnv "MAILTRAP_USER"
  MAILTRAP_PASS = Get-EnvValue $localEnv "MAILTRAP_PASS"
  SMTP_HOST = Get-EnvValue $localEnv "SMTP_HOST"
  SMTP_PORT = Get-EnvValue $localEnv "SMTP_PORT"
  SMTP_SECURE = Get-EnvValue $localEnv "SMTP_SECURE"
  SMTP_USER = Get-EnvValue $localEnv "SMTP_USER"
  SMTP_PASS = Get-EnvValue $localEnv "SMTP_PASS"
  MAIL_FROM = Get-EnvValue $localEnv "MAIL_FROM" "PsyScreening <no-reply@psyscreening.local>"
  GOOGLE_CLIENT_ID = Get-EnvValue $localEnv "GOOGLE_CLIENT_ID"
  ML_PROVIDER = "remote"
  AI_ML_API_BASE_URL = "https://fastapi-psyscreening-production.up.railway.app"
  ADMIN_EMAIL = Get-EnvValue $localEnv "ADMIN_EMAIL" "adminganteng@gmail.com"
  ADMIN_PASSWORD = Get-EnvValue $localEnv "ADMIN_PASSWORD" "Adminganjil13579"
}

$missing = @()
Push-Location $backendDir
try {
  foreach ($entry in $variables.GetEnumerator()) {
    if (-not $entry.Value) {
      $missing += $entry.Key
      continue
    }

    $entry.Value | npx.cmd @railway/cli variable set $entry.Key --stdin --service $serviceName --project $projectId --environment $environmentId --skip-deploys | Out-Null
    Write-Output "Variable $($entry.Key) sudah dipasang."
  }
}
finally {
  Pop-Location
}

if ($missing.Count -gt 0) {
  Write-Warning "Variable kosong dan dilewati: $($missing -join ', ')"
}
