@echo off
setlocal enabledelayedexpansion

for /L %%i in (1, 1, 79) do (
    set "num=00%%i"
    set "seg=seg_!num:~-3!"
    REM prodoct
    node gen_video/render_segment.mjs --plan test_story3/plan.ch0.json --seg !seg! --prompt .\test_story3\prompts\!seg!.t2v.txt --async --no-turbo --width 608 --height 1056
    
    REM test
    REM node gen_video/render_segment.mjs --plan test_story3/plan.ch0.json --seg !seg! --prompt .\test_story3\prompts\!seg!.t2v.txt --async
)

endlocal