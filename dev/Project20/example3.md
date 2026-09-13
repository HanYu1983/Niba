# Ch2 區塊獨立提示詞 — B0–B5（實作範例 3：每區塊一支 r2v，參考圖統一管理）

> 本範例承接 example2.md 的「總表：區塊分割與計秒」，將每個區塊視為**一支獨立的 r2v**，
> 並建立統一的參考圖管理表——角色/場景肖像一次性生成後，各區塊按表引用。
> 本文件完成 B0 艾倫身世旁白區塊 + B1–B5（共 70 秒）。

---

## 與 example2 的關鍵差異

| | example2（beat 合併） | example3（區塊獨立） |
|---|---|---|
| 粒度 | 4 支 r2v，每支 36–47s | 27 支 r2v，每支 1–18s |
| 腔調風險 | 同支內 seed 統一、腔調穩定 | 每支獨立 seed、腔調需逐支錨定 |
| 精細控制 | 無法替換單個鏡頭 | 任何一塊出錯只重跑該塊 |
| 參考圖 | 兩張共用（角色+場景） | 同樣共用，但按需求可帶額外場景圖 |

---

## 參考圖管理表（Step 1：一次性建置）

> 以下角色/場景肖像以 `gen_zit_image`（Z-Image）於先前步驟統一生成並存放於 `output/` 下各參考目錄，
> 每支 r2v 透過 `ref_image_0 / ref_image_1 / ref_image_2` 重複取用，不重出圖。

| 編號 | 檔名（實際既有） | 內容 | 尺寸建議 | 用途 |
|------|------|------|----------|------|
| Ref-C1 | `output/ch1_beat13_ref_char/zimage_00008_.png` | 林墨肖像：瘦削中年男性、黑髮灰絲、淺鬍茬、深炭灰西裝、皺白襯衫 | 832×1248 (2:3) | 所有含林墨的區塊 |
| Ref-C2 | `output/ch2_prosecutor_ref/zimage_00017_.png` | 檢察官肖像：中年男性、削瘦、銳利眼神、深色法袍、胸針 | 832×1248 | B3、B5 |
| Ref-C3 | `output/ch2_allen_ref/zimage_00015_.png` | 艾倫肖像：19 歲少年、瘦弱、短髮、白色襯衫、恐懼表情 | 832×1248 | B4 |
| Ref-C4 | `output/ch2_judge_ref/zimage_00032_.png` | 法官肖像：老年男性、銀髮、法袍、嚴肅 | 832×1248 | B10、B24（法官特寫） |
| Ref-S1 | `output/ch2_court_ref/zimage_00016_.png` | 最高法院第三審判庭全景：圓頂大廳、分裂旁聽席、紅衣左/噤聲右、憲法石牆 | 832×1248 | B1、B2、B3、B5 等全景/坐席區塊 |
| Ref-S2 | `ch2_refs/scene_court_defense.png` | 辯護席區域：木質桌椅、近法官席 | 832×1248 | B2、B8 等辯護席區塊（先用 Ref-S1 代用） |
| Ref-S3 | `output/ch2_camerawall_ref/zimage_00033_.png` | 法庭頂端直播攝影機與天花板結構 | 832×1248 | B20 |
| Ref-S4 | `output/ch2_exit_ref/zimage_00034_.png` | 法庭門外走廊：石柱、記者群 | 832×1248 | B26、B27、B28 |
| Ref-S5 | `output/ch2_tvwall_ref/zimage_00035_.png` | 法庭外電視牆：黑色標題滾動 | 832×1248 | B29 |

> **建置方式**：每張以 `gen_zit_image`（Z-Image，832×1248 直式 2:3）生成，prompt 中明確指定角色外觀
> 錨點（與 guide §5.3 一致）。Z-Image 出圖直接 2:3，r2v `ref_image_size: match` 縮放時不切構圖重點。
> 所有圖尺寸統一 832×1248（2:3 比例），確保 r2v 輸出不裁切。

---

## 總表：區塊分割與計秒（含旁白區塊）

> 承接 example2.md 的 B1–B27（鏡頭區塊：場景 1–5s、對白照字數計秒；區塊可交錯），
> 額外分出**旁白區塊**（純旁白，5 字/秒計秒）並重新以 B 開頭編碼：B0、B7、B22。
> 對白/旁白計秒：台灣腔普通話慢讀約 **4 字/秒**；旁白略快更平約 **5 字/秒**。

| # | 類型 | 內容 | 秒 |
|---|------|------|----|
| B0 | 旁白 | 艾倫身世：十九歲、數據科學系學生、罪名與 2% vs 15% 對照圖（全文見 B0 詳述） | 23 |
| B1 | 場景 | 最高法院第三審判庭全景：圓頂、挑高、紅衣左／噤聲右 | 4 |
| B2 | 場景 | 林墨坐辯護席後，視線越過群眾望向被告席少年艾倫 | 5 |
| B3 | 對白 | 檢察官質問艾倫（62字） | 15 |
| B4 | 對白 | 艾倫顫抖（27字） | 7 |
| B5 | 對白 | 檢察官冷笑轉向陪審團：「真實？…這不是科學，這是背叛。」（70字） | 16 |
| B6 | 場景 | 紅衣旁聽席爆出掌聲；法官敲槌未制止 | 8 |
| B7 | 旁白 | 「林墨在辯護席後方坐了很久。他等的，就是讓檢察官把話全部說出來的那一刻。」（約34字） | 7 |
| B8 | 場景 | 林墨緩緩站起，不看檢察官，看向憲法牆 | 5 |
| B9 | 對白 | 林墨：「法官閣下，辯方要求傳喚一名關鍵證人。」（16字） | 4 |
| B10 | 對白 | 法官：「誰？」（1字） | 1 |
| B11 | 對白 | 林墨：「聯邦統計局局長。以及，這份訴狀中『官方核實數據』的原始運算公式。」（29字） | 7 |
| B12 | 場景 | 法庭陷入沉默，檢察官臉色微變 | 3 |
| B13 | 對白 | 檢察官：「這涉及國家機密，官方數據的運算模型受《安全法》保護，無須公開。」（31字） | 8 |
| B14 | 對白 | 林墨：「如果數據不能被質疑，那它就不是數據，而是教條。」（24字） | 5 |
| B15 | 對白 | 林墨：「今天，你們以『不實資訊』起訴這名少年。但在法律上，要證明他的資訊為『假』，你們必須先證明官方的資訊為『真』。請告訴我，那百分之二的通膨率，是否包含了房租、能源與進口糧食？還是你們在運算時，刻意剔除了一切會讓數字難看的變數？」（94字） | 23 |
| B16 | 場景 | 林墨在原地站定，法庭寂靜 | 4 |
| B17 | 對白 | 檢察官拍桌：「你這是在擾亂視聽！這是立場問題！你到底是站在聯邦這一邊，還是站在那些想看我們崩潰的人那一邊？」（43字） | 10 |
| B18 | 場景 | 紅衣群眾叫囂：「標籤他！他也是賣國賊！」（群聲，不蓋對白） | 7 |
| B19 | 對白 | 林墨轉過身，對艾倫：「別低頭，這不是你的審判。」（11字） | 3 |
| B20 | 場景 | 林墨望向法庭頂端直播攝影機 | 3 |
| B21 | 對白 | 林墨（對全國直播）：104 字宣言 | 26 |
| B22 | 旁白 | 「那張印著領袖頭像的千萬廢紙，在邊境連半瓶水都換不到。林墨把它帶到了法庭上。」（約34字） | 7 |
| B23 | 場景 | 林墨掏出那張印著領袖頭像的千萬廢紙，高舉過頭 | 6 |
| B24 | 場景 | 法官宣布休庭，艾倫被法警帶走 | 4 |
| B25 | 對白 | 林墨：「我在南方的鄰居那學到一件事：標籤不能當飯吃…」（64字） | 15 |
| B26 | 場景 | 走出法庭，麥克風包圍 | 3 |
| B27 | 對白 | 記者三問：「你真的要在下週推動那個法案嗎？」「你這是在公然挑釁司法權嗎？」「有人說你收了外國政府的錢，才要破壞聯邦的團結，你怎麼回應？」（62字） | 14 |
| B28 | 對白 | 林墨：「我沒收錢，我只是不想在未來的某一天…（47字）」 | 12 |
| B29 | 場景 | 電視牆滾動標題《數據修正主義者的野心：林墨與其背後的陰謀》 | 3 |

> 全表共 **30 個區塊**（B0–B29），其中旁白區塊 3 個：**B0 / B7 / B22**，
> 皆為純旁白、沿用 `seed=310000`（旁白專用 seed，見「旁白 seed 鎖定」）。
> 全部合併總秒數 ≈ **230 秒**。

---

## 區塊 × 參考圖對照（B0–B5 已配置）

> 以下為已寫出六欄位完整提示詞的區塊；B6–B29 的參考圖分配於各該區塊生成前填表。
> 全部沿用統一參考圖管理表（§step 1），不重出圖。

| 區塊 | 類型 | ref_image_0 | ref_image_1 | ref_image_2 | duration |
|------|------|-------------|-------------|-------------|----------|
| B0 | 旁白 | Ref-C3 艾倫 | Ref-S1 法庭全景 | — | 23 |
| B1 | 場景 | — (無角色) | — | Ref-S1 法庭全景 | 4 |
| B2 | 場景 | Ref-C1 林墨 | — | Ref-S1 法庭全景 | 5 |
| B3 | 對白 | Ref-C2 檢察官 | Ref-C3 艾倫 | Ref-S1 法庭全景 | 15 |
| B4 | 對白 | Ref-C3 艾倫 | — | Ref-S1 法庭全景 | 7 |
| B5 | 對白 | Ref-C2 檢察官 | Ref-C1 林墨 | Ref-S1 法庭全景 | 16 |

> B0 為**純旁白區塊**：畫面為艾倫身世的蒙太奇（超市比價、統計圖、社群貼文），音訊只由旁白
> 承載，畫面內角色不開口。旁白計秒約 **5 字/秒**（比對白的 4 字/秒略快、更平）。

---

## B0 — 艾倫身世（旁白，23 秒）

> **旁白全文（約 105 字，5 字/秒 ≈ 21s，留緩神餘裕 → 23s）**：
> 「那少年叫艾倫，今年才十九歲，是一名數據科學系的學生。他的罪名是『散布不實資訊以意圖顛覆
> 聯邦秩序』。而他所做的『罪行』，僅僅是將政府公布的『通膨率百分之二』與他實地走訪五十家超市後
> 彙整的『物價漲幅百分之十五』做成對照圖，發布在個人的社群平台上。」
>
> ⚠️ **百分比唸法陷阱**：`<d>` 內不可寫 `2%`／`15%`——`%` 符號會被模型照唸成怪音（實測「PiFen」）。
> 一律改以**中文數字**寫出：`百分之二`、`百分之十五`（避免 `百分之2` 這種漢字混阿拉伯數字，也儘量
> 避免；若圖表上是阿拉伯數字畫面，那屬「畫面可見文字」，與旁白發音無關）。

```
subject_definitions:
<Subject 1> is the young student Allen from <Picture 1>:
19 years old, thin build, short hair, white shirt, a data-science student, plain and focused.

<Subject 2> is the supreme court chamber from <Picture 2>:
large domed hall, divided audience seating, high judge bench against a constitutional stone wall.

summary:
Reference-based montage narration.
Handheld micro-shake, slow montage.
Narration only.
Allen's background and charge are narrated.

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
Handheld micro-shake, slow montage, shallow depth of field.

[Shot 1]

00:00-00:06

Action:
Allen walks supermarket aisles, picks up shelf goods, checks price tags against his phone screen, focused.

Narration:
<Narrator> says:

<d>
[中文]
那少年叫艾倫，今年才十九歲，是一名數據科學系的學生。
</d>

[Shot 2]

00:06-00:10

Action:
Close-up of the phone screen generating a comparison chart, official 2% versus surveyed 15%.

Narration:
<Narrator> says:

<d>
[中文]
他的罪名是『散布不實資訊以意圖顛覆聯邦秩序』。
</d>

[Shot 3]

00:10-00:17

Action:
Allen taps "post"; the social post goes out and like/share counters jump.

Narration:
<Narrator> says:

<d>
[中文]
而他所做的『罪行』，僅僅是將政府公布的『通膨率百分之二』與他實地走訪五十家超市後彙整的『物價漲幅百分之十五』做成對照圖，發布在個人的社群平台上。
</d>

[Shot 4]

00:17-00:23

Action:
Fade in to the courtroom; Allen stands with head down in the defendant seat, gallery faintly stirring.
No narration in this closing shot.

overall_soundscape:
Narration delivered in a low, calm, middle-aged male voice, Taiwan-accented Standard Mandarin (台灣腔普通話), read flat at a steady pace, not character dialogue, not on-screen voice, no Cantonese.
No character speaks in frame.
Otherwise supermarket daily noise floor (store broadcast, cart sounds), phone operation and like chimes, then vast courtroom silence with low murmur echoes.

non_diegetic_music:
A low cello line with sparse piano notes, steady and slow, rising slightly through the montage and closing into the courtroom silence.
```

**參數**：`ref_image_0=output/ch2_allen_ref/zimage_00015_.png（重用）, ref_image_1=output/ch2_court_ref/zimage_00016_.png（重用）, duration=23, seed=310000（B0 專用，見「旁白 seed 鎖定」）, out=ch2_b0_video`

> **旁白 `<Narrator>` 標記**：旁白不佔用 `<Subject N>` 編號（不引用參考圖），以 `<Narrator>` 獨立標記；
> 這樣模型才知道『這段話不是畫面內角色說的』，OTOH 也不會去生畫面內嘴型。實際生成時如模型不認
> `<Narrator>` 標籤，可改成在 `overall_soundscape` 明確寫『無畫面內人物開口，僅旁白』並刪掉 `<d>` 標記
> 退階用音場錨點帶出旁白。

---

## 旁白 seed 鎖定（B0 及未來所有旁白區塊）

- **B0 用 `seed=310000` 標定**：先出一支 5–8 秒純旁白測試格，確認聲線（低沉、冷靜、中年男聲、
  台灣腔）無誤後，**將 310000 鎖定為全片旁白專用 seed**，所有後續旁白區塊一律沿用。
- 歪粵腔／聲線不符 → 記入黑名單、換下一顆候選，標定成功才鎖定。
- 每支旁白區塊的 `overall_soundscape` **逐字重複同一組聲線描述**（見 B0），seed 與文字雙鎖定。

---

## B7 — 林墨的等待（旁白，7 秒）

> **旁白全文**：「林墨在辯護席後方坐了很久。他等的，就是讓檢察官把話全部說出來的那一刻。」
>
> **格式說明（v5，2026-09 驗證成功）**：對白/旁白區塊用「極度去敘事化」格式——
> 非 `<d>` 欄位一律英文名詞片語、禁止中文完整句；中文只存在於 `<d>` 內。

```
subject_definitions:
<Subject 1> is the border economist Lin Mo from <Picture 1>:
thin, middle-aged East Asian male, gray-flecked black hair, short stubble, tired eyes, dark charcoal suit and wrinkled white shirt, no tie.

<Subject 2> is the supreme court chamber from <Picture 2>:
large domed hall, divided audience seating, high judge bench.

summary:
Reference-based courtroom scene.
Static medium shot.
No on-screen character speaks.
Narration only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No character speaks on screen.
Narration by a calm low male voice only.
No voice-over otherwise.

detailed_description:

Visual style:
Cold blue-gray documentary courtroom footage.
Static medium shot.
Shallow depth of field.
Applause recedes into distant off-screen ambience.

[Shot 1]

00:00-00:07

Action:
Lin Mo sits motionless behind the defense table, gaze lowered, as faint applause and murmurs fade to distant off-screen sound.

Dialogue:
<Narrator> says:

<d>
[中文]
林墨在辯護席後方坐了很久。

他等的，就是讓檢察官把話全部說出來的那一刻。
</d>

overall_soundscape:
All narration is delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, by a calm low middle-aged male voice, off-screen, non-dialogue.
No on-screen character speaks.

non_diegetic_music:
Low cello line with sparse piano notes, steady and slow.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_1=output/ch2_court_ref/zimage_00016_.png（重用）, duration=7, seed=310000（旁白專用）, out=ch2_b7_video`

---

## B22 — 千萬廢紙（旁白，7 秒）

> **旁白全文**：「那張印著領袖頭像的千萬廢紙，在邊境連半瓶水都換不到。林墨把它帶到了法庭上。」

```
subject_definitions:
<Subject 1> is the border economist Lin Mo from <Picture 1>:
thin, middle-aged East Asian male, gray-flecked black hair, short stubble, tired eyes, dark charcoal suit and wrinkled white shirt, no tie.

<Subject 2> is the supreme court chamber from <Picture 2>:
large domed hall, divided audience seating, high judge bench.

summary:
Reference-based courtroom scene.
Static medium shot, very shallow depth of field.
Narration only.
Lin Mo's hand touches a folded bill in his coat pocket.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No character speaks in frame.
Narration by the fixed narrator voice only.
No dialogue.
No on-screen mouth movement.

detailed_description:

Visual style:
Cold blue-gray documentary courtroom footage.
Static medium shot, very shallow depth of field.

[Shot 1]

00:00-00:07

Action:
Lin Mo stands in the middle of the courtroom, slips one hand into his coat inner pocket, fingertips touching a folded banknote; he does not pull it out, only pauses slightly.

Narration:
<Narrator> says:

<d>
[中文]
那張印著領袖頭像的千萬廢紙，在邊境連半瓶水都換不到。林墨把它帶到了法庭上。
</d>

overall_soundscape:
Narration delivered in the same low, calm, middle-aged male voice, Taiwan-accented Standard Mandarin (台灣腔普通話), read flat at a steady pace, not character dialogue, not on-screen voice, no Cantonese.
No character speaks in frame.
Otherwise vast courtroom silence and faint cloth friction.

non_diegetic_music:
A low cello line with sparse piano notes, steady, slow, slightly sinking.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_1=output/ch2_court_ref/zimage_00016_.png（重用）, duration=7, seed=310000（旁白專用）, out=ch2_b22_video`

---

## B1 — 法庭全景（場景，無對白，4 秒）

```
subject_definitions:
<Subject 1> is the supreme court chamber from <Picture 1>:
large domed hall, divided audience seating, red-clad supporters on the left, silent young spectators on the right, high judge bench against a constitutional stone wall.

summary:
Reference-based courtroom establishing shot.
Static wide shot, very slight rise.
No dialogue.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
No one speaks.
No narration.
No voice-over.

detailed_description:

Visual style:
Cold blue-gray documentary courtroom footage.
Slow camera, cold light cutting across.
Static wide shot from the low aisle position, very slight rise.

[Shot 1]

00:00-00:04

Action:
Wide tableau of the courtroom; galleries full, red-clad left side and silent right side, high judge bench against the constitutional stone wall.

overall_soundscape:
Vast courtroom silence, occasional seat creaks and low murmur echoes, cold air hum.

non_diegetic_music:
N/A
```

**參數**：`ref_image_0=output/ch2_court_ref/zimage_00016_.png, duration=4, seed=310001, out=ch2_b1_video`

---

## B2 — 林墨望向被告席（場景，無對白，5 秒）

```
subject_definitions:
<Subject 1> is the border economist Lin Mo from <Picture 1>:
thin, middle-aged East Asian male, gray-flecked black hair, short stubble, tired eyes, dark charcoal suit and wrinkled white shirt, no tie.

<Subject 2> is the supreme court chamber from <Picture 2>:
large domed hall, divided audience seating, high judge bench, view from the defense table across the gallery toward the defendant seat.

summary:
Reference-based courtroom scene.
Static medium shot.
No dialogue.
Lin Mo watches the defendant from behind the defense table.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No one speaks.
No narration.
No voice-over.

detailed_description:

Visual style:
Cold blue-gray documentary courtroom footage.
Static medium shot, shallow depth of field.

[Shot 1]

00:00-00:05

Action:
Lin Mo sits quietly behind the defense table, gaze crossing the crowd toward the young man in the defendant seat, expression complex.

overall_soundscape:
Vast courtroom silence, Lin Mo's faint breathing, distant low murmur echoes from the gallery.

non_diegetic_music:
A low sustained cello note, almost still.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_1=output/ch2_court_ref/zimage_00016_.png（重用）, duration=5, seed=310002, out=ch2_b2_video`

---

## B3 — 檢察官質問艾倫（對白，15 秒）

```
subject_definitions:
<Subject 1> is the federal prosecutor from <Picture 1>:
middle-aged male, thin face, sharp eyes, dark robe, federal prosecutor badge.

<Subject 2> is the young defendant Allen from <Picture 2>:
19 years old, thin build, short hair, white shirt, frightened expression.

<Subject 3> is the supreme court chamber from <Picture 3>:
large domed hall, divided audience seating, red-clad supporters on the left.

summary:
Reference-based courtroom scene.
Static medium shot.
One visible speaker only.
The prosecutor questions Allen.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.
<Subject 3>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks.
No other character speaks.
No narration.
No voice-over.
No off-screen voice.

detailed_description:

Visual style:
Cold blue-gray documentary courtroom footage.
Static medium shot, shallow depth of field.
Natural courtroom lighting.

[Shot 1]

00:00-00:15

Action:
The prosecutor rises at his seat and questions the young man at the defendant bench.
Lip sync must follow dialogue exactly.
Camera remains focused on the prosecutor.

Dialogue:
<Subject 1> says:

<d>
[中文]
被告人艾倫，你是否承認，你在未經官方核實的情況下，私自發布具誘導性的數據，導致民眾對聯邦財政產生不信任，甚至引發了上週的超市搶購潮？
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.
Only courtroom ambience, vast silence and hall echo.
No additional speech.
No crowd voices.

non_diegetic_music:
A low cello line with sparse piano notes, steady and slow.
```

**參數**：`ref_image_0=output/ch2_prosecutor_ref/zimage_00017_.png（重用）, ref_image_1=output/ch2_allen_ref/zimage_00015_.png（重用）, ref_image_2=output/ch2_court_ref/zimage_00016_.png（重用）, duration=15, seed=310003, out=ch2_b3_video`

---

## B4 — 艾倫顫抖回答（對白，7 秒）

```
subject_definitions:
<Subject 1> is the young defendant Allen from <Picture 1>:
19 years old, thin build, short hair, white shirt, frightened expression.

summary:
Reference-based courtroom scene.
Static medium-close shot, shallow depth of field.
One visible speaker only.
Allen answers in a trembling voice.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks.
No other character speaks.
No narration.
No voice-over.
No off-screen voice.

detailed_description:

Visual style:
Cold blue-gray documentary courtroom footage.
Static medium-close shot, shallow depth of field, slight tremble.

[Shot 1]

00:00-00:07

Action:
The young man at the defendant seat opens his mouth shakily and defends himself weakly.
Lip sync must follow dialogue exactly.
Camera remains focused on Allen.

Dialogue:
<Subject 1> says:

<d>
[中文]
我只是……我只是拍下標價，然後做了平均值。那些都是真實的數字……
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.
In the courtroom silence, Allen's trembling breath and faint seat creak.
No other speech.

non_diegetic_music:
A low sustained cello note, almost still.
```

**參數**：`ref_image_0=output/ch2_allen_ref/zimage_00015_.png（重用）, duration=7, seed=310004, out=ch2_b4_video`

---

## B5 — 檢察官冷笑定罪（對白，16 秒）

> **格式說明（v5，2026-09 驗證成功）**：為避免 summary 等敘述欄污染台詞，
> 對白區塊改用「極度去敘事化」格式：所有非 `<d>` 欄位一律英文名詞片語、
> 禁止中文完整句；中文只存在於 `<d>` 內。

```
subject_definitions:
<Subject 1> is the federal prosecutor from <Picture 1>:
middle-aged male, thin face, sharp eyes, dark robe, federal prosecutor badge.

<Subject 2> is the supreme court chamber from <Picture 2>:
large domed hall, divided audience seating.

summary:
Reference-based courtroom scene.
One visible speaker only.
The prosecutor delivers a formal accusation.
Preserve appearance and environment from references.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks.
No other character speaks.
No narration.
No voice-over.
No off-screen voice.

detailed_description:

Visual style:
Cold blue-gray documentary courtroom footage.
Medium shot.
Natural courtroom lighting.

[Shot 1]

00:00-00:16

Action:
The prosecutor turns toward the jury and speaks calmly.
Lip sync must follow dialogue exactly.
Camera remains focused on the prosecutor.

Dialogue:
<Subject 1> says:

<d>
[中文]
真實？

在聯邦，面臨外部經濟封鎖的這段時期，

任何偏離官方定調的數字，

都是敵人用來瓦解我們內部的武器。

這不是科學。

這是背叛。
</d>

overall_soundscape:
Only courtroom ambience.
No additional speech.
No crowd voices.
No whispering.

non_diegetic_music:
Low cello.
Sparse piano notes.
```

**參數**：`ref_image_0=output/ch2_prosecutor_ref/zimage_00017_.png（重用）, ref_image_1=output/ch2_court_ref/zimage_00016_.png（重用）, duration=16, seed=310005, out=ch2_b5_video`

---

## B6 — 紅衣掌聲（場景，無對白，8 秒）

```
subject_definitions:
<Subject 1> is the supreme court chamber from <Picture 1>:
large domed hall, divided audience seating, red-clad supporters on the left, silent young spectators on the right, high judge bench against a constitutional stone wall.

summary:
Reference-based courtroom scene.
Medium and overhead shots, applause rising.
No dialogue.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
No one speaks.
No narration.
No voice-over.

detailed_description:

Visual style:
Cold blue-gray documentary courtroom footage.
Medium shots with slight push-in, then a steady overhead wide.

[Shot 1]

00:00-00:04

Action:
Red-clad spectators in the gallery applaud; applause grows from scattered to dense.

[Shot 2]

00:04-00:08

Action:
The judge strikes the gavel, his call drowned by the applause; the red-clad crowd only grows louder.

overall_soundscape:
Courtroom silence broken by applause: scattered claps surging into cheering and shouting, a wind-like roar, the gavel's submerged thud.

non_diegetic_music:
N/A
```

**參數**：`ref_image_0=output/ch2_court_ref/zimage_00016_.png（重用）, duration=8, seed=310006, out=ch2_b6_video`

---

## B8 — 林墨起身（場景，無對白，5 秒）

```
subject_definitions:
<Subject 1> is the border economist Lin Mo from <Picture 1>:
thin, middle-aged East Asian male, gray-flecked black hair, short stubble, tired eyes, dark charcoal suit and wrinkled white shirt, no tie.

<Subject 2> is the supreme court chamber from <Picture 2>:
large domed hall, divided audience seating, high judge bench against a constitutional stone wall.

summary:
Reference-based courtroom scene.
Static medium shot.
No dialogue.
Lin Mo rises slowly amid fading applause.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No one speaks.
No narration.
No voice-over.

detailed_description:

Visual style:
Cold blue-gray documentary courtroom footage.
Static medium shot.
Shallow depth of field.
Applause recedes to near silence.

[Shot 1]

00:00-00:05

Action:
Lin Mo places both hands on the defense table and slowly stands up, calm and deliberate, looking neither at the prosecutor nor the audience, gaze fixed on the constitutional stone wall behind the judge bench. Very slight camera rise.

overall_soundscape:
Applause fading to sparse claps and low murmurs; cloth friction and the chair sliding back as Lin Mo rises; courtroom silence returning.

non_diegetic_music:
A low sustained cello note, almost still.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_1=output/ch2_court_ref/zimage_00016_.png（重用）, duration=5, seed=310008, out=ch2_b8_video`

---

## B9 — 要求傳喚（對白，4 秒）

```
subject_definitions:
<Subject 1> is the border economist Lin Mo from <Picture 1>:
thin, middle-aged East Asian male, gray-flecked black hair, short stubble, tired eyes, dark charcoal suit and wrinkled white shirt, no tie.

<Subject 2> is the supreme court chamber from <Picture 2>:
large domed hall, divided audience seating, high judge bench.

summary:
Reference-based courtroom scene.
Static medium shot.
One visible speaker only.
Lin Mo requests to call a key witness.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks.
No other character speaks.
No narration.
No voice-over.
No off-screen voice.
Delivery accent: Taiwan-accented Standard Mandarin (台灣腔國語), never Cantonese (never 粵語/廣東話), never Hong Kong accent, never any regional dialect.

detailed_description:

Visual style:
Cold blue-gray documentary courtroom footage.
Static medium shot.
Shallow depth of field.
Natural courtroom lighting.

[Shot 1]

00:00-00:04

Action:
Lin Mo faces the judge bench and speaks firmly, enunciating calmly in Taiwan-accented Standard Mandarin (台灣腔國語), soft rounded tone, no Cantonese tones.
Lip sync must follow dialogue exactly.
Camera remains focused on Lin Mo.

Dialogue:
<Subject 1> says (in Taiwan-accented Mandarin, not Cantonese):

<d>
[中文]
法官閣下，辯方要求傳喚一名關鍵證人。
</d>

overall_soundscape:
All spoken lines are delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese; no Hong Kong accent, no accent slippage.
Only courtroom ambience.
No additional speech.
No crowd voices.

non_diegetic_music:
A low sustained cello note, almost still.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_1=output/ch2_court_ref/zimage_00016_.png（重用）, duration=4, seed=310009（歪粵腔黑名單 → 改 310109）, out=ch2_b9_video`

---

## B10 — 法官：「誰？」（對白，1 秒）

```
subject_definitions:
<Subject 1> is the elderly supreme court judge from <Picture 1>:
East Asian elderly male, short silver hair, stern cold face, deep nasolabial folds, black judge robe, federal justice badge.

<Subject 2> is the supreme court chamber from <Picture 2>:
large domed hall, divided audience seating, high judge bench against a constitutional stone wall.

summary:
Reference-based courtroom scene.
Static wide shot.
One visible speaker only.
The judge asks a single short question.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks.
No other character speaks.
No narration.
No voice-over.
No off-screen voice.

detailed_description:

Visual style:
Cold blue-gray documentary courtroom footage.
Static wide shot.
Square framing.
Natural courtroom lighting.

[Shot 1]

00:00-00:01

Action:
The elderly judge looks down at Lin Mo from the high bench and asks one word.
Lip sync must follow dialogue exactly.
Camera remains focused on the judge.

Dialogue:
<Subject 1> says:

<d>
[中文]
誰？
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.
After the single word, vast courtroom silence with hall echo.
No additional speech.

non_diegetic_music:
N/A
```

**參數**：`ref_image_0=output/ch2_judge_ref/zimage_00032_.png（重用）, ref_image_1=output/ch2_court_ref/zimage_00016_.png（重用）, duration=1, seed=310010, out=ch2_b10_video`

---

## B11 — 林墨點名統計局長（對白，7 秒）

```
subject_definitions:
<Subject 1> is the border economist Lin Mo from <Picture 1>:
thin, middle-aged East Asian male, gray-flecked black hair, short stubble, tired eyes, dark charcoal suit and wrinkled white shirt, no tie.

<Subject 2> is the supreme court chamber from <Picture 2>:
large domed hall, divided audience seating, high judge bench against a constitutional stone wall.

summary:
Reference-based courtroom scene.
Static medium shot.
One visible speaker only.
Lin Mo answers the judge and names the statistics director.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks.
No other character speaks.
No narration.
No voice-over.
No off-screen voice.

detailed_description:

Visual style:
Cold blue-gray documentary courtroom footage.
Static medium shot.
Shallow depth of field.
Natural courtroom lighting.

[Shot 1]

00:00-00:07

Action:
Lin Mo stands in place, facing the judge bench, answering in a steady low voice.
Lip sync must follow dialogue exactly.
Camera remains focused on Lin Mo.

Dialogue:
<Subject 1> says:

<d>
[中文]
聯邦統計局局長。

以及，這份訴狀中提到的那份『官方核實數據』的原始運算公式。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.
Only courtroom ambience, vast silence and hall echo.
No additional speech.
No crowd voices.

non_diegetic_music:
A low sustained cello note, almost still.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_1=output/ch2_court_ref/zimage_00016_.png（重用）, duration=7, seed=310011, out=ch2_b11_video`

---

## B12 — 法庭沉默（場景，無對白，3 秒）

```
subject_definitions:
<Subject 1> is the supreme court chamber from <Picture 1>:
large domed hall, divided audience seating, red-clad supporters on the left, silent young spectators on the right, high judge bench against a constitutional stone wall.

summary:
Reference-based courtroom scene.
Static wide shot.
No dialogue.
The chamber falls into total silence.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
No one speaks.
No narration.
No voice-over.

detailed_description:

Visual style:
Cold blue-gray documentary courtroom footage.
Static wide shot.
Very slight push-in.

[Shot 1]

00:00-00:03

Action:
The whole courtroom falls silent after the key words land; the prosecutor stiffens slightly and changes countenance; no one makes a sound.

overall_soundscape:
Courtroom silence pushed to the extreme; only a low air-conditioning hum and a few stray seat creaks; no applause, no shouting.

non_diegetic_music:
N/A
```

**參數**：`ref_image_0=output/ch2_court_ref/zimage_00016_.png（重用）, duration=3, seed=310012, out=ch2_b12_video`

---

## B13 — 檢察官反制（對白，8 秒）

```
subject_definitions:
<Subject 1> is the federal prosecutor from <Picture 1>:
middle-aged male, thin face, sharp eyes, dark robe, federal prosecutor badge.

<Subject 2> is the supreme court chamber from <Picture 2>:
large domed hall, divided audience seating, high judge bench.

summary:
Reference-based courtroom scene.
Static medium shot.
One visible speaker only.
The prosecutor objects on national-security grounds.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks.
No other character speaks.
No narration.
No voice-over.
No off-screen voice.

detailed_description:

Visual style:
Cold blue-gray documentary courtroom footage.
Static medium shot.
Shallow depth of field.
Natural courtroom lighting.

[Shot 1]

00:00-00:08

Action:
The prosecutor speaks first before Lin Mo, addressing the judge bench.
Lip sync must follow dialogue exactly.
Camera remains focused on the prosecutor.

Dialogue:
<Subject 1> says:

<d>
[中文]
林委員，這涉及國家機密，官方數據的運算模型受《安全法》保護，無須對公眾公開。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.
Only courtroom ambience, vast silence and hall echo.
No additional speech.
No crowd voices.

non_diegetic_music:
A low cello line with sparse piano notes, steady and slow.
```

**參數**：`ref_image_0=output/ch2_prosecutor_ref/zimage_00017_.png（重用）, ref_image_1=output/ch2_court_ref/zimage_00016_.png（重用）, duration=8, seed=310013, out=ch2_b13_video`

---

## B14 — 數據與教條（對白，5 秒）

```
subject_definitions:
<Subject 1> is the border economist Lin Mo from <Picture 1>:
thin, middle-aged East Asian male, gray-flecked black hair, short stubble, tired eyes, dark charcoal suit and wrinkled white shirt, no tie.

<Subject 2> is the supreme court chamber from <Picture 2>:
large domed hall, divided audience seating, high judge bench.

summary:
Reference-based courtroom scene.
Static medium shot.
One visible speaker only.
Lin Mo replies that unquestionable data is not data.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks.
No other character speaks.
No narration.
No voice-over.
No off-screen voice.

detailed_description:

Visual style:
Cold blue-gray documentary courtroom footage.
Static medium shot.
Shallow depth of field.
Natural courtroom lighting.

[Shot 1]

00:00-00:05

Action:
Lin Mo faces the judge bench and answers in a low, firm voice.
Lip sync must follow dialogue exactly.
Camera remains focused on Lin Mo.

Dialogue:
<Subject 1> says:

<d>
[中文]
如果數據不能被質疑，那它就不是數據，而是教條。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.
Only courtroom ambience, vast silence and hall echo.
No additional speech.
No crowd voices.

non_diegetic_music:
A low sustained cello note, almost still.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_1=output/ch2_court_ref/zimage_00016_.png（重用）, duration=5, seed=310014, out=ch2_b14_video`

---

## B15 — 質問通膨率（對白，23 秒）

```
subject_definitions:
<Subject 1> is the border economist Lin Mo from <Picture 1>:
thin, middle-aged East Asian male, gray-flecked black hair, short stubble, tired eyes, dark charcoal suit and wrinkled white shirt, no tie.

<Subject 2> is the supreme court chamber from <Picture 2>:
large domed hall, divided audience seating, high judge bench against a constitutional stone wall.

summary:
Reference-based courtroom scene.
Static medium shot, slight push-in at end.
One visible speaker only.
Lin Mo confronts the prosecution with a detailed factual challenge.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks.
No other character speaks.
No narration.
No voice-over.
No off-screen voice.

detailed_description:

Visual style:
Cold blue-gray documentary courtroom footage.
Static medium shot with slight push-in in the final seconds.
Shallow depth of field.
Natural courtroom lighting.

[Shot 1]

00:00-00:23

Action:
Lin Mo points toward the defendant Allen, then turns to the judge bench and speaks calmly but with precision.
Lip sync must follow dialogue exactly.
Camera remains focused on Lin Mo throughout.

Dialogue:
<Subject 1> says:

<d>
[中文]
今天，你們以『不實資訊』起訴這名少年，

但在法律上，要證明他的資訊為『假』，

你們必須先證明官方的資訊為『真』。

請告訴我，那百分之二的通膨率，

是否包含了房租、能源與進口糧食？

還是你們在運算時，刻意剔除了一切會讓數字難看的變數？
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.
Only courtroom ambience, vast silence and hall echo.
No additional speech.
No crowd voices.

non_diegetic_music:
A low cello line with sparse piano notes, steady and slow.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_1=output/ch2_court_ref/zimage_00016_.png（重用）, duration=23, seed=310015, out=ch2_b15_video`

---

## B16 — 原地站定（場景，無對白，4 秒）

```
subject_definitions:
<Subject 1> is the border economist Lin Mo from <Picture 1>:
thin, middle-aged East Asian male, gray-flecked black hair, short stubble, tired eyes, dark charcoal suit and wrinkled white shirt, no tie.

<Subject 2> is the supreme court chamber from <Picture 2>:
large domed hall, divided audience seating, high judge bench.

summary:
Reference-based courtroom scene.
Static medium shot with very slight push-in.
No dialogue.
Lin Mo stands still after his long challenge.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No one speaks.
No narration.
No voice-over.

detailed_description:

Visual style:
Cold blue-gray documentary courtroom footage.
Static medium shot with very slight push-in.

[Shot 1]

00:00-00:04

Action:
Lin Mo lowers the hand that was pointing at Allen, stays where he stands, chest moving with quiet breaths, eyes level at the judge bench.

overall_soundscape:
Vast courtroom silence; Lin Mo's short breaths, faint fabric strain, scattered low murmurs.
No dialogue.

non_diegetic_music:
A low sustained cello note, almost still.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_1=output/ch2_court_ref/zimage_00016_.png（重用）, duration=4, seed=310016, out=ch2_b16_video`

---

## B17 — 檢察官拍桌（對白，10 秒）

```
subject_definitions:
<Subject 1> is the federal prosecutor from <Picture 1>:
middle-aged male, thin face, sharp eyes, dark robe, federal prosecutor badge.

<Subject 2> is the supreme court chamber from <Picture 2>:
large domed hall, divided audience seating, high judge bench.

summary:
Reference-based courtroom scene.
Dynamic medium shot.
One visible speaker only.
The prosecutor slams the desk and accuses Lin Mo.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks.
No other character speaks.
No narration.
No voice-over.
No off-screen voice.

detailed_description:

Visual style:
Cold blue-gray documentary courtroom footage.
Dynamic medium shot with slight handheld shake.
Natural courtroom lighting.

[Shot 1]

00:00-00:10

Action:
The prosecutor slams a palm on his desk, rises to his feet and speaks angrily.
Lip sync must follow dialogue exactly.
Camera remains focused on the prosecutor.

Dialogue:
<Subject 1> says:

<d>
[中文]
你這是在擾亂視聽！這是立場問題！

你到底是站在聯邦這一邊，還是站在那些想看我們崩潰的人那一邊？
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.
The desk slam's dull thud, vast courtroom silence and hall echo.
No additional speech.
No crowd voices.

non_diegetic_music:
A low cello line with sparse piano notes, steady and slow.
```

**參數**：`ref_image_0=output/ch2_prosecutor_ref/zimage_00017_.png（重用）, ref_image_1=output/ch2_court_ref/zimage_00016_.png（重用）, duration=10, seed=310017, out=ch2_b17_video`

---

## B18 — 紅衣叫囂（場景，群聲，7 秒）

```
subject_definitions:
<Subject 1> is the supreme court chamber from <Picture 1>:
large domed hall, divided audience seating, red-clad supporters on the left, silent young spectators on the right, high judge bench against a constitutional stone wall.

summary:
Reference-based courtroom scene.
Overhead and medium shots, group movement.
Crowd uproar, no clear individual words.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
No single clear speech.
Crowd shouting only, off-screen muffled yells that never cover dialogue.
No narration.
No voice-over.

detailed_description:

Visual style:
Cold blue-gray documentary courtroom footage.
Overhead wide and medium shots alternating, group commotion.

[Shot 1]

00:00-00:04

Action:
Red-clad spectators in the gallery rise, point fingers toward Lin Mo and shout angrily.

[Shot 2]

00:04-00:07

Action:
The shouting surge peaks; bailiffs move forward to press order back down.

overall_soundscape:
Crowd shouting and whistles surging like waves, indistinct muffled yelling without clear words, stamping feet, bailiffs' suppressed orders.

non_diegetic_music:
N/A
```

**參數**：`ref_image_0=output/ch2_court_ref/zimage_00016_.png（重用）, duration=7, seed=310018, out=ch2_b18_video`

---

## B19 — 別低頭（對白，3 秒）

```
subject_definitions:
<Subject 1> is the border economist Lin Mo from <Picture 1>:
thin, middle-aged East Asian male, gray-flecked black hair, short stubble, tired eyes, dark charcoal suit and wrinkled white shirt, no tie.

<Subject 2> is the young defendant Allen from <Picture 2>:
19 years old, thin build, short hair, white shirt, frightened expression.

<Subject 3> is the supreme court chamber from <Picture 3>:
large domed hall, divided audience seating, high judge bench.

summary:
Reference-based courtroom scene.
Over-the-shoulder medium-close shot.
One visible speaker only.
Lin Mo reassures Allen in the noise.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.
<Subject 3>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks.
No other character speaks.
No narration.
No voice-over.
No off-screen voice.

detailed_description:

Visual style:
Cold blue-gray documentary courtroom footage.
Over-the-shoulder medium-close shot, shallow depth of field.

[Shot 1]

00:00-00:03

Action:
Lin Mo turns to the young man in the defendant seat and lowers his voice to reassure him.
Lip sync must follow dialogue exactly.
Camera remains over the shoulder toward <Subject 2>.

Dialogue:
<Subject 1> says:

<d>
[中文]
別低頭，這不是你的審判。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.
Distant shouting fades to a low off-screen wave; vast courtroom silence.
No other clear speech.

non_diegetic_music:
A low sustained cello note, almost still.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_1=output/ch2_allen_ref/zimage_00015_.png（重用）, ref_image_2=output/ch2_court_ref/zimage_00016_.png（重用）, duration=3, seed=310019, out=ch2_b19_video`

---

## B20 — 望向直播攝影機（場景，無對白，3 秒）

> 2026-09-13 修復：加入林墨參考圖（原版無人物參考，人物跑掉）。

```
subject_definitions:
<Subject 1> is the border economist Lin Mo from <Picture 1>:
thin, middle-aged East Asian male, gray-flecked black hair, short stubble, tired eyes, dark charcoal suit and wrinkled white shirt, no tie.

<Subject 2> is the supreme court chamber from <Picture 2>:
large domed hall, divided audience seating, red-clad supporters on the left, silent young spectators on the right, high judge bench against a constitutional stone wall.

<Subject 3> is the large live broadcast camera in the courtroom ceiling from <Picture 3>:
black body, long lens, small red indicator light glowing, suspended beneath the dome structure.

summary:
Reference-based courtroom scene.
Low and high angle shots, the red light breathing.
No dialogue.
Lin Mo looks up at the live camera.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.
<Subject 3>: fully_preserved.

speaker_constraints:
No one speaks.
No narration.
No voice-over.

detailed_description:

Visual style:
Cold blue-gray documentary courtroom footage.
Low angle followed by a cut to camera close-up, the red light breathing on and off.

[Shot 1]

00:00-00:03

Action:
<Subject 1> stands in the middle of the courtroom, lifts his head to the large broadcast camera above; <Subject 3>'s red light blinks on and off.

overall_soundscape:
Vast courtroom silence; faint high-frequency hum of the camera mechanism and servo movement.

non_diegetic_music:
A low sustained cello note, almost still.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png（林墨）, ref_image_1=output/ch2_court_ref/zimage_00016_.png（重用）, ref_image_2=output/ch2_camerawall_ref/zimage_00033_.png（重用）, duration=3, seed=310020, out=ch2_b20_video`

---

## B21 — 全國直播宣言（對白，26 秒）

```
subject_definitions:
<Subject 1> is the border economist Lin Mo from <Picture 1>:
thin, middle-aged East Asian male, gray-flecked black hair, short stubble, tired eyes, dark charcoal suit and wrinkled white shirt, no tie.

<Subject 2> is the supreme court chamber from <Picture 2>:
large domed hall, divided audience seating, high judge bench against a constitutional stone wall, large live broadcast camera blinking red at the top.

summary:
Reference-based courtroom scene.
Static medium shot, looking straight into the lens.
One visible speaker only.
Lin Mo directly addresses the nationwide broadcast.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks.
No other character speaks.
No narration.
No voice-over.
No off-screen voice.

detailed_description:

Visual style:
Cold blue-gray documentary courtroom footage.
Static medium shot, eyes straight toward camera, shallow depth of field.

[Shot 1]

00:00-00:26

Action:
Lin Mo stands firm, lifts his head slightly and looks straight into the live broadcast camera's red light, speaking steadily.
Lip sync must follow dialogue exactly.
Camera remains focused on Lin Mo.

Dialogue:
<Subject 1> says:

<d>
[中文]
各位國民，今天政府告訴我們，懷疑數字就是背叛。

但我要告訴各位，當一個政府開始用『立場』來代替『加減法』時，

你們手中的積蓄、你們對未來的計畫，都將建立在沙灘上。

如果我們容許政府提告一個說出超市價格的孩子，

那麼明天，當政府說一加一等於五的時候，你們也只能點頭。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.
Judge's distant angry gavel strikes, low courtroom commotion, broadcast camera servo hum.

non_diegetic_music:
A low cello line with sparse piano notes, climbing steadily through the speech, almost still.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_1=output/ch2_court_ref/zimage_00016_.png（重用）, duration=26, seed=310021, out=ch2_b21_video`

---

## B23 — 高舉千萬廢紙（場景，無對白，6 秒）

```
subject_definitions:
<Subject 1> is the border economist Lin Mo from <Picture 1>:
thin, middle-aged East Asian male, gray-flecked black hair, short stubble, tired eyes, dark charcoal suit and wrinkled white shirt, no tie.

<Subject 2> is the supreme court chamber from <Picture 2>:
large domed hall, divided audience seating, high judge bench.

summary:
Reference-based courtroom scene.
Medium shot, slow upward tilt.
No dialogue.
Lin Mo raises the worthless banknote overhead.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No one speaks.
No narration.
No voice-over.

detailed_description:

Visual style:
Cold blue-gray documentary courtroom footage.
Medium shot tilting slowly up to the paper in the light.

[Shot 1]

00:00-00:06

Action:
Lin Mo takes the worthless banknote printed with the leader's portrait from his coat pocket and raises it with both hands overhead; the paper catches a small arc of light.

overall_soundscape:
Vast courtroom silence; the paper's rustle as it is drawn out, Lin Mo's breath and cloth sounds, subdued scattered stirring.

non_diegetic_music:
A low sustained cello note, slightly rising and held.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_1=output/ch2_court_ref/zimage_00016_.png（重用）, duration=6, seed=310023, out=ch2_b23_video`

---

## B24 — 法官宣布休庭（場景，無對白，4 秒）

```
subject_definitions:
<Subject 1> is the supreme court chamber from <Picture 1>:
large domed hall, divided audience seating, high judge bench against a constitutional stone wall, the judge seated above.

<Subject 2> is the young defendant Allen from <Picture 2>:
19 years old, thin build, short hair, white shirt, frightened expression.

summary:
Reference-based courtroom scene.
Wide shot, medium-speed lateral move.
No dialogue.
The judge adjourns and Allen is taken away.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No one speaks.
No narration.
No voice-over.

detailed_description:

Visual style:
Cold blue-gray documentary courtroom footage.
Wide shot, medium-speed lateral move.

[Shot 1]

00:00-00:04

Action:
The judge strikes the gavel and adjourns the hearing; two bailiffs lead Allen from the defendant seat; the gallery erupts into motion.

overall_soundscape:
Courtroom dead silence broken by the gavel; adjournment commotion, bailiffs pulling Allen, cloth and footsteps, gallery seats scraping as people rise.

non_diegetic_music:
A low sustained cello note, almost still.
```

**參數**：`ref_image_0=output/ch2_court_ref/zimage_00016_.png（重用）, ref_image_1=output/ch2_allen_ref/zimage_00015_.png（重用）, duration=4, seed=310024, out=ch2_b24_video`

---

## B25 — 標籤不能當飯吃（對白，15 秒）

```
subject_definitions:
<Subject 1> is the border economist Lin Mo from <Picture 1>:
thin, middle-aged East Asian male, gray-flecked black hair, short stubble, tired eyes, dark charcoal suit and wrinkled white shirt, no tie.

<Subject 2> is the supreme court chamber from <Picture 2>:
large domed hall, divided audience seating, high judge bench.

summary:
Reference-based courtroom scene.
Static medium shot.
One visible speaker only.
Lin Mo delivers his final verdict on labels and the worthless bill.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks.
No other character speaks.
No narration.
No voice-over.
No off-screen voice.

detailed_description:

Visual style:
Cold blue-gray documentary courtroom footage.
Static medium shot, shallow depth of field.

[Shot 1]

00:00-00:15

Action:
Lin Mo stands in place, eyes sweeping the judge bench and the gallery, speaking in an even voice.
Lip sync must follow dialogue exactly.
Camera remains focused on Lin Mo.

Dialogue:
<Subject 1> says:

<d>
[中文]
我在南方的鄰居那裡學到了一件事：

標籤不能當飯吃，口號不能折抵債務。

如果這座法庭今天判處真實有罪，

那麼這張廢紙，就是歐若拉聯邦明天的樣子。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.
Adjournment commotion as a low wave, bailiff and Allen steps fading away.
No other clear speech.

non_diegetic_music:
A low cello line with sparse piano notes, steady and slow.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_1=output/ch2_court_ref/zimage_00016_.png（重用）, duration=15, seed=310025, out=ch2_b25_video`

---

## B26 — 走出法庭（場景，無對白，3 秒）

```
subject_definitions:
<Subject 1> is the border economist Lin Mo from <Picture 1>:
thin, middle-aged East Asian male, gray-flecked black hair, short stubble, tired eyes, dark charcoal suit and wrinkled white shirt, no tie.

<Subject 2> is the corridor outside the courtroom from <Picture 2>:
low and high platform steps, stone columns, a crowd of journalists surging in from both sides.

summary:
Reference-based corridor scene.
Medium shot, handheld micro-shake.
No dialogue.
Lin Mo walks out through the crowd toward the doors.

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
Medium shot, handheld micro-shake, following the walk.

[Shot 1]

00:00-00:03

Action:
Lin Mo walks out of the courtroom through bailiffs and the surging press, microphones lining both sides of the corridor.

overall_soundscape:
Corridor crowd and microphone noise floor, bailiffs' order-keeping commands, brisk footsteps and scattered camera shutter bursts.

non_diegetic_music:
A low sustained cello note, almost still.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_1=output/ch2_exit_ref/zimage_00034_.png（重用）, duration=3, seed=310026, out=ch2_b26_video`

---

## B27 — 記者群問（對白，14 秒）

```
subject_definitions:
<Subject 1> is the border economist Lin Mo from <Picture 1>:
thin, middle-aged East Asian male, gray-flecked black hair, short stubble, tired eyes, dark charcoal suit and wrinkled white shirt, no tie.

<Subject 2> is the corridor outside the courtroom from <Picture 2>:
stone columns, a crowd of journalists pressing in, reporters pushing microphones forward.

summary:
Reference-based corridor scene.
Medium shot, handheld micro-shake.
Reporters fire questions; Lin Mo stops and stays silent.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only three reporters in the corridor speak, one turn each.
<Subject 1> does not speak in this block.
No narration.
No voice-over.

detailed_description:

Visual style:
Cold blue-gray documentary footage.
Medium shot, handheld micro-shake.

[Shot 1]

00:00-00:14

Action:
Lin Mo steps out of the courtroom door and is immediately surrounded by microphones; reporters press in with questions; he stops and looks silently at the questioners.
Lip sync must follow dialogue exactly for each reporter.

Dialogue:
A reporter says:

<d>
[中文]
林委員，你真的要在下週推動那個法案嗎？
</d>

Another reporter says:

<d>
[中文]
你這是在公然挑釁司法權嗎？
</d>

A third reporter says:

<d>
[中文]
有人說你收了外國政府的錢，才要破壞聯邦的團結，你怎麼回應？
</d>

overall_soundscape:
All dialogue in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.
Overlapping question babble in the corridor, microphone and crowd noise floor, camera shutter bursts.
Lin Mo remains silent.

non_diegetic_music:
A low sustained cello note, almost still.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_1=output/ch2_exit_ref/zimage_00034_.png（重用）, duration=14, seed=310027, out=ch2_b27_video`

---

## B28 — 我沒收錢（對白，12 秒）

```
subject_definitions:
<Subject 1> is the border economist Lin Mo from <Picture 1>:
thin, middle-aged East Asian male, gray-flecked black hair, short stubble, tired eyes, dark charcoal suit and wrinkled white shirt, no tie.

<Subject 2> is the corridor outside the courtroom from <Picture 2>:
stone columns, a crowd of journalists pressing in.

summary:
Reference-based corridor scene.
Static medium shot, shallow depth of field.
One visible speaker only.
Lin Mo answers the paid-money accusation.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks.
No reporter speaks in this block.
No narration.
No voice-over.
No off-screen voice.

detailed_description:

Visual style:
Cold blue-gray documentary footage.
Static medium shot, shallow depth of field.

[Shot 1]

00:00-00:12

Action:
Lin Mo stops, looks straight at the reporter who asked about the money, and answers calmly but firmly.
Lip sync must follow dialogue exactly.
Camera remains focused on Lin Mo.

Dialogue:
<Subject 1> says:

<d>
[中文]
我沒收錢，我只是不想在未來的某一天，我的孩子必須拿著幾億張印著我頭像的廢紙，去換一塊發霉的麵包。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.
Reporter crowd hushed into a low murmur, occasional camera shutter sound.

non_diegetic_music:
A low cello line with sparse piano notes, steady and slow.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_1=output/ch2_exit_ref/zimage_00034_.png（重用）, duration=12, seed=310028, out=ch2_b28_video`

---

## B29 — 電視牆標題（場景，無對白，3 秒）

```
subject_definitions:
<Subject 1> is the video wall outside the courthouse from <Picture 1>:
black background, rolling white text, the headline "數據修正主義者的野心：林墨與其背後的陰謀".

summary:
Reference-based exterior scene.
Upward tilt, cold light.
No dialogue.
The video wall scrolls the accusation headline.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
No one speaks.
No narration.
No voice-over.

detailed_description:

Visual style:
Cold blue-gray documentary footage.
Upward tilt toward the wall, cold light.

[Shot 1]

00:00-00:03

Action:
Lin Mo's back walks toward his car as the camera tilts up to the video wall outside the courthouse, the black headline beginning to scroll.

overall_soundscape:
Street and corridor ambience floor, muffled car door closing, the video wall's cold hum.

non_diegetic_music:
A low sustained cello note, slightly sinking and closing.
```

**參數**：`ref_image_0=output/ch2_tvwall_ref/zimage_00035_.png（重用）, duration=3, seed=310029, out=ch2_b29_video`

---

## 腔調錨點（B0–B29 全部以此為準）

- **`<d>` 語言標籤維持 `[中文]` 不改**；腔調不由標籤決定。
- **角色對白控制點＝ `overall_soundscape` 首句錨點**：
  `所有台詞以台灣腔普通話（台灣腔、無粵語、無方言）逐字緩慢朗讀、由畫面內本人說出、非旁白。`
- **旁白控制點＝同一組聲線描述**（見 B0/B7/B22）：`同一名低沉、冷靜、中年男聲……逐字平讀、
  非角色對白、非畫面內發聲`，並搭配**旁白專用 seed 310000**（標定後鎖定）。
  全部旁白區塊（B0、B7、B22）只可有旁白、不可有畫面內角色開口。
- 每支 r2v 獨立 seed；seed 需先查黑名單（guide §5.2），實測若歪粵腔即記入黑名單並換 seed。
- **黑名單（實測歪粵腔 seed）**：`310009`（B9 首次跑出廣東腔，已改換 `310109`）。
- B1 無對白，故 `overall_soundscape` 不含腔調錨點（無音訊需要錨定）。

---

## 已寫出提示詞的區塊（B0–B29 全部）完成後：合併

已寫出完整六欄位提示詞的區塊依序合併為 Ch2 全文：旁白身世 → 開庭 → 直播宣言 → 車前收束（約 259 秒）：

```
merge_videos(
  files = [
    "ch2_b0/video/MiniMax_H3_00145_.mp4",
    "ch2_b1/video/MiniMax_H3_00138_.mp4",
    "ch2_b2_video/video/MiniMax_H3_00178_.mp4",
    "ch2_b3/video/MiniMax_H3_00140_.mp4",
    "ch2_b4/video/MiniMax_H3_00141_.mp4",
    "ch2_b5_video/video/MiniMax_H3_00153_.mp4",
    "ch2_b6_video/video/MiniMax_H3_00147_.mp4",
    "ch2_b7_video/video/MiniMax_H3_00154_.mp4",
    "ch2_b8_video/video/MiniMax_H3_00155_.mp4",
    "ch2_b9_video/video/MiniMax_H3_00177_.mp4",
    "ch2_b10_video/video/MiniMax_H3_00157_.mp4",
    "ch2_b11_video/video/MiniMax_H3_00158_.mp4",
    "ch2_b12_video/video/MiniMax_H3_00176_.mp4",
    "ch2_b13_video/video/MiniMax_H3_00159_.mp4",
    "ch2_b14_video/video/MiniMax_H3_00160_.mp4",
    "ch2_b15_video/video/MiniMax_H3_00161_.mp4",
    "ch2_b16_video/video/MiniMax_H3_00162_.mp4",
    "ch2_b17_video/video/MiniMax_H3_00163_.mp4",
    "ch2_b18_video/video/MiniMax_H3_00164_.mp4",
    "ch2_b19_video/video/MiniMax_H3_00165_.mp4",
    "ch2_b20_video/video/MiniMax_H3_00180_.mp4",
    "ch2_b21_video/video/MiniMax_H3_00167_.mp4",
    "ch2_b22_video/video/MiniMax_H3_00168_.mp4",
    "ch2_b23_video/video/MiniMax_H3_00169_.mp4",
    "ch2_b24_video/video/MiniMax_H3_00170_.mp4",
    "ch2_b25_video/video/MiniMax_H3_00171_.mp4",
    "ch2_b26_video/video/MiniMax_H3_00172_.mp4",
    "ch2_b27_video/video/MiniMax_H3_00173_.mp4",
    "ch2_b28_video/video/MiniMax_H3_00174_.mp4",
    "ch2_b29_video/video/MiniMax_H3_00175_.mp4"
  ],
  resolution = "352:608",
  out = "ch2_full"
)
```

> 2026-09-13 更新：B2（00178）、B9（00177）、B20（00180）為重生成版本，取代舊檔 00139 / 00156 / 00166。
> B12（00176）、B25–B29（00171–00175）已填入實際檔名，B13–B19 補上 00159–00165。

> **B0–B29 全部區塊均已完成提示詞撰寫。** 對白皆逐字對照 `story1.md` 第二章（lines 67–113），
> 無省略、無自創。
