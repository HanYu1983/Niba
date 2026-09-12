### 5.5 實作範例：Beat 1.1（Z-Image 雙參考圖 + r2v）

以 Ch1 Beat 1.1（開場：林墨在邊境鐵絲網旁，從灰燼中拾起千萬面額鈔票｜中景，風沙，鐵絲網｜無台詞）為例，示範現行標準流水線：**Z-Image（`gen_zit_image`）出兩張參考圖（角色＋場景） → `gen_r2v_video` 六欄位提示詞**。

**Step 1 — Z-Image 參考圖 ×2（`gen_zit_image`，832×1248 直式 2:3）：**

角色圖（`out=ch1_beat11_ref_char`）：
```
prompt: editorial portrait photograph of a middle-aged East Asian man, late 40s, thin lean serious face with
sharp jaw, short neatly combed black hair with faint grey strands, light stubble, deep-set tired eyes, wearing
a dusty dark charcoal suit with a rumpled white shirt and no tie, holding up a folded brightly-colored oversized
banknote with one hand, wary intense expression looking slightly off-camera, cold blue-grey cinematic color
grading, realistic skin texture, 85mm portrait lens, shallow depth of field, dark plain industrial background
```

場景圖（`out=ch1_beat11_ref_scene`）：
```
prompt: cinematic film still, desolate desert border wasteland of the Aurora Federation, vast open sky, rusty
barbed wire fence stretching to the horizon, strong muted daylight, wind blowing dust and sand, scattered burned
papers and ash piles on the ground, cold blue-grey color grading, photorealistic cinematic photography, 24mm wide
angle, wide negative space, gritty documentary look, no people
```

產出：`ch1_beat11_ref_char/zimage_00011_.png`、`ch1_beat11_ref_scene/zimage_00012_.png`

**Step 2 — r2v 影片提示詞（`gen_r2v_video`，官方 Ref2VA 六欄位）：**

```
subject_definitions:
<Subject 1> is the border economist Lin Mo in <Picture 1>, a thin lean middle-aged East Asian man in his late 40s
with short neatly combed black hair with faint grey strands, light stubble, deep-set tired eyes, wearing a dusty
dark charcoal suit with a rumpled white shirt without tie, holding up a folded brightly-colored oversized banknote.
<Subject 2> is the border wasteland in <Picture 2>, a desolate dusty expanse beside a rusty barbed-wire fence
stretching to the horizon, wind-blown sand and dust, scattered ash piles and burned paper scraps on the ground,
wide open grey sky, cold blue-grey grading.

summary:
[reference generation] The target video is the opening beat at the barbed-wire border: Lin Mo crouches by the
fence line in the windy wasteland, spots a vivid banknote of enormous denomination half-buried in the ash, picks
it up and turns it between his dusty fingers, examining its glaring printed digits. Character and setting are
preserved from <Picture 1> and <Picture 2>.

retention_analysis:
<Subject 1> (appears in [Shot 1], [Shot 3], [Shot 4]): fully_preserved - his gaunt lean face, neat black hair
with grey strands, dark charcoal suit with rumpled white shirt, dusty weary presence, and the vivid banknote he
handles.
<Subject 2> (appears in [Shot 1], [Shot 3], [Shot 4]): fully_preserved - the desolate wasteland, dusty ground,
ash piles, burned paper scraps, rusty barbed-wire fence against the wide grey sky, and the cold blue-grey tones.

detailed_description:
The target video uses a cold gritty documentary style with cold blue-grey color grading and stark natural
daylight, medium framing among the wind, sand and barbed wire.
[Shot 1] The scene opens at 00:00.000 with a medium shot of Lin Mo in his dusty dark suit crouched beside the
barbed-wire fence in the windy wasteland; sand streams across the ground and his jacket, gusts flattening the dry
grass, as his squinting eyes catch something vivid glinting in the ash pile by his feet. Camera: static medium
shot with a subtle handheld sway. No dialogue.
[Shot 2] At 00:04.500, a close-up cut on Lin Mo's dusty fingers sifting through the grey ash and retrieving a
brightly-colored oversized banknote, its rainbow ink stark and almost crude against the burnt paper fragments
around it; grains of sand fall from the bill as it lifts. Camera: close-up, shallow depth of field. No dialogue.
[Shot 3] At 00:08.000, Lin Mo straightens up slightly and turns the banknote between two fingers, squinting at
the printed digits of an enormous denomination while the bill's edge flutters in the wind; behind him the
barbed-wire fence stretches toward the horizon under the huge grey sky, ashes drifting past. Camera: medium
shot, slightly low, the character on the rule of thirds. No dialogue.
[Shot 4] At 00:12.500, a slow push toward the banknote held against the desolate backdrop, sand and ash gusting
across the frame, the fence lines receding into muted light, then a gentle fade. Camera: slow push-in, fade out.
No dialogue.

overall_soundscape:
Dry wind howling continuously across the empty wasteland, sand grains scratching over cracked earth, the metallic
rattle of loose barbed wire tapping the fence posts, faint distant crows, and the crisp rustle of paper as Lin Mo
turns the banknote between his fingers.

non_diegetic_music:
A sparse somber low-string drone with a single mournful woodwind note, cold and restrained, slowly swelling as
the banknote comes into focus and thinning again into the final fade.
```

參數：`ref_image_0=ch1_beat11_ref_char/zimage_00011_.png, ref_image_1=ch1_beat11_ref_scene/zimage_00012_.png, duration=15, seed=110101, out=ch1_beat11_video`

**範例要點：**
- **角色＋場景雙參考圖**是標準配置：`ref_image_0` 鎖人物、`ref_image_1` 鎖環境，`<Subject 1>`/`<Subject 2>` 各對應 `<Picture 1>`/`<Picture 2>`。
- Z-Image 出圖直接 2:3（832×1248），符合指南 6.1 解析度規範，r2v `ref_image_size: match` 縮放時不切構圖重點。
- 無對白＝六欄位中**完全不寫 `<d>`**，`overall_soundscape` 只給環境/動作聲，`non_diegetic_music` 給配樂輪廓。
- 時間戳嚴格遞增且 ≤ duration：`00:00.000 / 04.500 / 08.000 / 12.500`。

---

### 5.6 實作範例：Beat 1.2（Z-Image 雙場景參考圖 + r2v）

以 Ch1 Beat 1.2（象徵：難民用整疊鈔票換半瓶水，走私販拿廢紙墊火爐｜中遠景，烈日｜無台詞，無主角）為例。此例**無固定主角**，參考圖全部是場景/人物關係，仍用六欄位。

**Step 1 — Z-Image 參考圖 ×2（`gen_zit_image`，832×1248）：**

中遠景（`out=ch1_beat12_ref_zit`）：
```
prompt: cinematic film still, desolate sun-blasted border checkpoint wasteland in harsh noon sunlight, no
shadows, dusty ground scattered with colorful banknotes and gray ash, a group of thin desperate refugees crouch
in the shadow of rusted metal structures clutching thick stacks of brightly colored oversized banknotes, in the
foreground a weathered smuggler in a dusty vest shrugs and turns away ignoring the offered cash while a small
rusty fire stove crackles beside him being fed with sheets of the same rainbow paper banknotes, medium-wide shot,
documentary photojournalism style, cold harsh daylight, gritty realistic tones
```

兌換特寫（`out=ch1_beat12_ref_zit`）：
```
prompt: close-up cinematic still, a pair of grimy trembling hands extending a thick stack of brightly colored
oversized banknotes toward a weathered smuggler who holds up a half bottle of drinking water, the exchange frozen
mid-gesture, beside them a rusty small stove burning sheets of the same rainbow paper banknotes with orange
flames and rising embers, harsh noon sunlight, dust motes in the air, gritty documentary photojournalism, cold
harsh daylight
```

產出：`ch1_beat12_ref_zit/zimage_00013_.png`、`zimage_00014_.png`

**Step 2 — r2v 影片提示詞（`gen_r2v_video`，六欄位）：**

```
subject_definitions:
<Subject 1> is the group of desperate border refugees in <Picture 1>, thin ragged people crouching in the
shadow of rusted metal structures, hollow exhausted faces, clutching thick stacks of brightly colored oversized
banknotes.
<Subject 2> is the weathered smuggler and his fire stove in <Picture 1> and <Picture 2>, a dust-covered man in
a faded vest beside a small rusty stove fed with burning sheets of the same rainbow paper banknotes, holding up
a half bottle of drinking water.

summary:
[reference generation] The target video is a symbolic scene at the sun-blasted border checkpoint: a family of
refugees offers a whole stack of brightly colored banknotes for a half bottle of water, and the smuggler rejects
the cash, feeding the colorful bills into the crackling fire stove while everyone watches the money burn. Scene
and figures preserved from <Picture 1> and <Picture 2>.

retention_analysis:
<Subject 1> (appears in [Shot 1], [Shot 2], [Shot 3]): fully_preserved - the thin ragged refugees, hollow faces,
crouching poses, and the thick stacks of vivid oversized banknotes they clutch.
<Subject 2> (appears in [Shot 1], [Shot 2], [Shot 3]): fully_preserved - the weathered smuggler in the faded
vest, the half bottle of water in his hand, the small rusty stove, and the burning sheets of rainbow paper
banknotes.

detailed_description:
The target video uses a harsh documentary photojournalism style with cold midday sunlight, no shadows,
heat-haze distortion, and gritty realistic tones; medium-wide framing holds the whole exchange in frame.
[Shot 1] The scene opens at 00:00.000 with a medium-wide shot of the sun-blasted checkpoint: thin refugees crouch
in the shadow of rusted structures with stacks of colorful banknotes, while beside them the smuggler crouches at
the small rusty stove whose fire is fed with bright paper bills; heat-haze shimmers over the dusty ground.
Camera: static medium-wide shot. No dialogue.
[Shot 2] At 00:05.000, the camera moves closer as grimy trembling hands extend a whole thick stack of vividly
colored banknotes toward the smuggler; he glances at the cash with contempt, turns away with the half bottle of
water still in his hand, then tosses the offered stack into the stove; orange flames lick up and the rainbow ink
peels and chars as embers rise. Camera: slow push-in from medium to close, gritty handheld feel. No dialogue.
[Shot 3] At 00:10.500, a wide shot: the refugee family watches the burning money, their hollow faces lit by the
fire, while the half bottle of water remains in the smuggler's hand and ashes and blackened paper scraps drift
in the heat-glazed air. Camera: slow pull-out to wide, ending with a gentle fade into the white-hot sky.
No dialogue.

overall_soundscape:
Scorching dry wind over the empty wasteland, the crackle and hiss of the fire stove, the stiff crinkle of paper
banknotes as the stack is handled and burns, grit and ash drifting, a faint distant ticking of hot rusted metal,
no human voices.

non_diegetic_music:
A sparse, desolate low drone with a single repeated wooden clank, dry and hollow, barely rising and fading away
with the final wide shot, restrained and bleak.
```

參數：`ref_image_0=ch1_beat12_ref_zit/zimage_00013_.png, ref_image_1=ch1_beat12_ref_zit/zimage_00014_.png, duration=15, seed=120202, out=ch1_beat12_video`

**範例要點：**
- **沒有主角的節拍**用「場景＋人物關係」當 Subject，`retention_analysis` 仍逐 Subject 承諾 `fully_preserved`。
- 兩張參考圖可以分角色職責：`<Picture 1>` 提供整體空間、`<Picture 2>` 提供關鍵動作特寫，`<Subject 2>` 同時引用兩張圖。
- 舊版 Beat 1.2 曾因 A/B/C/D 結構、無音訊欄而**腦補旁白**；六欄位 + `overall_soundscape` 結尾明寫 `no human voices` 即可根絕。
- 對白/旁白一律不放：`detailed_description` 內無任何 `<d>`，說話聲不得出現。

---

### 5.7 實作範例：Beat 1.3（Z-Image 角色＋場景雙參考圖 + r2v）

以 Ch1 Beat 1.3（對照：電子廣告牆文宣「警惕！數據是毒藥」；林墨對比口袋廢紙，感到寒顫｜特寫→遠景、壁畫式構圖｜無台詞）為例。**畫面可見中文**（廣告牆標語）可以是 Subject 特徵，但對白依然不寫 `<d>`。

**Step 1 — Z-Image 參考圖 ×2（`gen_zit_image`，832×1248）：**

角色圖（林墨，`out=ch1_beat13_ref_char`）：
```
prompt: editorial portrait photograph of a middle-aged East Asian man, late 40s, thin lean serious face with
sharp jaw, short neatly combed black hair with faint grey strands, light stubble, deep-set tired eyes, wearing a
dark charcoal suit with a rumpled white shirt and no tie, holding a folded brightly-colored oversized banknote
pressed tightly against his chest with both hands, wary tense expression looking slightly off-camera, cold
blue-grey cinematic color grading, realistic skin texture, 85mm portrait lens, shallow depth of field, plain
dark industrial warehouse background
```

場景圖（`out=ch1_beat13_ref_scene`）：
```
prompt: cinematic film still, desolate border wasteland of the Aurora Federation at dusk, a towering giant
electronic advertising wall with a huge LED screen glowing starkly, the screen surface displaying huge hot-red
Chinese propaganda characters BaoJing ShuJu Shi DuYao and warning the public, colossal luminous billboard looming
over a dusty empty road with scattered ashes and burned colorful paper scraps, cold blue-grey color grading, wind
blowing dust and sand, dramatic monumental low-angle composition, photorealistic cinematic photography, gritty
documentary look
```

產出：`ch1_beat13_ref_char/zimage_00008_.png`、`ch1_beat13_ref_scene/zimage_00009_.png`

**Step 2 — r2v 影片提示詞（`gen_r2v_video`，六欄位，特寫→遠景）：**

```
subject_definitions:
<Subject 1> is the border economist Lin Mo in <Picture 1>, a thin lean middle-aged East Asian man in his late
40s with short neatly combed black hair with faint grey strands, light stubble, deep-set tired eyes, wearing a
dark charcoal suit and a rumpled white shirt without tie, habitually holding a folded oversized colorful banknote.
<Subject 2> is the towering electronic advertising wall in <Picture 2>, a colossal LED screen glowing with stark
hot-red Chinese propaganda characters on a desolate border wasteland at dusk, dusty road, scattered ashes and
burned colorful paper scraps, cold blue-grey grading.

summary:
[reference generation] The target video is a dramatic contrast sequence at the border: close-up of the giant red
slogan wall, close-up of Lin Mo flinching as he pulls out the folded colorful banknote from his pocket and
compares it with the warning above, ending on a wide mural-like shot of his small silhouette under the vast
luminous wall. Composition, character and scene are preserved from <Picture 1> and <Picture 2>.

retention_analysis:
<Subject 1> (appears in [Shot 2], [Shot 3]): fully_preserved - his gaunt serious face, neat black hair with grey
strands, dark charcoal suit with rumpled white shirt, and the folded vivid banknote he carries.
<Subject 2> (appears in [Shot 1], [Shot 3]): fully_preserved - the colossal electronic wall with stark glowing
red Chinese characters, the desolate wasteland and the cold blue-grey tones around it.

detailed_description:
The target video uses a cold documentary style with monumental, mural-like composition and cold blue-grey color
grading throughout.
[Shot 1] The scene opens at 00:00.000 with a close-up push toward the colossal electronic advertising wall; the
huge screen flickers as the red Chinese characters glow, dust drifting across the beam of light with wind-bent
power lines in the foreground. Camera: slow push-in with slight low angle. No dialogue.
[Shot 2] At 00:04.000, cut to a close-up of Lin Mo's wary profile; the billboard light ripples across his thin
tired face. His trembling fingers slowly pull the folded oversized colorful banknote from his suit pocket and
hold it beside his cheek, comparing its vivid rainbow colors against the red slogan towering above; he shivers
almost imperceptibly and swallows. Camera: static close-up, shallow depth of field, the red characters faintly
reflected in his eyes. No dialogue.
[Shot 3] At 00:08.500, the camera pulls far back into a mural-like wide shot: Lin Mo is a small dark silhouette
in his suit standing on the dusty road facing the enormous wall of light, clutching the single bright banknote
whose vivid colors echo the red screen; behind him the wasteland stretches into darkness, ashes and paper scraps
drifting on the wind. Camera: slow pull-out to monumental wide composition, low angle. No dialogue.
[Shot 4] At 00:13.000, slow tilt up along the glowing characters as the last flicker fades into cold grey dusk,
the screen dimming until nearly dark before a gentle fade. No dialogue.

overall_soundscape:
Cold wind howling across the empty wasteland, sand scratching the cracked ground, the low electrical hum and
faint intermittent crackle of the giant billboard screen, a distant metal pylon creaking, a few faint crows in
the far distance.

non_diegetic_music:
A barely-there ominous low drone with sparse cold isolated piano notes, swelling very slowly then thinning to
near silence in the final wide shot, restrained and unsettled.
```

參數：`ref_image_0=ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=ch1_beat13_ref_scene/zimage_00009_.png, duration=15, seed=130302, out=ch1_beat13_video`

**範例要點：**
- **壁畫式構圖靠「鏡頭運動」寫死**：Shot 3 明寫 `pulls far back into a mural-like wide shot`＋`monumental`，把節拍表的「特寫→遠景」方向用運鏡落實。
- **畫面可見文字**（廣告牆標語）在 `subject_definitions`/`detailed_description` 描述為「紅字」即可，無需 `<d>`；`<d>` 只留給「角色說出口的話」。
- 對比要素（鈔票 vs 標語）在 summary 就點出 `contrast sequence`，讓整體敘事意圖先行。
- Google 出圖時畫面上的中文不一定要精準，影片 prompt 描述「hot-red Chinese propaganda characters」即可，字面精度由 r2v 自由呈現。

---

### 5.8 實作範例：Beat 1.4（重複使用角色參考圖 + r2v 含對白）

以 Ch1 Beat 1.4（收束：轎車內閉眼「回研究室，我要把草案序言重新寫一遍」；車窗掠過政治標語｜車內中景、窗外流動｜**有台詞**）為例。示範**角色參考圖跨段重用**（指南 5.2 方案 C）＋六欄位內 `<d>` 對白寫法。

**Step 1 — Z-Image 場景參考圖 ×1（`gen_zit_image`，832×1248；角色圖沿用 5.7 的 `zimage_00008_.png`）：**

車內景（`out=ch1_beat14_ref_scene`）：
```
prompt: interior of a dark plain sedan car, rear cabin view from the side of a back-seat passenger, worn dark
fabric seats with a rumpled seat belt, grey door panel, through the side window pass blurred red political
propaganda billboards with glowing slogans along the roadside, overcast cold dusk light, cold blue-grey cinematic
color grading, photorealistic film still, shallow depth of field, no people visible
```

產出：`ch1_beat14_ref_scene/zimage_00010_.png`（重複引用：`ch1_beat13_ref_char/zimage_00008_.png`）

**Step 2 — r2v 影片提示詞（`gen_r2v_video`，六欄位 + `<d>` 對白）：**

```
subject_definitions:
<Subject 1> is the border economist Lin Mo in <Picture 1>, a thin lean middle-aged East Asian man in his late
40s with short neatly combed black hair with faint grey strands, light stubble, deep-set tired eyes, wearing a
dark charcoal suit and rumpled white shirt without tie.
<Subject 2> is the sedan rear cabin in <Picture 2>, a dark plain sedan interior with worn fabric seats and grey
door panel, seen from beside a back-seat passenger, with cold dusk light through the window where blurred red
political propaganda billboards glide past.

summary:
[reference generation] The target video is a quiet closing beat inside a moving sedan on the border road: Lin Mo
settles into the back seat with his eyes closed after a draining day, the dark car interior rocking gently as
political propaganda billboards stream past the window, and he softly voices his plan in a tired murmur. Character
and car are preserved from <Picture 1> and <Picture 2>.

retention_analysis:
<Subject 1> (appears in [Shot 1], [Shot 2], [Shot 3]): fully_preserved - his thin gaunt face, neat black hair
with grey strands, dark charcoal suit and rumpled white shirt, and the weary restrained manner.
<Subject 2> (appears in [Shot 1], [Shot 2], [Shot 3]): fully_preserved - the dark sedan rear cabin, worn fabric
seats, grey door panel, and the cold dusk window with passing red slogan billboards.

detailed_description:
The target video uses a quiet, intimate documentary style with cold blue-grey color grading and a lingering
medium framing inside the moving sedan, the only color accents being the red slogans gliding past outside.
[Shot 1] The scene opens at 00:00.000 with a medium interior shot of Lin Mo in the dark charcoal suit seated in
the back of the sedan; the car rocks gently over the cracked border road while a continuous stream of red
political propaganda billboards slides past the window, their reflections gliding across the glass. Camera:
static medium shot with a subtle handheld sway matching the car. No dialogue.
[Shot 2] At 00:04.000, Lin Mo slowly closes his eyes and lets out a long quiet breath, his tired face relaxing
as the red slogan lights flicker past and drift across his features; he murmurs softly with his eyes still
closed, <Subject 1> (S1) says, <d>[中文] 一份如何讓政府閉嘴、讓數據說話的法案。</d>. Camera: slow push-in to a
medium-close frame.
[Shot 3] At 00:08.500, the frame widens; Lin Mo sits motionless with eyes closed in the dim cabin, the billboards
still streaming past outside, the last border signage receding into the dusk. Camera: static medium shot with the
passing signs creating quiet motion in the window.
[Shot 4] At 00:12.500, a slow tilt toward the window as the red slogans keep flowing past, the steady car hum
continuing, and the image slowly fades toward darkness. Camera: slow tilt up with gentle fade out.

overall_soundscape:
The steady low hum of the sedan engine, faint gravel crunch of tires on the cracked road, wind rushing past the
side window, muffled whooshes as each billboard passes, a soft rustle of fabric as Lin Mo shifts in his seat.

non_diegetic_music:
A slow contemplative low piano line over a deep ambient pad, warm-tinged but still restrained and cold-edged,
gradually thinning until near silence in the final fade.
```

參數：`ref_image_0=ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_1=ch1_beat14_ref_scene/zimage_00010_.png, duration=15, seed=140401, out=ch1_beat14_video`

**範例要點：**
- **對白格式**：在對應鏡頭段寫 `<Subject 1> (S1) says, <d>[中文] 台詞。</d>`，對白保留中文原文、逐字不發明（節拍表只列金句，其他內容以小說原文為準）。
- **角色參考圖跨段重用**：5.7 的林墨肖像圖在此直接當 `ref_image_0`，不必重出——這是方案 C 節省成本的核心。
- **「車窗流動標語」不另出圖**：由場景圖（窗外帶標語）+ `detailed_description`（「a stream of red political propaganda billboards slides past」）共同驅動即可。
- 默默無語的鏡頭（Shot 1/3/4）仍標 `No dialogue`，只有含 `<d>` 的 Shot 2 出聲。
- `overall_soundscape` 不含人聲、`non_diegetic_music` 只給配樂，避免模型另創旁白。