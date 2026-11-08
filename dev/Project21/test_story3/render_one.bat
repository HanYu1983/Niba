@echo off
setlocal
cd /d "%~dp0.."

if "%~1"=="" (
  echo usage: render_one.bat ^<seg_id^>
  echo   e.g. render_one.bat seg_009
  exit /b 2
)

node workspace\tools\render_segment.mjs --story test_story3 --seg %~1 --async --no-turbo --seed 100

endlocal
