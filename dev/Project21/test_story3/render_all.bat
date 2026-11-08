@echo off
setlocal
cd /d "%~dp0.."

REM Sequential submit for the whole plan. Segments already in render_manifest.json
REM are skipped unless you add --force. Collection: audit_renders + download_renders.
node workspace\tools\render_all.mjs --story test_story3 --from seg_002 --async --no-turbo --seed 100

endlocal
