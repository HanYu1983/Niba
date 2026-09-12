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

---

### 5.9 實作範例：Beat 2.1（法庭場景＋艾倫首次登場，雙參考圖 + r2v）

以 Ch2 Beat 2.1（開場：最高法院第三審判庭，19 歲艾倫站上被告席發抖｜低角度，圓頂壓迫｜無台詞）為例。Ch2 新增三名角色/場景參考圖（艾倫、檢察官、庭审走廊）可與 Ch1 共用林墨肖像。

**Step 1 — Z-Image 參考圖 ×2（`gen_zit_image`，832×1248）：**

艾倫肖像（`out=ch2_allen_ref`）：
```
prompt: editorial portrait photograph of a 19-year-old East Asian male student standing in a courtroom, very
young pale nervous face with short black hair, wearing a plain grey hooded sweatshirt and rumpled dark jeans,
trembling slightly, hollow anxious wide eyes looking slightly off-camera, hands fidgeting at his sides, harsh
cold courtroom practical lighting from above, cold blue-grey cinematic color grading, realistic skin texture,
85mm portrait lens, shallow depth of field, blurred wooden dock and marble background
```

法庭場景（`out=ch2_court_ref`）：
```
prompt: cinematic film still, interior of the Supreme Court third courtroom of the Aurora Federation, a vast
oppressive hall with a towering domed ceiling casting deep shadows, rows of curved wooden benches split into two
grandstands, on the left red-clad government supporters holding warning banners, on the right a silent crowd of
young spectators, a high judge's bench at the far end backed by a towering constitutional stone wall, cold marble
columns, dim institutional light pooling in shafts of light, wide-angle interior, cold blue-grey color grading,
photorealistic cinematic film still, gritty documentary look
```

**Step 2 — r2v 影片提示詞（`gen_r2v_video`，六欄位，無台詞）：**

```
subject_definitions:
<Subject 1> is Allen in <Picture 1>, a 19-year-old East Asian male student standing at the defendant's rail,
very young pale nervous face, short black hair, plain grey hooded sweatshirt and rumpled dark jeans, hollow
anxious wide eyes, trembling.
<Subject 2> is the third courtroom of the Supreme Court of the Aurora Federation in <Picture 2>, a vast
oppressive hall under a towering domed ceiling with deep shadows, curved rows of benches split into two
grandstands, the red-clad government supporters and the silent young crowd, high judge's bench backed by a
towering constitutional stone wall, cold marble columns, cold blue-grey institutional light.

summary:
[reference generation] The target video is the opening beat of the trial: a very young defendant stands trembling
alone at the rail of a cavernous, oppressive courtroom while two dressed crowds watch him and massive shadows
hang from the dome. Character and hall are preserved from <Picture 1> and <Picture 2>.

retention_analysis:
<Subject 1> (appears in [Shot 1], [Shot 2], [Shot 3], [Shot 4]): fully_preserved - his young pale nervous face,
short black hair, grey hooded sweatshirt, rumpled jeans, and trembling vulnerable stance.
<Subject 2> (appears in [Shot 1], [Shot 3], [Shot 4]): fully_preserved - the towering domed ceiling, the split
grandstands, the red-clad supporters on the left, the silent young spectators on the right, the high judge's
bench, and the stone constitutional wall.

detailed_description:
The target video uses an oppressive institutional documentary style with cold blue-grey color grading, harsh
overhead shafts of light and overwhelming vertical architecture, low angles exaggerating the boy's smallness.
[Shot 1] The scene opens at 00:00.000 with a very low wide-angle shot looking down the vast courtroom: the small
figure of the defendant Allen stands alone at the far rail beside the high wooden dock, his plain grey sweatshirt
a pale speck against dark marble, while the split crowds of red-clad supporters and muted young spectators fill
the grandstands and the dome's deep shadows weigh overhead. Camera: static low-angle wide shot. No dialogue.
[Shot 2] At 00:04.000, a close-up on Allen's trembling pale hands gripping the edge of the dark wooden dock,
knuckles white, a faint tremor running down his arm; the courtroom murmurs distantly around him. Camera: static
close-up, very shallow depth of field, cold light from directly above. No dialogue.
[Shot 3] At 00:08.000, a medium shot from behind Allen as he lifts his chin and swallows, his anxious eyes
flicking across the red-clad supporters on the left and the silent young faces on the right, then up to the
towering constitutional stone wall behind the empty judge's bench; the room is cavernous and still around him.
Camera: slow push-in from medium to medium-close, subtle handheld sway. No dialogue.
[Shot 4] At 00:12.500, the camera pulls up and back to an extreme low angle beneath the dome: Allen in the grey
sweatshirt is a fragile lone mark in the center of the vast hall, the architecture closing over him, and the
image slowly fades. Camera: slow tilt-up pull-out, fade to darkness. No dialogue.

overall_soundscape:
Deep cavernous hush of the vast courtroom, hollow footsteps and scuffing on marble, faint rustling of clothing on
the benches, the small quick breaths of the young defendant, a distant gavel echo somewhere behind, no human
voice.

non_diegetic_music:
A slow, oppressive low-room-tone drone with a single sustained low string note, cold and patient, swelling very
slightly as the camera looks up at the dome and thinning into the fade.
```

參數：`ref_image_0=ch2_allen_ref/zimage_*.png, ref_image_1=ch2_court_ref/zimage_*.png, duration=15, seed=210101, out=ch2_beat21_video`（Z-Image 檔名以實際輸出為準）

**範例要點：**
- **首度登場的新角色**（艾倫）仍走肖像圖方案：`ref_image_0` 鎖臉與衣著，`ref_image_1` 鎖法庭空間。
- 情感用鏡頭語言呈現：低角度＋圓頂壓迫（Shot 1/4）、手部特寫（Shot 2）、`deep shadows`/`smallness` 貫穿主描述。
- 無台詞：六欄位完全不寫 `<d>`；`overall_soundscape` 明確 `no human voice` 防腦補旁白。

---

### 5.10 實作範例：Beat 2.2（檢察官宣判式質問 + 紅衣群眾鼓掌，三參考圖 + r2v）

以 Ch2 Beat 2.2（壓迫：檢察官宣讀「這是背叛」，紅衣群眾鼓掌｜中景分屏感（檢察官↔群眾）｜**有台詞**）為例。示範傳**三張參考圖**（檢察官＋法庭＋艾倫），讓分屏構圖中三方都鎖定。

**Step 1 — Z-Image 檢察官肖像（`gen_zit_image`，832×1248，`out=ch2_prosecutor_ref`）：**

```
prompt: editorial portrait photograph of a middle-aged male public prosecutor in a formal black court robe with
white collar bands, authoritative stern face with slicked-back greying hair and sharp narrow eyes, one hand
holding a heavy case folder, cold courtroom lighting from above, cold blue-grey cinematic color grading,
realistic skin texture, 85mm portrait lens, shallow depth of field, blurred marble pillar background
```

**Step 2 — r2v 影片提示詞（`gen_r2v_video`，六欄位，含對白）：**

```
subject_definitions:
<Subject 1> is the public prosecutor in <Picture 1>, a middle-aged male in a formal black court robe with white
collar bands, authoritative stern face, slicked-back greying hair, sharp narrow eyes, holding a heavy case
folder.
<Subject 2> is the third courtroom of the Supreme Court in <Picture 2>, the vast domed hall with split
grandstands, red-clad supporters on the left and silent young spectators on the right.
<Subject 3> is the young defendant Allen in <Picture 3>, a 19-year-old student in a grey hooded sweatshirt
standing trembling at the wooden dock.

summary:
[reference generation] The target video is the prosecutor's crushing declamation of the young defendant: he
turns from the jury bench and hurls his verdict at the hall and at Allen, and the red-clad supporters burst into
excited applause while the courtroom darkens around them. All three subjects are preserved from <Picture 1>,
<Picture 2> and <Picture 3>.

retention_analysis:
<Subject 1> (appears in [Shot 1], [Shot 2], [Shot 4]): fully_preserved - the black court robe, white collar
bands, stern slicked-back greying appearance, and commanding courtroom posture.
<Subject 2> (appears in [Shot 1], [Shot 3], [Shot 4]): fully_preserved - the domed hall, the split grandstands
and the raised banners of the left-side crowd.
<Subject 3> (appears in [Shot 2], [Shot 3]): fully_preserved - the grey hooded sweatshirt, rumpled jeans,
pale young face and trembling stance at the dock.

detailed_description:
The target video uses a tense courtroom documentary style with cold blue-grey grading, hard overhead light and a
split-screen feel that keeps the prosecutor and the red-crowd facing each other in one frame.
[Shot 1] The scene opens at 00:00.000 with a static medium two-sided shot: the prosecutor stands on the left in
his black robe before the jury bench, the red-clad crowd massed on the right, Allen a grey speck in the dock
between them; the prosecutor takes a breath and straightens his collar bands with a thick case folder in hand.
Camera: static medium shot, symmetrical split composition. No dialogue.
[Shot 2] At 00:04.000, a medium-close shot of the prosecutor as he turns sharply toward the jury, slams the
folder down and points at the raised banners, his face hardening into righteous fury; he booms across the hall,
<Subject 1> (S1) declares, <d>[中文] 在聯邦面臨外部經濟封鎖的非常時期，任何偏離官方定調的「數字」，都是敵人用來瓦解我們內部的武器！這不是科學，這是背叛。</d>. Camera: static medium-close shot, slightly low. No other dialogue.
[Shot 3] At 00:08.000, the red-clad supporters on the left rise and clap frenetically, waving their banners, their applause growing and rolling over the right-side silent young faces, while Allen flinches at the sound and
grips the dock. Camera: slow pan across the crowd from left to right. No dialogue.
[Shot 4] At 00:12.500, back to the split shot: the prosecutor lowers his head with cold satisfaction as the
judge's gavel bangs once, unconvinced, and the courtroom settling into a harder, darker quiet; the image slowly
fades. Camera: static medium shot, slow dim. No dialogue.

overall_soundscape:
The prosecutor's voice (only his <d> line), then a swelling burst of clapping, stamps and approving shouts from
the left grandstand, jangling banner poles, the judge's gavel thumping on wood, and the rustle of the silent
right-side spectators growing still, before fading to a heavy quiet.

non_diegetic_music:
A low churning orchestral undercurrent that swells with the applause and cuts off abruptly at the gavel, leaving
only a cold held tone until the fade.
```

參數：`ref_image_0=ch2_prosecutor_ref/zimage_*.png, ref_image_1=ch2_court_ref/zimage_*.png, ref_image_2=ch2_allen_ref/zimage_*.png, duration=15, seed=210202, out=ch2_beat22_video`

**範例要點：**
- **三參考圖分工**：`ref_image_0`＝主說話者檢察官、`ref_image_1`＝法庭場景、`ref_image_2`＝在場但靜默的艾倫——`<Picture 3>`/`<Subject 3>` 標籤依序對應。
- 對白**逐字來自小說**（檢察官的「背叛」兩拍），一句放進 Shot 2 的 `<d>`；群眾聲音只用「掌聲/歡呼」描述＋`overall_soundscape`，不幫路人加對白。
- 「分屏感」用文字寫死：Shot 1/4 點名 `split composition`、左右群眾對峙。

---

### 5.11 實作範例：Beat 2.3（林墨起身傳喚統計局長，重用林墨肖像 + r2v 含對白）

以 Ch2 Beat 2.3（轉折：林墨起身，要求傳喚統計局長｜群像，林墨自下而上入鏡｜**有台詞**）為例。林墨肖像**直接重用 Ch1 的 `zimage_00008_.png`**，示範方案 C 的角色圖跨章複用。

**Step 1 — 重用現有參考圖（不重出圖）：**
- `ref_image_0`＝林墨肖像：`ch1_beat13_ref_char/zimage_00008_.png`（5.7 建置，深色西裝、黑髮、瘦削）
- `ref_image_1`＝法庭場景：`ch2_court_ref/zimage_*.png`（5.9 建置）

**Step 2 — r2v 影片提示詞（`gen_r2v_video`，六欄位，兩句逐字對白）：**

```
subject_definitions:
<Subject 1> is the border economist Lin Mo in <Picture 1>, a thin lean middle-aged East Asian man in his late
40s with short neatly combed black hair with faint grey strands, light stubble, deep-set tired eyes, wearing a
dark charcoal suit and rumpled white shirt without tie.
<Subject 2> is the third courtroom of the Supreme Court in <Picture 2>, the vast domed hall with split
grandstands, red-clad supporters on the left, silent young spectators on the right, and the high judge's bench
backed by the constitutional stone wall.

summary:
[reference generation] The target video is the turning point of the trial: from among the seated crowd Lin Mo
rises slowly into a shaft of light, walks into the center of the court and calmly demands the summoning of the
director of the Federal Statistics Bureau, turning the trial's momentum against the prosecutor. Character and
hall are preserved from <Picture 1> and <Picture 2>.

retention_analysis:
<Subject 1> (appears in [Shot 1], [Shot 2], [Shot 3], [Shot 4]): fully_preserved - his thin serious face, clean
black hair with grey strands, dark charcoal suit and rumpled white shirt, and his measured weary authority.
<Subject 2> (appears in [Shot 1], [Shot 4]): fully_preserved - the domed hall, the split grandstands, the
towering judicial bench, and the cold stone architecture.

detailed_description:
The target video uses a composed courtroom documentary style with cold blue-grey grading, shafts of overhead
light and deliberate, slow camera movement that gives the turning point a monumental weight.
[Shot 1] The scene opens at 00:00.000 with a wide group shot from a low aisle position: rows of seated spectators
fill the grandstands, and among the defense seats off-center a man in a dark charcoal suit begins to stand,
rising slowly into a single shaft of cold light that cuts across the bench. Camera: static wide group shot with a
very slight tilt-up following his rise. No dialogue.
[Shot 2] At 00:04.000, a medium-close shot of Lin Mo now standing, straightening the lapel of his suit, his
voice calm and unhurried as he addresses the bench; he declares, <Subject 1> (S1) says, <d>[中文] 法官閣下，辯方要求傳喚一名關鍵證人。</d> He opens a laptop and the central screen lights up with a document beside the judge's bench. Camera: static medium-close shot, shallow depth of field. No other dialogue.
[Shot 3] At 00:08.000, Lin Mo steps into the center of the court, walking past the dock toward the judge's
bench; the prosecutor shifts uneasily at his seat while Lin Mo turns his head calmly and finishes, <Subject 1>
(S1) continues, <d>[中文] 如果數據不能被質疑，那它就不是數據，而是教條。</d> Camera: slow lateral tracking shot following his walk. No other dialogue.
[Shot 4] At 00:12.500, a wide shot from behind Lin Mo: he stands alone in the middle of the grand hall facing
the towering judicial bench and the constitutional wall, the courtroom dead still around him, then the image
slowly fades. Camera: static wide shot, slow fade.

overall_soundscape:
The cavernous hush of the courtroom, Lin Mo's light footsteps on cold marble, the soft clack of the laptop
latch, a murmur spreading and dying across the grandstands, and the distant echo of the court hall, no crowd
voice laid over the spoken lines.

non_diegetic_music:
A restrained low cello line with a sparse piano note, steady and rising barely as he walks to the center,
holding a quiet tension into the fade.
```

參數：`ref_image_0=ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_1=ch2_court_ref/zimage_*.png, duration=15, seed=210303, out=ch2_beat23_video`

**範例要點：**
- **林墨圖跨章復用**：直接引用 5.7 的 `zimage_00008_.png`，不重出圖——這是方案 C 最大的成本節約。
- 節拍表只列金句，實際 prompt 可依小說補充前一句「法官閣下，辯方要求傳喚…」；兩句皆逐字、兩句對白各放一個鏡頭。
- 「自下而上入鏡」用 Shot 1 的 `tilt-up following his rise` 兌現；「群像」用 Shot 1 的 group shot 落實。

---

### 5.12 實作範例：Beat 2.4（高潮：高舉千萬廢紙，法庭死寂｜特寫→全景 + r2v 含金句）

以 Ch2 Beat 2.4（高潮：高舉千萬廢紙「標籤不能當飯吃，口號不能折抵債務」｜特寫手舉廢紙→全景法庭死寂｜**有台詞**）為例。此節是本書第一句**全書級金句**，`<d>` 逐字保留粗體原句。

**Step 1 — 重用現有參考圖（不重出圖）：**
- `ref_image_0`＝林墨：`ch1_beat13_ref_char/zimage_00008_.png`
- `ref_image_1`＝法庭：`ch2_court_ref/zimage_*.png`

**Step 2 — r2v 影片提示詞（`gen_r2v_video`，六欄位，特寫金句）：**

```
subject_definitions:
<Subject 1> is the border economist Lin Mo in <Picture 1>, a thin lean middle-aged East Asian man in his late
40s with short neatly combed black hair with faint grey strands, light stubble, deep-set tired eyes, wearing a
dark charcoal suit and rumpled white shirt without tie.
<Subject 2> is the third courtroom of the Supreme Court in <Picture 2>, the vast domed hall with split
grandstands, red-clad supporters on the left, silent young spectators on the right, and the high judge's bench
backed by the constitutional stone wall.

summary:
[reference generation] The target video is the climax of the trial: Lin Mo holds high a thick folded banknote of
enormous denomination above his head and delivers the book's founding line on labels and debt, coldly promising
the court that sentencing truth would make this worthless bill the look of their own future; the hall falls into
a heavy silence. Character and hall are preserved from <Picture 1> and <Picture 2>.

retention_analysis:
<Subject 1> (appears in [Shot 1], [Shot 2], [Shot 3], [Shot 4]): fully_preserved - his thin serious face, clean
black hair with grey strands, dark charcoal suit, rumpled white shirt, and the folded vibrant banknote he raises
from his pocket.
<Subject 2> (appears in [Shot 3], [Shot 4]): fully_preserved - the vast domed hall, the split grandstands and
the judicial bench towering under cold light.

detailed_description:
The target video uses a solemn courtroom documentary style with cold blue-grey grading, one strong shaft of
light on the speaker, and a single emphatic camera arc from a close-up of the raised bill to a wide dead-silent
view of the whole hall.
[Shot 1] The scene opens at 00:00.000 with a medium-low shot of Lin Mo at the center of the court, his hand
slipping into the inner pocket of his charcoal suit; the courtroom watches him in silence. Camera: static medium
shot, slow push-in. No dialogue.
[Shot 2] At 00:03.500, a close-up of his hand drawing out the thick folded vividly-colored banknote and lifting
it above his head, rainbow ink stark against the cold grey light of the hall, the bill's edge catching the shaft
of light. Camera: extreme close-up on hand and bill, very shallow depth of field. No dialogue.
[Shot 3] At 00:07.500, back to a medium shot of Lin Mo holding the raised bill with both hands high, his voice
firm and unshaken as he declares, <Subject 1> (S1) says, <d>[中文] 標籤不能當飯吃，口號不能折抵債務。</d>
He adds softly without lowering the bill, <d>[中文] 如果這座法庭今天判處真實有罪，那麼這張廢紙，就是歐若拉聯邦明天的樣子。</d>. Camera: static medium shot, slightly low, the bill over his head against the hall. No other dialogue.
[Shot 4] At 00:12.500, a slow pull-out to a very wide shot of the entire courtroom: Lin Mo a single dark figure
in the center beneath the dome, banners lowered, every spectator frozen, the judge not lifting a finger, the
whole hall a heavy tableau; the image slowly fades. Camera: slow pull-out to wide, gentle fade.

overall_soundscape:
Profound silence punctuated by the faint rustle of black fabric as several spectators shift uneasily, the quiet
grip of the bill between Lin Mo's fingers, a single distant clock ticking under the dome, and the cold air of
the courtroom settling, no human voice besides the spoken lines.

non_diegetic_music:
A low sustained organ-like drone with a sparse deep piano pulse, swelling slightly at the raised bill and
collapsing into near silence across the final wide shot.
```

參數：`ref_image_0=ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_1=ch2_court_ref/zimage_*.png, duration=15, seed=210404, out=ch2_beat24_video`

**範例要點：**
- **金句逐字 + 可嫁接後句**：原句粗體「標籤不能當飯吃，口號不能折抵債務。」必留；「如果判處真實有罪…」一句（小說緊接其後）可一併放入，兩個 `<d>` 皆原文字。
- 鏡頭弧線呼應節拍表「特寫手舉廢紙→全景法庭死寂」：`close-up on hand and bill`（Shot 2）→ `very wide shot` (Shot 4)。
- 金句節拍的情感出口在「死寂」：`overall_soundscape` 用 `Profound silence` 開頭，音樂也在全景鏡塌成近無聲。

---

### 5.13 實作範例：Beat 2.5（餘韻：記者麥克風圍攻，他淡回一句｜手持環繞 + r2v 含對白）

以 Ch2 Beat 2.5（餘韻：走出法庭被記者麥克風圍攻，林墨淡回一句｜手持環繞｜**有台詞**）為例。新增「法庭走廊／記者」場景參考圖，收束鏡用新聞點的動態感做結。

**Step 1 — Z-Image 走廊場景（`gen_zit_image`，832×1248，`out=ch2_corridor_ref`）：**

```
prompt: cinematic film still, a marble corridor outside a grand courtroom at dusk, crowded with journalists
thrusting a thicket of microphones and press cameras forward, bright camera flashes bursting against stone
columns, a few dark-suited security guards holding the press line, institutional cold lighting from the ceiling,
cold blue-grey cinematic color grading, photorealistic film still, gritty documentary look, motion blur at the
edges of the frame
```

**Step 2 — r2v 影片提示詞（`gen_r2v_video`，六欄位，含逐字回答）：**

```
subject_definitions:
<Subject 1> is the border economist Lin Mo in <Picture 1>, a thin lean middle-aged East Asian man in his late
40s with short neatly combed black hair with faint grey strands, light stubble, deep-set tired eyes, wearing a
dark charcoal suit and rumpled white shirt without tie, holding a folded colorful banknote in one pocket.
<Subject 2> is the courthouse corridor in <Picture 2>, a marble hallway crowded with journalists pressing
forward with a thicket of microphones and flashing press cameras, dark-suited security guards holding the line,
cold institutional lighting and cold blue-grey tones.

summary:
[reference generation] The target video is the closing portamento of the chapter: Lin Mo steps out of the
courtroom into a storm of cameras and microphones, fielding shouted questions, then stops to answer one calm
sentence about his child and worthless banknotes before parting the press crowd and walking toward his car,
while a TV wall behind him rolls a new cold headline. Character and corridor are preserved from <Picture 1> and
<Picture 2>.

retention_analysis:
<Subject 1> (appears in [Shot 1], [Shot 2], [Shot 3], [Shot 4]): fully_preserved - his thin serious face, clean
black hair with grey strands, dark charcoal suit, rumpled white shirt, and his weary unshaken calm.
<Subject 2> (appears in [Shot 1], [Shot 2], [Shot 3], [Shot 4]): fully_preserved - the marble corridor crowded
with journalists, the thicket of microphones, the camera flashes and the dark-suited guards.

detailed_description:
The target video uses a raw handheld news-documentary style with cold blue-grey grading, frequent camera flashes
and orbiting movement that keeps Lin Mo at the center of a swallowing press mob.
[Shot 1] The scene opens at 00:00.000 with a handheld medium shot as the court doors open and Lin Mo walks out
straight into a burst of camera flashes; a wall of journalists surges toward him, microphones and recorders
thrust into his face, guards bracing behind them. Camera: handheld medium shot, slight jostle. No dialogue.
[Shot 2] At 00:03.500, a fast handheld montage of the press mob jabbing questions at him with shouts and camera
shutters, hands shoving recorders forward; Lin Mo stops mid-step, neither flinching nor fastening his pace.
Camera: quick handheld cuts around the mob. No dialogue.
[Shot 3] At 00:08.000, a close-up of Lin Mo pausing to face one particular reporter squarely, his tired eyes
flat and calm; he answers in a low even voice, <Subject 1> (S1) says, <d>[中文] 我沒收錢，我只是不想在未來的
某一天，我的孩子必須拿著幾億張印著我頭像的廢紙，去換一塊發霉的麵包。</d>. Camera: static close-up with the
flash strobing past his face. No other dialogue.
[Shot 4] At 00:12.500, the mob parts around him as he walks through with long strides; behind him the corridor's
TV wall scrolls a cold red headline about himself, growing small as he reaches the door; the image slowly fades.
Camera: low handheld tracking shot behind the parting crowd.

overall_soundscape:
Dense overlapping shouts and questions from the crowd, camera shutters firing, the rustle of coats and shoved
microphones, a distant door slamming, and Lin Mo's quiet voice carrying only his spoken line through the noise.

non_diegetic_music:
A low, restless percussive pulse over a cold ambient pad, tightening through the montage, dropping out almost
entirely during the close-up answer, and thinning to silence as he walks away.
```

參數：`ref_image_0=ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_1=ch2_corridor_ref/zimage_*.png, duration=15, seed=210505, out=ch2_beat25_video`

**範例要點：**
- **餘韻鏡頭＝新聞動態**：手持環繞（Shot 2 `handheld cuts`）、`motion blur`（參考圖就寫好）、對白鏡頭（Shot 3）反而靜止──以「靜」托出金句。
- 回答**逐字來自小說**（比節拍表長），一段落放單一 `<d>`；路人的追問只作聲＋動作，不幫記者加對白。
- 結尾電視牆標題（《數據修正主義者的野心》）只入描述、不寫字幕，`TV wall scrolls a cold red headline` 即可。
- Ch2 全章參考圖建置量：艾倫（2.1）、檢察官（2.2）、走廊（2.5）、法庭（2.1 共用）、林墨（Ch1 重用）——共 5 張圖支撐 5 個 beats。

---

### 5.14 實作範例：Beat 3.1（研究室＋網軍洗版螢幕，雙參考圖 + r2v）

以 Ch3 Beat 3.1（開場：研究室，螢幕上網軍洗版留言｜特寫螢幕，滾動留言｜無台詞）為例。Ch3 新增三名參考（研究室、洗版螢幕、蘇菲），林墨沿用 Ch1 肖像。

**Step 1 — Z-Image 參考圖 ×2（`gen_zit_image`，832×1248）：**

研究室場景（`out=ch3_office_ref`）：
```
prompt: cinematic film still, interior of a political research office at night, a dim room lit only by a glowing
desktop monitor and a small desk lamp, desk with a monitor and an open vintage offline laptop with worn plastic
keys, stacks of paper reports and folders, at the back a night window showing a dark city with distant lights and
below a few black administrative cars waiting along the street, cold blue-grey cinematic color grading,
photorealistic film still, gritty documentary look, wide-angle interior, slightly low light level
```

洗版螢幕特寫（`out=ch3_screen_ref`）：
```
prompt: close-up cinematic still of a computer monitor screen, a social-media feed flooded with thousands of
identical short Chinese attack comments scrolling downward, slogans about a data hound and a traitor destroying
unity densely repeated, gray-blue interface with red warning badges and cold angry icons, one obviously fabricated
photograph of a man in a suit standing under a foreign flag flickering among the posts, unread-message counters
climbing into the tens of thousands, harsh blue monitor light, cold blue-grey grading, photorealistic screen
photo, documentary style
```

產出：`ch3_office_ref/zimage_*.png`、`ch3_screen_ref/zimage_*.png`

**Step 2 — r2v 影片提示詞（`gen_r2v_video`，六欄位，無台詞）：**

```
subject_definitions:
<Subject 1> is Lin Mo at his work desk in <Picture 1>, a thin lean middle-aged East Asian man in his late 40s
with short neatly combed black hair with faint grey strands, light stubble and deep-set tired eyes, dark charcoal
suit and rumpled white shirt, sitting motionless in the dim research office before a glowing desktop monitor,
blue light washing his face.
<Subject 2> is the hostile comment storm on the monitor in <Picture 2>, a social-media feed flooded with
thousands of identical short Chinese attack comments rolling down, gray-blue interface crowded with red warning
badges and one fabricated photograph of a suited man under a foreign flag inside it.

summary:
[reference generation] The target video is the opening beat of the chapter: Lin Mo sits alone in the dim research
office late at night, staring at a monitor flooded by an endless stream of identical hostile comments, a
fabricated photo of him flashing among the bots, then quietly closes every communication window. Character and
office are preserved from <Picture 1> and <Picture 2>.

retention_analysis:
<Subject 1> (appears in [Shot 1], [Shot 2], [Shot 3], [Shot 4]): fully_preserved - his thin tired face, neat
black hair with grey strands, dark charcoal suit with rumpled white shirt, sitting silhouette lit by blue screen
glow in the dim office.
<Subject 2> (appears in [Shot 1], [Shot 3], [Shot 4]): fully_preserved - the dense scrolling Chinese attack
comments, red warning badges, and the single fabricated photo flickering among the posts.

detailed_description:
The target video uses a cold, quiet documentary style with blue-grey grading, a dark office and the only light
source being the glowing monitor reflected on Lin Mo's face.
[Shot 1] The scene opens at 00:00.000 with a close-up of the monitor: thousands of identical Chinese attack
comments scroll downward in a dense grey-blue stream, red badges and unread counters climbing, a fabricated photo
of a suited man under an enemy flag flickering among the rows. Camera: slow push-in to the screen, screen light
dominant. No dialogue.
[Shot 2] At 00:04.000, the camera pulls back to a medium shot of Lin Mo sitting alone in the dark office, the
monitor light mapping across his thin tired face, his eyes fixed on the stream without blinking. Camera: static
medium shot, subtle handheld sway. No dialogue.
[Shot 3] At 00:08.000, a rack focus from Lin Mo's unreadable expression to the screen behind him, the comment
flood still rolling, the fabricated photo looping among the bots in a cold loop. Camera: static, rack focus. No
dialogue.
[Shot 4] At 00:12.500, close-up of his hand moving the mouse: window after window closes with a soft click, the
feed shrinking away until the desktop is bare, then the camera holds on his face in the dimming light, a long
quiet before a gentle fade. Camera: static close-up, slow fade.

overall_soundscape:
The low hum of the desktop fan and the warm loop of the CPU, a soft tick of the cooling, faint notification
chimes firing in a staccato rhythm, muted night traffic far below the window, the click of the mouse closing each
window, no human voice.

non_diegetic_music:
A cold minimal electronic tone bed with sparse discordant ticks aligned to the message chimes, nervous and flat,
thinning to near silence as the windows close and the screen goes bare.
```

參數：`ref_image_0=ch3_office_ref/zimage_*.png, ref_image_1=ch3_screen_ref/zimage_*.png, duration=15, seed=310101, out=ch3_beat31_video`

**範例要點：**
- **無對白情緒段**靠「光的指引」敘事：畫面只有螢幕光，`monitor light washing his face`/`blue screen glow` 貫穿主描述。
- **洗版留言不精確字面化**：`short Chinese attack comments`＋意象（狗/逃亡者）即可，r2v 自由呈現；畫面可見文字不進 `<d>`。
- 全段無 `<d>`，`overall_soundscape` 只有機器聲＋`no human voice`。

---

### 5.15 實作範例：Beat 3.2（離線筆電敲法案，重用林墨肖像 + r2v）

以 Ch3 Beat 3.2（構思：林墨在離線筆電逐條敲下法案條文｜中景，鍵盤特寫｜無台詞）為例。林墨引用 5.7 肖像、場景沿用 5.14 研究室。

**Step 1 — 重用現有參考圖（不重出圖）：**
- `ref_image_0`＝林墨肖像：`ch1_beat13_ref_char/zimage_00008_.png`
- `ref_image_1`＝研究室：`ch3_office_ref/zimage_*.png`（含復古離線筆電）

**Step 2 — r2v 影片提示詞（`gen_r2v_video`，六欄位，無台詞）：**

```
subject_definitions:
<Subject 1> is the border economist Lin Mo in <Picture 1>, a thin lean middle-aged East Asian man in his late 40s
with short neatly combed black hair with faint grey strands, light stubble, deep-set tired eyes, wearing a dark
charcoal suit and rumpled white shirt without tie.
<Subject 2> is the research office desk in <Picture 2>, a dim political research office at night with a desk
holding a closed desktop monitor and an open vintage offline laptop with worn plastic keys, stacks of paper
reports, and a night window with distant city lights behind.

summary:
[reference generation] The target video is a quiet drafting beat in the research office: Lin Mo works alone on his
vintage offline laptop, tapping out the clauses of the draft protocol line by line, screens showing the draft
title and new articles, while the dark city rests outside the window. Character and office are preserved from
<Picture 1> and <Picture 2>.

retention_analysis:
<Subject 1> (appears in [Shot 1], [Shot 2], [Shot 3], [Shot 4]): fully_preserved - his thin serious face, neat
black hair with grey strands, dark charcoal suit, rumpled white shirt, and his concentrated weary manner.
<Subject 2> (appears in [Shot 1], [Shot 2], [Shot 3], [Shot 4]): fully_preserved - the desk with the vintage
offline laptop and its worn keys, the paper stacks, the closed desktop monitor and the night window behind.

detailed_description:
The target video uses a quiet intimate documentary style with cold blue-grey grading, one warm lamp pooling on the
keyboard while the room stays dark, deliberate slow framing on the hands and the screen.
[Shot 1] The scene opens at 00:00.000 with a medium shot of Lin Mo at the desk in the dim office, the open vintage
laptop glowing before him, both hands resting at the keys, the desktop monitor dark beside it; the room is still
and the night window shows distant lights. Camera: static medium shot, slightly low. No dialogue.
[Shot 2] At 00:04.000, a close-up of his index finger striking the worn plastic keys as cursive letters cascade
onto the screen: the draft title, then the article headings and clause lines marching down one by one. Camera:
close-up on keyboard and screen, very shallow depth of field. No dialogue.
[Shot 3] At 00:08.000, a rack pull to a medium-close of Lin Mo, his thin face lit by the pale laptop glow, eyes
scanning the clause text he has just typed, a faint weariness and resolve passing across his features. Camera:
static medium-close frame, slow rack. No dialogue.
[Shot 4] At 00:12.500, a slow push toward the screen: the clause is finished and marked, a cold cursor blinking
under the last line, and the rest of the dark office waits behind the frame as the image slowly fades. Camera:
slow push-in, gentle fade.

overall_soundscape:
The soft rhythmic clatter of typing on worn plastic keys, the low whir of the vintage laptop fan, gentle
background hum, a page of paper rustling under stacks, distant night traffic and a faint siren far away, no
human voice.

non_diegetic_music:
A sparse, steady two-note ambient pulse under near silence, patient and mechanical, rising imperceptibly as the
clauses stack up and fading with the final push-in.
```

參數：`ref_image_0=ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_1=ch3_office_ref/zimage_*.png, duration=15, seed=320202, out=ch3_beat32_video`

**範例要點：**
- **鍵盤特寫的「打字」動作**：Shot 2 用 `index finger striking`＋`letters cascade onto the screen`，法案內容以「標題/條文逐行」意象帶出，不把全文唸出。
- 鏡頭弧線＝中景 → 鍵盤特寫 → 中近 → 螢幕推進，對應節拍表「中景、鍵盤特寫」。
- 無台詞段照例全部 `No dialogue`＋音場無 `human voice`。

---

### 5.16 實作範例：Beat 3.3（蘇菲通報查封預算，三參考圖 + r2v 含對白）

以 Ch3 Beat 3.3（干擾：助理蘇菲通報審計部要查封預算｜雙人中景，緊張｜**有台詞**）為例。蘇菲首度登場走肖像圖（新出 `ch3_sophie_ref`），與林墨（重用）、研究室（重用）構成分屏感雙人景。

**Step 1 — Z-Image 蘇菲肖像（`gen_zit_image`，832×1248，`out=ch3_sophie_ref`）：**

```
prompt: editorial portrait photograph of a young East Asian female research assistant in her mid-20s standing
just inside a dark office doorway, pale worried face, long straight black hair loosely tied back, plain dark
cardigan over a white blouse, holding a stack of paper reports pressed against her chest, glancing toward a desk
lamp across the room, harsh cold practical light from above, cold blue-grey cinematic color grading, realistic
skin texture, 85mm portrait lens, shallow depth of field, blurred dark office and window background
```

**Step 2 — r2v 影片提示詞（`gen_r2v_video`，六欄位，含對白）：**

```
subject_definitions:
<Subject 1> is the assistant Sophie in <Picture 1>, a young East Asian research assistant in her mid-20s, long
straight black hair loosely tied back, plain dark cardigan over a white blouse, pale worried face, holding a
stack of paper reports against her chest.
<Subject 2> is Lin Mo in <Picture 2>, a thin lean middle-aged East Asian man in his late 40s in a dark charcoal
suit with a rumpled white shirt, short black hair with grey strands, light stubble, deep-set tired eyes.
<Subject 3> is the research office in <Picture 3>, the dim night office with the desk, the closed desktop
monitor, the vintage offline laptop and a night window below which black administrative cars wait.

summary:
[reference generation] The target video is the interruption beat of the chapter: Lin Mo types the last clause of
the protocol while the door quietly opens and Sophie steps in, pale, holding reports, delivering the news that the
Audit Bureau will seal the office budget for the night, and the two exchange a tense quiet exchange about numbers
and slogans. All three subjects are preserved from <Picture 1>, <Picture 2> and <Picture 3>.

retention_analysis:
<Subject 1> (appears in [Shot 1], [Shot 2], [Shot 3], [Shot 4]): fully_preserved - the young pale assistant with
long black hair tied back, dark cardigan over white blouse, and the paper reports pressed to her chest.
<Subject 2> (appears in [Shot 1], [Shot 2], [Shot 3]): fully_preserved - the thin tired man in the dark charcoal
suit, rumpled white shirt, black hair with grey strands and his composed weary expression.
<Subject 3> (appears in [Shot 3], [Shot 4]): fully_preserved - the dim research office, the desk, the dark
monitor, and the night window over the waiting black cars.

detailed_description:
The target video uses a tense quiet documentary style with cold blue-grey grading, a two-shot framing that keeps
Sophie at the door and Lin Mo at the desk facing each other, with the night window as a cold backdrop.
[Shot 1] The scene opens at 00:00.000 with a medium two-sided shot: Sophie stands inside the doorway in the dark
cardigan holding her reports, while Lin Mo remains seated at the desk in his charcoal suit, the open laptop
glowing between them; she takes a breath before speaking. Camera: static medium two-shot, slight symmetry. No
dialogue.
[Shot 2] At 00:03.500, a close-up of Sophie as she steadies herself against the door frame, pale face in the
cold overhead light; she speaks low and evenly, <Subject 1> (S1) says, <d>[中文] 我怕的是，如果我們這次輸了，以後歐若拉聯邦就再也沒有「數字」，只有「口號」了。</d>. Camera: static close-up, shallow depth of field. No other dialogue.
[Shot 3] At 00:08.000, a medium shot of Lin Mo turning from the screen; he rises slightly, composure unbroken,
then glances past her toward the window where the black administrative cars sit below, streetlight glinting off
them. Camera: slow pan from the desk to the window. No dialogue.
[Shot 4] At 00:12.500, back to the two-shot: Sophie stays by the door watching him, Lin Mo lowers himself back to
the keyboard with a quiet decision hardening his face, the office settling back into its cold hum, and the image
slowly fades. Camera: static medium two-shot, slow dim.

overall_soundscape:
The quiet click of the door latch, the rustle of paper reports, the low hum of the vintage laptop, distant
footsteps of security officers in the corridor below, muffled street sounds through the window, and only the
spoken lines above the hush.

non_diegetic_music:
A low restrained cello line with a sparse piano note under the tense calm, swelling softly at the window glimpse
of the waiting cars and thinning to silence at the fade.
```

參數：`ref_image_0=ch3_sophie_ref/zimage_*.png, ref_image_1=ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_2=ch3_office_ref/zimage_*.png, duration=15, seed=330303, out=ch3_beat33_video`

**範例要點：**
- **新角色蘇菲**肖像圖描述帶動作（`holding a stack of paper reports`）直接服務本節「通報」情節。
- 對白**逐字**：節拍表只列蘇菲金句，prompt 補足小說連接上下文（審計部查封預算已由 Shot 3 的窗外黑車＋門外腳步聲傳達），單一 `<d>` 只放蘇菲那句。
- 窗外黑車＝開場鏡頭的伏筆（小說描述行政調查車待命），用 `overall_soundscape` 的 `footsteps of security officers` 補足。

---

### 5.17 實作範例：Beat 3.4（斷電、廣播搜索、抽隨身碟，重用林墨 + r2v 含對白）

以 Ch3 Beat 3.4（高潮：斷電、廣播搜索，林墨闔蓋抽出隨身碟｜特寫，黑暗中的螢幕光｜**有台詞**）為例。收束鏡用「黑暗＋微弱螢幕光」與廣播人聲（背景，不進 `<d>`）對峙。

**Step 1 — 重用現有參考圖（不重出圖）：**
- `ref_image_0`＝林墨：`ch1_beat13_ref_char/zimage_00008_.png`
- `ref_image_1`＝研究室：`ch3_office_ref/zimage_*.png`

**Step 2 — r2v 影片提示詞（`gen_r2v_video`，六欄位，含對白）：**

```
subject_definitions:
<Subject 1> is the border economist Lin Mo in <Picture 1>, a thin lean middle-aged East Asian man in his late 40s
with short neatly combed black hair with faint grey strands, light stubble, deep-set tired eyes, wearing a dark
charcoal suit and rumpled white shirt without tie.
<Subject 2> is the research office in <Picture 2>, the dim night office with the desk, the closed desktop monitor
and the open vintage laptop now dark, darkness swallowing the room except a cold glow from the window.

summary:
[reference generation] The target video is the climax beat of the chapter: the office power fails and the veteran
laptop screen dies as its old battery drains, an amplified order from outside orders him to stop all work; Lin Mo
closes the laptop calmly in the dark, draws a USB stick from his inner pocket, and speaks a quiet line to Sophie
about the protocol needing no computer, only the rostrum of the parliament. Character and office are preserved
from <Picture 1> and <Picture 2>.

retention_analysis:
<Subject 1> (appears in [Shot 1], [Shot 2], [Shot 3], [Shot 4]): fully_preserved - his thin tired face, neat
black hair with grey strands, dark charcoal suit, rumpled white shirt, and his unshaken calm in the dark.
<Subject 2> (appears in [Shot 1], [Shot 2], [Shot 3], [Shot 4]): fully_preserved - the dark office, the desk,
the dead monitor, the closed vintage laptop, and the cold night window glow.

detailed_description:
The target video uses a stark dark-room documentary style with cold blue-grey grading, almost no light source
except the dying laptop glow and the cold window light, and very still camera work punctuated by one red
emergency glow from outside.
[Shot 1] The scene opens at 00:00.000 with a medium shot: the office lights flicker once and die, plunging the
room into darkness except for the pale glow of the vintage laptop screen; outside the window a red emergency
light sweeps past. Camera: static medium shot with a tiny flicker effect. No dialogue.
[Shot 2] At 00:04.000, a close-up of the laptop: the screen dims steadily as the aging battery drains, letters
fading into grey, then Lin Mo's hand arrives and closes the lid with a soft click, sealing the dark. Camera:
close-up on the screen and hand, very shallow depth of field. No dialogue.
[Shot 3] At 00:08.000, a close-up of Lin Mo's fingers slipping inside his suit jacket and drawing out a slim USB
stick, holding it in the dim red-swept light; he speaks low and evenly without looking up, <Subject 1> (S1) says,
<d>[中文] 蘇菲，從後門走。這份協議不需要存在電腦裡，它只需要出現在國會的發言台上。</d>. Camera: static close-up on hand and USB, subtle red glow. No other dialogue.
[Shot 4] At 00:12.500, a medium shot of Lin Mo standing, straightening his tie in the half-dark, the USB tucked
into his palm, the red emergency light stroking across his silhouette, then the image slowly fades. Camera: static
medium shot, gentle fade.

overall_soundscape:
The sharp pop of the power cut and the dying whine of the laptop fan dropping away, the loudspeaker order from
outside in a distorted amplified voice demanding he stop all electronic operations (background, not a character
line), the click of the lid closing, fabric rustling as he straightens his tie, distant sirens in the night city.

non_diegetic_music:
A low, ominous drone with a heartbeat-like pulse, tightening through the power cut and dead-softening during the
USB close-up, holding a cold held tone until the final fade.
```

參數：`ref_image_0=ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_1=ch3_office_ref/zimage_*.png, duration=15, seed=340404, out=ch3_beat34_video`

**範例要點：**
- **廣播人聲（擴音器）只當場景聲**：`overall_soundscape` 描述「失真擴音命令」內容但不寫 `<d>`——`<d>` 只留給角色說出口的原文台詞。
- 收束鏡的演員動作（闔蓋、抽隨身碟、撫平領帶）全部入 Shot 2/3/4，台詞只有林墨那句 `[中文]`。
- Ch3 全章參考圖建置量：研究室（3.1）、洗版螢幕（3.1）、蘇菲（3.3）、林墨（Ch1 重用）、研究室/辦公室沿用——共 3 張新圖支撐 4 個 beats。