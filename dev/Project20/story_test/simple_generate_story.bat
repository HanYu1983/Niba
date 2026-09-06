@echo off
setlocal

rem ============================================================
rem  ComfyUI Simple Story Generator (Docker)
rem  Usage: simple_generate_story.bat <config.json> [scenes]
rem    config : story_config.json / story_config_cyberpunk.json (default)
rem    scenes : specific scenes, e.g. "1" or "1,3,5" or "2-4" (default: all)
rem  Examples:
rem    simple_generate_story.bat story_config.json
rem    simple_generate_story.bat story_config_cyberpunk.json 1
rem    simple_generate_story.bat story_config.json 3
rem ============================================================

set CONFIG=%1
if "%CONFIG%"=="" set CONFIG=story_config_cyberpunk.json

set SCENES=%2

echo.
echo [ComfyUI Simple Story Generator]
echo   Config : %CONFIG%
echo   Scenes : "%SCENES%"
echo.

docker compose run --rm comfy-client node story.js story_t2i.json story_output 1 10 %CONFIG% "%SCENES%"

echo.
echo Done: story_output
endlocal