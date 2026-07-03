@echo off
title Make Ambered Jack Website Deploy Zip
echo Building a fresh, dated deploy zip of the Ambered Jack website...
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0Build-Deploy-Zip.ps1"
echo.
echo Done. You can close this window.
pause
