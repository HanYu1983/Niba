# Ch4 區塊獨立提示詞 — E0–E33（實作範例 6：第四章「標籤之雨」）

> 本文件承接 `novel_to_video_guide_v2.md` 與 `example5_ch3.md`（Ch3），
> 完整產出**第四章「標籤之雨」**的區塊分割、參考圖分配與全部 34 支 r2v 六欄位提示詞。
>
> **章節功能**：英雄廣場傳單如雨落在林墨頭頂，群眾被政府動員圍攻；林墨以「三條推播同一伺服器」與
> 「支薪雇員」當眾拆穿情緒代碼，留下金句「標籤是廉價的，數據是昂貴的」，走進國會，反將一軍
> （開源論壇同步伺服器邏輯），最後回研究室看「懷疑曲線」飆升。
> 登場角色：林墨（沿用既有肖像）、蘇菲（沿用 Ch3 肖像）、記者、紅衣人、支薪小伙（輿論引導課雇員）、
> 親政府立委（新肖像）。

---

## 一、參考圖管理表（Step 1：一次性建置）

> 沿用既有：`Ref-M`（林墨）、`Ref-Sph`（蘇菲）、`Ref-O`（研究室）。Ch4 新增 **10 張 Z-Image**：
> 廣場、傳單特寫、投影宣傳片、平板網絡圖、社媒牆、國會大廳、記者、紅衣人、制服小伙、親政府立委。

| 編號 | 檔名（實際既有） | 內容 | 尺寸 | 用於區塊 |
|------|------|------|------|---------|
| Ref-M | `output/ch1_beat13_ref_char/zimage_00008_.png`（**共用**，同 Ch1/Ch2/Ch3） | 林墨肖像：瘦削中年、灰絲黑髮、淺鬍茬、深炭灰西裝、皺白襯衫 | 832×1248 (2:3) | 所有含林墨的區塊 |
| Ref-Sph | `output/ch3_sophie_ref/zimage_00021_.png`（既有） | 蘇菲肖像：二十多歲、黑長髮鬆紮、素色深針織外套+白襯衫、蒼白憂慮 | 832×1248 | E31、E32 |
| Ref-O | `output/ch3_office_ref/zimage_00019_.png`（既有） | 研究室：深夜、螢幕+桌燈、復古筆電、紙堆、夜窗黑車 | 832×1248 | E31、E32 |
| Ref-HQ | `output/ch4_hero_square_ref/zimage_*.png`（**新增**） | 英雄廣場全景：摩天大樓、大批紅衣群眾、傳單如雨、中央防彈轎車 | 832×1248 | E0、E2–E5、E7、E8、E12、E15–E19、E21–E26 |
| Ref-FLY | `output/ch4_flyer_ref/zimage_*.png`（**新增**） | 傳單特寫：林墨與索利亞難民握手合成照＋背面螢光字 | 832×1248 | E1 |
| Ref-PROJ | `output/ch4_projection_ref/zimage_*.png`（**新增**） | 廣場中央巨大投影螢幕：政府宣傳片「資訊病毒」網絡圖 | 832×1248 | E7 |
| Ref-TAB | `output/ch4_tablet_ref/zimage_*.png`（**新增**） | 平板電腦特寫：複雜網絡追蹤圖、伺服器節點以紅線連結 | 832×1248 | E9、E10a、E10b、E13、E14 |
| Ref-SM | `output/ch4_socialwall_ref/zimage_*.png`（**新增**） | 社媒牆：#林墨的陰謀 hashtag 破千萬、即時動態巨大牆 | 832×1248 | E4 |
| Ref-LOB | `output/ch4_lobby_ref/zimage_*.png`（**新增**） | 國會大廳：大理石柱、冷調光、幾名親政府立委冷冷站著 | 832×1248 | E27–E30 |
| Ref-REP | `output/ch4_reporter_ref/zimage_*.png`（**新增**） | 記者肖像：中年男記者、深色大衣、手持麥克風 | 832×1248 | E6 |
| Ref-RED | `output/ch4_redman_ref/zimage_*.png`（**新增**） | 紅衣人肖像：壯碩中年男、鮮紅外套、怒喊 | 832×1248 | E15 |
| Ref-EMP | `output/ch4_employee_ref/zimage_*.png`（**新增**） | 制服小伙肖像：二十歲出頭、灰制服「輿論引導課」臂章、蒼白 | 832×1248 | E16、E17 |
| Ref-POL | `output/ch4_politician_ref/zimage_*.png`（**新增**） | 親政府立委肖像：禿頭偏胖中年、深藍西裝、冷蔑 | 832×1248 | E28 |

> **建置狀態**：Ch4 需新建 10 張（Step 1 一次完成），其餘沿用。

---

## 二、總表：區塊分割與計秒

> 對白 4 字/秒、旁白 5 字/秒（台灣腔普通話），留緩神餘裕進位；場景按動作粗估、寧短勿長。
> 原文範圍：`story1.md` 第四章（lines 188–257）。全部合併規劃約 **252 秒**。

| # | 類型 | 內容 | 秒 |
|---|------|------|----|
| E0 | 場景 | 高空俯拍：英雄廣場、摩天大樓、傳單如雨落下（line 190） | 5 |
| E1 | 旁白 | 「那不是水滴，而是數以萬計的傳單…『出賣未來的數據叛徒』」（lines 190–192） | 8 |
| E2 | 場景 | 林墨踏出防彈轎車、熱浪怒吼迎面（line 194） | 4 |
| E3 | 場景 | 群眾怒吼口號（賣國賊／滾回數據庫／冷血計算）（lines 196–198，口號入音場） | 6 |
| E4 | 場景 | 紅衣支持者、民主保衛手冊、社媒牆 #林墨的陰謀 破千萬（line 200） | 8 |
| E5 | 場景 | 十名保鏢簇擁前行、發臭雞蛋砸肩、蛋黃沿西裝流下（line 202） | 5 |
| E6 | 對白 | 記者：「林立委…你是否願意放棄豁免權接受調查？」（line 204） | 11 |
| E7 | 場景 | 林墨停步、看向巨大投影螢幕的政府宣傳片（資訊病毒）（lines 206–208） | 6 |
| E8 | 對白 | 林墨：「我想請各位看一個東西。」（line 210） | 3 |
| E9 | 場景 | 從懷中拿出平板、手指定格網絡圖（line 212） | 5 |
| E10a | 對白 | 林墨：「現在，請大家低頭看看你們的手機。就在剛才，你們收到了三條推播。」（line 214） | 8 |
| E10b | 對白 | 林墨：「第一條是我的誹聞…第三條是匯率上揚的錯誤數據。」（line 214） | 12 |
| E11 | （保留） | — | — |
| E12 | 場景 | 人群中騷動、許多人下意識掏手機（line 216） | 5 |
| E13 | 對白 | 林墨：「這些訊息是在四十五秒內，由同一個位於行政區的伺服器發出的。」（line 218） | 8 |
| E14 | 對白 | 林墨：「這就是你們引以為傲的『熱情』…按秒計算出來的。」（line 218） | 15 |
| E15 | 對白 | 紅衣人：「胡說八道！我們是自發來的！」（line 220） | 4 |
| E16 | 對白 | 林墨：「你是自發來的，但他不是…發動前三次尖叫…」（line 222） | 13 |
| E17 | 場景 | 小伙子臉色慘白、下意識躲進人群（line 224） | 5 |
| E18a | 對白 | 林墨：「大家看！每一張傳單的印刷費用是零點五歐若拉幣，這裡有三萬張。」（lines 226–228） | 7 |
| E18b | 對白 | 林墨：「這筆錢沒有出現在行政院的預算表裡，而是掛在『社會和諧推廣費』的名下。」（line 228） | 8 |
| E19 | 對白 | 林墨直視攝影機：「你們在拿著自己的稅金，買這場羞辱你們自己智商的表演。」（line 228） | 7 |
| E20 | （保留） | — | — |
| E21 | 場景 | 廣場詭異安靜、風吹傳單沙沙聲；拍蛋殼、整理領帶（lines 230–232） | 5 |
| E22 | 對白 | 林墨：「標籤是廉價的，因為它不需要大腦。但數據是昂貴的，因為它需要勇氣。」（line 234） | 9 |
| E23 | （保留） | — | — |
| E24 | 對白 | 林墨回頭：「明天，當表決開始時…把那三條訊息的原始證據拿出來。」（line 238） | 13 |
| E25 | 場景 | 穿過自動分開的人群、走向國會大門、回望群眾（line 236） | 8 |
| E26 | 對白 | 林墨：「如果拿不出來，那麼這場『標籤之雨』，就是這個國家最後的氣數。」（line 238） | 7 |
| E27 | 場景 | 國會大門沉重關上；大廳內親政府立委冷冷看著（lines 240–242） | 4 |
| E28 | 對白 | 立委：「林墨，你剛才在外面玩的把戲很有趣…第一讀都過不了。」（line 242） | 14 |
| E29a | 對白 | 林墨：「那可不一定。」（line 244） | 3 |
| E29b | 對白 | 林墨：「因為我剛才在廣場上，不只是在說話…同步到了全聯邦所有的開源論壇上。」（line 246） | 12 |
| E30 | 對白 | 林墨：「現在，全歐若拉聯邦的年輕人都在玩一個遊戲：找出藏在政府宣傳裡的『代碼錯誤』。」（line 246） | 9 |
| E31 | 對白 | 蘇菲：「老師，數據上線了。流量……爆炸了。」（line 250） | 4 |
| E32a | 場景 | 推開研究室門、蘇菲緊張看著螢幕（line 248） | 5 |
| E32b | 旁白 | 「他知道，標籤的雨雖然很大…泥濘就困不住所有人。」（line 252） | 6 |

> 全表 **34 個區塊**（E0–E33），對白 19、旁白 2、場景 13。旁白 `seed=310000`（見第 6 節）。
> 群眾口號（E3）與擴音器一律只入 `overall_soundscape`，畫面無對嘴角色、不進 `<d>`。

---

## 三、區塊 × 參考圖對照

| 區塊 | 類型 | ref_image_0 | ref_image_1 | ref_image_2 | duration |
|------|------|-------------|-------------|-------------|----------|
| E0 | 場景 | Ref-HQ 廣場 | — | — | 5 |
| E1 | 旁白 | Ref-FLY 傳單特寫 | Ref-HQ 廣場 | — | 8 |
| E2 | 場景 | Ref-M 林墨 | Ref-HQ 廣場(轎車) | — | 4 |
| E3 | 場景 | Ref-HQ 廣場(群眾) | — | — | 6 |
| E4 | 場景 | Ref-SM 社媒牆 | Ref-HQ 廣場 | — | 8 |
| E5 | 場景 | Ref-M 林墨(護行) | Ref-HQ 廣場 | — | 5 |
| E6 | 對白 | Ref-REP 記者 | Ref-M 林墨 | Ref-HQ 廣場 | 11 |
| E7 | 場景 | Ref-PROJ 投影螢幕 | Ref-M 林墨(背影) | — | 6 |
| E8 | 對白 | Ref-M 林墨 | Ref-HQ 廣場 | — | 3 |
| E9 | 場景 | Ref-TAB 平板 | Ref-M 林墨(手持) | — | 5 |
| E10a | 對白 | Ref-M 林墨 | Ref-TAB 平板 | Ref-HQ 廣場 | 8 |
| E10b | 對白 | Ref-M 林墨 | Ref-TAB 平板 | — | 12 |
| E12 | 場景 | Ref-HQ 廣場(群眾掏手機) | — | — | 5 |
| E13 | 對白 | Ref-M 林墨 | Ref-TAB 平板 | — | 8 |
| E14 | 對白 | Ref-M 林墨 | Ref-TAB 平板 | Ref-HQ 廣場 | 15 |
| E15 | 對白 | Ref-RED 紅衣人 | Ref-HQ 廣場 | — | 4 |
| E16 | 對白 | Ref-M 林墨 | Ref-EMP 小伙 | Ref-HQ 廣場 | 13 |
| E17 | 場景 | Ref-EMP 小伙 | Ref-HQ 廣場(人群) | — | 5 |
| E18a | 對白 | Ref-M 林墨(指天) | Ref-HQ 廣場(傳單) | — | 7 |
| E18b | 對白 | Ref-M 林墨 | Ref-HQ 廣場 | — | 8 |
| E19 | 對白 | Ref-M 林墨(直視鏡頭) | Ref-HQ 廣場 | — | 7 |
| E21 | 場景 | Ref-HQ 廣場(寂靜) | Ref-M 林墨(整領帶) | — | 5 |
| E22 | 對白 | Ref-M 林墨 | Ref-HQ 廣場 | — | 9 |
| E24 | 對白 | Ref-M 林墨(回頭) | Ref-HQ 廣場(群眾) | — | 13 |
| E25 | 場景 | Ref-M 林墨(走向大門) | Ref-HQ 廣場(人群分開) | — | 8 |
| E26 | 對白 | Ref-M 林墨(台階上回頭) | Ref-HQ 廣場 | — | 7 |
| E27 | 場景 | Ref-LOB 國會大廳 | — | — | 4 |
| E28 | 對白 | Ref-POL 立委 | Ref-M 林墨 | Ref-LOB 大廳 | 14 |
| E29a | 對白 | Ref-M 林墨 | Ref-LOB 大廳 | — | 3 |
| E29b | 對白 | Ref-M 林墨 | Ref-LOB 大廳 | — | 12 |
| E30 | 對白 | Ref-M 林墨 | Ref-LOB 大廳 | — | 9 |
| E31 | 對白 | Ref-Sph 蘇菲 | Ref-O 研究室(螢幕) | — | 4 |
| E32a | 場景 | Ref-Sph 蘇菲 | Ref-O 研究室 | — | 5 |
| E32b | 旁白 | Ref-M 林墨(坐回螢幕前) | Ref-O 研究室(懷疑曲線) | — | 6 |

> 未餵 `ref_image_N` 一律省略（勿留空檔名殘餘污染，見 v2 §3）。

---

## E0 — 英雄廣場定場（場景，5 秒）

**來源**：`story1.md` line 190。

```
subject_definitions:
<Subject 1> is the Hero Square from <Picture 1>:
a vast open plaza before a grand neoclassical congress building, ringed by glass skyscrapers, tens of
thousands of flyers drifting down from the rooftops like rain, crowds of red-clothed people below, cold
blue-grey daylight, photorealistic cinematic wide shot.

summary:
Reference-based aerial establishing shot of the square with flyer rain.
No dialogue.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
No one speaks. No narration. No voice-over.

detailed_description:

Visual style:
Cold blue-grey daylight documentary footage. High aerial establishing shot, slow descent.

[Shot 1]

00:00-00:05

Action:
High aerial view tilting down over the Hero Square: tens of thousands of printed flyers drift down past the
glass skyscrapers like a slow rain toward the plaza, where red-clothed crowds gather before the neoclassical
congress building. The camera descends gently, the paper rain crowding the frame then thinning as it reaches
plaza level.

overall_soundscape:
The papery rustle of thousands of flyers drifting down, the low roar of a distant crowd, city hum, no human
voice, no dialogue.

non_diegetic_music:
A low ambient string tone with a papery percussion bed, ominous and patient.
```

**參數**：`ref_image_0=output/ch4_hero_square_ref/zimage_*.png, duration=5, seed=450001, out=ch4_e0_video`

---

## E1 — 傳單與合成照（旁白，8 秒）

**來源**：`story1.md` lines 190–192。

> **旁白全文（約 40 字，5 字/秒 ≈ 8s）**：傳單正面印著林墨與索利亞難民握手的合成照，背面用刺眼的螢光字寫著「出賣未來的數據叛徒」。

```
subject_definitions:
<Subject 1> is the flyer from <Picture 1>:
a paper flyer drifted to the ground, front printed with a manipulated photo of a Chinese man in a suit shaking
hands with refugees, back printed with neon fluorescent Chinese characters.

<Subject 2> is the Hero Square from <Picture 2>:
a vast plaza covered with scattered flyers, red-clothed crowds blurred in the background.

summary:
Reference-based flyer shot with described narration.
The image is narrated from outside.
No character speaks in frame.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No character speaks in frame. Narration by the fixed narrator voice only. No on-screen mouth movement.

detailed_description:

Visual style:
Cold blue-grey daylight documentary footage. Extreme close-up, shallow depth of field.

[Shot 1]

00:00-00:08

Action:
Close-up on one flyer lying on the wet plaza stones: the front shows a manipulated photo of a man in a suit
shaking hands with ragged refugees under a foreign flag; the camera slowly pans over to reveal the fluorescent
characters printed on its back, then pulls back to show hundreds of identical flyers scattered around.

Narration:
<Narrator> says:

<d>
[中文]
傳單正面印著林墨與索利亞難民握手的合成照，背面用刺眼的螢光字寫著「出賣未來的數據叛徒」。
</d>

overall_soundscape:
Narration delivered in a low calm middle-aged male voice, Taiwan-accented Standard Mandarin (台灣腔普通話),
read flat at a steady pace, not character dialogue, not on-screen voice, no Cantonese.
The papery rustle of flyers, the distant crowd roar.

non_diegetic_music:
A low ambient string tone with paper percussion, cold and detached.
```

**參數**：`ref_image_0=output/ch4_flyer_ref/zimage_*.png, ref_image_1=output/ch4_hero_square_ref/zimage_*.png, duration=8, seed=310000（旁白專用）, out=ch4_e1_video`

---

## E2 — 踏出防彈轎車（場景，4 秒）

**來源**：`story1.md` line 194。

```
subject_definitions:
<Subject 1> is the border economist Lin Mo from <Picture 1>:
a thin lean middle-aged East Asian man in his late 40s, short neatly combed black hair with faint grey
strands, light stubble, deep-set tired eyes, dark charcoal suit and rumpled white shirt.

<Subject 2> is the Hero Square from <Picture 2>:
a vast plaza before the congress building, a black armored sedan stopped at the curb, red-clothed crowds
surge and shout, flyers drift in the air.

summary:
Reference-based entrance shot.
Lin Mo steps out of the armored sedan into the crowd.
No dialogue.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No one speaks. No narration. No voice-over.

detailed_description:

Visual style:
Cold grey daylight, gritty documentary handheld.

[Shot 1]

00:00-00:04

Action:
The armored sedan door opens and Lin Mo steps out, straightening his jacket against the blast of heat and
shouts; the red-clothed crowd surges and masses of flyers stream down around him as he stands at the edge of
the square.

overall_soundscape:
The slam of the car door, the surge of shouting and heat from the crowd, flyers rustling, distant chants, no
clear single voice, no dialogue.

non_diegetic_music:
A low string pulse with a muffled drumbeat, tense.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch4_hero_square_ref/zimage_*.png, duration=4, seed=450002, out=ch4_e2_video`

---

## E3 — 群眾怒吼口號（場景，6 秒）

**來源**：`story1.md` lines 196–198。

```
subject_definitions:
<Subject 1> is the Hero Square crowd from <Picture 1>:
a sea of red-clothed people packed before the congress building, fists raised, shouting, flyers drifting
between them.

summary:
Reference-based crowd shot; roaring chants are ambient sound only.
No lip-synced on-screen speaker.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
No single character speaks in frame. Crowd chants are environment sound only. No narration. No voice-over.

detailed_description:

Visual style:
Cold grey daylight documentary, handheld medium-wide shots.

[Shot 1]

00:00-00:06

Action:
Crowd shots through the red-clothed masses: raised fists, angry faces shouting, flyers and flags moving with
the surge; a few protectors push near the edge of the square. Quick cuts between faces, all screaming
anti-data rally slogans in the soundscape.

overall_soundscape:
A roaring crowd chanting three short slogans in Taiwan-accented Mandarin — traitor, back to your database,
no cold calculation — overlapping heavily, no single clear voice.
No dialogue, no narration.

non_diegetic_music:
A low militaristic drum pulse under the shout, ominous.
```

**參數**：`ref_image_0=output/ch4_hero_square_ref/zimage_*.png, duration=6, seed=450003, out=ch4_e3_video`

---

## E4 — 社媒牆與紅衣支持者（場景，8 秒）

**來源**：`story1.md` line 200。

```
subject_definitions:
<Subject 1> is the social media wall from <Picture 1>:
a giant billboard wall of a live social feed, a Chinese hashtag meaning Lin Mo's conspiracy climbing past ten
million mentions, dense live posts scrolling.

<Subject 2> is the Hero Square from <Picture 2>:
red-clothed supporters packed in the plaza, many holding small booklets, flyers in the air.

summary:
Reference-based wall shot then crowd revealed.
No dialogue.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No one speaks. No narration. No voice-over.

detailed_description:

Visual style:
Cold blue-grey daylight, crisp contrast between the glowing screen and the plaza.

[Shot 1]

00:00-00:08

Action:
Close-up on the giant social media wall: the hyphenated hashtag of Lin Mo's conspiracy climbs past ten
million with a sharp ting; the camera pulls back to reveal the full square of red-clothed supporters holding
democracy defense booklets, flyers drifting above their heads.

overall_soundscape:
The soft electronic ting of a counter climbing, the low roar of the crowd, flyers rustling, no human voice.

non_diegetic_music:
A low pulsing electronic tone with ticking counter clicks, cold and mechanical.
```

**參數**：`ref_image_0=output/ch4_socialwall_ref/zimage_*.png, ref_image_1=output/ch4_hero_square_ref/zimage_*.png, duration=8, seed=450004, out=ch4_e4_video`

---

## E5 — 雞蛋砸肩（場景，5 秒）

**來源**：`story1.md` line 202。

```
subject_definitions:
<Subject 1> is the border economist Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit and rumpled
white shirt, walking.

<Subject 2> is the Hero Square from <Picture 2>:
a packed red-clothed crowd pressing in, flyers drifting, tense atmosphere.

summary:
Reference-based escort shot; a rotting egg strikes Lin Mo's shoulder.
No dialogue.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No one speaks. No narration. No voice-over.

detailed_description:

Visual style:
Cold grey daylight, handheld close-up.

[Shot 1]

00:00-00:05

Action:
Medium close as ten dark-suited bodyguards muscle through the pressing crowd around Lin Mo, every step heavy;
a rotten egg arcs in and smacks against his shoulder, the thick yolk spilling down the charcoal fabric. He
does not slow down.

overall_soundscape:
The muffled grunts of bodyguards, the wet slap of the egg, the roar of the crowd, flyers rustling, no
distinct voice, no dialogue.

non_diegetic_music:
A low tense pulse, flattening to a single thud at the impact.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch4_hero_square_ref/zimage_*.png, duration=5, seed=450005, out=ch4_e5_video`

---

## E6 — 記者質問（對白，11 秒）

**來源**：`story1.md` line 204。

```
subject_definitions:
<Subject 1> is the reporter from <Picture 1>:
a middle-aged East Asian man in a dark overcoat holding a microphone with a TV logo, persistent expression.

<Subject 2> is Lin Mo from <Picture 2>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit and rumpled
white shirt, yolk stain on one shoulder.

<Subject 3> is the Hero Square from <Picture 3>:
a packed red-clothed crowd pressing around.

summary:
Reference-based interview close-up.
The reporter speaks first, one speaker at a time.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.
<Subject 3>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.

detailed_description:

Visual style:
Cold grey daylight handheld two-shot, shallow depth of field.

[Shot 1]

00:00-00:11

Action:
The reporter thrusts the microphone hard into Lin Mo's face and asks the question, unrelenting; Lin Mo stands
still, yolk still wet on his shoulder, his face unreadable.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
林立委，請發表看法！針對政府指控你私通外國勢力、意圖癱瘓行政效能，你是否願意放棄豁免權接受調查？
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.
The crowd roar, flyers rustling, crackle of the microphone.
No other speech.

non_diegetic_music:
A low restrained tension tone with sparse piano, tight and short.
```

**參數**：`ref_image_0=output/ch4_reporter_ref/zimage_*.png, ref_image_1=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_2=output/ch4_hero_square_ref/zimage_*.png, duration=11, seed=450006, out=ch4_e6_video`

---

## E7 — 投影螢幕宣傳片（場景，6 秒）

**來源**：`story1.md` lines 206–208。

```
subject_definitions:
<Subject 1> is the giant projection screen from <Picture 1>:
a huge outdoor screen on the plaza showing a government propaganda animation of a document being eaten by a
digital virus.

<Subject 2> is Lin Mo from <Picture 2>:
thin lean middle-aged East Asian man in a dark charcoal suit seen from behind mid-crowd.

summary:
Reference-based projection shot; Lin Mo stops to watch.
No dialogue.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No one speaks. No narration. No voice-over.

detailed_description:

Visual style:
Cold blue-grey daylight, the glare of the projection cutting the square.

[Shot 1]

00:00-00:06

Action:
Lin Mo has stopped; the camera shows the giant projection screen across the plaza — a government propaganda
film animating his consensus protocol as a plague of digital virus infecting the nation's defense systems —
then rack-focuses to his still, unreadable face half-lit by the screen's light, the crowd noise pressing in.

overall_soundscape:
The distorted narration of the propaganda film (an echoing voice calling the protocol a viral threat, muted,
environmental not a character line), the crowd roar, no character dialogue.

non_diegetic_music:
A low ominous electronic drone with a sinking tone under the propaganda voices.
```

**參數**：`ref_image_0=output/ch4_projection_ref/zimage_*.png, ref_image_1=output/ch1_beat13_ref_char/zimage_00008_.png, duration=6, seed=450007, out=ch4_e7_video`

---

## E8 — 「我想請各位看一個東西」（對白，3 秒）

**來源**：`story1.md` line 210。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit and rumpled
white shirt, lapel microphone visible.

<Subject 2> is the Hero Square from <Picture 2>:
a packed red-clothed crowd, flyers in the air.

summary:
Reference-based close shot; Lin Mo announces the crowd's attention.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.

detailed_description:

Visual style:
Cold grey daylight, medium-close shot.

[Shot 1]

00:00-00:03

Action:
Lin Mo lifts his chin and speaks into his lapel microphone, his voice amplified across the square; the crowd
shifts.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
我想請各位看一個東西。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, slightly amplified echo.
The crowd noise dropping a notch, flyers rustling.
No other speech.

non_diegetic_music:
A low single cello note, settling the square.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch4_hero_square_ref/zimage_*.png, duration=3, seed=450008, out=ch4_e8_video`

---

## E9 — 拿出平板（場景，5 秒）

**來源**：`story1.md` line 212。

```
subject_definitions:
<Subject 1> is the tablet from <Picture 1>:
a glowing tablet screen showing a complex dark network graph with red tracing lines linking server nodes.

<Subject 2> is Lin Mo from <Picture 2>:
thin lean middle-aged East Asian man, dark charcoal suit, holding the tablet, fingertip on the screen.

summary:
Reference-based tablet close-up; Lin Mo presents the network map.
No dialogue.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No one speaks. No narration. No voice-over.

detailed_description:

Visual style:
Cold blue-grey daylight; the tablet glow dominant in close-up.

[Shot 1]

00:00-00:05

Action:
Close-up of the tablet in Lin Mo's hand: a complex dark network graph with red tracing lines linking server
nodes; his fingertip freezes on one node, holding steady as the graph glows. Quick shot of his wrist and
jacket cuff.

overall_soundscape:
The soft electronic hum of the tablet, the crowd murmur, flyers rustling, no human voice.

non_diegetic_music:
A low electronic drone with clicking node pings, cold.
```

**參數**：`ref_image_0=output/ch4_tablet_ref/zimage_*.png, ref_image_1=output/ch1_beat13_ref_char/zimage_00008_.png, duration=5, seed=450009, out=ch4_e9_video`

---

## E10a — 「請大家低頭看手機」（對白，8 秒）

**來源**：`story1.md` line 214（前半）。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit and rumpled
white shirt, lapel microphone, holding a tablet.

<Subject 2> is the tablet from <Picture 2>:
a glowing screen showing a dark network graph with red tracing lines.

<Subject 3> is the Hero Square from <Picture 3>:
a packed red-clothed crowd listening.

summary:
Reference-based announcement shot; Lin Mo tells the crowd to look at their phones.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.
<Subject 3>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.

detailed_description:

Visual style:
Cold grey daylight, medium shot.

[Shot 1]

00:00-00:08

Action:
Lin Mo raises the tablet and speaks levelly into the mic: the crowd should look down at their phones; three
push notifications were just received.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
現在，請大家低頭看看你們的手機。就在剛才，你們收到了三條推播。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, slightly amplified.
The crowd murmur shifting to attention, flyers rustling.
No other speech.

non_diegetic_music:
A low restrained string tone holding beneath his words.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch4_tablet_ref/zimage_*.png, ref_image_2=output/ch4_hero_square_ref/zimage_*.png, duration=8, seed=450010, out=ch4_e10a_video`

---

## E10b — 「三條推播」（對白，12 秒）

**來源**：`story1.md` line 214（後半）。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, holding a
glowing tablet.

<Subject 2> is the tablet from <Picture 2>:
dark network graph with red tracing lines.

summary:
Reference-based announcement shot; Lin Mo recites the three notifications.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.

detailed_description:

Visual style:
Cold grey daylight, medium-close shot.

[Shot 1]

00:00-00:12

Action:
Lin Mo reads out the three push notifications one by one off the tablet, each item a count he sets before the
crowd with a small gesture of the screen.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
第一條是我的誹聞，第二條是索利亞軍隊在邊境集結的假消息，第三條是聯邦幣即時匯率上揚的錯誤數據。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.
The shocked murmur of the crowd growing, flyers rustling.
No other speech.

non_diegetic_music:
A low string line with a faint rising pulse over the three items.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch4_tablet_ref/zimage_*.png, duration=12, seed=450011, out=ch4_e10b_video`

---

## E12 — 人群掏手機（場景，5 秒）

**來源**：`story1.md` line 216。

```
subject_definitions:
<Subject 1> is the Hero Square crowd from <Picture 1>:
a packed red-clothed crowd; many people are now pulling out phones.

summary:
Reference-based crowd reaction shot.
No dialogue.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
No one speaks. No narration. No voice-over.

detailed_description:

Visual style:
Cold grey daylight, handheld crowd shots.

[Shot 1]

00:00-00:05

Action:
Through the red-clothed crowd: rows of people glancing down at their glowing phones, visibly startled,
patterns of screen-light flickering across their faces; small pockets of confusion spreading.

overall_soundscape:
The rising murmur of the crowd as phones light up, the low buzz of notifications, flyers rustling, no human
voice in clarity, no dialogue.

non_diegetic_music:
A low sparse electronic tone with notification ticks, uneasy.
```

**參數**：`ref_image_0=output/ch4_hero_square_ref/zimage_*.png, duration=5, seed=450012, out=ch4_e12_video`

---

## E13 — 「同一個伺服器」（對白，8 秒）

**來源**：`story1.md` line 218（前半）。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, holding a
glowing tablet.

<Subject 2> is the tablet from <Picture 2>:
dark network graph with a single server node glowing and trace lines converging on it.

summary:
Reference-based reveal shot; Lin Mo names the single source server.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.

detailed_description:

Visual style:
Cold grey daylight, medium shot tilting to the tablet.

[Shot 1]

00:00-00:08

Action:
Lin Mo taps once on the tablet; the network graph collapses into a single glowing node, and he announces the
key fact: all three messages were sent from one server inside the administrative district within forty-five
seconds.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
這些訊息是在四十五秒內，由同一個位於行政區的伺服器發出的。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.
The crowd murmur dropping to near silence, flyers rustling.
No other speech.

non_diegetic_music:
A low cold drone sinking under the reveal, holding still.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch4_tablet_ref/zimage_*.png, duration=8, seed=450013, out=ch4_e13_video`

---

## E14 — 「情緒代碼」（對白，15 秒）

**來源**：`story1.md` line 218（後半）。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, cold steady
eyes, holding a tablet.

<Subject 2> is the tablet from <Picture 2>:
dark network graph where the nodes now pulse in rhythm.

<Subject 3> is the Hero Square from <Picture 3>:
a stunned red-clothed crowd listening.

summary:
Reference-based speech shot; Lin Mo names the emotion code.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.
<Subject 3>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.

detailed_description:

Visual style:
Cold grey daylight, close-up, shallow depth of field.

[Shot 1]

00:00-00:15

Action:
Lin Mo holds the tablet up and speaks with deliberate precision, describing the machine that computes their
anger, fear and patriotism by the second; the graph pulses in rhythm on the screen behind him.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
這就是你們引以為傲的「熱情」。這不是民意，這是「情緒代碼」。你們現在感到的憤怒、恐懼與愛國心，都是由這台機器按秒計算出來的。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.
The crowd almost silent now, only the wind and flyers.
No other speech.

non_diegetic_music:
A low pulsing drone that slows toward the end of the line, cold.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch4_tablet_ref/zimage_*.png, ref_image_2=output/ch4_hero_square_ref/zimage_*.png, duration=15, seed=450014, out=ch4_e14_video`

---

## E15 — 紅衣人反駁（對白，4 秒）

**來源**：`story1.md` line 220。

```
subject_definitions:
<Subject 1> is the red-jacketed man from <Picture 1>:
a burly middle-aged East Asian man in a bright red jacket, furious face, shouting.

<Subject 2> is the Hero Square from <Picture 2>:
a red-clothed crowd behind him.

summary:
Reference-based reaction shot; the red man shouts back.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.

detailed_description:

Visual style:
Cold grey daylight, medium close, handheld surge.

[Shot 1]

00:00-00:04

Action:
A burly man in a bright red jacket shoves to the front of the crowd and shouts two short denials, jabbing a
finger across the square.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
胡說八道！我們是自發來的！
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.
The renewed roar of the crowd behind him, flyers rustling.
No other speech.

non_diegetic_music:
A sharp percussive hit with a low tense pulse.
```

**參數**：`ref_image_0=output/ch4_redman_ref/zimage_*.png, ref_image_1=output/ch4_hero_square_ref/zimage_*.png, duration=4, seed=450015, out=ch4_e15_video`

---

## E16 — 「你是自發來的，但他不是」（對白，13 秒）

**來源**：`story1.md` line 222。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, pointing.

<Subject 2> is the uniformed young man from <Picture 2>:
a pale twenty-something East Asian man in a plain grey uniform with a sleeve patch, shrinking back.

<Subject 3> is the Hero Square from <Picture 3>:
a red-clothed crowd watching.

summary:
Reference-based reveal shot; Lin Mo exposes the paid employee.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.
<Subject 3>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.

detailed_description:

Visual style:
Cold grey daylight, two-shot with a slow push in.

[Shot 1]

00:00-00:13

Action:
Lin Mo turns to the red man and answers, then points to the pale young man in a grey uniform beside him,
naming his employer and his job — to start the first three screams of the rally so the other nine thousand
follow. The young man's face colors with shock.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
你是自發來的，但他不是。他是「輿論引導課」的支薪雇員。他的工作是在這場集會中發動前三次尖叫，好帶動你們剩下的九千個人。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.
The stunned murmur of the crowd, flyers rustling.
No other speech.

non_diegetic_music:
A low restrained string line swelling slightly at the reveal.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch4_employee_ref/zimage_*.png, ref_image_2=output/ch4_hero_square_ref/zimage_*.png, duration=13, seed=450016, out=ch4_e16_video`

---

## E17 — 小伙躲進人群（場景，5 秒）

**來源**：`story1.md` line 224。

```
subject_definitions:
<Subject 1> is the uniformed young man from <Picture 1>:
a pale twenty-something East Asian man in a plain grey uniform with a sleeve patch, shrinking away.

<Subject 2> is the Hero Square crowd from <Picture 2>:
a dense red-clothed crowd.

summary:
Reference-based reaction shot; the young man slips into the crowd.
No dialogue.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No one speaks. No narration. No voice-over.

detailed_description:

Visual style:
Cold grey daylight, handheld close shot.

[Shot 1]

00:00-00:05

Action:
The camera finds the young man in the grey uniform caught in the open, his face now ash-pale, then he ducks
backwards and vanishes into the pressing red-clothed crowd around him, swallowed without a word.

overall_soundscape:
The murmur of the crowd rising again, flyers rustling, footsteps of the crowd shifting, no human voice in
clarity, no dialogue.

non_diegetic_music:
A low swallowed drone, fading with the disappearing figure.
```

**參數**：`ref_image_0=output/ch4_employee_ref/zimage_*.png, ref_image_1=output/ch4_hero_square_ref/zimage_*.png, duration=5, seed=450017, out=ch4_e17_video`

---

## E18a — 「大家看！傳單的價錢」（對白，7 秒）

**來源**：`story1.md` lines 226–228（前半）。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, arm raised
pointing at the sky.

<Subject 2> is the Hero Square from <Picture 2>:
flyers drifting down over the crowd.

summary:
Reference-based speech shot; Lin Mo points at the falling flyers.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.

detailed_description:

Visual style:
Cold grey daylight, medium shot, slight upward tilt.

[Shot 1]

00:00-00:07

Action:
Lin Mo points at the sky where the flyers still fall, and turns to the square to announce their cost — half an
Aurora coin each, thirty thousand of them.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
大家看！每一張傳單的印刷費用是零點五歐若拉幣，這裡有三萬張。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.
The papery rustle of falling flyers, the crowd murmur.
No other speech.

non_diegetic_music:
A low cold string line with papery percussion, precise.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch4_hero_square_ref/zimage_*.png, duration=7, seed=450018, out=ch4_e18a_video`

---

## E18b — 「社會和諧推廣費」（對白，8 秒）

**來源**：`story1.md` line 228（中段）。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, steady cold
stare.

<Subject 2> is the Hero Square from <Picture 2>:
a red-clothed crowd listening, flyers on the ground.

summary:
Reference-based speech shot; Lin Mo names the hidden budget line.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.

detailed_description:

Visual style:
Cold grey daylight, close-up medium shot.

[Shot 1]

00:00-00:08

Action:
Lin Mo holds the crowd in a close shot and explains that the flyer money never appears in the government's
budget table — it is filed under a social harmony promotion fund.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
這筆錢沒有出現在行政院的預算表裡，而是掛在「社會和諧推廣費」的名下。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.
The crowd hush, flyers rustling on the stones.
No other speech.

non_diegetic_music:
A low restrained string tone with a faint grind, cold.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch4_hero_square_ref/zimage_*.png, duration=8, seed=450019, out=ch4_e18b_video`

---

## E19 — 「買羞辱智商的表演」（對白，7 秒）

**來源**：`story1.md` line 228（結尾，直視攝影機）。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, looking
straight into the lens, eyes cold as ice.

summary:
Reference-based direct-address shot; Lin Mo faces the camera.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.

detailed_description:

Visual style:
Cold grey daylight, tight close-up on the face, almost static.

[Shot 1]

00:00-00:07

Action:
Close-up of Lin Mo looking straight into the camera, cold and level, as he delivers the sharp line about
their own taxes buying a show that insults their intelligence.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
你們在拿著自己的稅金，買這場羞辱你們自己智商的表演。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.
Only the wind and the papery rustle of flyers, the crowd silent.
No other speech.

non_diegetic_music:
A low single drone holding under the line, stopping hard at the last word.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, duration=7, seed=450020, out=ch4_e19_video`

---

## E21 — 廣場寂靜、整理領帶（場景，5 秒）

**來源**：`story1.md` lines 230–232。

```
subject_definitions:
<Subject 1> is the Hero Square from <Picture 1>:
the plaza gone strangely still, flyers settled on the ground, papers stirring in the wind.

<Subject 2> is Lin Mo from <Picture 2>:
thin lean middle-aged East Asian man in a dark charcoal suit wiping an eggshell from his shoulder and
straightening his tie.

summary:
Reference-based quiet beat; the square falls silent and Lin Mo tidies himself.
No dialogue.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No one speaks. No narration. No voice-over.

detailed_description:

Visual style:
Cold grey daylight, very still camera.

[Shot 1]

00:00-00:05

Action:
A strange quiet settles over the square; only the wind shifts the fallen flyers. Lin Mo wipes the eggshell off
his shoulder, straightens his tie with both hands, and stands calm in the center of the silence.

overall_soundscape:
The wind and the papery rustle of flyers stirring on the stones, distant city hum, the crowd hushed, no human
voice, no dialogue.

non_diegetic_music:
A low ambient string tone holding empty air, almost silent.
```

**參數**：`ref_image_0=output/ch4_hero_square_ref/zimage_*.png, ref_image_1=output/ch1_beat13_ref_char/zimage_00008_.png, duration=5, seed=450021, out=ch4_e21_video`

---

## E22 — 「標籤是廉價的」（對白，9 秒）

**來源**：`story1.md` line 234。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, tie just
straightened, calm composed.

<Subject 2> is the Hero Square from <Picture 2>:
a silent red-clothed crowd and fallen flyers.

summary:
Reference-based aphorism shot; Lin Mo delivers the chapter's key line.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.

detailed_description:

Visual style:
Cold grey daylight, medium-close shot, still.

[Shot 1]

00:00-00:09

Action:
Lin Mo stands still in the silence and says the line slowly, each half well weighted, looking across the crowd
without raising his voice; a few flyers blow past at his feet.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
標籤是廉價的，因為它不需要大腦。但數據是昂貴的，因為它需要勇氣。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.
The wind, the papery rustle of flyers, the crowd silent.
No other speech.

non_diegetic_music:
A low cello line with two untouched piano notes, final and clean.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch4_hero_square_ref/zimage_*.png, duration=9, seed=450022, out=ch4_e22_video`

---

## E24 — 「把那三條訊息的原始證據拿出來」（對白，13 秒）

**來源**：`story1.md` line 238（前半）。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, turned
toward the crowd at the steps.

<Subject 2> is the Hero Square from <Picture 2>:
a hushed crowd of red-clothed people.

summary:
Reference-based address from the steps; Lin Mo makes his single demand.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.

detailed_description:

Visual style:
Cold grey daylight, medium-wide from the crowd side, slight upward angle.

[Shot 1]

00:00-00:13

Action:
On the steps before the congress door, Lin Mo turns back to the quiet crowd and states that at tomorrow's
vote he asks nothing of their support — the government must produce the raw evidence behind the three
notifications it just sent.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
明天，當表決開始時，我不會要求你們支持我。我只要求政府做一件事：把你們剛才收到的那三條訊息的原始證據拿出來。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.
The wind, the crowd silent, flyers low on the stones.
No other speech.

non_diegetic_music:
A low restrained string line under the flat delivery.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch4_hero_square_ref/zimage_*.png, duration=13, seed=450023, out=ch4_e24_video`

---

## E25 — 穿過人群走向國會大門（場景，8 秒）

**來源**：`story1.md` line 236。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, walking.

<Subject 2> is the Hero Square from <Picture 2>:
a crowd automatically parting into a path, the congress building ahead.

summary:
Reference-based parting-crowd tracking shot.
No dialogue.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No one speaks. No narration. No voice-over.

detailed_description:

Visual style:
Cold grey daylight, smooth tracking shot following Lin Mo.

[Shot 1]

00:00-00:08

Action:
The crowd parts of their own motion and Lin Mo walks the empty corridor toward the congress door, straight and
unhurried; at the steps he pauses and looks back once at the thousands of lost faces, then continues on.

overall_soundscape:
The murmur of the crowd parting, footsteps on stone, flyers stirring, low distant chants, no human voice in
clarity, no dialogue.

non_diegetic_music:
A low measured string line with slow steps, resolved.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch4_hero_square_ref/zimage_*.png, duration=8, seed=450024, out=ch4_e25_video`

---

## E26 — 「這就是氣數」（對白，7 秒）

**來源**：`story1.md` line 238（結尾）。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, face turned
back toward the crowd, hard.

<Subject 2> is the Hero Square from <Picture 2>:
a silent crowd of red-clothed people.

summary:
Reference-based final-warning shot from the steps.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.

detailed_description:

Visual style:
Cold grey daylight, close-up from below the steps.

[Shot 1]

00:00-00:07

Action:
Standing at the top of the steps, Lin Mo looks back at the crowd one more time and delivers the consequence: if
the government cannot produce the evidence, this rain of labels is the last breath of the nation.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
如果拿不出來，那麼這場「標籤之雨」，就是這個國家最後的氣數。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.
The wind, the hushed crowd.
No other speech.

non_diegetic_music:
A low rumbling drone deepening under the final words.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch4_hero_square_ref/zimage_*.png, duration=7, seed=450025, out=ch4_e26_video`

---

## E27 — 國會大門關上（場景，4 秒）

**來源**：`story1.md` lines 240–242。

```
subject_definitions:
<Subject 1> is the congress lobby from <Picture 1>:
an imposing marble hall with columns, cold light, a few grim-faced politicians standing apart watching.

summary:
Reference-based closing-door shot into the lobby.
No dialogue.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
No one speaks. No narration. No voice-over.

detailed_description:

Visual style:
Cold marble interior, heavy institutional light.

[Shot 1]

00:00-00:04

Action:
The heavy congress door closes shut with a low boom behind Lin Mo; inside the marble lobby, several
government-aligned politicians watch him from the side, cold and unmoving.

overall_soundscape:
The heavy boom of the closing door, the echoing marble hush of the lobby, muffled crowd noise outside dying
away, no human voice, no dialogue.

non_diegetic_music:
A low dark institutional drone, cold.
```

**參數**：`ref_image_0=output/ch4_lobby_ref/zimage_*.png, duration=4, seed=450026, out=ch4_e27_video`

---

## E28 — 立委嘲諷（對白，14 秒）

**來源**：`story1.md` line 242。

```
subject_definitions:
<Subject 1> is the politician from <Picture 1>:
a bald, heavyset middle-aged East Asian man in a dark blue suit, cold contemptuous face.

<Subject 2> is Lin Mo from <Picture 2>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit.

<Subject 3> is the congress lobby from <Picture 3>:
an imposing marble hall with columns, cold light.

summary:
Reference-based corridor confrontation; a politician insults Lin Mo.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.
<Subject 3>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.

detailed_description:

Visual style:
Cold marble interior, medium two-shot.

[Shot 1]

00:00-00:14

Action:
A pro-government politician steps close and speaks low and cold, the lobby marble behind him: the votes of
congress are not won by data but by colors, and the bill will not pass even first reading tomorrow.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
林墨，你剛才在外面玩的把戲很有趣。但你要知道，國會的票數是不看數據的，只看顏色。你的法案，明天連第一讀都過不了。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.
The echoing hush of the marble lobby.
No other speech.

non_diegetic_music:
A low dark institutional drone with a distant tick, cold.
```

**參數**：`ref_image_0=output/ch4_politician_ref/zimage_*.png, ref_image_1=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_2=output/ch4_lobby_ref/zimage_*.png, duration=14, seed=450027, out=ch4_e28_video`

---

## E29a — 「那可不一定」（對白，3 秒）

**來源**：`story1.md` line 244。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, walking past,
head not turned.

<Subject 2> is the congress lobby from <Picture 2>:
an imposing marble hall with columns.

summary:
Reference-based counter-shot; Lin Mo answers without stopping.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.

detailed_description:

Visual style:
Cold marble interior, walking two-shot.

[Shot 1]

00:00-00:03

Action:
Lin Mo walks past the politician without turning his head and answers in four flat words.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
那可不一定。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, low and flat.
The echo of his steps on marble.
No other speech.

non_diegetic_music:
A single dry piano note, cut.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch4_lobby_ref/zimage_*.png, duration=3, seed=450028, out=ch4_e29a_video`

---

## E29b — 「同步到開源論壇」（對白，12 秒）

**來源**：`story1.md` line 246（前半）。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, walking
through the lobby.

<Subject 2> is the congress lobby from <Picture 2>:
an imposing marble hall with columns, cold light.

summary:
Reference-based walking counter-speech; Lin Mo unveils the sync.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.

detailed_description:

Visual style:
Cold marble interior, tracking from behind.

[Shot 1]

00:00-00:12

Action:
Still walking, Lin Mo speaks toward the lobby: he was not only talking in the square — he has synced that
server's sending logic live to every open-source forum in the federation.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
因為我剛才在廣場上，不只是在說話。我把剛才那個伺服器的發信邏輯，即時同步到了全聯邦所有的開源論壇上。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.
The echo of his steps on marble, distant lobby hush.
No other speech.

non_diegetic_music:
A low rising electronic line under the walk, mechanical.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch4_lobby_ref/zimage_*.png, duration=12, seed=450029, out=ch4_e29b_video`

---

## E30 — 「找出代碼錯誤」（對白，9 秒）

**來源**：`story1.md` line 246（結尾）。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, in the
lobby.

<Subject 2> is the congress lobby from <Picture 2>:
an imposing marble hall with columns, cold light.

summary:
Reference-based closing speech; Lin Mo names the young people's game.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.

detailed_description:

Visual style:
Cold marble interior, medium shot walking turn.

[Shot 1]

00:00-00:09

Action:
As Lin Mo reaches the far end of the lobby he half-turns and delivers the game the nation's youth are now
playing: finding the code errors hidden inside the government's propaganda.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
現在，全歐若拉聯邦的年輕人都在玩一個遊戲：找出藏在政府宣傳裡的「代碼錯誤」。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.
The echo of the lobby, his steps stopping.
No other speech.

non_diegetic_music:
A low pulse snapping to a clean stop on the final word.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch4_lobby_ref/zimage_*.png, duration=9, seed=450030, out=ch4_e30_video`

---

## E31 — 「數據上線了」（對白，4 秒）

**來源**：`story1.md` line 250。

```
subject_definitions:
<Subject 1> is Sophie from <Picture 1>:
a mid-20s East Asian woman, long straight black hair loosely tied back, pale nervous face, plain dark cardigan
over a white blouse.

<Subject 2> is the research office from <Picture 2>:
a dim research office, a glowing screen with a sharply rising chart.

summary:
Reference-based office shot; Sophie reports the traffic spike.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.

detailed_description:

Visual style:
Cold blue-grey office light, close shot on watchful face.

[Shot 1]

00:00-00:04

Action:
Sophie stares at the screen without blinking, then turns to report the traffic exploding, her voice shaking
slightly on the last word.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
老師，數據上線了。流量……爆炸了。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.
The hum of the office, the low noise of the analytics screen.
No other speech.

non_diegetic_music:
A low swelling electronic tone, quick and electric.
```

**參數**：`ref_image_0=output/ch3_sophie_ref/zimage_00021_.png, ref_image_1=output/ch3_office_ref/zimage_00019_.png, duration=4, seed=450031, out=ch4_e31_video`

---

## E32a — 推門進研究室（場景，5 秒）

**來源**：`story1.md` line 248。

```
subject_definitions:
<Subject 1> is Sophie from <Picture 1>:
a mid-20s East Asian woman, long black hair tied back, pale, in a dark cardigan, standing tense before a
glowing screen.

<Subject 2> is the research office from <Picture 2>:
a dim research office at night, screens glowing, paper stacks.

summary:
Reference-based office entrance; Sophie is already at the screen.
No dialogue.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No one speaks. No narration. No voice-over.

detailed_description:

Visual style:
Cold blue-grey night office light, medium shot from the door.

[Shot 1]

00:00-00:05

Action:
The office door pushes open; from the doorway Sophie is already visible standing tense before a glowing
screen, its blue light washing her face; beyond her the dark office hums.

overall_soundscape:
The click of the door latch, the hum of the office machines, the low whir of the screen, distant city night,
no human voice, no dialogue.

non_diegetic_music:
A low ambient electronic tone, expectant.
```

**參數**：`ref_image_0=output/ch3_sophie_ref/zimage_00021_.png, ref_image_1=output/ch3_office_ref/zimage_00019_.png, duration=5, seed=450032, out=ch4_e32a_video`

---

## E32b — 懷疑曲線（旁白，6 秒）

**來源**：`story1.md` line 252。

> **旁白全文（約 28 字，5 字/秒 ≈ 6s）**：他知道，標籤的雨雖然很大，但只要有人開始低頭看路，泥濘就困不住所有人。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, seated
before a glowing screen.

<Subject 2> is the research screen from <Picture 2>:
a monitor showing a sharply climbing analytics curve labeled doubt.

summary:
Reference-based close shot; the doubt curve climbs while the line is narrated.
No character speaks in frame.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No character speaks in frame. Narration by the fixed narrator voice only. No on-screen mouth movement.

detailed_description:

Visual style:
Cold blue-grey night office light, close shot on the screen and profile.

[Shot 1]

00:00-00:06

Action:
Close-up on the analytics screen where a curve labeled doubt climbs sharply; slow push to Lin Mo's tired
profile lit by the blue light, a quiet breath, the image darkening slowly.

Narration:
<Narrator> says:

<d>
[中文]
他知道，標籤的雨雖然很大，但只要有人開始低頭看路，泥濘就困不住所有人。
</d>

overall_soundscape:
Narration delivered in a low calm middle-aged male voice, Taiwan-accented Standard Mandarin (台灣腔普通話),
read flat at a steady pace, not character dialogue, not on-screen voice, no Cantonese.
The quiet hum of the office, the low whir of the screen.
No character speaks in frame.

non_diegetic_music:
A low cello line sinking to near silence with a single final piano note.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch3_office_ref/zimage_00019_.png, duration=6, seed=310000（旁白專用）, out=ch4_e32b_video`

---

## 六、旁白 seed 鎖定與腔調錨點（E0–E33 全部以此為準）

- **旁白專用 seed = `310000`**：E1、E32b 沿用（同 Ch1/Ch2/Ch3）。
- **對白/場景新 seed `450001–450032`**（E0–E32a 順序號）。若某一支歪粵腔即記錄並換 seed 重跑；奇數歪腔立刻停用該號。
- 黑名單已知：`310009`（Ch2 歪粵腔）。
- 對白/旁白一律台灣腔（台灣腔普通話、無粵語、無方言）；`summary` 只寫英文名詞片語、非 `<d>` 欄位不出現中文完整句。
- `<d>` 內被唸文字皆中文數字（「四十五秒」「零點五」「三萬張」），無 `%`／阿拉伯數字。

## 七、字幕資料表（區塊順序、起始秒、逐字字幕）

> 規劃累積起點；合併後以 `scale = 實際總秒數 / 252` 換算實際起點。場景區塊無字幕。

| 區塊 | 類型 | 規劃秒 | 累積起點 | 字幕文字 | 斜體 |
|------|------|--------|----------|---------|------|
| E0 | 場景 | 5 | 0s | （無字幕） | — |
| E1 | 旁白 | 8 | 5s | 傳單正面印著林墨與索利亞難民握手的合成照，背面用刺眼的螢光字寫著「出賣未來的數據叛徒」。 | ✅ |
| E2 | 場景 | 4 | 13s | （無字幕） | — |
| E3 | 場景 | 6 | 17s | （無字幕） | — |
| E4 | 場景 | 8 | 23s | （無字幕） | — |
| E5 | 場景 | 5 | 31s | （無字幕） | — |
| E6 | 對白 | 11 | 36s | 林立委，請發表看法！針對政府指控你私通外國勢力、意圖癱瘓行政效能，你是否願意放棄豁免權接受調查？ | — |
| E7 | 場景 | 6 | 47s | （無字幕） | — |
| E8 | 對白 | 3 | 53s | 我想請各位看一個東西。 | — |
| E9 | 場景 | 5 | 56s | （無字幕） | — |
| E10a | 對白 | 8 | 61s | 現在，請大家低頭看看你們的手機。就在剛才，你們收到了三條推播。 | — |
| E10b | 對白 | 12 | 69s | 第一條是我的誹聞，第二條是索利亞軍隊在邊境集結的假消息，第三條是聯邦幣即時匯率上揚的錯誤數據。 | — |
| E12 | 場景 | 5 | 81s | （無字幕） | — |
| E13 | 對白 | 8 | 86s | 這些訊息是在四十五秒內，由同一個位於行政區的伺服器發出的。 | — |
| E14 | 對白 | 15 | 94s | 這就是你們引以為傲的「熱情」。這不是民意，這是「情緒代碼」。你們現在感到的憤怒、恐懼與愛國心，都是由這台機器按秒計算出來的。 | — |
| E15 | 對白 | 4 | 109s | 胡說八道！我們是自發來的！ | — |
| E16 | 對白 | 13 | 113s | 你是自發來的，但他不是。他是「輿論引導課」的支薪雇員。他的工作是在這場集會中發動前三次尖叫，好帶動你們剩下的九千個人。 | — |
| E17 | 場景 | 5 | 126s | （無字幕） | — |
| E18a | 對白 | 7 | 131s | 大家看！每一張傳單的印刷費用是零點五歐若拉幣，這裡有三萬張。 | — |
| E18b | 對白 | 8 | 138s | 這筆錢沒有出現在行政院的預算表裡，而是掛在「社會和諧推廣費」的名下。 | — |
| E19 | 對白 | 7 | 146s | 你們在拿著自己的稅金，買這場羞辱你們自己智商的表演。 | — |
| E21 | 場景 | 5 | 153s | （無字幕） | — |
| E22 | 對白 | 9 | 158s | 標籤是廉價的，因為它不需要大腦。但數據是昂貴的，因為它需要勇氣。 | — |
| E24 | 對白 | 13 | 167s | 明天，當表決開始時，我不會要求你們支持我。我只要求政府做一件事：把你們剛才收到的那三條訊息的原始證據拿出來。 | — |
| E25 | 場景 | 8 | 180s | （無字幕） | — |
| E26 | 對白 | 7 | 188s | 如果拿不出來，那麼這場「標籤之雨」，就是這個國家最後的氣數。 | — |
| E27 | 場景 | 4 | 195s | （無字幕） | — |
| E28 | 對白 | 14 | 199s | 林墨，你剛才在外面玩的把戲很有趣。但你要知道，國會的票數是不看數據的，只看顏色。你的法案，明天連第一讀都過不了。 | — |
| E29a | 對白 | 3 | 213s | 那可不一定。 | — |
| E29b | 對白 | 12 | 216s | 因為我剛才在廣場上，不只是在說話。我把剛才那個伺服器的發信邏輯，即時同步到了全聯邦所有的開源論壇上。 | — |
| E30 | 對白 | 9 | 228s | 現在，全歐若拉聯邦的年輕人都在玩一個遊戲：找出藏在政府宣傳裡的「代碼錯誤」。 | — |
| E31 | 對白 | 4 | 237s | 老師，數據上線了。流量……爆炸了。 | — |
| E32a | 場景 | 5 | 241s | （無字幕） | — |
| E32b | 旁白 | 6 | 246s | 他知道，標籤的雨雖然很大，但只要有人開始低頭看路，泥濘就困不住所有人。 | ✅ |

## 八、產出前自檢（E0–E33）

- [ ] 對白/旁白逐字對照 `story1.md` 第四章（lines 188–257），無省略、無自創。
- [ ] `<d>` 內被唸文字皆中文數字（「四十五秒」「零點五」「三萬張」），無 `%`／阿拉伯數字。
- [ ] 對白區塊指名 `Only <Subject N> speaks`、排除旁白；旁白區塊（E1/E32b）畫面角色不開口。
- [ ] 群眾口號（E3）在 `overall_soundscape` 環境聲處理，無畫面對嘴角色、無 `<d>`。
- [ ] 每支對白/旁白 `overall_soundscape` 帶台灣腔錨點句；seed 已對照黑名單（310009）。
- [ ] 合併後以實際總長 scale 換算 SRT；旁白字幕包 `<i>...</i>`。