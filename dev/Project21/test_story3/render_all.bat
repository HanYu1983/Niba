@echo off
setlocal enabledelayedexpansion

for /L %%i in (2, 1, 79) do (
    set "num=00%%i"
    set "seg=seg_!num:~-3!"
    REM prodoct
    node gen_video/render_segment.mjs --plan test_story3/plan.ch0.json --seg !seg! --prompt .\test_story3\prompts\!seg!.t2v.txt --async --no-turbo --seed 100 --width 352 --height 608
    
    REM test
    REM node gen_video/render_segment.mjs --plan test_story3/plan.ch0.json --seg !seg! --prompt .\test_story3\prompts\!seg!.t2v.txt --async
)

endlocal