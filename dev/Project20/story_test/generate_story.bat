@echo off
setlocal

rem ============================================================
rem  ComfyUI Story Image Generator (Docker)
rem  Usage: generate_story.bat <config.json> [workflow.json] [output_dir] [start_scene] [end_scene] [scenes] [sizes]
rem    config       : story_config.json / story_config_cyberpunk.json (default)
rem    workflow     : story_t2i.json (default)
rem    output_dir   : story_output (default)
rem    start_scene  : first scene number (default 1)
rem    end_scene    : last scene number (default 10)
rem    scenes       : specific scenes, e.g. "1,3,5" or "2-4" (overrides start/end)
rem    sizes        : json size array, e.g. "[[1024,1024],[832,1216]]" (overrides story.json sizes)
rem  Examples:
rem    generate_story.bat story_config_cyberpunk.json
rem    generate_story.bat story_config.json story_t2i.json story_output 3 6
rem    generate_story.bat story_config_cyberpunk.json story_t2i.json story_cyber 1 10 "1,3" "[[832,1216],[1216,832]]"
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

set SCENES=%6
set SIZES=%7

echo.
echo [ComfyUI Story Generator]
echo   Config   : %CONFIG%
echo   Workflow : %WORKFLOW%
echo   Output   : %OUTDIR%
echo   Scenes   : %START% - %END%  (specific: "%SCENES%")
echo   Sizes    : "%SIZES%"
echo.

docker compose run --rm comfy-client node story.js %WORKFLOW% %OUTDIR% %START% %END% %CONFIG% "%SCENES%" "%SIZES%"

echo.
echo Done: %OUTDIR%
endlocal