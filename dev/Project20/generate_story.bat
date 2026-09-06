@echo off
setlocal

rem ============================================================
rem  ComfyUI Story Image Generator (Docker)
rem  Usage: generate_story.bat <config.json> [workflow.json] [output_dir] [start_scene] [end_scene]
rem  Example:
rem    generate_story.bat story_config_cyberpunk.json
rem    generate_story.bat story_config.json story_t2i.json story_output 3 6
rem ============================================================

set CONFIG=%1
if "%CONFIG%"=="" set CONFIG=story_config_cyberpunk.json

set WORKFLOW=%2
if "%WORKFLOW%"=="" set WORKFLOW=story_t2i.json

set OUTDIR=%3
if "%OUTDIR%"=="" set OUTDIR=story_output

set START=%4
if "%START%"=="" set START=1

set END=%5
if "%END%"=="" set END=10

echo.
echo [ComfyUI Story Generator]
echo   Config   : %CONFIG%
echo   Workflow : %WORKFLOW%
echo   Output   : %OUTDIR%
echo   Scenes   : %START% - %END%
echo.

docker compose run --rm comfy-client node story.js %WORKFLOW% %OUTDIR% %START% %END% %CONFIG%

echo.
echo Done: %OUTDIR%
endlocal