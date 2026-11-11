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

```