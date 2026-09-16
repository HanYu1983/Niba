# Ch8 區塊獨立提示詞 — H0–H23（實作範例 10：第八章「暗殺與斷網」）

> 本文件承接 `novel_to_video_guide_v2.md` 與 `example9_ch7.md`（Ch7），
> 完整產出**第八章「暗殺與斷網」**的區塊分割、參考圖分配與全部 25 支 r2v 六欄位提示詞，
> 並套用 `video_prompt_guide.md` QA Q1–Q8（外語混雜、特殊符號、長句插話、跳針重讀、句間填補、口型對嘴、稱謂破題張嘴者指派）。
>
> **章節功能**：林墨依匿名座標抵達廢棄國家檔案館，會見前任大法官賽爾斯，得知「共識演算」的原始版本與藏在系統中的
> 「例外清單」、磁帶內有現任總統赫德參與索利亞實驗的通聯紀錄；電子脈衝彈突襲、全市斷網，政府誣陷林墨刺殺賽爾斯；
> 林墨奪路而逃，誓言讓全聯邦看見緊急狀態在掩蓋誰的罪行。情緒走向：
> 雨夜幽會 → 檔案館揭密 → 斷網伏擊 → 誣陷逃亡 → 日出宣言。
> 登場角色：林墨（沿用 Ref-M）、前大法官賽爾斯（**新肖像**）、蘇菲（沿用 Ref-Sophie，無線電聲、不出鏡）、特勤隊（無對白剪影）。
>
> ⚠ **QA 應用**：對白一律移除 `「」『』`《》引號、冒號、刪節號（省略號只留「…… 」氣口）、驚嘆號；阿拉伯數字改中文數字
> （3.0→三點零）；對白句間以語法銜接為本（Q6）；說話鏡頭一律帶正向嘴部 cue（Q7）；對白含另一角色稱謂直呼（林立委／賽爾斯法官／老師）
> 的區塊，被稱呼者不入鏡頭前景、`Action`/`Dialogue` 鎖死張嘴者（Q8）；每句獨立換行；錨點句一律含 `no English`。
> **旁白區塊（H11／H19／H23）一律含 `Narration: <Narrator> says:`＋`<d>[中文]…</d>` 內容欄位**（G20 r2 修正教訓），
> `speaker_constraints` 寫「畫面角色不開口、僅固定旁白聲線」；旁白共用 seed `310000`。

---

## 一、參考圖分配表

| 編號 | 角色/場景 | 來源路徑（應寫入 `ref_image_N`） | 主要區塊 |
|------|-----------|----------------------------------|----------|
| Ref-M | 林墨 | `output/ch1_beat13_ref_char/zimage_00008_.png` | H3,H6,H9,H15,H16,H17a,H17b,H19,H20,H21 |
| Ref-SELTH | 賽爾斯（前大法官） | `output/ch8_selth_ref/zimage_00064_.png` | H2,H4,H5,H7,H8,H14 |
| Ref-Sophie | 蘇菲（僅聲） | `output/ch3_sophie_ref/zimage_00021_.png` | H17a,H17b |
| Ref-NIGHT | 首都雨夜殘街 | `output/ch8_night_ref/zimage_00066_.png` | H0,H10,H11,H12,H13,H17,H18,H20,H21,H22,H23 |
| Ref-ARCH | 廢棄國家檔案館內景 | `output/ch8_archive_ref/zimage_00065_.png` | H1,H2,H3,H4,H5,H6,H7,H8,H9,H14,H15,H16 |
| Ref-SCR | 電子屏幕（通緝令） | `output/ch6_screen_ref/zimage_00056_.png` | H12,H18,H19 |

## 二、區塊總表（對白／旁白／場景分割）

| 區塊 | 型別 | 內容 | 秒 | 起始秒 |
|------|------|------|----|--------|
| H0 | 場景 | 雨夜霓虹街景 | 5 | 0s |
| H1 | 場景 | 抵達廢棄國家檔案館 | 6 | 5s |
| H2 | 對白 | 賽爾斯：林立委，你比我想像中更準時。 | 5 | 11s |
| H3 | 對白 | 林墨：賽爾斯法官，您提到的深淵是指什麼。 | 5 | 16s |
| H4 | 對白 | 賽爾斯：共識演算原始版本（前半） | 8 | 21s |
| H5 | 對白 | 賽爾斯：十年前祕密測試（後半＋但……） | 12 | 29s |
| H6 | 對白 | 林墨：但什麼。 | 3 | 41s |
| H7 | 對白 | 賽爾斯：演算法無法修正惡意＋例外清單（前半） | 13 | 44s |
| H8 | 對白 | 賽爾斯：磁帶通聯紀錄＋數位牢籠（後半） | 13 | 57s |
| H9 | 對白 | 林墨：小心。（電子干擾＋槍擊） | 5 | 70s |
| H10 | 場景 | 電子脈衝／街區燈滅 | 5 | 75s |
| H11 | 旁白 | 斷網了。 | 3 | 80s |
| H12 | 場景 | 國家防衛等級／通信切斷公告 | 4 | 83s |
| H13 | 場景 | 熱感視鏡特勤垂降 | 5 | 87s |
| H14 | 對白 | 賽爾斯：物理性刪除記憶＋聖保羅教堂發射台 | 12 | 92s |
| H15 | 場景 | 林墨廢墟狂奔、火花路標 | 6 | 104s |
| H16 | 對白 | 林墨：蘇菲。聽得到嗎。（對講機） | 4 | 110s |
| H17a | 對白 | 蘇菲（無線電聲）：全市斷網＋緊急狀態 | 8 | 114s |
| H17b | 對白 | 蘇菲（無線電聲）：通緝照片＋索利亞殺手 | 7 | 122s |
| H18 | 場景 | 電子屏幕通緝令 | 5 | 129s |
| H19 | 旁白 | 這就是赫德的最終反擊…抹黑觀察者。 | 8 | 134s |
| H20 | 場景 | 磁帶特寫（真理最後避難所） | 5 | 142s |
| H21 | 對白 | 林墨：標籤雖然快…掩蓋什麼人的罪行。 | 12 | 147s |
| H22 | 場景 | 軍車追擊、衝向發射台 | 5 | 159s |
| H23 | 旁白 | 他知道，如果他今晚死在這裡…最耀眼的一場日出。 | 13 | 164s |

> 合計 ≈ **177s**（對白 12、旁白 3、場景 9；H11/H19/H23 旁白 seed=310000）。
> 對白/旁白逐字盤點：賽爾斯 437/443÷2/447÷2/463、林墨 441/445/451/467/479、蘇菲 469÷2 全部入表，無遺漏。

---

## 三、完整提示詞

## H0 — 首都雨夜（場景，5 秒）

**來源**：`story1.md` line 433。

```
subject_definitions:
<Subject 1> is a rainy capital night street from <Picture 1>:
wet black asphalt, neon signs streaking in long distorted reflections, ruined city masonry under driving rain.

summary:
Reference-based establishing shot.
No speaker.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
No one speaks. No narration. No voice-over.

detailed_description:

Visual style:
Wide establishing shot, cold blue-black night, rain shearing the neon.

[Shot 1]

00:00-00:05

Action:
Rain hammers the empty street, neon signs smear across the wet asphalt, puddles ripple. A lone figure in a dark
suit moves through the far end of the frame toward a ruined building. Camera holds a slow push-in.

overall_soundscape:
Driving rain, distant thunder, the hiss of tyres on wet asphalt, neon hum.
No speech.

non_diegetic_music:
A low ominous drone, rain-soaked.
```

**參數**：`ref_image_0=output/ch8_night_ref/zimage_00066_.png, duration=5, seed=480000, out=ch8_h0_video`

---

## H1 — 抵達廢棄國家檔案館（場景，6 秒）

**來源**：`story1.md` line 435。

```
subject_definitions:
<Subject 1> is a ruined national archive building from <Picture 1>:
broken facade, collapsed steel shelving, cracked plaster walls, dust and debris, cold blue-grey light.

summary:
Reference-based arrival.
No speaker.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
No one speaks. No narration. No voice-over.

detailed_description:

Visual style:
Tracking shot following the figure through the ruined doorway, cold blue-grey ruin light.

[Shot 1]

00:00-00:06

Action:
Lin steps through a broken doorway into the abandoned archive. Shelves lie collapsed, paper dust drifts; on a
cracked plaster wall a long faded spray-painted slogan remains visible (visible on-screen text). Camera follows
him inside as dust rolls off his sleeve.

overall_soundscape:
Dragging boots on debris, distant rain, the slow shift of ruined paper.
No speech.

non_diegetic_music:
A low hollow drone.
```

**參數**：`ref_image_0=output/ch8_archive_ref/zimage_00065_.png, duration=6, seed=480001, out=ch8_h1_video`

---

## H2 — 賽爾斯：你比我想像中更準時（對白，5 秒）

**來源**：`story1.md` line 437。

```
subject_definitions:
<Subject 1> is the retired Chief Justice Selth from <Picture 1>:
extremely elderly East Asian man in his early eighties, gaunt deeply wrinkled face, wispy white hair, thin white
moustache, heavy dark overcoat, thick woollen blanket over his legs, seated in an old steel wheelchair, cradling an
antique analog cassette player.

<Subject 2> is the ruined national archive from <Picture 2>:
collapsed shelving, cracked plaster, dust drifting in cold blue-grey light.

summary:
Reference-based arrival line.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Medium close-up on Selth in the wheelchair, the shadowed ruins behind him.

[Shot 1]

00:00-00:05

Action:
Selth speaks from the shadow, addressing the newcomer by his committee title. Malice cannot move his lips; the
person being addressed listens silently with lips closed in the far background, out of focus. Only Selth's mouth
moves, articulating clearly with each syllable. Camera stays on Selth.
Lip sync must follow the line exactly.

Dialogue:
The following lines belong to <Subject 1> alone. <Subject 2> remains silent.
<Subject 1> says:

<d>
[中文]
林立委，你比我想像中更準時。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
Dusty silence of the ruined hall, rain beyond the walls.
No other speech.

non_diegetic_music:
A low bass note, ominous.
```

**參數**：`ref_image_0=output/ch8_selth_ref/zimage_00064_.png, ref_image_1=output/ch8_archive_ref/zimage_00065_.png, duration=5, seed=480002, out=ch8_h2_video`

---

## H3 — 林墨：深淵是指什麼（對白，5 秒）

**來源**：`story1.md` line 441。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, breathing hard,
eyes wary.

<Subject 2> is the ruined national archive from <Picture 2>:
collapsed shelving, cracked plaster, dust drifting in cold blue-grey light.

summary:
Reference-based question.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Medium close-up on Lin's wary face, the old man a blurred shape in the background.

[Shot 1]

00:00-00:05

Action:
Lin studies the old man in the wheelchair, asks his question. The person he addresses, the old justice, remains
silent in the far background with lips closed; only Lin's mouth moves, articulating clearly with each syllable.
Camera stays on Lin.
Lip sync must follow the line exactly.

Dialogue:
The following lines belong to <Subject 1> alone. <Subject 2> remains silent.
<Subject 1> says:

<d>
[中文]
賽爾斯法官，您提到的深淵是指什麼。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
His quick breathing, dust settling, faint rain.
No other speech.

non_diegetic_music:
A low tension string.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch8_archive_ref/zimage_00065_.png, duration=5, seed=480003, out=ch8_h3_video`

---

## H4 — 賽爾斯：共識演算的原始版本（對白，8 秒）

**來源**：`story1.md` line 443 前段。

```
subject_definitions:
<Subject 1> is the retired Chief Justice Selth from <Picture 1>:
extremely elderly East Asian man in his early eighties, gaunt deeply wrinkled face, wispy white hair, thin white
moustache, heavy dark overcoat, thick woollen blanket over his legs, seated in an old steel wheelchair, cradling an
antique analog cassette player.

<Subject 2> is the ruined national archive from <Picture 2>:
collapsed shelving, cracked plaster, dust drifting in cold blue-grey light.

summary:
Reference-based revelation.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Medium close-up on Selth, a sad smile under the wispy moustache, cold ruin light.

[Shot 1]

00:00-00:08

Action:
Selth tells Lin the origin of the consensus algorithm, a bitter smile passing over his face. The person he
addresses stays out of the foreground, listening with lips closed; only Selth's mouth moves, articulating clearly
with each syllable. Camera holds Selth.
Lip sync must follow the line exactly.

Dialogue:
The following lines belong to <Subject 1> alone. <Subject 2> remains silent.
<Subject 1> says:

<d>
[中文]
是共識演算的原始版本。
你以為你是第一個想到民主三點零的人嗎。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
Old man's dry breathing, the faint whir of the tape player.
No other speech.

non_diegetic_music:
A low string line, sad and cold.
```

**參數**：`ref_image_0=output/ch8_selth_ref/zimage_00064_.png, ref_image_1=output/ch8_archive_ref/zimage_00065_.png, duration=8, seed=480004, out=ch8_h4_video`

---

## H5 — 賽爾斯：十年前祕密測試（對白，12 秒）

**來源**：`story1.md` line 443 後段。

```
subject_definitions:
<Subject 1> is the retired Chief Justice Selth from <Picture 1>:
extremely elderly East Asian man in his early eighties, gaunt deeply wrinkled face, wispy white hair, thin white
moustache, heavy dark overcoat, thick woollen blanket over his legs, seated in an old steel wheelchair, thumbs
resting on an antique analog cassette player.

<Subject 2> is the ruined national archive from <Picture 2>:
collapsed shelving, cracked plaster, dust drifting in cold blue-grey light.

summary:
Reference-based confession.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Slow push-in on Selth's tired face, the tape player in his hands.

[Shot 1]

00:00-00:12

Action:
Selth confesses the secret test done on the eve of Soliya's collapse, his voice trailing into a long pause on the
last word. The person he addresses listens out of the foreground with lips closed; only Selth's mouth moves,
articulating clearly. Camera slowly pushes in and stays on Selth.
Lip sync must follow the line exactly.

Dialogue:
The following lines belong to <Subject 1> alone. <Subject 2> remains silent.
<Subject 1> says:

<d>
[中文]
不，十年前，我們在索利亞崩潰前夕，就已經在那邊祕密測試過這套系統。
我們想用數據挽救那個國家，但……
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
The faint mechanical whir of the cassette player, dust settling.
No other speech.

non_diegetic_music:
A low cello toll, mournful.
```

**參數**：`ref_image_0=output/ch8_selth_ref/zimage_00064_.png, ref_image_1=output/ch8_archive_ref/zimage_00065_.png, duration=12, seed=480005, out=ch8_h5_video`

---

## H6 — 林墨：但什麼（對白，3 秒）

**來源**：`story1.md` line 445。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, leaning forward,
brow furrowed.

<Subject 2> is the ruined national archive from <Picture 2>:
collapsed shelving, cracked plaster, dust drifting in cold blue-grey light.

summary:
Reference-based prompt.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Tight medium close-up on Lin's face, waiting.

[Shot 1]

00:00-00:03

Action:
Lin leans in and presses the old man with one short question. The man he addresses stays silent, lips closed, out
of the foreground; only Lin's mouth moves, articulating clearly. Camera stays on Lin.
Lip sync must follow the line exactly.

Dialogue:
The following lines belong to <Subject 1> alone. <Subject 2> remains silent.
<Subject 1> says:

<d>
[中文]
但什麼。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
Tense silence, dust drifting.
No other speech.

non_diegetic_music:
A held low note, waiting.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch8_archive_ref/zimage_00065_.png, duration=3, seed=480006, out=ch8_h6_video`

---

## H7 — 賽爾斯：演算法無法修正惡意（對白，13 秒）

**來源**：`story1.md` line 447 前段。

```
subject_definitions:
<Subject 1> is the retired Chief Justice Selth from <Picture 1>:
extremely elderly East Asian man in his early eighties, gaunt deeply wrinkled face, wispy white hair, thin white
moustache, heavy dark overcoat, thick woollen blanket over his legs, seated in an old steel wheelchair, trembling
hand pressing play on an antique cassette player.

<Subject 2> is the ruined national archive from <Picture 2>:
collapsed shelving, cracked plaster, dust drifting in cold blue-grey light.

summary:
Reference-based secret reveal.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Medium close-up on Selth, his trembling hand on the player, dry lips moving.

[Shot 1]

00:00-00:13

Action:
Selth's hand trembles as he presses the play button; the tape whirs. He speaks of the backdoor the government
planted in the system and the exception list. The person who listens stays silent out of the foreground with lips
closed; only Selth's mouth moves, articulating clearly with each syllable. Camera holds him.
Lip sync must follow the line exactly.

Dialogue:
The following lines belong to <Subject 1> alone. <Subject 2> remains silent.
<Subject 1> says:

<d>
[中文]
但我們發現，演算法可以修正錯誤，卻無法修正惡意。
政府在系統裡植入了一個後門，叫作例外清單。
只要被標註為例外，數據就不再真實。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
Cassette tape hissing, his dry breathing.
No other speech.

non_diegetic_music:
A low industrial undertone.
```

**參數**：`ref_image_0=output/ch8_selth_ref/zimage_00064_.png, ref_image_1=output/ch8_archive_ref/zimage_00065_.png, duration=13, seed=480007, out=ch8_h7_video`

---

## H8 — 賽爾斯：磁帶與數位牢籠（對白，13 秒）

**來源**：`story1.md` line 447 後段。

```
subject_definitions:
<Subject 1> is the retired Chief Justice Selth from <Picture 1>:
extremely elderly East Asian man in his early eighties, gaunt deeply wrinkled face, wispy white hair, thin white
moustache, heavy dark overcoat, thick woollen blanket over his legs, seated in an old steel wheelchair, holding a
cassette tape up in one shaking hand.

<Subject 2> is the ruined national archive from <Picture 2>:
collapsed shelving, cracked plaster, dust drifting in cold blue-grey light.

summary:
Reference-based accusation.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Medium close-up on Selth with the cassette held up, cold light glinting off the plastic shell.

[Shot 1]

00:00-00:13

Action:
Selth explains what is recorded on the tape and what the president built on the ruins. His voice turns bitter and
grave. The listener remains silent in the background with lips closed; only Selth's mouth moves, articulating with
each syllable. Camera stays on Selth.
Lip sync must follow the line exactly.

Dialogue:
The following lines belong to <Subject 1> alone. <Subject 2> remains silent.
<Subject 1> says:

<d>
[中文]
這捲磁帶裡，有歐若拉現任總統赫德當年參與索利亞實驗的通聯紀錄。
他不是想防止索利亞化，他是想在那套廢墟上，建立一個更完美的數位牢籠。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
Cassette hiss fading, settling dust.
No other speech.

non_diegetic_music:
A slow cold harmonic swell.
```

**參數**：`ref_image_0=output/ch8_selth_ref/zimage_00064_.png, ref_image_1=output/ch8_archive_ref/zimage_00065_.png, duration=13, seed=480008, out=ch8_h8_video`

---

## H9 — 林墨：小心！（對白＋槍擊，5 秒）

**來源**：`story1.md` line 451–453。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, eyes snapping
wide in alarm.

<Subject 2> is the ruined national archive from <Picture 2>:
collapsed shelving, cracked plaster, dust drifting in cold blue-grey light.

<Subject 3> is the retired Chief Justice Selth from <Picture 3>:
extremely elderly East Asian man in his early eighties, gaunt deeply wrinkled face, wispy white hair, thin white
moustache, heavy dark overcoat, thick woollen blanket over his legs, seated in his old steel wheelchair, gripping
the armrests, silent and unmoving.

summary:
Reference-based alarm.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.
<Subject 3>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Handheld shake, a sudden slash of muzzle-flash in the ruin.

[Shot 1]

00:00-00:05

Action:
A sharp electronic interference shriek cuts through. Lin cries out, lunges, and shoves the wheelchair with Selth
still seated in it behind a stone pillar; the wheelchair rolls on its wheels and Selth stays seated, gripping the
armrests. A suppressed shot cracks and a bullet hits the wheelchair frame with a burst of EMP sparks. Camera
jerks with the impact.

Dialogue:
Only <Subject 1> shouts this single cry; no one replies.
<Subject 1> says:

<d>
[中文]
小心。
</d>

overall_soundscape:
Electronic interference shriek, a muffled gunshot, an electric crackle of the pulse round.
No other speech.

non_diegetic_music:
None, only the percussive noise.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch8_archive_ref/zimage_00065_.png, ref_image_2=output/ch8_selth_ref/zimage_00064_.png, duration=5, seed=480009, out=ch8_h9_video`

---

## H10 — 電子脈衝／街區燈滅（場景，5 秒）

**來源**：`story1.md` line 455。

```
subject_definitions:
<Subject 1> is a rainy capital night street from <Picture 1>:
wet black asphalt, neon reflections, ruined masonry under rain.

summary:
Reference-based blackout.
No speaker.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
No one speaks. No narration. No voice-over.

detailed_description:

Visual style:
Wide shot of the street, lights dying one by one into darkness.

[Shot 1]

00:00-00:05

Action:
The electromagnetic pulse ripples outward; street lamps and signs die one by one along the block, plunging the
street into sudden black. A thin wisp of smoke curls from a smashed storefront, rain still falling.

overall_soundscape:
A rising electric hum cutting into silence as each lamp dies, rain hissing.
No speech.

non_diegetic_music:
A single low organ note hanging in the dark.
```

**參數**：`ref_image_0=output/ch8_night_ref/zimage_00066_.png, duration=5, seed=480010, out=ch8_h10_video`

---

## H11 — 旁白：斷網了（旁白，3 秒）

**來源**：`story1.md` line 457。

```
subject_definitions:
<Subject 1> is a rainy capital night street from <Picture 1>:
a wide black street after the blackout, wet asphalt, faint residual glow in the gutters.

summary:
Reference-based blackout narration.
No speaker.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
No character speaks in frame. Narration by the fixed narrator voice only. No on-screen mouth movement.
No other speech.

detailed_description:

Visual style:
Near-black frame, the street a pool of deep shadow under steady rain.

[Shot 1]

00:00-00:03

Action:
The dark street holds for a beat in the rain; a single distant emergency light blinks once. Nothing else moves.

Narration:
<Narrator> says:

<d>
[中文]
斷網了。
</d>

overall_soundscape:
Narration delivered in a low calm middle-aged male voice, Taiwan-accented Standard Mandarin (台灣腔普通話), read
flat at a steady pace, not character dialogue, not on-screen voice, no Cantonese, no English.
Rain hiss and a faint electric dying hum.

non_diegetic_music:
None.
```

**參數**：`ref_image_0=output/ch8_night_ref/zimage_00066_.png, duration=3, seed=310000（旁白專用）, out=ch8_h11_video`

---

## H12 — 國家防衛等級公告（場景，4 秒）

**來源**：`story1.md` line 459。

```
subject_definitions:
<Subject 1> is an emergency wall screen from <Picture 1>:
a dark glowing screen with bold official message text, flickering in the rain.

<Subject 2> is a rainy capital night street from <Picture 2>:
wet black asphalt, dark buildings, faint drizzle.

summary:
Reference-based broadcast.
No speaker.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No one speaks. No narration. No voice-over.

detailed_description:

Visual style:
Static-disrupted screen lit against the wet night street.

[Shot 1]

00:00-00:04

Action:
A wall screen in the dead street snaps to life under static: an official national-defence-level notice with bold
lettered text (visible on-screen text), accompanied by a short line about seizing foreign agents. Rain streaks the
glass; no one is on the street.

overall_soundscape:
Rain hiss, the electronic hum of a screen waking, faint distant siren.
No speech.

non_diegetic_music:
A taut low drone.
```

**參數**：`ref_image_0=output/ch6_screen_ref/zimage_00056_.png, ref_image_1=output/ch8_night_ref/zimage_00066_.png, duration=4, seed=480011, out=ch8_h12_video`

---

## H13 — 熱感視鏡特勤垂降（場景，5 秒）

**來源**：`story1.md` line 461。

```
subject_definitions:
<Subject 1> is a rainy capital night street from <Picture 1>:
wet black asphalt, dark ruined masonry, faint residual glow in the gutters.

summary:
Reference-based ambush.
No speaker.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
No one speaks. No narration. No voice-over.

detailed_description:

Visual style:
Low-angle wide shot, silhouettes dropping into the dark.

[Shot 1]

00:00-00:05

Action:
In the blackness, several figures wearing thermal-imaging goggles descend on ropes from a high structure; black
tactical suits, suppressed rifles slung under their arms. They land soundlessly and fan out into the ruins.

overall_soundscape:
Rope strain, soft landings, the rustle of tactical fabric, rain.
No speech.

non_diegetic_music:
A low percussive heartbeat.
```

**參數**：`ref_image_0=output/ch8_night_ref/zimage_00066_.png, duration=5, seed=480012, out=ch8_h13_video`

---

## H14 — 賽爾斯：快走！（對白，12 秒）

**來源**：`story1.md` line 463。

```
subject_definitions:
<Subject 1> is the retired Chief Justice Selth from <Picture 1>:
extremely elderly East Asian man in his early eighties, gaunt deeply wrinkled face, wispy white hair, thin white
moustache, heavy dark overcoat, thick woollen blanket over his legs, seated in an old steel wheelchair, coughing,
pressing a cassette into the listener's hand.

<Subject 2> is the ruined national archive from <Picture 2>:
collapsed shelving, cracked plaster, dust drifting in cold blue-grey light.

summary:
Reference-based urgent handoff.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Medium close-up on Selth, eyes urgent in the dark, pushing the tape into Lin's hand.

[Shot 1]

00:00-00:12

Action:
Selth coughs hard in the dark, then presses the cassette into the younger man's hand and commands the escape route
to the basilica transmitter. The man he speaks to listens with lips closed, out of the foreground; only Selth's
mouth moves, articulating clearly with each syllable. Camera stays on Selth.
Lip sync must follow the line exactly.

Dialogue:
The following lines belong to <Subject 1> alone. <Subject 2> remains silent.
<Subject 1> says:

<d>
[中文]
他們不是要抓你，林墨。
他們是要物理性地刪除這段記憶。
快走。
去聖保羅大教堂的發射台，那是唯一不受行政網關控制的獨立訊號源。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
Harsh coughing, rain, the tape case clicking between hands.
No other speech.

non_diegetic_music:
A fast low string pulse.
```

**參數**：`ref_image_0=output/ch8_selth_ref/zimage_00064_.png, ref_image_1=output/ch8_archive_ref/zimage_00065_.png, duration=12, seed=480013, out=ch8_h14_video`

---

## H15 — 林墨廢墟狂奔（場景，6 秒）

**來源**：`story1.md` line 465。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, sprinting hard.

<Subject 2> is the ruined national archive from <Picture 2>:
collapsed shelving, cracked plaster, broken corridors in cold blue-grey light.

summary:
Reference-based chase.
No speaker.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No one speaks. No narration. No voice-over.

detailed_description:

Visual style:
Handheld tracking shot dense and low behind Lin's shoulder.

[Shot 1]

00:00-00:06

Action:
Lin bolts through the ruined archive corridors. Suppressed shots crack behind him; sparks of ricochet off stone
columns are the only light along his path. He vaults a fallen shelf and vanishes through a doorway.

overall_soundscape:
Running footfalls on debris, muffled gunfire and ricochet sparks, heavy breathing.
No speech.

non_diegetic_music:
A driving percussion pulse.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch8_archive_ref/zimage_00065_.png, duration=6, seed=480014, out=ch8_h15_video`

---

## H16 — 林墨：蘇菲，聽得到嗎（對白，4 秒）

**來源**：`story1.md` line 467。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, crouched by a
wall, pressing a compact analog radio to his mouth.

<Subject 2> is a rainy capital night street from <Picture 2>:
wet black asphalt, dark ruined masonry, faint residual glow.

summary:
Reference-based radio call.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks on camera. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Medium close-up on Lin's face, rain beading on his shoulders, radio at his mouth.

[Shot 1]

00:00-00:04

Action:
Lin crouches against wet masonry, presses the compact radio to his mouth, and speaks into it, panting. Only his
mouth moves, articulating clearly. Camera stays on him.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
蘇菲。聽得到嗎。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
Rain, heavy breaths, radio static tail.
No other speech.

non_diegetic_music:
None, rain only.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch8_night_ref/zimage_00066_.png, duration=4, seed=480015, out=ch8_h16_video`

---

## H17a — 蘇菲：全市都斷網了（對白，8 秒）

**來源**：`story1.md` line 469 前段。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, crouched by a
wall, rain-soaked, pressing a compact analog radio to his ear.

<Subject 2> is Sophie, a young woman from <Picture 2>:
small, sharp eyes, ponytail, dark academy sweater, heard only through the analog radio, facing a speaker room in
fear; her face never appears on screen.

summary:
Reference-based radio response.
Voice only, off-screen.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 2>'s voice is heard through the radio, off-screen. No character speaks on camera. No narration. No
voice-over. No on-screen mouth movement.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Close-up on the radio in Lin's hand, rain glinting off its shell.

[Shot 1]

00:00-00:08

Action:
The radio crackles and a panicked young woman's voice bursts out of its speaker; Lin holds it tight to his ear,
jaw tight. Her face never appears on screen.

Dialogue:
The one speaking is <Subject 2> off-screen; <Subject 1> only listens, lips sealed.
<Subject 2> says:

<d>
[中文]
老師。
全市都斷網了。
政府宣布進入緊急狀態，理由是你刺殺了前大法官賽爾斯。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching, heard through radio distortion.
Radio hiss, rain, distant sirens.
No other speech.

non_diegetic_music:
A tense low drone.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch3_sophie_ref/zimage_00021_.png, duration=8, seed=480016, out=ch8_h17a_video`

---

## H17b — 蘇菲：通緝照片（對白，7 秒）

**來源**：`story1.md` line 469 後段。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, crouched by a
wall, rain-soaked, the compact analog radio pressed to his ear.

<Subject 2> is Sophie, a young woman from <Picture 2>:
small, sharp eyes, ponytail, dark academy sweater, heard only through the analog radio, voice shaking with fear;
her face never appears on screen.

summary:
Reference-based radio alarm.
Voice only, off-screen.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 2>'s voice is heard through the radio, off-screen. No character speaks on camera. No narration. No
voice-over. No on-screen mouth movement.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Medium close-up on Lin's face, the radio held from ear to chest, eyes hardening.

[Shot 1]

00:00-00:07

Action:
The young woman's panicked voice continues through the radio speaker, finishing the terrible news. Lin's jaw
clenches; rain runs down his face. Her face never appears on screen.

Dialogue:
The one speaking is <Subject 2> off-screen; <Subject 1> only listens, lips sealed.
<Subject 2> says:

<d>
[中文]
他們在電視上放了你推倒輪椅的照片，說你是索利亞派來的殺手。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching, heard through radio distortion.
Radio hiss, rain, her ragged breathing.
No other speech.

non_diegetic_music:
A low tense drone swelling.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch3_sophie_ref/zimage_00021_.png, duration=7, seed=480017, out=ch8_h17b_video`

---

## H18 — 電子屏幕通緝令（場景，5 秒）

**來源**：`story1.md` line 471。

```
subject_definitions:
<Subject 1> is an emergency wall screen from <Picture 1>:
a dark glowing screen showing a wanted poster with a man's face and bold lettered text, flickering in the rain.

<Subject 2> is a rainy capital night street from <Picture 2>:
wet black asphalt, dark buildings, faint drizzle.

summary:
Reference-based wanted reveal.
No speaker.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No one speaks. No narration. No voice-over.

detailed_description:

Visual style:
Wide shot, a giant screen flaring against the wet dark street.

[Shot 1]

00:00-00:05

Action:
A colossal wall screen re-lights in the blackened street, flickering over static: a wanted poster showing a man's
face, with bold lettered text about an assassination charge and warning that he is dangerous (visible on-screen
text). Lin stops a few paces back, his face lit by the glow.

overall_soundscape:
Screen static crackle, rain, the hush spreading through the empty street.
No speech.

non_diegetic_music:
A low cold string swell.
```

**參數**：`ref_image_0=output/ch6_screen_ref/zimage_00056_.png, ref_image_1=output/ch8_night_ref/zimage_00066_.png, duration=5, seed=480018, out=ch8_h18_video`

---

## H19 — 旁白：赫德的最終反擊（旁白，8 秒）

**來源**：`story1.md` line 473。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, standing still
below a flickering screen, eyes fixed ahead.

<Subject 2> is an emergency wall screen from <Picture 2>:
a dark glowing screen with a man's wanted face and bold lettered text, flickering.

summary:
Reference-based closing narration.
No speaker.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No character speaks in frame. Narration by the fixed narrator voice only. No on-screen mouth movement.
No other speech.

detailed_description:

Visual style:
Medium shot from behind and below, Lin's silhouette against the flickering wanted screen.

[Shot 1]

00:00-00:08

Action:
Lin stands motionless before the giant wanted screen, rain streaking past him. The screen flickers over his
silhouette as the narrator delivers the closing judgment.

Narration:
<Narrator> says:

<d>
[中文]
這就是赫德的最終反擊。
當數據無法被操縱時，就操縱現實。
當現實無法被掩蓋時，就抹黑觀察者。
</d>

overall_soundscape:
Narration delivered in a low calm middle-aged male voice, Taiwan-accented Standard Mandarin (台灣腔普通話), read
flat at a steady pace, not character dialogue, not on-screen voice, no Cantonese, no English.
Rain, screen static, distant sirens.

non_diegetic_music:
A low cello line, grave.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch6_screen_ref/zimage_00056_.png, duration=8, seed=310000（旁白專用）, out=ch8_h19_video`

---

## H20 — 磁帶特寫（場景，5 秒）

**來源**：`story1.md` line 475。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, holding a
cassette tape in both hands.

<Subject 2> is a rainy capital night street from <Picture 2>:
wet black asphalt, dark ruins, neon glow bleeding from an alley.

summary:
Reference-based object close-up.
No speaker.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No one speaks. No narration. No voice-over.

detailed_description:

Visual style:
Macro close-up on the cassette in Lin's hands, shallow depth of field.

[Shot 1]

00:00-00:05

Action:
Lin looks down at the antique cassette in his hands; rain streaks the plastic shell, neon bleeding reflections
along the spools. His thumb turns a reel slowly, then he tucks it inside his jacket.

overall_soundscape:
Rain, the soft click of the cassette shell, his breathing.
No speech.

non_diegetic_music:
A spare piano note, reverent.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch8_night_ref/zimage_00066_.png, duration=5, seed=480019, out=ch8_h20_video`

---

## H21 — 林墨：標籤雖然快（對白，12 秒）

**來源**：`story1.md` line 479。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, seated on an old
motorcycle, rain-soaked, eyes piercing in the dark.

<Subject 2> is a rainy capital night street from <Picture 2>:
wet black asphalt, dark alley opening, neon glow bleeding.

summary:
Reference-based vow.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Medium close-up on Lin on the motorcycle, the dark street behind him.

[Shot 1]

00:00-00:12

Action:
Lin kicks the old motorcycle to life, pockets the tape inside his jacket, and speaks into the empty night, defying
whoever listens. Only his mouth moves, articulating clearly with each syllable; no one answers. Camera holds his
face, then gunshot-red lights of army vehicles bloom far behind him as he revs.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
標籤雖然快，但它們怕光。
既然你們要進入緊急狀態，那我就讓全聯邦的人看看，這場緊急狀態到底是在掩蓋什麼人的罪行。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
Engine thrum, rain, rising far-off sirens.
No other speech.

non_diegetic_music:
A rising percussion pulse under the vow.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch8_night_ref/zimage_00066_.png, duration=12, seed=480020, out=ch8_h21_video`

---

## H22 — 軍車追擊（場景，5 秒）

**來源**：`story1.md` line 481。

```
subject_definitions:
<Subject 1> is a rainy capital night street from <Picture 1>:
wet black asphalt, dark narrow alley, faint neon glow bleeding.

summary:
Reference-based pursuit.
No speaker.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
No one speaks. No narration. No voice-over.

detailed_description:

Visual style:
Low wide shot, pursuit lights flaring through rain.

[Shot 1]

00:00-00:05

Action:
Army vehicles round the alley mouth far behind, their warning lights flaring through the rain and engine roars
closing in. Lin's motorcycle fishtails around a corner and races toward a distant church spire on the skyline.

overall_soundscape:
Roaring engines, squealing tyres, rain, storming sirens.
No speech.

non_diegetic_music:
A pounding chase percussion.
```

**參數**：`ref_image_0=output/ch8_night_ref/zimage_00066_.png, duration=5, seed=480021, out=ch8_h22_video`

---

## H23 — 旁白：最耀眼的一場日出（旁白，13 秒）

**來源**：`story1.md` lines 483–484。

```
subject_definitions:
<Subject 1> is a rainy capital night street from <Picture 1>:
wet black asphalt receding toward a distant basilica spire, stormclouds cracking with faint gold.

summary:
Reference-based closing narration.
No speaker.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
No character speaks in frame. Narration by the fixed narrator voice only. No on-screen mouth movement.
No other speech.

detailed_description:

Visual style:
Wide slow tracking shot racing the motorcycle toward the cathedral spire, the city dark around it.

[Shot 1]

00:00-00:13

Action:
The motorcycle races through the wet dark city toward the basilica spire. Ahead, a thin seam of gold cracks open
through the stormclouds, a promise of sunrise. The narrator delivers the closing lines over the motion.

Narration:
<Narrator> says:

<d>
[中文]
他知道，如果他今晚死在這裡，他就會被永遠釘在賣國賊的標籤上。
但如果他抵達了那裡，那捲磁帶裡的數據，將會變成歐若拉聯邦歷史上最耀眼的一場日出。
</d>

overall_soundscape:
Narration delivered in a low calm middle-aged male voice, Taiwan-accented Standard Mandarin (台灣腔普通話), read
flat at a steady pace, not character dialogue, not on-screen voice, no Cantonese, no English.
Engine roar, rain, wind tearing past.

non_diegetic_music:
A slow awakening string swell into faint warmth.
```

**參數**：`ref_image_0=output/ch8_night_ref/zimage_00066_.png, duration=13, seed=310000（旁白專用）, out=ch8_h23_video`

---

## 四、字幕資料表（區塊順序、起始秒、逐字字幕）

> 時間為規劃秒（合併後以 scale=實際總長/177 換算，實際值於合併後回填）。旁白（H11／H19／H23）字幕包 `<i>…</i>`。
> 起始秒＝前序區塊累計時長：H0=0、H1=5、H2=11、H3=16、H4=21、H5=29、H6=41、H7=44、H8=57、H9=70、
> H10=75、H11=80、H12=83、H13=87、H14=92、H15=104、H16=110、H17a=114、H17b=122、H18=129、H19=134、H20=142、H21=147、H22=159、H23=164。

| # | 區塊 | 類型 | 秒 | 起始秒 | 字幕（逐字） |
|---|------|------|----|--------|--------------|
| 1 | H2 | 對白 | 5 | 11s | 林立委，你比我想像中更準時。 |
| 2 | H3 | 對白 | 5 | 16s | 賽爾斯法官，您提到的深淵是指什麼。 |
| 3 | H4 | 對白 | 8 | 21s | 是共識演算的原始版本。你以為你是第一個想到民主三點零的人嗎。 |
| 4 | H5 | 對白 | 12 | 29s | 不，十年前，我們在索利亞崩潰前夕，就已經在那邊祕密測試過這套系統。我們想用數據挽救那個國家，但…… |
| 5 | H6 | 對白 | 3 | 41s | 但什麼。 |
| 6 | H7 | 對白 | 13 | 44s | 但我們發現，演算法可以修正錯誤，卻無法修正惡意。政府在系統裡植入了一個後門，叫作例外清單。只要被標註為例外，數據就不再真實。 |
| 7 | H8 | 對白 | 13 | 57s | 這捲磁帶裡，有歐若拉現任總統赫德當年參與索利亞實驗的通聯紀錄。他不是想防止索利亞化，他是想在那套廢墟上，建立一個更完美的數位牢籠。 |
| 8 | H9 | 對白 | 5 | 70s | 小心。 |
| 9 | H11 | 旁白 | 3 | 80s | `<i>`斷網了。`</i>` |
| 10 | H14 | 對白 | 12 | 92s | 他們不是要抓你，林墨。他們是要物理性地刪除這段記憶。快走。去聖保羅大教堂的發射台，那是唯一不受行政網關控制的獨立訊號源。 |
| 11 | H16 | 對白 | 4 | 110s | 蘇菲。聽得到嗎。 |
| 12 | H17a | 對白 | 8 | 114s | 老師。全市都斷網了。政府宣布進入緊急狀態，理由是你刺殺了前大法官賽爾斯。 |
| 13 | H17b | 對白 | 7 | 122s | 他們在電視上放了你推倒輪椅的照片，說你是索利亞派來的殺手。 |
| 14 | H19 | 旁白 | 8 | 134s | `<i>`這就是赫德的最終反擊。當數據無法被操縱時，就操縱現實。當現實無法被掩蓋時，就抹黑觀察者。`</i>` |
| 15 | H21 | 對白 | 12 | 147s | 標籤雖然快，但它們怕光。既然你們要進入緊急狀態，那我就讓全聯邦的人看看，這場緊急狀態到底是在掩蓋什麼人的罪行。 |
| 16 | H23 | 旁白 | 13 | 164s | `<i>`他知道，如果他今晚死在這裡，他就會被永遠釘在賣國賊的標籤上。但如果他抵達了那裡，那捲磁帶裡的數據，將會變成歐若拉聯邦歷史上最耀眼的一場日出。`</i>` |

> 字幕序即起始秒排序（16 條全部對白/旁白；賽爾斯 437/443÷2/447÷2/463、林墨 441/445/451/467/479、蘇菲 469÷2、
> 旁白 457/473/483–484 全部入列，無遺漏）。

---

## 五、產出前自檢（H0–H23）

- [ ] 對白/旁白逐字對照 `story1.md` 第八章（lines 431–485），僅移除標點符號引號，無省略、無自創。
- [ ] `<d>` 內被唸文字皆中文，無 `%`／阿拉伯數字／`「」『』《》`／冒號／刪節號（僅 H5 保留「……」氣口）／驚嘆號；每句獨立換行（QA Q2/Q3/Q4）。
- [ ] 對白區塊指名 `Only <Subject N> speaks`、排除旁白；旁白區塊（H11/H19/H23）畫面角色不開口，且**必須含 `Narration: <Narrator> says:`＋`<d>[中文]…</d>` 內容欄位**（G20 r2 教訓）。
- [ ] `speaker_constraints` 皆排除 English / code-switching；外來語已中文化（3.0→三點零）（QA Q1/Q5）；`Action` 未複述台詞全文（QA Q3）。
- [ ] 說話鏡頭一律帶正向嘴部 cue（`mouth articulates clearly`）（QA Q7）；對白句間以語法銜接為本（QA Q6）。
- [ ] 對白含另一角色稱謂直呼（林立委／賽爾斯法官／老師）時，非說話者不在說話鏡頭前景（或遠景散焦、`lips closed`）；`Action` 用「名字＋張嘴者」鎖死 only `<Subject N>`'s mouth moves；無指代含糊代名詞（QA Q8）。
- [ ] 每支對白/旁白 `overall_soundscape` 帶台灣腔錨點句（含 `no English`）；seed 已對照黑名單，旁白用 310000；場景區塊無 `<d>`、無旁白暗示。
- [ ] 合併後以實際總長 scale 換算 SRT；旁白字幕包 `<i>...</i>`。

---

**參數速查**：共 25 支 r2v。對白/場景 seed 480000–480021；旁白 H11/H19/H23 共用 310000。輸出子目錄 `ch8_h*_video`。
