@echo off
setlocal
set "path=%~1"
set "size=%~2"

if not exist "%path%" (
    echo File not found: %path%
    exit /b
)

for /f "tokens=*" %%a in ('magick identify -format "%%w" "%path%"') do set "width=%%a"
for /f "tokens=*" %%a in ('magick identify -format "%%h" "%path%"') do set "height=%%a"

if %width% lss %size% if %height% lss %size% (
    echo Image is already smaller than the specified size.
    exit /b
)

magick convert "%path%" -resize %size%x%size% "%path%"
