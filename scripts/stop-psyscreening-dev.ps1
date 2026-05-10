$workspaceRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot ".."))
$workspacePattern = $workspaceRoot.ToLowerInvariant()

$processes = Get-CimInstance Win32_Process -Filter "name = 'node.exe'" |
  Where-Object {
    $_.CommandLine -and $_.CommandLine.ToLowerInvariant().Contains($workspacePattern)
  }

if (-not $processes) {
  Write-Output "Tidak ada proses dev PsyScreening yang aktif."
  exit 0
}

$currentPid = $PID
$stopped = @()

foreach ($process in $processes) {
  if ($process.ProcessId -eq $currentPid) {
    continue
  }

  try {
    Stop-Process -Id $process.ProcessId -Force -ErrorAction Stop
    $stopped += $process.ProcessId
  } catch {
    Write-Warning "Gagal menghentikan process ID $($process.ProcessId): $($_.Exception.Message)"
  }
}

if ($stopped.Count -gt 0) {
  Write-Output ("Menghentikan process PsyScreening: " + ($stopped -join ", "))
} else {
  Write-Output "Tidak ada proses yang perlu dihentikan."
}
