### 5.5 實作範例：Beat 1.1（i2v / 方案 B 完整流程）

以 Ch1 Beat 1.1（邊境拾起廢紙、中景風沙鐵絲網、無台詞）為例，示範 i2v（FL2VA 錨定）時的真實執行流程。若改用 r2v，則此範例等同於 Step 1（出定場圖）直接接 `gen_r2v_video`。

**角色視覺錨點（全書每段重複使用）：**
> 林墨：中年男子，黑色俐落短髮，瘦削方正臉型，深色西裝，皮鞋沾灰，神情嚴肅冷靜。

**Step 1 — SDXL 定場圖（`gen_sdxl_image`）：**

```
prompt: cinematic film still, desolate desert border wasteland of the Aurora Federation, vast open sky,
rusty barbed wire fence stretching to the horizon, strong sunlight, wind blowing dust and sand,
scattered burned papers and ash piles on the ground. A middle-aged man in a dark suit, short black neat hair,
thin lean serious face, dusty leather shoes, crouches beside the fence, holding up a colorful banknote
he just picked from the ashes, examining it. Cold blue-grey color grading, photorealistic cinematic photography,
24mm wide angle, character placed on the rule-of-thirds, wide negative space, gritty documentary look
```

參數：`width=1216, height=768, seed=110101, out=ch1_beat1`
產出：`ch1_beat1/sdxl_00009_.png`

**Step 2 — I2VA 影片提示詞（`gen_i2v_video`，首=尾幀=定場圖）：**

```
I2VA: For the target video, at 0.00 seconds into the target video, <Picture 1> (from [Shot 1]) is fully referenced.

integrated_multimodal_description: [Shot 1] The desolate border wasteland with a rusty barbed wire fence
and the middle-aged man in a dark suit (Lin Mo) crouching beside it, exactly preserved from the reference picture.
Strong sunlight beats down as wind gusts sweep dust and sand across the ground. The man's fingers tighten
slightly around the colorful banknote, its corner fluttering in the wind with ash drifting past. He squints
against the sun, then slowly turns the bill between two fingers to examine its printed digits, a subtle,
restrained gesture. The camera pushes in with small amplitude at slow speed. No dialogue.

overall_soundscape: Dry desert wind howling continuously, sand grains scratching across the cracked ground,
an occasional clank of loose barbed wire tapping the metal fence post, faint crows in the distance.

non_diegetic_music: A sparse, somber low-string drone with a single mournful woodwind note, restrained and
cold, barely rising, matching the desolate stillness.
```

參數：`first_frame=last_frame=輸出定場圖路徑, duration=15, seed=112233, out=ch1_beat1_video`

**範例要點：**
- 開場 `I2VA:` 行是 H3 對首幀錨定模式的必要前綴，不可省略。
- `[Shot 1]` 內首句「exactly preserved from the reference picture」鎖緊與定場圖的一致性。
- 動作只用**微小、生活化**的變化（手指收緊、鈔票角飄動、轉瓶身式翻紙幣），符合「中景固定」節拍。
- 無台詞時在時間軸內明寫 `No dialogue.`
- `overall_soundscape` 只含環境與動作聲；`non_diegetic_music` 只含配樂，兩欄不重複。

### 5.6 實作範例：Beat 1.2（r2v / 方案 C 完整流程）

以 Ch1 Beat 1.2（象徵：難民用整疊鈔票換半瓶水、走私販拿廢紙墊火爐，中遠景烈日，無台詞）為例，示範 r2v 的真實執行流程。全程只用 **1 張場景參考圖**，提示詞採**官方 Ref2VA 六欄位**（含音訊欄，杜絕旁白）。

**Step 1 — SDXL 場景參考圖（`gen_sdxl_image`）：**

```
prompt: cinematic film still, desolate sun-blasted border checkpoint wasteland in harsh noon sunlight,
no shadow, dusty ground with scattered colorful banknotes and ash. A group of thin desperate refugees crouch
in the shadow of rusted structures, clutching thick stacks of brightly colored banknotes. In the foreground
a smuggler shrugs and turns away, ignoring the offered cash, while a small fire stove crackles beside him,
fed with sheets of the same colorful paper banknotes. Medium-wide shot, documentary photojournalism style,
cold harsh daylight, gritty realistic tones
```

參數：`width=1216, height=768, seed=120102, out=ch1_beat12_ref`
產出：`ch1_beat12_ref/sdxl_00012_.png`

**Step 2 — r2v 影片提示詞（`gen_r2v_video`，官方 Ref2VA 六欄位）：**

```
subject_definitions:
<Subject 1> is the scene in <Picture 1>, a sun-blasted border checkpoint wasteland with a group of thin
desperate refugees crouching in the shadow of rusted structures, clutching thick stacks of colorful banknotes,
and a smuggler in the foreground turning away from the offered cash beside a small cracking fire stove fed
with the same colorful paper banknotes.

summary:
[reference generation] The target video shows <Subject 1> as a suffering group of refugees being refused by a
smuggler who burns their worthless colorful banknotes, capturing the human cost of hyperinflation at a
border checkpoint.

retention_analysis:
<Subject 1> (appears in [Shot 1], [Shot 2], [Shot 3], [Shot 4]): fully_preserved - the refugees' thin bodies,
their stacks of colorful banknotes, the smuggler, the fire stove, the rusty structures, and the harsh noon
daylight from <Picture 1> are retained.

detailed_description:
The target video uses a desolate photojournalism style with sun-blasted colors and harsh, shadowless noon light.
[Shot 1] A medium-wide shot establishes <Subject 1>, the border checkpoint wasteland, where a thin refugee
trembles as he holds out a thick stack of colorful banknotes toward the smuggler, his eyes pleading on the
half bottle of water in the man's hand. The camera stays static.
[Shot 2] At 00:03.000, the shot cuts to a medium-close shot of the smuggler, who waves his hand dismissively
without even counting the money, turns his back, crouches by the fire stove, and throws a stack of banknotes
into the flames. The fire licks up the paper and colorful ash drifts away in the heat. The camera pushes in
slightly with a small handheld amplitude.
[Shot 3] At 00:08.000, the shot cuts to a medium shot of the same refugee, his eyes reddening as he withdraws
the rejected banknotes and lowers his head. Behind him the fire stove keeps burning, and another refugee
carefully pours a few drops of the half bottle of water for each person around. The camera holds static with a
slight handheld sway.
[Shot 4] At 00:13.000, the shot pulls out to a wide angle of the whole wasteland, colorful banknotes and ash
scattered on the ground, the refugees' figures blurring in the heat shimmer, and the scene slowly fades out.
The camera pulls back slowly with small amplitude.

overall_soundscape:
Continuous dry desert wind with low howling, crackling of the fire stove, soft rustling of paper banknotes,
shuffling of refugees' footsteps on dusty ground, and faint heat-shimmer shimmer. No human voice of any kind.

non_diegetic_music:
N/A
```

參數（`gen_r2v_video`）：`ref_image_0=輸出場景參考圖路徑, duration=15, seed=120889, out=ch1_beat12_video`

**範例要點：**
- **六欄位依序出現**：`subject_definitions` → `summary` → `retention_analysis` → `detailed_description` → `overall_soundscape` → `non_diegetic_music`。
- **「<Subject 1>」與「<Picture 1>」標籤**在 subject_definitions 定義一次，retention_analysis 用 `fully_preserved` 承諾一致性。
- **無對白＝不寫任何 `<d>`**（舊 A/B/C/D 結構的「全程無對白」會被模型忽略）；音訊一律由 `overall_soundscape` / `non_diegetic_music` 控制，`non_diegetic_music: N/A` 明確關掉配樂。
- `detailed_description` 以 350-500 英文詞描述 4 鏡（00:00 / 03 / 08 / 13），鏡頭時間戳嚴格遞增且 ≤ duration。
- 前半段描述（構圖主體動作）放 `detailed_description`；「無任何語言」明確寫在 `overall_soundscape` 結尾防旁白。
- seed 用 **120889**（與舊版 120888 分帳號，利於舊問題影片/新影片對比）。

### 5.7 實作範例：Beat 1.3（Z-Image 生成參考圖 + r2v）

以 Ch1 Beat 1.3（對照：電子廣告牆文宣「警惕！數據是毒藥」；林墨對比口袋裡的廢紙，感到寒顫｜特寫→遠景、壁畫式構圖｜無台詞）為例，示範以 **Z-Image（`gen_zit_image`）** 出參考圖再接 r2v 的流程。此例只用 1 張參考圖承載「廣告牆 + 林墨」對照構圖。

**Step 1 — Z-Image 參考圖（`gen_zit_image`）：**
Z-Image 適合出風格強烈、高反差的圖；prompt 集中描述廣告牆的內容與配色，人物擺入前景作大小對照。

```
prompt: photo-realistic cinematic wide shot, a massive electronic propaganda billboard wall on a city street,
screen glowing giant red Chinese text "警惕！數據是毒藥" with scrolling banner below and a colorful animated
cartoon of a crow pecking a seedling. In front at the bottom, a small darkly dressed man in a suit seen from
behind, looking up at the towering wall, feeling small and unsettled. High contrast between the bright neon
billboard and the dark foreground figure. Cold night color grading, deep shadows, epic monumental composition
```

（可另加一段對照細節：`the billboard's font style and color scheme matches a colorful banknote in his pocket, symbolically identical`）

參數（`gen_zit_image`）：`width=1216, height=768, seed=130103, out=ch1_beat13_ref`
產出：`ch1_beat13_ref/xxxxx.png`（Z-Image 檔名以實際輸出為準）

**Step 2 — r2v 影片提示詞（`gen_r2v_video`，A/B/C/D 結構）：**

```
A. Shared Creative Direction (top section)
Color palette: electric neon red (#FF2F2F) propaganda screen, deep city-night blue (#0B1B3F), cold asphalt
grey, warm golden billboard edge light. Overall mood: monumental propaganda wall towering over one small man,
oppressive contrast. No subtitles besides the on-screen sign, no watermark.

B. Character Definition Section
主角: 參考圖1 前景底部一名穿深色西裝的中年男子（林墨），從背後拍攝，仰頭看向巨型廣告牆，
身形在巨大的螢幕前顯得很渺小。人物外觀、衣物、構圖位置與參考圖 100% 一致。

C. Environment and Scene Design Section
Location: 夜晚城市街道，由參考圖1 定義。一座巨型電子廣告牆占據畫面大半，螢幕上滾動巨大紅字
「警惕！數據是毒藥」與烏鴉啄幼苗的動畫；街燈與招牌燈稀疏，周遭寂靜。

D. Storyboard Section
鏡頭 1 (00:00–00:07)：
從林墨背後特寫開始：他停步仰頭，螢幕的光與紅字在他外套上明滅。鏡頭上移，掠過他的肩頭，
帶出整個巨型廣告牆。景別：特寫→中景。運鏡：手持緩慢上搖（tilt up）。

鏡頭 2 (00:07–00:12)：
廣告牆上的紅色標語「警惕！數據是毒藥」與烏鴉動畫占滿畫面，林墨徹底縮進畫框底部的小黑點。
景別：遠景，壁畫式構圖。運鏡：固定鏡位。

鏡頭 3 (00:12–00:15)：
林墨低頭，右手隔著西裝口袋輕壓那張紙幣，停頓一拍，再抬起頭目光變冷。畫面漸隱。景別：近景。
運鏡：靜止。

全程無對白。
```

參數（`gen_r2v_video`）：`ref_image_0=輸出Z-Image參考圖路徑, duration=15, seed=130888, out=ch1_beat13_video`

**範例要點：**
- **Z-Image 適合「單張圖承載強反差構圖」**（亮牆 vs 暗人、巨型 vs 渺小），一個節拍只需 1 張參考圖即可錨定。
- 「壁畫式」構圖在 C 段已有整體描述，D 段鏡頭 2 再以「遠景」落實。
- 對比細節（牆上字體色調與口袋紙幣相同）寫進 prompt 的風格段（可選補充句），讓模型隱約呈現「同源」感。
- 三個鏡頭各安其序：**上搖揭示 → 遠景襯托 → 近景收束**，符合節拍表的「特寫→遠景」方向。
- 此節拍無台詞，金句（1.4 的「閉嘴」宣言）留給下一段承接。

### 5.8 實作範例：Beat 1.4（r2v + 台詞範例，車內收束鏡）

以 Ch1 Beat 1.4（收束：轎車內閉眼「回研究室，我要把草案序言重新寫一遍」；車窗掠過政治標語｜車內中景、窗外流動｜有台詞）為例，示範 **含對白的 r2v** 寫法，以及「車外流動標語」如何用單張參考圖 + 鏡頭敘事完成。

**Step 1 — Z-Image 參考圖（`gen_zit_image`）：**

```
prompt: cinematic interior shot, the rear seat of a moving black sedan at dusk, a middle-aged man in a dark suit
with short black hair leaning back with eyes closed, one hand resting near his chest pocket, city political
slogan billboards blurring past through the side window, warm streetlight streaks, photorealistic film still,
shallow depth of field focusing on the man's calm face
```

參數（`gen_zit_image`）：`width=1216, height=768, seed=140104, out=ch1_beat14_ref`
產出：`ch1_beat14_ref/xxxxx.png`

**Step 2 — r2v 影片提示詞（`gen_r2v_video`，A/B/C/D 含台詞）：**

```
A. Shared Creative Direction (top section)
Color palette: warm amber streetlight (#E8A33D) streaks outside, deep charcoal car interior (#2A2A30),
the man's dark suit (#1C1C22), faint slogan-neon reflections on glass. Overall mood: quiet resolve, a brief
stillness before the fight begins. No watermark, no subtitles other than external signs.

B. Character Definition Section
主角: 參考圖1 穿深色西裝的中年男子（林墨），坐在行進中的黑色轎車後座，閉著眼睛，外形、衣著、
神情與參考圖 100% 一致。

C. Environment and Scene Design Section
Location: 行進中的黑色轎車後座內部，由參考圖1 定義。車窗外城市傍晚光影流動，政治標語招牌
由窗玻璃掠過、模糊成光帶；車內安靜，引擎低鳴。

D. Storyboard Section
鏡頭 1 (00:00–00:05)：
林墨靠在後座閉眼，車窗外的城市標語與燈光在玻璃上流動。司機在前座聲音傳來。景別：中景。
運鏡：固定鏡位。
司機（畫外音）：「林立委，明天是《國安資訊增補案》的表決，要回議會嗎？」

鏡頭 2 (00:05–00:11)：
林墨沒有睜眼，嘴角微微動了一下：「不，回研究室。」他停頓，補充道：「我要把那份草案的序言
重新寫一遍。」窗外標語繼續掠過。景別：近景──特寫過渡。運鏡：緩慢推近。

鏡頭 3 (00:11–00:15)：
司機問：「哪份草案？」林墨這才睜眼，瞳孔映著掠過的燈光，沉聲說：「一份關於如何讓政府閉嘴，
讓數據說話的法案。」畫面漸隱。景別：特寫。運鏡：靜止收束。
```

參數（`gen_r2v_video`）：`ref_image_0=輸出Z-Image參考圖路徑, duration=15, seed=140888, out=ch1_beat14_video`

**範例要點：**
- **對白逐字寫入鏡頭段**，說話者標註（「司機（畫外音）：」「林墨：」），多句對白按時間順序放在對應鏡頭內。
- 小說對話會比節拍表長——節拍表只列金句，實際 prompt 可依小說原文擴充，但**不可發明／改寫**（微調標點除外）。
- 收束鏡的「閉嘴／讓數據說話」是本書母題第一次現身，此鏡承先（1.3 的口袋廢紙）啟後（後續各章法案），提示詞中保留原文逐字。
- 「窗外流動標語」不另出圖：由 C 段環境描述 + 鏡頭文字（「模糊成光帶」）驅動，省一張參考圖。
- 車窗光影（streetlight streaks）在 Step 1 就寫進參考圖，A 段再以 #HEX 鎖定，確保流動感延續到影片。