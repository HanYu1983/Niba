# 常用指令
```
node .\workspace\tools\render_segment.mjs --story .\test_story3\ --seg seg_058 --async --no-turbo --mode r2v --prompt .\test_story3\prompts\seg_058.t2v.txt
 
node .\workspace\tools\render_all.mjs --story .\test_story3\ --async --seed 1000 --mode r2v --width 544 --height 960 --force --from seg_005 --to seg_005

node .\workspace\tools\audit_renders.mjs --story .\test_story3\                                     

node .\workspace\tools\download_renders.mjs --story .\test_story3\

node .\workspace\tools\concat_renders.mjs --story .\test_story3\ --from seg_002 --to seg_008

node .\workspace\tools\generate_refs.mjs --story .\test_story3 --plan plan.ch0.json

node .\workspace\tools\generate_refs.mjs --story .\test_story3\ --plan .\test_story3\plan.ch1.json 

node .\workspace\tools\verify_plan.mjs --story .\test_story3\ --verbose

node .\workspace\tools\check_prompts.mjs --story .\test_story3

node .\workspace\tools\render_segment.mjs --story .\test_story3\ --prompt .\test_story3\prompts\ch1\seg_001.t2v.txt --mode r2v --no-turbo --async --seg seg_001

node workspace/tools/render_all.mjs --story test_story3 --plan test_story3/plan.ch1.json --prompts test_story3/prompts/ch1 --manifest test_story3/render_manifest.ch1.json --async --no-turbo --seed 100 --mode r2v --force --from seg_003 --to seg_010

node .\workspace\tools\audit_renders.mjs --story .\test_story3\ --manifest .\test_story3\render_manifest.ch1.json

node .\workspace\tools\download_renders.mjs --story .\test_story3\ --manifest .\test_story3\render_manifest.ch1.json

node .\workspace\tools\build_subtitles.mjs --story .\test_story3\ --manifest .\test_story3\render_manifest.ch1.json

node .\workspace\tools\concat_renders.mjs --story .\test_story3\ --manifest .\test_story3\render_manifest.ch1.json

node .\workspace\tools\new_story.mjs --name test_story4 --title test4

node .\workspace\tools\extract_penana.mjs --html .\test_story3\story_ch1.html --out story_ch1.txt
```


```
node .\workspace\tools\generate_refs.mjs --story .\test_story4\

node .\workspace\tools\render_all.mjs --story .\test_story4\ --async --seed 100 --mode r2v --from seg_001 --to seg_030

node .\workspace\tools\audit_renders.mjs --story .\test_story4\

node .\workspace\tools\download_renders.mjs --story .\test_story4\

node .\workspace\tools\concat_renders.mjs --story .\test_story4\ --manifest .\test_story4\render_manifest.json --from seg_001 --to seg_030

node .\workspace\tools\build_subtitles.mjs --story .\test_story4\ --manifast .\test_story4\render_manifest.json
```

```
node .\workspace\tools\method2_segment.mjs --json .\test_story4\prompts.ch0_15s.json --from-index  0 --image --out test_story4/output/refs/ch0_15s    

node .\workspace\tools\method2_segment.mjs --json .\test_story4\prompts.ch0_15s.json --from-index 3 --to-index 3 --video --ref-root .\test_story4\output\refs\ch0_15s --out test_story4/output/video/ch0_15s --seconds -3 --ref-spread 1 --width 608 --height 352

node .\workspace\tools\method2_segment.mjs --json .\test_story4\prompts.ch0_15s.json --from-index 0 --to-index 4 --video --mode t2v --out test_story4/output/video/ch0_15s --seconds -3 --no-turbo


node .\workspace\tools\method2_segment.mjs --json .\test_story4\gemini-code-1794495717090.json --from-index 0 --to-index 2 --image --out .\test_story4\output\

node .\workspace\tools\method2_segment.mjs --json .\test_story4\deepseek_json_1.json --video --out .\test_story4\output\ --segment 07 --ref-root .\test_story4\output\

node .\workspace\tools\method2_segment.mjs --json .\test_story4\deepseek_json_1.json --video --out .\test_story4\output\ --ref-root .\test_story4\output\ --mode t2v --from-index 0 --to-index 5 --no-turbo
```


```
node workspace/tools/generate_refs_from_json.mjs --json .\test_story5\story.json --output .\test_story5\output\refs

node workspace/tools/generate_videos_from_json.mjs --json .\test_story5\story.json --output .\test_story5\output\video --mode r2v

node workspace/tools/generate_videos_from_json.mjs --json .\test_story5\story.json --output .\
test_story5\output\video --mode r2v --no-turbo --seed 100 --width 416 --height 736 --force

node workspace/tools/generate_videos_from_json.mjs --json .\test_story5\story.json --output .\test_story5\output\video --mode r2v --no-turbo --seed 100 --width 416 --height 736 --id shot_3_7 --force

node workspace/tools/download_videos_from_json.mjs --jobs .\test_story5\output\video\render_jobs.json --output .\test_story5\output\video --force

node workspace/tools/concat_videos_from_report.mjs .\test_story5\output\video\download_report.json

node workspace/tools/build_subtitles_from_json.mjs .\test_story5\story.json --film .\test_story5\output\video\merged.mp4
```


```
node workspace/tools/generate_refs_from_json.mjs --json .\test_story6\ch1.json --output .\test_story6\output\refs

node workspace/tools/generate_videos_from_json.mjs --json .\test_story6\ch1.json --output .\test_story6\output\video --mode r2v --no-turbo --seed 100 --width 416 --height 736 --force

node workspace/tools/download_videos_from_json.mjs --jobs .\test_story6\output\video\render_jobs.json --output .\test_story6\output\video

node workspace/tools/generate_videos_from_json.mjs --json .\test_story6\ch1.json --output .\test_story6\output\video --mode r2v --no-turbo --seed 101 --width 416 --height 736 --id shot_1_8 --force

node workspace/tools/download_videos_from_json.mjs --jobs .\test_story6\output\video\render_jobs.json --output .\test_story6\output\video --force

node workspace/tools/concat_videos_from_report.mjs .\test_story6\output\video\download_report.json

node workspace/tools/build_subtitles_from_json.mjs .\test_story6\ch1.json --film .\test_story6\output\video\merged.mp4

node workspace/tools/generate_refs_from_json.mjs --json .\test_story6\ch2.json --output .\test_story6\output_ch2\refs

node workspace/tools/generate_videos_from_json.mjs --json .\test_story6\ch2.json --output .\test_story6\output_ch2\video --mode r2v --no-turbo --seed 100 --width 416 --height 736

node workspace/tools/download_videos_from_json.mjs --jobs .\test_story6\output_ch2\video\render_jobs.json --output .\test_story6\output_ch2\video

node workspace/tools/concat_videos_from_report.mjs .\test_story6\output_ch2\video\download_report.jso

node workspace/tools/build_subtitles_from_json.mjs .\test_story6\ch2.json --film .\test_story6\output_ch2\video\merged.mp4
```

```
node workspace/tools/generate_refs_from_json.mjs --json .\test_story7\ch1.json --output .\test_story7\output\ch1\refs

node workspace/tools/generate_videos_from_json.mjs --json .\test_story7\ch1.json --output .\test_story7\output\ch1\video --mode r2v --no-turbo --seed 100 --width 416 --height 736

node workspace/tools/download_videos_from_json.mjs --jobs .\test_story7\output\ch1\video\render_jobs.json --output .\test_story7\output\ch1\video

node workspace/tools/concat_videos_from_report.mjs .\test_story7\output\ch1\video\download_report.json

node workspace/tools/build_subtitles_from_json.mjs .\test_story7\ch1.json --film .\test_story7\output\ch1\video\merged.mp4
```