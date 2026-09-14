# Ch1 區塊獨立提示詞 — C0–C19（實作範例 4：第一章「邊境的廢紙」）

> 本文件承接 `novel_to_video_guide_v2.md`（一支影片＝一個區塊）與 `example3.md`（Ch2，參考圖統一管理），
> 完整產出**第一章「邊境的廢紙」**的區塊分割、參考圖分配與全部 20 支 r2v 六欄位提示詞。
>
> **章節功能**：全書的引子與母題（廢紙＝標籤／口號 vs 數據＝真相）埋設。情緒走向：
> 陰冷壓抑（邊境荒涼）→ 荒誕諷刺（紙幣換半瓶水）→ 寒意（想起索利亞崩潰）→ 決意（車上定案）。
> 林墨是本片唯一主角，艾倫此時尚未登場。

---
## 一、參考圖管理表（Step 1：一次性建置）

> 依 v2「可跨章共用」原則，**林墨肖像直接沿用 Ch2 既有 Ref-C1（與 example3.md 同張，不重出）**；
> 邊境各場景圖皆為先前 Ch1 測試時已生成、可直接重用。本章**只新增 2 張小角色肖像（巡邏員必建、司機可選）**。

| 編號 | 檔名（實際既有／待建置） | 內容 | 尺寸 | 用於區塊 |
|------|------|------|------|---------|
| Ref-C1 | `output/ch1_beat13_ref_char/zimage_00008_.png`（**共用**，同 example3.md） | 林墨肖像：瘦削中年、黑髮灰絲、淺鬍茬、深炭灰西裝、皺白襯衫無領帶 | 832×1248 (2:3) | 所有含林墨的區塊 |
| Ref-C1b | `output/ch1_beat11_ref_char/zimage_00011_.png`（既有，可替換） | 林墨手持彩色紙幣版本，眼神警戒 | 832×1248 | C3–C10 手持紙幣系列可優先取用 |
| Ref-S1 | `output/ch1_beat11_ref_scene/zimage_00012_.png`（既有） | 邊境荒原全景：鐵絲網、灰燼、廢紙、風沙，無人物 | 832×1248 | C0–C10、C19 邊境諸鏡 |
| Ref-S2 | `output/ch1_beat12_ref_zit/zimage_00013_.png`（既有） | 難民縮影＋走私販背身＋火爐（中景） | 832×1248 | C6 |
| Ref-S2b | `output/ch1_beat12_ref_zit/zimage_00014_.png`（既有） | 換水交易特寫：手遞紙鈔、火爐燃燒廢紙 | 832×1248 | C7 |
| Ref-S3 | `output/ch1_beat13_ref_scene/zimage_00009_.png`（既有） | 巨型電子廣告牆：紅色標語高亮 | 832×1248 | C11、C12、C13、C19 |
| Ref-S4 | `output/ch1_beat14_ref_scene/zimage_00010_.png`（既有） | 黑色轎車後座內景（無人物） | 832×1248 | C14–C18 |
| Ref-P | `output/ch1_patrol_ref/zimage_00036_.png`（新建完成） | 邊境巡邏員肖像：黝黑風霜、鬍茬、灰塵巡邏制服、麻木神情 | 832×1248 | C2、C8、C12 |
| Ref-D | `output/ch1_driver_ref/zimage_00037_.png`（新建完成） | 聯邦司機肖像：四旬、灰色制服、平淡表情 | 832×1248 | C15、C17 |

> **建置方式**：Ref-P／Ref-D 用 `gen_zit_image`（832×1248 直式 2:3）生成，prompt 內寫死外觀錨點，
> 存到各自參考目錄。**兩張皆已建置完成（2026-09-14）**：Ref-P=`zimage_00036_.png`、Ref-D=`zimage_00037_.png`。

---
## 二、總表：區塊分割與計秒

> 對白 4 字/秒、旁白 5 字/秒（台灣腔普通話），留緩神餘裕進位；場景按動作粗估、寧短勿長。
> 原文範圍：`story1.md` 第一章（lines 3–51）。全部合併規劃約 **119 秒**。

| # | 類型 | 內容 | 秒 |
|---|------|------|----|
| C0 | 場景 | 邊境荒原定場：鐵絲網、灰燼、風沙、死寂（lines 5–7 背景） | 4 |
| C1 | 場景 | 林墨立於鐵絲網邊、皮鞋沾灰，望向網外 | 4 |
| C2 | 對白 | 巡邏員：「那是今年的新版鈔票。」 | 3 |
| C3 | 場景 | 林墨走向廢紙堆、蹲下、從灰燼撿起未燒毀紙幣 | 3 |
| C4 | 旁白 | 千萬索利亞幣：薄如面紙、元首半身像、口號（lines 15 全文） | 17 |
| C5 | 對白 | 林墨：「主權確實很沉重，但它顯然填不飽肚子。」 | 4 |
| C6 | 場景 | 難民縮陰影攥紙鈔；一捆面額換半瓶過期礦泉水 | 6 |
| C7 | 場景 | 走私販懶數，直接拿廢紙墊火爐 | 3 |
| C8 | 對白 | 巡邏員：「林博士，別看了…他們贏了，贏得只剩下這堆廢紙。」 | 13 |
| C9 | 場景 | 林墨折好紙幣放入西裝口袋，抬頭望聯邦境內 | 4 |
| C10 | 對白 | 林墨：「他們不是贏了，」望向廣告牆方向 | 2 |
| C11 | 場景 | 巨型廣告牆動畫：烏鴉學者啄幼苗＋紅字標語（畫面文字） | 5 |
| C12 | 對白 | 巡邏員：「那是執政黨這週的新文宣…真的都很像賣國賊。」 | 11 |
| C13 | 旁白 | 「林墨沒有回答…當數據停止流動，文明的血液就開始凝固。」（lines 35–39） | 14 |
| C14 | 場景 | 林墨上黑色轎車，司機從後照鏡回望 | 3 |
| C15 | 對白 | 司機：「林立委，我們要回議會了嗎？明天是《國安資訊增補案》的表決。」 | 6 |
| C16 | 對白 | 林墨：「不，回研究室。我要把那份草案的序言重新寫一遍。」 | 5 |
| C17 | 對白 | 司機：「哪份草案？」 | 2 |
| C18 | 對白 | 林墨：「一份關於如何讓政府閉嘴，讓數據說話的法案。」 | 5 |
| C19 | 場景 | 車加速駛離邊境，路旁標語倒掠，朝首都 | 5 |

> 全表 **20 個區塊**（C0–C19），其中旁白 2 個：**C4 / C13**，皆純旁白、沿用 `seed=310000`（見第 6 節）。
> 與 Ch2 相同：對白/旁白區塊的 `summary` 只寫英文名詞片語、非 `<d>` 欄位不出現中文完整句。

---
## 三、區塊 × 參考圖對照

| 區塊 | 類型 | ref_image_0 | ref_image_1 | ref_image_2 | duration |
|------|------|-------------|-------------|-------------|----------|
| C0 | 場景 | — | Ref-S1 邊境全景 | — | 4 |
| C1 | 場景 | Ref-C1 林墨 | — | Ref-S1 邊境 | 4 |
| C2 | 對白 | Ref-C1 林墨 | Ref-P 巡邏員 | Ref-S1 邊境 | 3 |
| C3 | 場景 | Ref-C1b 林墨(持幣) | — | Ref-S1 邊境 | 3 |
| C4 | 旁白 | Ref-C1b 林墨(持幣) | — | Ref-S1 邊境 | 17 |
| C5 | 對白 | Ref-C1b 林墨(持幣) | — | Ref-S1 邊境 | 4 |
| C6 | 場景 | Ref-S2 難民走私販 | — | — | 6 |
| C7 | 場景 | Ref-S2b 換水/火爐特寫 | — | — | 3 |
| C8 | 對白 | Ref-C1 林墨 | Ref-P 巡邏員 | Ref-S1 邊境 | 13 |
| C9 | 場景 | Ref-C1b 林墨(持幣) | — | Ref-S1 邊境 | 4 |
| C10 | 對白 | Ref-C1b 林墨(持幣) | — | — | 2 |
| C11 | 場景 | Ref-S3 廣告牆 | — | — | 5 |
| C12 | 對白 | Ref-P 巡邏員 | Ref-C1 林墨 | Ref-S3 廣告牆 | 11 |
| C13 | 旁白 | Ref-C1 林墨 | — | Ref-S1 邊境 | 14 |
| C14 | 場景 | Ref-S4 轎車內 | Ref-C1 林墨 | — | 3 |
| C15 | 對白 | Ref-C1 林墨 | Ref-S4 轎車內 | Ref-D 司機 | 6 |
| C16 | 對白 | Ref-C1 林墨 | Ref-S4 轎車內 | — | 5 |
| C17 | 對白 | Ref-D 司機 | Ref-S4 轎車內 | Ref-C1 林墨 | 2 |
| C18 | 對白 | Ref-C1 林墨 | Ref-S4 轎車內 | — | 5 |
| C19 | 場景 | Ref-S4 轎車內 | — | Ref-S3 廣告牆 | 5 |

> 未餵 `ref_image_N` 一律省略（勿留空檔名殘留污染，見 v2 §3）。
> Ref-D 未建置時，C15/C17 的 `ref_image_2` 省略，司機以 `Action` 描述代替（接受面貌不穩）。

---

## C0 — 邊境定場（場景，無對白，4 秒）

> **來源**：`story1.md` lines 5–7。

```
subject_definitions:
<Subject 1> is the desolate border wasteland from <Picture 1>:
sun-blasted open land, rusty barbed wire fence stretching to the horizon, scattered burned paper scraps and ash piles on dusty ground.

summary:
Reference-based establishing shot.
Empty border wasteland.
Wide static shot, wind only.
No dialogue.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
No one speaks.
No narration.
No voice-over.

detailed_description:

Visual style:
Cold blue-gray documentary footage.
Static wide angle, gritty film look, harsh midday sun.

[Shot 1]

00:00-00:04

Action:
Huge empty border wasteland, rusty barbed wire fence running to the horizon, dusty ground scattered with burned colorful paper scraps and ash piles, wind sweeping sand, dead silent. No people.

overall_soundscape:
Open desert wind, faint rustle of scattered paper scraps, deep dead silence of a closed border crossing, no speech, no engine.

non_diegetic_music:
A low droning wind-like pad, barely audible, oppressive and still.
```

**參數**：`ref_image_0=output/ch1_beat11_ref_scene/zimage_00012_.png（重用）, duration=4, seed=430001, out=ch1_c0_video`

---

## C1 — 林墨立於鐵絲網（場景，無對白，4 秒）

> **來源**：`story1.md` line 7。

```
subject_definitions:
<Subject 1> is the border economist Lin Mo from <Picture 1>:
thin, middle-aged East Asian male, gray-flecked black hair, short stubble, tired eyes, dark charcoal suit and wrinkled white shirt, no tie, dusty leather shoes.

<Subject 2> is the border wasteland from <Picture 2>:
rusty barbed wire fence, dusty ground, scattered burned paper scraps, wind-blown sand.

summary:
Reference-based border scene.
Static medium shot.
Lin Mo stands at the wire.
No dialogue.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No one speaks.
No narration.
No voice-over.

detailed_description:

Visual style:
Cold blue-gray documentary footage.
Medium shot, shallow depth of field, gritty film look.

[Shot 1]

00:00-00:04

Action:
Lin Mo stands motionless at the rusty barbed wire fence, dusty suit silhouette against the vast wasteland, wind ruffling his hair, gaze fixed past the fence-line. Lip sync none.

overall_soundscape:
Open desert wind, dust sweeping, faint paper rustle, silence of the closed border.

non_diegetic_music:
Low droning wind-like pad, barely audible.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_1=output/ch1_beat11_ref_scene/zimage_00012_.png（重用）, duration=4, seed=430002, out=ch1_c1_video`

---

## C2 — 「那是今年的新版鈔票。」（對白，3 秒）

> **來源**：`story1.md` lines 9–11。巡邏員首次登場。

```
subject_definitions:
<Subject 1> is the border economist Lin Mo from <Picture 1>:
thin, middle-aged East Asian male, gray-flecked black hair, short stubble, tired eyes, dark charcoal suit and wrinkled white shirt, no tie.

<Subject 2> is the border patrolman from <Picture 2>:
late 40s or 50s, weathered sun-darkened face, stubble, dusty olive patrol uniform, indifferent numb expression.

<Subject 3> is the border wasteland from <Picture 3>:
rusty barbed wire fence, a pile of colorful banknotes beyond the wire.

summary:
Reference-based border scene.
Two-shot, pointing gesture.
The patrolman points at new bills.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.
<Subject 3>: fully_preserved.

speaker_constraints:
Only <Subject 2> speaks.
No other character speaks.
No narration.
No voice-over.

detailed_description:

Visual style:
Cold blue-gray documentary footage.
Medium shot, shallow depth of field.

[Shot 1]

00:00-00:03

Action:
The patrolman stands beside the fence and points beyond the wires at a pile of colorful waste banknotes, then nods toward Lin Mo.
Lip sync must follow the line exactly.

Dialogue:
<Subject 2> says:

<d>
[中文]
那是今年的新版鈔票。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.
Open wind, dust, dead border silence.
No other speech.

non_diegetic_music:
Low droning wind-like pad, barely audible.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_1=output/ch1_patrol_ref/zimage_00036_.png（新建）, ref_image_2=output/ch1_beat11_ref_scene/zimage_00012_.png（重用）, duration=3, seed=430003, out=ch1_c2_video`

---

## C3 — 撿起紙幣（場景，無對白，3 秒）

> **來源**：`story1.md` lines 13–15。

```
subject_definitions:
<Subject 1> is the border economist Lin Mo from <Picture 1>:
thin, middle-aged East Asian male, gray-flecked black hair, short stubble, tired eyes, dark charcoal suit and wrinkled white shirt, holding up a brightly colored oversized banknote.

<Subject 2> is the border wasteland from <Picture 2>:
sun-blasted ground, gray ash piles, scattered colorful paper scraps.

summary:
Reference-based border scene.
Low angle crouching shot.
Lin Mo picks a banknote from ash.
No dialogue.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No one speaks.
No narration.
No voice-over.

detailed_description:

Visual style:
Cold blue-gray documentary footage.
Low-angle close medium shot, shallow depth of field, harsh midday light.

[Shot 1]

00:00-00:03

Action:
Lin Mo walks to the waste pile, crouches down, and picks an unburned banknote from the gray ashes, holding it up under the harsh sunlight, the vivid bill stark against the grey cinders.

overall_soundscape:
Wind, faint ash rustle, the slight fabric sound of his suit, dead border silence.

non_diegetic_music:
Low droning pad with a single sparse piano note.
```

**參數**：`ref_image_0=output/ch1_beat11_ref_char/zimage_00011_.png（重用）, ref_image_1=output/ch1_beat11_ref_scene/zimage_00012_.png（重用）, duration=3, seed=430004, out=ch1_c3_video`

---

## C4 — 千萬紙幣（旁白，17 秒）

> **旁白全文（約 84 字，5 字/秒 ≈ 17s）**：
> 「那是一張面額一千萬的索利亞幣，紙質薄得像廉價的面紙。正面印著現任元首激昂的半身像，
> 背景是象徵革命的紅星與繁榮的齒輪。背面用華麗的字體印著一行口號：主權是唯一的食糧，尊嚴是永恆的財富。」
>
> ⚠️ 面額寫**中文數字**「一千萬」（`<d>` 內禁阿拉伯數字）；畫面文字與發音無關。

```
subject_definitions:
<Subject 1> is the border economist Lin Mo from <Picture 1>:
thin, middle-aged East Asian male, gray-flecked black hair, dark charcoal suit, holding a colorful oversized banknote in his hand.

<Subject 2> is the border wasteland from <Picture 2>:
sun-blasted ground, gray ash, scattered paper scraps.

summary:
Reference-based montage narration.
Handheld micro-shake, slow montage.
No character speaks in frame.
The banknote is narrated.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No character speaks in frame.
Narration by the fixed narrator voice only.
No on-screen mouth movement.

detailed_description:

Visual style:
Cold blue-gray documentary footage.
Handheld micro-shake, slow montage, macro close-ups.

[Shot 1]

00:00-00:06

Action:
Close-up of the banknote held in Lin Mo's dusty hand, the paper thin like tissue, trembling slightly in the wind.

Narration:
<Narrator> says:

<d>
[中文]
那是一張面額一千萬的索利亞幣，紙質薄得像廉價的面紙。
</d>

[Shot 2]

00:06-00:11

Action:
Macro shot of the front of the bill: the current leader's passionate half-length portrait, red star and bright gear symbols behind him.

Narration:
<Narrator> says:

<d>
[中文]
正面印著現任元首激昂的半身像，背景是象徵革命的紅星與繁榮的齒輪。
</d>

[Shot 3]

00:11-00:17

Action:
Macro shot tilting across the back of the bill, ornate type setting of a slogan line.

Narration:
<Narrator> says:

<d>
[中文]
背面用華麗的字體印著一行口號：主權是唯一的食糧，尊嚴是永恆的財富。
</d>

overall_soundscape:
Narration delivered in a low, calm, middle-aged male voice, Taiwan-accented Standard Mandarin (台灣腔普通話), read flat at a steady pace, not character dialogue, not on-screen voice, no Cantonese.
No character speaks in frame.
Wind over the border, thin paper flapping.

non_diegetic_music:
A low cello line with sparse piano notes, steady and slow through the montage.
```

**參數**：`ref_image_0=output/ch1_beat11_ref_char/zimage_00011_.png（重用）, ref_image_1=output/ch1_beat11_ref_scene/zimage_00012_.png（重用）, duration=17, seed=310000（旁白專用，見第 6 節）, out=ch1_c4_video`

---

## C5 — 「主權確實很沉重…」（對白，4 秒）

> **來源**：`story1.md` line 17。

```
subject_definitions:
<Subject 1> is the border economist Lin Mo from <Picture 1>:
thin, middle-aged East Asian male, gray-flecked black hair, short stubble, tired eyes, dark charcoal suit, holding a colorful oversized banknote.

<Subject 2> is the border wasteland from <Picture 2>:
sun-blasted ground, gray ash, a pile of colorful banknote scraps.

summary:
Reference-based border scene.
Close-up shot.
Lin Mo murmurs to himself.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks.
No other character speaks.
No narration.
No voice-over.

detailed_description:

Visual style:
Cold blue-gray documentary footage.
Close-up, shallow depth of field.

[Shot 1]

00:00-00:04

Action:
Close-up of Lin Mo's face as he looks down at the bill in his hand and mutters to himself in a low, quiet voice, eyes half-lidded.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
主權確實很沉重，但它顯然填不飽肚子。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.
Wind, faint paper flap, dead border silence.
No other speech.

non_diegetic_music:
A low cello note with a sparse piano touch, quiet.
```

**參數**：`ref_image_0=output/ch1_beat11_ref_char/zimage_00011_.png（重用）, ref_image_1=output/ch1_beat11_ref_scene/zimage_00012_.png（重用）, duration=4, seed=430005, out=ch1_c5_video`

---

## C6 — 難民換水（場景，無對白，6 秒）

> **來源**：`story1.md` lines 19–21（前半）。

```
subject_definitions:
<Subject 1> is the border crossing wasteland with refugees from <Picture 1>:
sun-blasted ground, a group of thin desperate refugees crouching in shadow, clutching thick stacks of bright colorful banknotes, a weathered smuggler in a dusty vest, a small fire stove.

summary:
Reference-based border scene.
Medium-wide shot, harsh light.
No dialogue.
Refugees trade a fortune for water.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
No one speaks.
No narration.
No voice-over.

detailed_description:

Visual style:
Cold harsh daylight, gritty documentary photojournalism.
Medium-wide shot, hand-held micro-shake.

[Shot 1]

00:00-00:06

Action:
Refugees crouch in the shadow of rusted structures clutching thick bundles of colorful banknotes; one refugee extends a stack worth several mansions toward the smuggler, who half-heartedly offers a half bottle of expired mineral water. The exchange hangs frozen mid-gesture.

overall_soundscape:
Wind, low ragged refugee murmurs and coughs (non-verbal), bottle clink, paper rustle, distant metal creak.

non_diegetic_music:
Low droning pad, faint, hollow.
```

**參數**：`ref_image_0=output/ch1_beat12_ref_zit/zimage_00013_.png（重用）, duration=6, seed=430006, out=ch1_c6_video`

---

## C7 — 廢紙墊火爐（場景，無對白，3 秒）

> **來源**：`story1.md` line 21。

```
subject_definitions:
<Subject 1> is the stove and hands exchange from <Picture 1>:
a pair of grimy trembling hands holding thick colorful banknotes, a weathered smuggler holding up a half bottle of water, a rusty small stove burning sheets of the same rainbow paper, orange flames and rising embers.

summary:
Reference-based border close-up.
Tight shot, firelight.
No dialogue.
The smuggler burns the bills.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
No one speaks.
No narration.
No voice-over.

detailed_description:

Visual style:
Gritty documentary photojournalism, harsh cold daylight with warm firelight contrast.
Tight shot.

[Shot 1]

00:00-00:03

Action:
The smuggler does not count the bills; he feeds sheets of the "national glory" paper into the rusty stove, the colorful prints blackening and curling as orange flames lick up, embers rising into the dusty air.

overall_soundscape:
Crackling fire, paper catching and burning, faint wind, ember hiss.

non_diegetic_music:
N/A
```

**參數**：`ref_image_0=output/ch1_beat12_ref_zit/zimage_00014_.png（重用）, duration=3, seed=430007, out=ch1_c7_video`

---

## C8 — 「別看了，他們贏了…」（對白，13 秒）

> **來源**：`story1.md` line 23（全文）。

```
subject_definitions:
<Subject 1> is the border patrolman from <Picture 1>:
late 40s or 50s, weathered sun-darkened face, stubble, dusty olive patrol uniform, numb indifferent expression.

<Subject 2> is the border economist Lin Mo from <Picture 2>:
thin, middle-aged East Asian male, gray-flecked black hair, dark charcoal suit, dusted shoes.

<Subject 3> is the border wasteland from <Picture 3>:
rusty barbed wire fence, gray ash piles, scattered colorful paper scraps.

summary:
Reference-based border scene.
Medium two-shot, slow push-in.
The patrolman reflects on the collapse.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.
<Subject 3>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks.
No other character speaks.
No narration.
No voice-over.

detailed_description:

Visual style:
Cold blue-gray documentary footage.
Medium two-shot with slow push-in, shallow depth of field.

[Shot 1]

00:00-00:06

Action:
The patrolman pats dust off his uniform, half-turns to Lin Mo, and speaks in a numb habitual tone, gesturing loosely at the waste pile beyond the wire.
Lip sync must follow the lines exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
林博士，別看了。
三年前，那邊的人也跟我們一樣，每天在網路上爭論誰才是更愛國的人。
</d>

[Shot 2]

00:06-00:13

Action:
Cut to a wider view of both men with the rubbish pile of paper money behind them; wind stirring ash.
Lip sync continues for the remaining lines.

Dialogue:
<Subject 1> says:

<d>
[中文]
後來，他們贏了，贏得只剩下這堆廢紙。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.
Open wind, dust, faint paper rustle.
No other speech.

non_diegetic_music:
Low cello line with sparse piano notes, steady and slow.
```

**參數**：`ref_image_0=output/ch1_patrol_ref/zimage_00036_.png（新建）, ref_image_1=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_2=output/ch1_beat11_ref_scene/zimage_00012_.png（重用）, duration=13, seed=430008, out=ch1_c8_video`

---

## C9 — 折入口袋（場景，無對白，4 秒）

> **來源**：`story1.md` line 25。

```
subject_definitions:
<Subject 1> is the border economist Lin Mo from <Picture 1>:
thin, middle-aged East Asian male, gray-flecked black hair, dark charcoal suit, holding a colorful banknote at his chest.

<Subject 2> is the border wasteland from <Picture 2>:
dusty open ground, gray ash, wire fence line.

summary:
Reference-based border scene.
Medium shot.
Lin Mo secures the bill.
No dialogue.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No one speaks.
No narration.
No voice-over.

detailed_description:

Visual style:
Cold blue-gray documentary footage.
Medium shot, shallow depth of field.

[Shot 1]

00:00-00:04

Action:
Lin Mo folds the ten-million banknote neatly and slips it into the inner pocket of his suit, then raises his head, eyes turning toward the federal side of the border.

overall_soundscape:
Wind, faint fabric rustle of the suit, dead border silence.

non_diegetic_music:
Low droning pad, barely audible.
```

**參數**：`ref_image_0=output/ch1_beat11_ref_char/zimage_00011_.png（重用）, ref_image_1=output/ch1_beat11_ref_scene/zimage_00012_.png（重用）, duration=4, seed=430009, out=ch1_c9_video`

---

## C10 — 「他們不是贏了。」（對白，2 秒）

> **來源**：`story1.md` line 27（上半）。

```
subject_definitions:
<Subject 1> is the border economist Lin Mo from <Picture 1>:
thin, middle-aged East Asian male, gray-flecked black hair, short stubble, tired eyes, dark charcoal suit.

summary:
Reference-based border scene.
Close-up shot.
Lin Mo speaks one cold line.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks.
No other character speaks.
No narration.
No voice-over.

detailed_description:

Visual style:
Cold blue-gray documentary footage.
Close-up, shallow depth of field.

[Shot 1]

00:00-00:02

Action:
Tight close-up of Lin Mo's eyes as he lifts his head toward the federal side; a cold, brief statement, gaze traveling just off-camera toward the billboard glow in the distance.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
他們不是贏了，
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.
Wind, dead border silence.
No other speech.

non_diegetic_music:
A low cello note, quiet and cold.
```

**參數**：`ref_image_0=output/ch1_beat11_ref_char/zimage_00011_.png（重用）, duration=2, seed=430010, out=ch1_c10_video`

---

## C11 — 廣告牆標語（場景，無對白，5 秒）

> **來源**：`story1.md` lines 29–31。**畫面文字**（不被唸出，見 v2 §5.4）。

```
subject_definitions:
<Subject 1> is the giant electronic advertisement wall from <Picture 1>:
towering LED screen on a mast above a dusty road, glowing hot-red Chinese propaganda characters, luminous cold-blue night-less daylight backdrop.

summary:
Reference-based exterior scene.
Upward low-angle shot.
No dialogue.
The billboard plays the ruling-party propaganda.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
No one speaks.
No narration.
No voice-over.

detailed_description:

Visual style:
Cold blue-gray documentary footage.
Dramatic monumental low-angle, steady shot.

[Shot 1]

00:00-00:05

Action:
The giant LED billboard animation plays: a bespectacled opposition scholar drawn as a copper-smelling black crow pecking at seedlings symbolizing the nation's future. Below the animation, a huge red scrolling slogan reads "警惕！數據是外敵瓦解我們團結的毒藥，唯有立場才是守護家園的盾牌。" (visible on-screen text, not read aloud).

overall_soundscape:
LED screen electronic hum, distant wind, no speech.

non_diegetic_music:
Low sustained drone, cold and faintly threatening.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_scene/zimage_00009_.png（重用）, duration=5, seed=430011, out=ch1_c11_video`

---

## C12 — 「那是執政黨這週的新文宣…」（對白，11 秒）

> **來源**：`story1.md` line 33（全文）。

```
subject_definitions:
<Subject 1> is the border patrolman from <Picture 1>:
late 40s or 50s, weathered sun-darkened face, stubble, dusty olive patrol uniform, a hint of pride in his eyes.

<Subject 2> is the border economist Lin Mo from <Picture 2>:
thin, middle-aged East Asian male, gray-flecked black hair, dark charcoal suit, silent cold gaze.

<Subject 3> is the advertisement wall from <Picture 3>:
towering LED screen with glowing red Chinese propaganda characters.

summary:
Reference-based border scene.
Medium two-shot, billboard glow.
The patrolman praises the new propaganda.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.
<Subject 3>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks.
No other character speaks.
No narration.
No voice-over.

detailed_description:

Visual style:
Cold blue-gray documentary footage.
Medium two-shot, shallow depth of field, billboard light rim on faces.

[Shot 1]

00:00-00:11

Action:
The patrolman, with a faint smug pride, tilts his chin toward the billboard and speaks; behind him the red slogan glows. Lin Mo stays silent, face cold.
Lip sync must follow the lines exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
那是執政黨這週的新文宣，說得真好，不是嗎？
現在社會上那些質疑預算流向的人，真的都很像賣國賊。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.
Wind, LED screen hum, dust.
No other speech.

non_diegetic_music:
Low droning pad with an uneasy cello line.
```

**參數**：`ref_image_0=output/ch1_patrol_ref/zimage_00036_.png（新建）, ref_image_1=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_2=output/ch1_beat13_ref_scene/zimage_00009_.png（重用）, duration=11, seed=430012, out=ch1_c12_video`

---

## C13 — 寒意：數據停止流動（旁白，14 秒）

> **旁白全文（約 69 字，5 字/秒 ≈ 14s）**：
> 「林墨沒有回答，只感到一股沒來由的寒意。他想起索利亞崩潰前夕：政府禁止任何人傳播悲觀數據，
> 提告所有拍攝空貨架的人。當數據停止流動，文明的血液就開始凝固。」

```
subject_definitions:
<Subject 1> is the border economist Lin Mo from <Picture 1>:
thin, middle-aged East Asian male, gray-flecked black hair, short stubble, cold still expression, dark charcoal suit.

<Subject 2> is the border wasteland from <Picture 2>:
dusty open ground, gray ash, drifting scraps, wire fence line.

summary:
Reference-based montage narration.
Slow dolly, drifting ash.
No character speaks in frame.
Cold memory narration only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No character speaks in frame.
Narration by the fixed narrator voice only.
No on-screen mouth movement.

detailed_description:

Visual style:
Cold blue-gray documentary footage.
Slow dolly, drifting ash, shallow depth of field.

[Shot 1]

00:00-00:05

Action:
Lin Mo stands motionless in the wind, silent, a cold discomfort crossing his tired eyes.

Narration:
<Narrator> says:

<d>
[中文]
林墨沒有回答，只感到一股沒來由的寒意。
</d>

[Shot 2]

00:05-00:10

Action:
Slow dolly across the waste pile, gray ash drifting and curling in the air, burned paper scraps rolling along the ground.

Narration:
<Narrator> says:

<d>
[中文]
他想起索利亞崩潰前夕：政府禁止任何人傳播悲觀數據，提告所有拍攝空貨架的人。
</d>

[Shot 3]

00:10-00:14

Action:
The drifting ash blurs out of focus into darkness, a single red slogan reflection fading in a dusty puddle and dimming to black.

Narration:
<Narrator> says:

<d>
[中文]
當數據停止流動，文明的血液就開始凝固。
</d>

overall_soundscape:
Narration delivered in a low, calm, middle-aged male voice, Taiwan-accented Standard Mandarin (台灣腔普通話), read flat at a steady pace, not character dialogue, not on-screen voice, no Cantonese.
No character speaks in frame.
Wind, ash rustle, fading into silence.

non_diegetic_music:
A low cello line with sparse piano notes, sinking steadily into near-silence.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_1=output/ch1_beat11_ref_scene/zimage_00012_.png（重用）, duration=14, seed=310000（旁白專用，見第 6 節）, out=ch1_c13_video`

---

## C14 — 上車（場景，無對白，3 秒）

> **來源**：`story1.md` line 41（前段）。

```
subject_definitions:
<Subject 1> is the rear cabin of a black sedan from <Picture 1>:
worn dark fabric seats, grey door panel, dusk light through a side window, blurred roadside banners outside.

<Subject 2> is the border economist Lin Mo from <Picture 2>:
thin, middle-aged East Asian male, gray-flecked black hair, dark charcoal suit.

summary:
Reference-based interior scene.
Static seat-level shot.
Lin Mo gets into the car.
No dialogue.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No one speaks.
No narration.
No voice-over.

detailed_description:

Visual style:
Cold dusk interior light, photorealistic film still.
Seat-level shot, shallow depth of field.

[Shot 1]

00:00-00:03

Action:
Lin Mo opens the door of the black sedan and settles into the back seat; the driver glances at the rear-view mirror; the door closes with a soft thud, dusk light dimming the cabin.

overall_soundscape:
Car door thud, engine idle hum, distant fading wind, seat leather creak.

non_diegetic_music:
Low sustained cello note, quiet.
```

**參數**：`ref_image_0=output/ch1_beat14_ref_scene/zimage_00010_.png（重用）, ref_image_1=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, duration=3, seed=430014, out=ch1_c14_video`

---

## C15 — 「要回議會了嗎？」（對白，6 秒）

> **來源**：`story1.md` line 41（司機台詞）。

```
subject_definitions:
<Subject 1> is the border economist Lin Mo from <Picture 1>:
thin, middle-aged East Asian male, gray-flecked black hair, dark charcoal suit, seated in a car.

<Subject 2> is the rear cabin of the black sedan from <Picture 2>:
worn dark fabric seats, grey door panel, dusk light through the side window.

<Subject 3> is the federal chauffeur from <Picture 3>:
early 40s, neat short hair, plain grey suit, calm flat expression, eyes in the rear-view mirror.

summary:
Reference-based interior scene.
Two-shot through the mirror.
The driver asks about the assembly vote.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.
<Subject 3>: fully_preserved.

speaker_constraints:
Only <Subject 3> speaks.
No other character speaks.
No narration.
No voice-over.

detailed_description:

Visual style:
Cold dusk interior light, photorealistic film still.
Medium shot with the mirror reflecting the driver's eyes.

[Shot 1]

00:00-00:06

Action:
The driver glances at Lin Mo in the rear-view mirror and asks whether they should return to the assembly; Lin Mo sits back with eyes closed, listening.
Lip sync must follow the lines exactly.

Dialogue:
<Subject 3> says:

<d>
[中文]
林立委，我們要回議會了嗎？
明天是《國安資訊增補案》的表決。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.
Engine idle hum, low cabin murmur.
No other speech.

non_diegetic_music:
Low sustained cello note, quiet.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_1=output/ch1_beat14_ref_scene/zimage_00010_.png（重用）, ref_image_2=output/ch1_driver_ref/zimage_00037_.png（新建）, duration=6, seed=430015, out=ch1_c15_video`

---

## C16 — 「不，回研究室…」（對白，5 秒）

> **來源**：`story1.md` line 43。

```
subject_definitions:
<Subject 1> is the border economist Lin Mo from <Picture 1>:
thin, middle-aged East Asian male, gray-flecked black hair, dark charcoal suit, eyes closed, one hand resting on the inner pocket.

<Subject 2> is the rear cabin of the black sedan from <Picture 2>:
worn dark fabric seats, grey door panel, dusk light through the side window.

summary:
Reference-based interior scene.
Close medium shot.
Lin Mo redirects the route.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks.
No other character speaks.
No narration.
No voice-over.

detailed_description:

Visual style:
Cold dusk interior light, photorealistic film still.
Close medium shot, shallow depth of field.

[Shot 1]

00:00-00:05

Action:
Lin Mo, eyes still closed, feels the folded bill through his suit pocket fabric and answers in a low firm voice.
Lip sync must follow the lines exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
不。
回研究室。
我要把那份草案的序言重新寫一遍。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.
Engine idle hum, low cabin murmur.
No other speech.

non_diegetic_music:
Low sustained cello note, quiet.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_1=output/ch1_beat14_ref_scene/zimage_00010_.png（重用）, duration=5, seed=430016, out=ch1_c16_video`

---

## C17 — 「哪份草案？」（對白，2 秒）

> **來源**：`story1.md` line 45。

```
subject_definitions:
<Subject 1> is the federal chauffeur from <Picture 1>:
early 40s, neat short hair, plain grey suit, calm flat expression, curious glance.

<Subject 2> is the rear cabin of the black sedan from <Picture 2>:
worn dark fabric seats, grey door panel, dusk light through the side window.

<Subject 3> is the border economist Lin Mo from <Picture 3>:
thin, middle-aged East Asian male, gray-flecked black hair, dark charcoal suit.

summary:
Reference-based interior scene.
Mirror close shot.
The driver asks one question.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.
<Subject 3>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks.
No other character speaks.
No narration.
No voice-over.

detailed_description:

Visual style:
Cold dusk interior light, photorealistic film still.
Mirror close-up.

[Shot 1]

00:00-00:02

Action:
The driver's face turns slightly in the front seat, asking a short curious question; Lin Mo begins to open his eyes.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
哪份草案？
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.
Engine idle hum.
No other speech.

non_diegetic_music:
Low sustained cello note, quiet.
```

**參數**：`ref_image_0=output/ch1_driver_ref/zimage_00037_.png（新建）, ref_image_1=output/ch1_beat14_ref_scene/zimage_00010_.png（重用）, ref_image_2=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, duration=2, seed=430017, out=ch1_c17_video`

---

## C18 — 「讓政府閉嘴，讓數據說話」（對白，5 秒）

> **來源**：`story1.md` lines 47–49（金句收束）。

```
subject_definitions:
<Subject 1> is the border economist Lin Mo from <Picture 1>:
thin, middle-aged East Asian male, gray-flecked black hair, dark charcoal suit, eyes open reflecting passing roadside slogans.

<Subject 2> is the rear cabin of the black sedan from <Picture 2>:
worn dark fabric seats, grey door panel, dusk light, blurred glowing slogans sliding past the side window.

summary:
Reference-based interior scene.
Close-up shot.
Lin Mo states the plan.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks.
No other character speaks.
No narration.
No voice-over.

detailed_description:

Visual style:
Cold dusk interior light, photorealistic film still.
Close-up, shallow depth of field, light streaks moving past.

[Shot 1]

00:00-00:05

Action:
Lin Mo opens his eyes, the blurry roadside political slogans reflecting in his pupils as he states the plan in a low, resolute voice.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
一份關於如何讓政府閉嘴，讓數據說話的法案。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.
Engine muffled hum, cabin quiet.
No other speech.

non_diegetic_music:
Low cello line rising slightly, resolved and cold.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_1=output/ch1_beat14_ref_scene/zimage_00010_.png（重用）, duration=5, seed=430018, out=ch1_c18_video`

---

## C19 — 車離去（場景，無對白，5 秒）

> **來源**：`story1.md` line 51。

```
subject_definitions:
<Subject 1> is the black sedan rear cabin from <Picture 1>:
worn dark fabric seats, dusk light through blurred windows.

<Subject 2> is the billboard edge of the border road from <Picture 2>:
a towering LED wall glowing above a dusty highway, fading heat haze.

summary:
Reference-based exterior scene.
Tracking shot, receding distance.
The car leaves the border.
No dialogue.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No one speaks.
No narration.
No voice-over.

detailed_description:

Visual style:
Cold blue-gray documentary footage.
Tracking shot accelerating away, heat-haze blur, slow re-focus to the horizon.

[Shot 1]

00:00-00:05

Action:
The black sedan accelerates away from the wasted border, roadside propaganda billboards sliding past in a blur, the vehicle receding into the heat haze of the highway, heading toward the distant capital.

overall_soundscape:
Engine accelerating, wind rush rising, border noise fading behind.

non_diegetic_music:
Low cello line with sparse piano notes, steady, closing out the chapter.
```

**參數**：`ref_image_0=output/ch1_beat14_ref_scene/zimage_00010_.png（重用）, ref_image_1=output/ch1_beat13_ref_scene/zimage_00009_.png（重用）, duration=5, seed=430019, out=ch1_c19_video`

---

## 六、旁白 seed 鎖定與腔調錨點（C0–C19 全部以此為準）

- **旁白專用 seed = `310000`**（與 Ch2 同一顆）：C4、C13 沿用。先出一支 5–8 秒純旁白測試格確認
  聲線（低沉、冷靜、中年男聲、台灣腔），歪粵腔即記入黑名單換候選，標定成功才鎖定。
- **對白控制點**：`overall_soundscape` 首句寫 `Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.`
- **旁白控制點**：`overall_soundscape` 逐字重複同一組聲線描述（見 C4/C13），seed＋文字雙鎖定。
- **黑名單（實測歪粵腔 seed）**：目前沿用 `310009`（Ch2 記入）；Ch1 新 seed（4300xx）若實測歪腔，
  立即記入本節並換 seed 重跑。
- C0/C1/C3/C6/C7/C9/C11/C14/C19 為純場景區塊，無音訊需錨定，`soundscape` 不帶腔調錨點。
- `<d>` 語言標籤維持 `[中文]` 不改；`<d>` 內凡被唸出的文字禁用 `%`／阿拉伯數字（已全改中文數字）。

---

## 七、字幕資料表（區塊順序、起始秒、逐字字幕）

> 規劃累積起點；合併後以 `scale = 實際總秒數 / 119` 換算實際起點（見 v2 §6.5）。場景區塊無字幕。

| 區塊 | 類型 | 規劃秒 | 累積起點 | 字幕文字 | 斜體 |
|------|------|--------|----------|---------|------|
| C0 | 場景 | 4 | 0s | （無字幕） | — |
| C1 | 場景 | 4 | 4s | （無字幕） | — |
| C2 | 對白 | 3 | 8s | 那是今年的新版鈔票。 | — |
| C3 | 場景 | 3 | 11s | （無字幕） | — |
| C4 | 旁白 | 17 | 14s | 那是一張面額一千萬的索利亞幣，紙質薄得像廉價的面紙。／正面印著現任元首激昂的半身像，背景是象徵革命的紅星與繁榮的齒輪。／背面用華麗的字體印著一行口號：主權是唯一的食糧，尊嚴是永恆的財富。 | ✅ |
| C5 | 對白 | 4 | 31s | 主權確實很沉重，但它顯然填不飽肚子。 | — |
| C6 | 場景 | 6 | 35s | （無字幕） | — |
| C7 | 場景 | 3 | 41s | （無字幕） | — |
| C8 | 對白 | 13 | 44s | 林博士，別看了。三年前，那邊的人也跟我們一樣，每天在網路上爭論誰才是更愛國的人。後來，他們贏了，贏得只剩下這堆廢紙。 | — |
| C9 | 場景 | 4 | 57s | （無字幕） | — |
| C10 | 對白 | 2 | 61s | 他們不是贏了， | — |
| C11 | 場景 | 5 | 63s | （無字幕） | — |
| C12 | 對白 | 11 | 68s | 那是執政黨這週的新文宣，說得真好，不是嗎？現在社會上那些質疑預算流向的人，真的都很像賣國賊。 | — |
| C13 | 旁白 | 14 | 79s | 林墨沒有回答，只感到一股沒來由的寒意。／他想起索利亞崩潰前夕：政府禁止任何人傳播悲觀數據，提告所有拍攝空貨架的人。／當數據停止流動，文明的血液就開始凝固。 | ✅ |
| C14 | 場景 | 3 | 93s | （無字幕） | — |
| C15 | 對白 | 6 | 96s | 林立委，我們要回議會了嗎？明天是《國安資訊增補案》的表決。 | — |
| C16 | 對白 | 5 | 102s | 不。回研究室。我要把那份草案的序言重新寫一遍。 | — |
| C17 | 對白 | 2 | 107s | 哪份草案？ | — |
| C18 | 對白 | 5 | 109s | 一份關於如何讓政府閉嘴，讓數據說話的法案。 | — |
| C19 | 場景 | 5 | 114s | （無字幕） | — |

---

## 八、產出前自檢（C0–C19）

- [ ] 每個區塊只含一個主要事件；對白每支 ≤ 2 句承載。
- [ ] 對白/旁白逐字對照 `story1.md` 第一章（lines 3–51），無省略、無自創。
- [ ] `<d>` 內被唸文字皆中文數字（面額「一千萬」），無 `%`／阿拉伯數字。
- [ ] 場景區塊（C0/C1/C3/C6/C7/C9/C11/C14/C19）完全不寫 `<d>`、僅環境音。
- [ ] 對白區塊指名 `Only <Subject N> speaks`、排除旁白；旁白區塊（C4/C13）畫面角色不開口、
      用 `<Narrator>` 標記、共用 seed 310000。
- [ ] 每支對白/旁白區塊的 `overall_soundscape` 帶台灣腔錨點句；seed 已查黑名單。
- [ ] 參考圖：Ref-P（`zimage_00036_`）已建置，C2/C8/C12 已帶入；Ref-D（`zimage_00037_`）已建置，C15/C17 已帶入。
- [ ] 未餵 `ref_image_N` 一律省略（無殘留污染，v2 §三）。
- [ ] 解析度全片統一 352×608（r2v workflow 預設）；合併順序 C0→C19。
- [ ] 合併後以實際總長 scale 換算 SRT；旁白字幕包 `<i>...</i>`。

> **下一步**：依「區塊 × 參考圖對照」逐支 `gen_r2v_video` 提交（C0→C19），全部完成後依序
> `merge_videos(files=[C0…C19], resolution="352:608", out="ch1_full")`，並以總表資料產出 Ch1 SRT。