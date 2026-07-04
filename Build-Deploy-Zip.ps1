# ============================================================
#  Build-Deploy-Zip.ps1
#  Makes a dated BACKUP zip of the "site" folder (rollback snapshot in website-deploys/).
#  NOT the deploy path — deploy is automatic via git push to main (Cloudflare Pages).
#  Don't run this directly - just double-click "MAKE WEBSITE ZIP.cmd"
#  (it handles Windows permissions for you).
# ============================================================
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$root   = $PSScriptRoot
$src    = Join-Path $root 'site'
$outDir = Join-Path $root 'website-deploys'

if (-not (Test-Path $src)) {
  Write-Host "ERROR: can't find the 'site' folder next to this script." -ForegroundColor Red
  return
}
if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }

# date-stamped filename, e.g. AmberedJack-website_2026-06-16_2330.zip  (sorts oldest -> newest)
$stamp = Get-Date -Format 'yyyy-MM-dd_HHmm'
$dest  = Join-Path $outDir ("AmberedJack-website_" + $stamp + ".zip")

# files that live in the site folder but should NOT be published
# NOTE: ambered-jack-menu.pdf is the OLD menu with outdated pricing. The "Download
# Menu (PDF)" button was removed (2026-06-26); the file is kept in assets/ for
# reference but excluded from the deploy so its stale prices can't be reached by
# direct URL / indexed by Google. Re-link + remove this exclusion once a corrected
# PDF replaces it.
$excludeNames = @('README-DEPLOY.md','serve.ps1','CLAUDE-CODE-BRIEF.md','preview.html',
                  'TESTING.md','package.json','package-lock.json','playwright.config.js','.gitignore',
                  'ambered-jack-menu.pdf')
# dev/test directories that must never ship to production
$excludeDirs  = @('node_modules','tests','tools','playwright-report','test-results','.playwright','.git','.impeccable')

$bs = [char]92   # backslash
$fs = [char]47   # forward slash  (zip paths MUST use this or Netlify breaks)
$files = Get-ChildItem -Path $src -Recurse -File | Where-Object {
  $rel   = $_.FullName.Substring($src.Length + 1)
  $parts = $rel -split '[\\/]'
  ($excludeNames -notcontains $_.Name) -and -not ($parts | Where-Object { $excludeDirs -contains $_ })
}

$zip = [System.IO.Compression.ZipFile]::Open($dest,'Create')
try {
  foreach ($f in $files) {
    $rel = $f.FullName.Substring($src.Length + 1).Replace($bs,$fs)
    [void][System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $f.FullName, $rel)
  }
} finally { $zip.Dispose() }

# safety check: index.html must sit at the TOP of the zip
$z = [System.IO.Compression.ZipFile]::OpenRead($dest)
$hasIndex = ($z.Entries | Where-Object { $_.FullName -eq 'index.html' }).Count
$count = $z.Entries.Count
$z.Dispose()

Write-Host ""
if ($hasIndex -eq 1) {
  Write-Host "SUCCESS - deploy zip created:" -ForegroundColor Green
  Write-Host "   $dest"
  Write-Host "   ($count files, index.html at root - good to deploy)"
  Write-Host ""
  Write-Host "This is a BACKUP snapshot only. Deploy is automatic via git push to main (Cloudflare Pages)."
  Start-Process explorer.exe "/select,`"$dest`""   # opens the folder with the new zip highlighted
} else {
  Write-Host "WARNING: index.html is not at the zip root - DO NOT deploy this one." -ForegroundColor Red
  Write-Host "Tell Dave/Claude something is off with the Website Mockup folder." -ForegroundColor Red
}
