# 新·桃太娘 — 故事分鏡 i2v 區塊提示詞（37 區塊）

> 由 `doc\story.md` 依 `novel_to_video_guide_v2.md`（三型別/計秒）與 `video_prompt_guide.md`（i2v 三欄位 H3 格式）分割。
> **一區塊＝一支獨立的 `gen_i2v_video`。** 首尾幀來自 `doc\image_story\` 的 37 張序列圖，無額外參考圖（非 r2v）。
> 幀號鏈嚴格連續：`01→02→…→36→37`；每區塊的尾幀即下一區塊的首幀（B37 為首幀-only 片尾）。
> 生成日期：2026-09-14

---

## 0. 圖幀對照表（37 張，依 LastWriteTime 排序）

| 幀號 | 檔案名稱（`doc\image_story\`） |
|------|-------------------------------|
| 01 | `799279325_10165198413067376_6084801744728169900_n.jpg` |
| 02 | `802821497_10165198414532376_8458038109672805895_n.jpg` |
| 03 | `799831424_10165198413637376_7116621751776862137_n.jpg` |
| 04 | `803828299_10165198414117376_2027390180660065037_n.jpg` |
| 05 | `799849316_10165198414512376_2857418806827283782_n.jpg` |
| 06 | `802033280_10165198413722376_5649535567457233442_n.jpg` |
| 07 | `802702635_10165198413702376_5680476693737976761_n.jpg` |
| 08 | `799830038_10165198414187376_8111274591058633242_n.jpg` |
| 09 | `799983702_10165198413317376_8354572818682430123_n.jpg` |
| 10 | `801587104_10165198413862376_2731028501321994798_n.jpg` |
| 11 | `799856517_10165198413872376_6980399459030417919_n.jpg` |
| 12 | `801756100_10165198414072376_6117669046407059140_n.jpg` |
| 13 | `803476416_10165198413487376_1326618859830502340_n.jpg` |
| 14 | `801670299_10165198413652376_2056345954264386423_n.jpg` |
| 15 | `801965993_10165198413562376_2233569319765050119_n.jpg` |
| 16 | `805784359_10165198413237376_7138173129358391733_n.jpg` |
| 17 | `805854237_10165198414332376_7205927216940142205_n.jpg` |
| 18 | `799161036_10165198413197376_5691220327902227288_n.jpg` |
| 19 | `805757276_10165198414172376_3187381992632259445_n.jpg` |
| 20 | `798825816_10165198413142376_5109104791182724282_n.jpg` |
| 21 | `799143612_10165198414012376_748451954547260033_n.jpg` |
| 22 | `801886850_10165198413822376_6354854724523861484_n.jpg` |
| 23 | `801878411_10165198413842376_5643761194822466170_n.jpg` |
| 24 | `802717749_10165198413982376_2692125557299646453_n.jpg` |
| 25 | `802702632_10165198413302376_7122940492872957803_n.jpg` |
| 26 | `805732327_10165198413367376_5452340847878249845_n.jpg` |
| 27 | `800979681_10165198414472376_7295796620737844852_n.jpg` |
| 28 | `802821500_10165198414247376_2594354197559059290_n.jpg` |
| 29 | `803102973_10165198413127376_7561999455898969034_n.jpg` |
| 30 | `799088149_10165198413572376_4786354351909969981_n.jpg` |
| 31 | `802717755_10165198414462376_8542107032698832133_n.jpg` |
| 32 | `799783548_10165198413077376_7335021937940490693_n.jpg` |
| 33 | `802702624_10165198413427376_4346874630083889718_n.jpg` |
| 34 | `802702625_10165198413447376_3132609953122167600_n.jpg` |
| 35 | `805732326_10165198414262376_4442905357622241464_n.jpg` |
| 36 | `802966602_10165198413382376_958835938983024899_n.jpg` |
| 37 | `801878411_10165198413512376_7237370717409650521_n.jpg` |

---

## 1. 區塊總表（區塊分割與計秒）

- 型別計秒：**對白** 4 字/秒、**旁白** 5 字/秒、**場景** 依動作節拍（寧短勿長）。
- 對白/旁白逐字以 `doc\story.md` 為準（不發明、不改寫）；日文臺詞照錄，朗讀以台灣腔普通話為錨。
- 各區塊中的參考圖＝首尾幀本身；B37 為 **首幀-only**（尾幀缺省）。

| 區塊 | 型別 | 首幀→尾幀 | 規劃秒 | 累積起點 | 內容標題 |
|------|------|-----------|--------|----------|----------|
| B01 | 對白＋片頭旁白 | 01→02 | 8s | 0s | 片頭口白 × 主視覺海報 |
| B02 | 場景 | 02→03 | 5s | 8s | 海報 → 碼頭齊聚 |
| B03 | 對白 | 03→04 | 7s | 13s | 旅行之球（桃/ゴン） |
| B04 | 對白 | 04→05 | 5s | 20s | 伸展宣言 |
| B05 | 對白 | 05→06 | 9s | 25s | 拜別婆婆 |
| B06 | 對白 | 06→07 | 6s | 34s | 出發與呼喚 |
| B07 | 對白 | 07→08 | 7s | 40s | 背上行囊 |
| B08 | 對白 | 08→09 | 7s | 47s | 神社喝水 |
| B09 | 對白 | 09→10 | 7s | 54s | 溪谷早餐 |
| B10 | 對白 | 10→11 | 8s | 61s | 地圖決心 |
| B11 | 對白 | 11→12 | 6s | 69s | 山徑指路 |
| B12 | 對白 | 12→13 | 9s | 75s | 桃太郎の湯 |
| B13 | 對白 | 13→14 | 6s | 84s | 旅館夜宴 |
| B14 | 對白 | 14→15 | 9s | 90s | 牌局夜談 |
| B15 | 對白 | 15→16 | 14s | 99s | 染血的鬼旗（喜八） |
| B16 | 對白 | 16→17 | 7s | 113s | 鬼ヶ島へ出発 |
| B17 | 對白 | 17→18 | 8s | 120s | 海上·望見鬼島 |
| B18 | 對白 | 18→19 | 6s | 128s | 叢林遺跡 |
| B19 | 對白 | 19→20 | 5s | 134s | 荊棘木門 |
| B20 | 對白 | 20→21 | 6s | 139s | 夜潛 |
| B21 | 場景 | 21→22 | 5s | 145s | 攀牆（一） |
| B22 | 對白 | 22→23 | 5s | 150s | 攀牆（二）氣聲 |
| B23 | 對白 | 23→24 | 6s | 155s | 木橋上的影子 |
| B24 | 對白 | 24→25 | 7s | 161s | 以果結緣 |
| B25 | 對白 | 25→26 | 6s | 168s | 第一戰 |
| B26 | 對白 | 26→27 | 6s | 174s | 城門激戰 |
| B27 | 對白 | 27→28 | 7s | 180s | 木匣 |
| B28 | 對白 | 28→29 | 8s | 187s | 眺望鬼城自白 |
| B29 | 對白 | 29→30 | 10s | 195s | 天牢重逢（源蔵） |
| B30 | 場景 | 30→31 | 5s | 205s | 突圍 |
| B31 | 場景 | 31→32 | 5s | 210s | 大殿對峙（一） |
| B32 | 場景 | 32→33 | 5s | 215s | 大殿對峙（二） |
| B33 | 場景 | 33→34 | 5s | 220s | 鬼王起身 |
| B34 | 對白 | 34→35 | 7s | 225s | 斬落 |
| B35 | 對白 | 35→36 | 6s | 232s | 勝利低語 |
| B36 | 場景 | 36→37 | 5s | 238s | 勝利 → 戰後 |
| B37 | 對白＋片尾字卡 | 37（首幀only） | 16s | 243s | 戰後撫狗 → 片尾 |

> 規劃總長 ≈ **259s**（約 4 分 19 秒，不含參差）。合併後以 `scale = 實際總秒數 / 259` 換算實際字幕起點。

---

## 2. 字幕資料表（切割時同步產出）

> 逐字抄錄自 `doc\story.md`；場場景型（B02/B21/B30/B31/B32/B33/B36）為（無字幕）。旁白加 `<i>` 斜體。

| 區塊 | 型別 | 規劃秒 | 累積起點 | 字幕文字（逐字） | 斜體 |
|------|------|--------|----------|-------------------|------|
| B01 | 對白＋旁白 | 8s | 0s | 鬼退治のあとで……就是說、打完鬼以後囉。<br>勝ったけど、ちょっと疲れた。<br>新たな冒険は、まだ終わっていない——新·桃太娘。 | 末句 ✅ |
| B02 | 場景 | 5s | 8s | （無字幕） | — |
| B03 | 對白 | 7s | 13s | 大家都到齊了吧？<br>……那個球，可以寫「食」嗎。<br>寫著「旅」才有意義嘛。走吧——我們的旅行，才不是為了吃。 | — |
| B04 | 對白 | 5s | 20s | 明天開始，就要去很多很多沒見過的地方了。 | — |
| B05 | 對白 | 9s | 25s | 婆婆……那句話，我一直想說。<br>坐在桃樹下等我回來的孩子啊。<br>我會好好活著回來。活著回來，聽你罵我怎麼搞得到處都是泥。 | — |
| B06 | 對白 | 6s | 34s | 衣服破了自己補！別忘了帶飯糰！<br>知道啦——！ | — |
| B07 | 對白 | 7s | 40s | 接下來就是我們四個人的旅途了。寫一篇讓婆婆也看得懂的「旅の記録」吧。 | — |
| B08 | 對白 | 7s | 47s | 啊——活過來了。ゴン，你為什麼每顆飯糰都要先偷咬一口。<br>……試毒。 | — |
| B09 | 對白 | 7s | 54s | 走了一上午，在這裡歇一下吧。水是甜的，風也是甜的。<br>咕咕——！<br>你看，連ピーチ都說好。 | — |
| B10 | 對白 | 8s | 61s | 婆婆說，我的「桃」和鬼島的那些人一樣，都是從「別的地方」來的。<br>汪。<br>……那就決定啦。先去鬼ヶ島，看看那些被關起來的人。然後——再回來。 | — |
| B11 | 對白 | 6s | 69s | 出發！<br>（小小聲）……你連島長什麼樣都不知道。<br>所以才更要去看看啊！ | — |
| B12 | 對白 | 9s | 75s | 哇——好舒服。這就是「いい湯、いい島」吧。<br>喂，前面就是鬼島了，你還有心情泡湯喔。<br>就是了鬼島才要泡。把力氣存好，明天好上路。 | — |
| B13 | 對白 | 6s | 84s | 這是今天的收穫！一口咬下去，海的味道——<br>（帶著魚）你已經講第三遍了。 | — |
| B14 | 對白 | 9s | 90s | 說好囉——去鬼ヶ島，把該救的人救回來，然後我們四個就一起去看更大的海。<br>汪。<br>要是鬼王很兇呢？<br>那就打贏他，再回來泡湯。 | — |
| B15 | 對白 | 14s | 99s | 老夫年輕時跟著船朝北走，被浪打上鬼ヶ島。那島啊——根本不是島，是「城堡」。島中央有座山，山頂像顆骷髏。鬼王把山下的人都關進籠子裡，替他搬石頭。<br>那島上的人……都還在嗎？<br>只要你還活著一只，就都還在。老夫是游水回來的，全村只有老夫一個人回來。<br>這面旗，我借了。回來再還你。 | — |
| B16 | 對白 | 7s | 113s | 小桃！就你們四個能幹嘛！<br>我們有五個！シロ、ゴン、ピーチ，還有我——加上婆婆在門口看著呢！ | — |
| B17 | 對白 | 8s | 120s | ……真的好像鬼。<br>我知道。我們是去把那座城，拆下來的。 | — |
| B18 | 對白 | 6s | 128s | 這些腳印……是那些被抓走的人留下的？不——太深了。這是鬼的腳印。 | — |
| B19 | 對白 | 5s | 134s | 一進門就有哨位。我數到三—— | — |
| B20 | 對白 | 6s | 139s | 牆內有人。兩個。<br>那就換邊走。我們是來救人的，不是來吵醒人的。 | — |
| B21 | 場景 | 5s | 145s | （無字幕） | — |
| B22 | 對白 | 5s | 150s | 再高一點……牆裡面就是城了。<br>汪。 | — |
| B23 | 對白 | 6s | 155s | 等他們走過去——一個，兩個，三個—— | — |
| B24 | 對白 | 7s | 161s | 給你。我們不打架，你讓路就好。<br>……走那條路。<br>你看，柿子比刀有用。 | — |
| B25 | 對白 | 6s | 168s | 小娃娃也敢來拆牆？<br>對。我來帶牆裡的人回家。 | — |
| B26 | 對白 | 6s | 174s | シロ——好感！ | — |
| B27 | 對白 | 7s | 180s | 這是……婆婆說的，那間屋子？<br>那孩子在那裡！<br>總之——先保住這件東西。 | — |
| B28 | 對白 | 8s | 187s | 那個人（婆婆）說，我是從桃樹下被撿到的。會不會，我家也跟這座城一樣，原本也是有屋簷的。<br>不管怎樣，先打完再說。明晚，我們就進去。 | — |
| B29 | 對白 | 10s | 195s | 您是島另一頭的上老，是不是？我是從村子裡來的，我叫桃。<br>桃……你怎麼進得來。快走！鬼王會把你——<br>要走也是大家一起走。我先把牢門劈開，再往大殿去討個說法。<br>那大殿上……可是真的鬼王啊。<br>我知道。婆婆說過，鬼也是能講道理的——只要你先動手。 | — |
| B30 | 場景 | 5s | 205s | （無字幕） | — |
| B31 | 場景 | 5s | 210s | （無字幕） | — |
| B32 | 場景 | 5s | 215s | （無字幕） | — |
| B33 | 場景 | 5s | 220s | （無字幕） | — |
| B34 | 對白 | 7s | 225s | 鬼王——我要你做人。<br>……我負責帶人回去。你負責，睡一覺。 | — |
| B35 | 對白 | 6s | 232s | 婆婆——我回來囉。 | — |
| B36 | 場景 | 5s | 238s | （無字幕） | — |
| B37 | 對白＋片尾字卡 | 16s | 243s | 你也想家吧。打完仗的人，都是要回家的。<br>那我們也回家吧。回去泡婆婆的湯，回去坐在桃樹下，把這趟「旅の記録」講成整整三天三夜都講不完的故事。<br>鬼退治のあとで。<br>勝ったけど、ちょっと疲れた。<br>まだ撮るの？收了啦——<br>また、どこかへ♡<br>新たな冒険は、まだ終わっていない。 | 末句 ✅ |

---

## 3. 全區塊共用約定（寫入原則）

- **格式**：i2v 三欄位 H3 schema：`integrated_multimodal_description` / `overall_soundscape` / `non_diegetic_music`。
- **說話者**：`(S1)`＝桃（Momo）；其餘出場說話者依序 `(S2)`…。全片 `(S1)` 統一為桃。
- **腔調錨點**（對白/旁白區塊必寫）：`All spoken Mandarin lines are delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.`（B05、B10 例外＝日文對白＋日文發音錨點）
- **畫面可見文字**：使用英文雙引號逐字保留（如 `"桃太郎"`、`"鬼ヶ島へ出発"`），與 `<d>` 分離。
- **鏡頭時間戳**：`[Shot 1]` 不含時間戳；後續鏡頭 `[Shot N] At 00:MM.mmm, ...` 嚴格遞增且落在規劃秒內。
- **參考圖**＝首尾幀本身，助攻架式以「首幀→尾幀」的動作連續性描述；B37 只有首幀，尾段以自然運鏡淡出。
- **生圖尺寸**（全片統一）：`width=1056, height=1408`（SDXL 直式 3:4）。B01 例外＝已以 `832×1248`（2:3）交付；B02–B37 一律使用 3:4。
- **負面**：prompt 內不寫 model 名、解析度、寬高比、時長（除鏡頭時間戳）；不加字幕/浮水印。

---

### B01｜片頭口白 × 主視覺海報（圖01→02）

- 型別：**對白＋片頭旁白** ｜ 規劃秒：**8s** ｜ 首幀：圖01 ／ 尾幀：圖02
- 提交建議：`gen_i2v_video(first_frame="圖01", last_frame="圖02", duration=8, seed=110101, out="i2v_momotaro")`（例外：`width=832, height=1248` 2:3，已交付）

integrated_multimodal_description:
[Shot 1] The camera sits close and slightly handheld, framing a young Japanese woman (S1) with light brown hair in a loose, tired ponytail bound by a red ribbon, sitting on a weathered wooden railing edge; a fluffy Shiba Inu with its snout very close to the lens occupies the left foreground with shallow depth of field; warm dusk lamplight softens her slightly tired but smiling face as she holds a small rice ball snack near her lips and blinks playfully; soft banner silhouettes flicker out of focus behind her.
(S1): 鬼退治のあとで……就是說、打完鬼以後囉。
(S1): 勝ったけど、ちょっと疲れた。
[Shot 2] At 00:03.500, the camera pulls back fast and tilts up as the frame transforms into a 90s retro poster: (S1) stands side-on, determined, hand pressing on the katana hilt at her hip, red ribbon and ponytail flowing in a light breeze; bold black calligraphy reads visible on-screen text "新·桃太娘" behind her with the subtitle "鬼退治のあとで。" in smaller print; golden key light, film grain and soft 90s print texture, the composition holds like a static title card.
<i>新たな冒険は、まだ終わっていない——新·桃太娘。</i>

overall_soundscape:
Warm village ambience at dusk, wooden creak of the railing, a soft contented exhale and gentle munching from the girl, quiet panting from the dog; a faint film-projector hum fades in as the poster locks up. All spoken Mandarin lines are delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.

non_diegetic_music:
Retro 90s synthwave cue with soft analog strings and a music-box pulse, playful and nostalgic, resolving into one heroic brass chord exactly at the poster lock-up, then holding a single sustained note.

---

### B02｜海報 → 碼頭齊聚（圖02→03）

- 型別：**場景** ｜ 規劃秒：**5s** ｜ 首幀：圖02 ／ 尾幀：圖03
- 提交建議：`gen_i2v_video(first_frame="圖02", last_frame="圖03", duration=5, seed=110102, out="i2v_momotaro")`（`width=1056, height=1408` 3:4；此後至 B37 同）

integrated_multimodal_description:
[Shot 1] A 90s retro poster of a young heroine (S1) with a high ponytail and red ribbon, hand on a katana, bold calligraphy "新·桃太娘" visible as on-screen text behind her; the camera slowly pulls back from the poster as it dissolves.
[Shot 2] At 00:02.000, the poster dissolves into a real wooden dock on a bright sunny morning: (S1) sits cross-legged at the dock edge, fair skin, beige sleeveless tunic with peach motifs, holding up a round white ball printed with the kanji visible on-screen text "旅"; a fluffy Shiba Inu wearing a red peach-patterned bandana pants happily beside her, a small brown monkey with a red scarf peeks from behind her ponytail, and a colorful pheasant perches on her shoulder; sparkling sea, a rustic ship with barrels and a tattered peach flag behind them, warm high-contrast retro-tech light. The camera pushes in gently on the group. No one speaks.

overall_soundscape:
Bright seaside ambience, lapping waves against wooden pilings, distant seagulls, fabric flutter of the tattered flag, cheerful dog panting. No spoken dialogue, no narration, no voice-over.

non_diegetic_music:
Lighthearted 90s synth-pop rhythm with a whistled melody and warm marimba, upbeat and sunny, fading into the next scene.

---

### B03｜旅行之球（圖03→04）

- 型別：**對白** ｜ 規劃秒：**7s** ｜ 首幀：圖03 ／ 尾幀：圖04
- 提交建議：`gen_i2v_video(first_frame="圖03", last_frame="圖04", duration=7, seed=110103, out="i2v_momotaro")`

integrated_multimodal_description:
[Shot 1] Same sunny dock moment: (S1) sits cross-legged with the white travel ball labeled "旅" in her hands; the Shiba Inu leans in panting, and a mischievous brown monkey (S2) with a red scarf peers over her ponytail from behind.
(S1): 大家都到齊了吧？
(S2): ……那個球，可以寫「食」嗎。
(S1): 寫著「旅」才有意義嘛。走吧——我們的旅行，才不是為了吃。
[Shot 2] At 00:04.500, the camera cuts to the afternoon wooden veranda: (S1) now leans back relaxed, right arm raised high overhead in a long stretch, red ribbon swaying, eyes soft and half closed; warm sunlight rakes across the wooden slats. She speaks softly.

overall_soundscape:
Bright dock ambience with gentle waves and gulls fading as the scene shifts indoors, soft wood creak of the veranda, light rustle of clothing during the stretch. All spoken Mandarin lines are delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.

non_diegetic_music:
Warm acoustic guitar with soft brushed drums, easygoing and hopeful, swelling gently at the stretch and trailing off.

---

### B04｜伸展宣言（圖04→05）

- 型別：**對白** ｜ 規劃秒：**5s** ｜ 首幀：圖04 ／ 尾幀：圖05
- 提交建議：`gen_i2v_video(first_frame="圖04", last_frame="圖05", duration=5, seed=110104, out="i2v_momotaro")`

integrated_multimodal_description:
[Shot 1] Afternoon on the wooden veranda: (S1), a young woman in a cream kimono-style top with a short reddish-brown peach-motif haori, stretches with her right arm high overhead, right wristband and wooden beads catching the light, eyes closed in contentment, gentle serene smile.
(S1): 明天開始，就要去很多很多沒見過的地方了。
[Shot 2] At 00:02.500, the camera cuts to the village entrance at golden hour: (S1) kneels on one knee on packed dirt ground before an elderly woman in a dark kimono, head lowered; behind them a wooden staff flies a tall banner reading visible on-screen text "桃太郎" with a peach illustration; the light turns warm and tender as the farewell begins. No further dialogue in this shot.

overall_soundscape:
Quiet afternoon ambience, distant birdsong and leaves rustling, light cotton rustle, soft footsteps on dirt. All spoken Mandarin lines are delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.

non_diegetic_music:
Gentle piano with soft flute, nostalgic and tender, quiet enough to let the voice carry.

---

### B05｜拜別婆婆（圖05→06）

- 型別：**對白** ｜ 規劃秒：**9s** ｜ 首幀：圖05 ／ 尾幀：圖06 ｜ **語音：日文**（原中文改編）
- 提交建議：`gen_i2v_video(first_frame="圖05", last_frame="圖06", duration=9, seed=110105, out="i2v_momotaro")`（`width=1056, height=1408` 3:4；此後至 B37 同）

integrated_multimodal_description:
[Shot 1] Village entrance, golden hour: (S1) kneels on one knee before the elderly grandmother (S2) in a dark kimono, gently shy, looking up; the "桃太郎" banner waves behind them; (S2)'s hand rests on (S1)'s shoulder.
(S1): おばあちゃん……ずっと言いたかったことがあるの。
(S2): 桃の木の下で、帰りを待っていた子だよ。
(S1): ちゃんと生きて帰ってくるから。帰ってきたら、泥だらけで何してるんだって、おばあちゃんに叱ってもらいたいの。
[Shot 2] At 00:05.500, the camera cuts to a wider view of the village gate: (S1) stands with her travel bundle, turning onto the dirt mountain path, glancing back with a tender smile; (S2) stands under the eaves waving warmly; stone steps, thatched roofs, distant green mountains washed in warm golden late-afternoon light.

overall_soundscape:
Rural village ambience, gentle wind through leaves, a banner flapping, distant dog bark, soft warm footsteps. All spoken lines are delivered in natural Japanese (日本語), a young woman and an aged gentle grandmother; no Mandarin, no Cantonese, no accent drift.

non_diegetic_music:
Tender string section with delicate piano, sweetly melancholy but hopeful, building as the goodbye broadens into the wide shot.

---

### B06｜出發與呼喚（圖06→07）

- 型別：**對白** ｜ 規劃秒：**6s** ｜ 首幀：圖06 ／ 尾幀：圖07
- 提交建議：`gen_i2v_video(first_frame="圖06", last_frame="圖07", duration=6, seed=110106, out="i2v_momotaro")`

integrated_multimodal_description:
[Shot 1] The dirt mountain path: (S1) walks mid-stride carrying a bamboo gourd and small banner, turning to look back over her shoulder with a warm smile; the Shiba Inu with a small saddle walks at her feet; at the framed village gate the elderly grandma (S2) waves hard from the doorway, her call carried across the golden light.
(S2)（喊）: 衣服破了自己補！別忘了帶飯糰！
(S1)（回喊）: 知道啦——！
[Shot 2] At 00:03.000, the camera cuts low to (S1)'s feet: she pauses, looking down at the Shiba Inu (S2 has stopped speaking) whose eyes shine upward while it wears its blue saddlecloth; the bundle of peach-print luggage sits tied at her back, ribbon swaying. She kneels slightly to reach for the dog's head.

overall_soundscape:
Golden-hour countryside ambience, wind through paddy and bamboo, soft leaves, rising and falling voices between the gate and the path. All spoken Mandarin lines are delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.

non_diegetic_music:
Hopeful acoustic folk with a bright mandolin line, warm and brisk like the start of a journey.

---

### B07｜背上行囊（圖07→08）

- 型別：**對白** ｜ 規劃秒：**7s** ｜ 首幀：圖07 ／ 尾幀：圖08
- 提交建議：`gen_i2v_video(first_frame="圖07", last_frame="圖08", duration=7, seed=110107, out="i2v_momotaro")`

integrated_multimodal_description:
[Shot 1] Close on the mountain path: (S1) kneels by the Shiba Inu wearing a blue patterned saddlecloth with a peach emblem, patting its head gently, eyes warm and affectionate; her large travel bundle of peach-print cloth and bamboo sticks leans at her back, the "桃太郎" banner strapped on top, late-afternoon sun through the trees.
(S1): 接下來就是我們四個人的旅途了。寫一篇讓婆婆也看得懂的「旅の記録」吧。
[Shot 2] At 00:03.500, the camera cuts to a rustic shrine: (S1) sits on a stone ledge, tilting her head back to drink from a large brown gourd held in both hands, eyes closed, water beading at the edge of her lips; the dog lies resting to her left, a red-scarfed monkey gnaws a rice ball to her right, and a pheasant perches on a stone lantern keeping watch. Midday light, quiet.

overall_soundscape:
Forest path ambience shifting to a shrine hush, small flowing stone-basin water, cicadas, soft gulp of drinking, gentle crunch of the monkey's rice ball. All spoken Mandarin lines are delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.

non_diegetic_music:
Light acoustic arrangement with soft percussion, comfortable and steady like walking companions.

---

### B08｜神社喝水（圖08→09）

- 型別：**對白** ｜ 規劃秒：**7s** ｜ 首幀：圖08 ／ 尾幀：圖09
- 提交建議：`gen_i2v_video(first_frame="圖08", last_frame="圖09", duration=7, seed=110108, out="i2v_momotaro")`

integrated_multimodal_description:
[Shot 1] Shrine stone ledge at midday: (S1) lowers the big gourd from her lips with a long satisfied sigh, skin slightly dusty from travel; the Shiba Inu lies on her left in a blue harness, a brown monkey (S2) squats on a rock on her right holding a half-bitten rice ball with an innocent face; a pheasant stands sentry on a wooden post; a "桃太郎" banner and stone water basin complete the scene.
(S1): 啊——活過來了。ゴン，你為什麼每顆飯糰都要先偷咬一口。
(S2): ……試毒。
[Shot 2] At 00:04.000, the camera cuts to a shallow mountain stream: (S1) crouches at the water's edge cupping clear water to wash her face, serene and looking slightly upward; the dog stands on mossy rocks sniffing near a woven bamboo basket of rice cakes, a pheasant perches on a large rock beyond; sun-dappled forest, gentle waterfall murmur.

overall_soundscape:
Shrine ambience with trickling stone-spout water and cicadas, then the stream; light splash of washing water, monkey's soft crunch, quiet bird chirp. All spoken Mandarin lines are delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.

non_diegetic_music:
Playful plucked strings with light woodwind, airy and refreshing like mountain water.

---

### B09｜溪谷早餐（圖09→10）

- 型別：**對白** ｜ 規劃秒：**7s** ｜ 首幀：圖09 ／ 尾幀：圖10
- 提交建議：`gen_i2v_video(first_frame="圖09", last_frame="圖10", duration=7, seed=110109, out="i2v_momotaro")`

integrated_multimodal_description:
[Shot 1] Mountain stream at midday: (S1) crouches at the shallow water, rinsing her hands, gentle serene expression; the Shiba Inu sniffs the woven rice-cake basket on the mossy rocks; the pheasant on a boulder utters its call.
(S1): 走了一上午，在這裡歇一下吧。水是甜的，風也是甜的。
(ピーチ): 咕咕——！
(S1): 你看，連ピーチ都說好。
[Shot 2] At 00:04.500, the camera cuts to a low rustic inn veranda: (S1) crouches over an old parchment map spread on the wooden floor, fingertip tracing across the sea toward an island marked with a red cross; visible on-screen text on the map reads "鬼ヶ島"; a travel guide book titled "旅の手引" lies open beside her, and a wooden banner shows visible on-screen text "夢を、鬼ヶ島へ". Her playful expression turns focused.

overall_soundscape:
Stream ambience with small waterfall, water drips, soft fabric rustle; then wooden veranda with gentle wind and a distant crow. All spoken Mandarin lines are delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese; the pheasant's "咕咕" is a bird call, not a voice.

non_diegetic_music:
Warm acoustic guitar with subtle bells, peaceful then gradually leaning into a more determined undertone.

---

### B10｜地圖決心（圖10→11）

- 型別：**對白** ｜ 規劃秒：**8s** ｜ 首幀：圖10 ／ 尾幀：圖11 ｜ **語音：日文**（原中文改編）
- 提交建議：`gen_i2v_video(first_frame="圖10", last_frame="圖11", duration=8, seed=110110, out="i2v_momotaro")`

integrated_multimodal_description:
[Shot 1] Low inn veranda in bright sunlight: (S1) crouches over the old parchment map with a focused, serious expression, fingertip tracing the sea toward the red-crossed island labeled visible on-screen text "鬼ヶ島"; the Shiba Inu stands alert at her left in a blue patterned harness, the brown monkey watches from behind, the pheasant by her foot; strong sun casts long shadows.
(S1): おばあちゃんが言ってたんだ。私の「桃」も、鬼ヶ島の人たちと同じで、よそから来たものなんだって。
(犬): ワン。
(S1): ……よし、決めた。鬼ヶ島に行って、囚われている人たちを見てくる。それから——帰ってくる。
[Shot 2] At 00:05.000, the camera cuts to a rocky mountain trailhead: (S1) stands with her hand resting on a weathered wooden signpost pointing toward the sea, visible on-screen text "鬼ヶ島 →"; behind her the Shiba Inu carries a woven pack and the monkey shoulders a bundle, walking a sunlit trail high above a blue sea; her expression hopeful and determined, warm natural light.

overall_soundscape:
Inn veranda with wind and distant village sounds, then the mountain trail with seabirds and a light sea breeze; one short confident bark from the dog. All spoken lines are delivered in natural Japanese (日本語); no Mandarin, no Cantonese, no accent drift.

non_diegetic_music:
Growing 90s adventure theme, pulsing synth and drums with acoustic warmth, determined but bright like a decision made.

---

### B11｜山徑指路（圖11→12）

- 型別：**對白** ｜ 規劃秒：**6s** ｜ 首幀：圖11 ／ 尾幀：圖12
- 提交建議：`gen_i2v_video(first_frame="圖11", last_frame="圖12", duration=6, seed=110111, out="i2v_momotaro")`

integrated_multimodal_description:
[Shot 1] Mountain trailhead above the sea: (S1) leans on the signpost "鬼ヶ島 →", glancing back with a bright grin; the Shiba Inu with a woven pack and the monkey (S2) with a bundle walk past in a file; vibrant greens, browns and clear blues under bright sunlight.
(S1): 出發！
(S2)（小小聲）: ……你連島長什麼樣都不知道。
(S1): 所以才更要去看看啊！
[Shot 2] At 00:03.500, the camera cuts to a steamy outdoor hot spring: wooden sign visible on-screen text "桃太郎の湯"; (S1) soaks in the water, knees drawn to her chest, head tilted back exhaling in bliss; the monkey rests its chin on the pool edge and the Shiba Inu naps in a small green vest; rustic bathhouse beams and rising steam in soft light.

overall_soundscape:
Mountain trail ambience with seabirds and wind, footsteps on gravel; the scene glides into a hot spring with gentle lapping water and rising steam. All spoken Mandarin lines are delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.

non_diegetic_music:
Breezy acoustic motif, playful, then melting into a warm, serene ambient wash at the hot spring.

---

### B12｜桃太郎の湯（圖12→13）

- 型別：**對白** ｜ 規劃秒：**9s** ｜ 首幀：圖12 ／ 尾幀：圖13
- 提交建議：`gen_i2v_video(first_frame="圖12", last_frame="圖13", duration=9, seed=110112, out="i2v_momotaro")`

integrated_multimodal_description:
[Shot 1] The "桃太郎の湯" hot spring: (S1) floats in the steaming water with her ponytail slightly messy, eyes closed, wholly relaxed; the monkey (S2) rests its chin on the wooden pool edge, and the sleepy Shiba Inu wears a small green vest with its tongue out.
(S1): 哇——好舒服。這就是「いい湯、いい島」吧。
(S2): 喂，前面就是鬼島了，你還有心情泡湯喔。
(S1): 就是了鬼島才要泡。把力氣存好，明天好上路。
[Shot 2] At 00:05.500, the camera cuts to the inn dining room at night: lanterns swaying, a table set with grilled fish visible on-screen text "地魚の炭火焼"; (S1) smiles playfully, winking at the camera as she lifts a grilled fish slice toward the lens with chopsticks; the Shiba Inu in a small bib sits at the table and the monkey's hand already reaches for the next dish.

overall_soundscape:
Gentle hot spring lapping and steam hush, then lantern-lit inn ambience with soft chatter, chopstick clinks, charcoal grill crackle. All spoken Mandarin lines are delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.

non_diegetic_music:
Warm and lazy synth lullaby at the bath, shifting into a cozy tavern tune with wooden flute and soft percussion at the feast.

---

### B13｜旅館夜宴（圖13→14）

- 型別：**對白** ｜ 規劃秒：**6s** ｜ 首幀：圖13 ／ 尾幀：圖14
- 提交建議：`gen_i2v_video(first_frame="圖13", last_frame="圖14", duration=6, seed=110113, out="i2v_momotaro")`

integrated_multimodal_description:
[Shot 1] Lantern-lit inn table at night: (S1) in a cream yukata with red floral patterns winks playfully at the camera while offering a piece of grilled fish on chopsticks; the Shiba Inu with a small cloth bib looks delighted, the monkey (S2) reaches from the side, mouth full.
(S1): 這是今天的收穫！一口咬下去，海的味道——
(S2)（帶著魚）: 你已經講第三遍了。
[Shot 2] At 00:03.500, the camera cuts to the tatami bedroom: (S1) lies on her stomach on the futon, bare feet kicked up behind her, holding a peach-print playing card near her face and sticking out her tongue playfully; the Shiba Inu lies calmly on its side in a blue vest, and the monkey fans a hand of peach cards across from her; soft lantern glow over warm wood and paper walls.

overall_soundscape:
Cozy tavern ambience, chopstick clinks, soft laughter, warm lantern crackle; then a quieter tatami-room hush with paper-screen rustle. All spoken Mandarin lines are delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.

non_diegetic_music:
Cheerful tavern melody with shamisen and light drums, playful and tipsy, easing into a soft intimate room tone.

---

### B14｜牌局夜談（圖14→15）

- 型別：**對白** ｜ 規劃秒：**9s** ｜ 首幀：圖14 ／ 尾幀：圖15
- 提交建議：`gen_i2v_video(first_frame="圖14", last_frame="圖15", duration=9, seed=110114, out="i2v_momotaro")`

integrated_multimodal_description:
[Shot 1] Tatami bedroom at night, warm lantern light: (S1) sprawls on her stomach, feet up, holding a peach card with a mischievous look; the Shiba Inu rests calmly on its side and the monkey (S2) holds its fan of cards across the futon.
(S1): 說好囉——去鬼ヶ島，把該救的人救回來，然後我們四個就一起去看更大的海。
(犬): 汪。
(S2): 要是鬼王很兇呢？
(S1): 那就打贏他，再回來泡湯。
[Shot 2] At 00:05.500, the camera cuts to a dim warehouse at night: embers glow in a brazier as a mud-caked old fisherman (S2') shakes open a tattered banner embroidered with a fierce red oni face and dark dried blood at the edges, backlit by the fire that stretches long shadows; (S1) crouches before it, her playful face turning serious for the first time.

overall_soundscape:
Quiet ryokan hush with paper-screen rustle and distant night insects, then the cut to the warehouse brings brazier crackle and the heavy rustle of old cloth. All spoken Mandarin lines are delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.

non_diegetic_music:
Intimate soft piano over the card talk, tentatively; at the banner reveal the music drops to a low ominous drone with distant wooden percussion.

---

### B15｜染血的鬼旗（圖15→16）

- 型別：**對白** ｜ 規劃秒：**14s** ｜ 首幀：圖15 ／ 尾幀：圖16
- 提交建議：`gen_i2v_video(first_frame="圖15", last_frame="圖16", duration=14, seed=110115, out="i2v_momotaro")`

integrated_multimodal_description:
[Shot 1] Night warehouse lit by a brazier: the weathered old fisherman Kiha (S2), wet-matting hair, headband, mud-covered, his face half in profile, points at the blood-stained red oni banner he holds up; (S1) sits cross-legged before it, focused and concerned; the Shiba Inu watches alertly, the monkey sits behind; hanging scroll visible on-screen text "鬼ヶ島" at the back.
(S2): 老夫年輕時跟著船朝北走，被浪打上鬼ヶ島。那島啊——根本不是島，是「城堡」。島中央有座山，山頂像顆骷髏。鬼王把山下的人都關進籠子裡，替他搬石頭。
(S1): 那島上的人……都還在嗎？
(S2): 只要你還活著一只，就都還在。老夫是游水回來的，全村只有老夫一個人回來。
(S1): 這面旗，我借了。回來再還你。
[Shot 2] At 00:10.000, the camera dissolves to a crowded harbor in bright daylight: paper curtain bunting reads visible on-screen text "鬼ヶ島へ出発"; (S1) sits on the wooden boat railing, leaning forward, arm extended, grinning back over her shoulder as the crowd cheers and the white sail with a large red oni face begins to rise. She speaks brightly into the wind.

overall_soundscape:
Brazier crackle, rough whisper of old cloth, heavy silence after Kiha's words; then the dissolve into a bustling harbor, lapping water, rowdy crowd, sail canvas snapping in the wind. All spoken Mandarin lines are delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.

non_diegetic_music:
Ominous low drumming and a grave cello line during the banner story, thinning to near-silence; then a sudden bright 90s pop-rock swell at the harbor departure.

---

### B16｜鬼ヶ島へ出発（圖16→17）

- 型別：**對白** ｜ 規劃秒：**7s** ｜ 首幀：圖16 ／ 尾幀：圖17
- 提交建議：`gen_i2v_video(first_frame="圖16", last_frame="圖17", duration=7, seed=110116, out="i2v_momotaro")`

integrated_multimodal_description:
[Shot 1] Crowded sunlit harbor: (S1) perches on the boat railing, looking back over her shoulder with a bright smile, arms spread in a cheerful boast; a villager (S2) shouts up from the dock where men in hats work; the Shiba Inu in a colorful vest sits beside her and the monkey peers over the railing; large red oni face painted on the rising sail.
(S2): 小桃！就你們四個能幹嘛！
(S1): 我們有五個！シロ、ゴン、ピーチ，還有我——加上婆婆在門口看著呢！
[Shot 2] At 00:04.500, the camera pushes out to sea: the boat noses into deep open water, choppy blue waves under bright sunlight; (S1) stands at the stern as wind whips hair across her face; far ahead, a towering mountain capped by a skull-shaped rock rise wears a dark ramshackle castle on its flank, smoke climbing from it like a bruise on the sky.

overall_soundscape:
Harbor crowd noise, villagers laughing as the sail rises, canvas snap; then the sea deepens to wind, waves, and the low groan of the hull. All spoken Mandarin lines are delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.

non_diegetic_music:
Energetic nautical tune with accordion and drums at the dock, thinning into a tense ambient swell as the dark island grows on the horizon.

---

### B17｜海上·望見鬼島（圖17→18）

- 型別：**對白** ｜ 規劃秒：**8s** ｜ 首幀：圖17 ／ 尾幀：圖18
- 提交建議：`gen_i2v_video(first_frame="圖17", last_frame="圖18", duration=8, seed=110117, out="i2v_momotaro")`

integrated_multimodal_description:
[Shot 1] Open sea, stern view: (S1) braced at the rail, the skull-topped black mountain and its smoking castle filling the background; her eyes hold a calm, slightly nervous wonder.
(S1): ……真的好像鬼。
(犬): （低低吼了一長聲）
(S1): 我知道。我們是去把那座城，拆下來的。
[Shot 2] At 00:05.000, the camera cuts to the island shore the next morning: (S1) crouches in a jungle ruin of fallen stone pillars and vine-wrapped corridors, dappled shadow; her fingertips hover over faintly glowing red footprints in the dirt that trail deeper into the grove; a red-corded skull lies in the foreground; the Shiba Inu sniffs low at the earth. She whispers low.

overall_soundscape:
Open sea with wind, wave slap, one low threatening growl from the dog; then jungle hush, dripping leaves, distant insects, soft fabric and soil sounds as she crouches. All spoken Mandarin lines are delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.

non_diegetic_music:
Deep uneasy synth drone with submerged percussion as the island looms; becoming a tense, creeping motif with sparse wooden hits in the jungle.

---

### B18｜叢林遺跡（圖18→19）

- 型別：**對白** ｜ 規劃秒：**6s** ｜ 首幀：圖18 ／ 尾幀：圖19
- 提交建議：`gen_i2v_video(first_frame="圖18", last_frame="圖19", duration=6, seed=110118, out="i2v_momotaro")`

integrated_multimodal_description:
[Shot 1] Jungle ruin in dappled light: (S1) crouches low, intense and slightly wary, fingers reaching toward the faint glowing red footprints in the dirt; the Shiba Inu sniffs at the earth beside her hand; a mossy skull with red cords rests in the foreground; weathered pillars hang demon-mask banners, faint red glow threading the path deeper.
(S1): 這些腳印……是那些被抓走的人留下的？不——太深了。這是鬼的腳印。
[Shot 2] At 00:03.500, the camera cuts low near the ground: (S1) and the dog move forward through the moss-covered gate of a wooden wall studded with sharp spikes, a black banner with a red oni face hanging above; dusty shafts of light and floating motes, upturned spikes, air thick with rot and the smell of old wood. She signals with her hand.

overall_soundscape:
Creeping jungle ambience, drip of leaves, insect buzz, faint snapping twigs, low breathing; a far-off heavy creak from the wooden gate. All spoken Mandarin lines are delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.

non_diegetic_music:
Sparse eerie strings with a deep, slow pulse, menace building quietly toward the gate.

---

### B19｜荊棘木門（圖19→20）

- 型別：**對白** ｜ 規劃秒：**5s** ｜ 首幀：圖19 ／ 尾幀：圖20
- 提交建議：`gen_i2v_video(first_frame="圖19", last_frame="圖20", duration=5, seed=110119, out="i2v_momotaro")`

integrated_multimodal_description:
[Shot 1] Before the spike-studded wooden gate draped with a red oni banner: (S1) crouches with the Shiba Inu, both pressed low to the ground as sunlight filters through the trees, dust hanging in the beams; her expression is alert, hand raised in a silent counting gesture.
(S1): 一進門就有哨位。我數到三——
[Shot 2] At 00:02.500, the camera cuts inside the oni fortress: night, between huge wooden pillars; (S1) holds a torch low against a pillar, creeping in small soft steps, lips pressed tight, the flame carving her focused face out of darkness; a red-scarfed monkey clings to a crossbeam overhead peering down.

overall_soundscape:
Hush of the forest floor, creaking wood, muffled wind over spikes; inside, the low hiss of the torch flame and the soft pad of her steps, distant whistling of night air through rafters. All spoken Mandarin lines are delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.

non_diegetic_music:
Taut low strings and a ticking heartbeat pulse, stealthy, tension coiling.

---

### B20｜夜潛（圖20→21）

- 型別：**對白** ｜ 規劃秒：**6s** ｜ 首幀：圖20 ／ 尾幀：圖21
- 提交建議：`gen_i2v_video(first_frame="圖20", last_frame="圖21", duration=6, seed=110120, out="i2v_momotaro")`

integrated_multimodal_description:
[Shot 1] Night inside the fortress pillars: (S1) holds the torch against a pillar in a stealthy crouch, wide alert eyes; the monkey (S2), up on a crossbeam, signals downward.
(S2): 牆內有人。兩個。
(S1): 那就換邊走。我們是來救人的，不是來吵醒人的。
[Shot 2] At 00:03.500, the camera cuts to the darkest hour before dawn: (S1) pulls herself up a steep stone wall along a crack, knuckles straining, shirt damp with sweat, the Shiba Inu in a small armored vest climbing the same rock face beside her, claws holding stone; dense green foliage frames an ancient weathered fortress wall behind, morning mist beginning to stir.

overall_soundscape:
Inner keep quiet, scuff of her stance, torch hiss, faint pigeon rustle in the rafters; the climb brings scraping claws on stone, heavy breaths, and distant birds waking. All spoken Mandarin lines are delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.

non_diegetic_music:
Low suspenseful synth with scattered percussion during the whisper; then a rising, straining air as the climb begins.

---

### B21｜攀牆（一）（圖21→22）

- 型別：**場景** ｜ 規劃秒：**5s** ｜ 首幀：圖21 ／ 尾幀：圖22
- 提交建議：`gen_i2v_video(first_frame="圖21", last_frame="圖22", duration=5, seed=110121, out="i2v_momotaro")`

integrated_multimodal_description:
[Shot 1] Pre-dawn fortress wall: (S1) reaches up from a low crouch, gripping a mossy rock ledge, knees bent, sunlight just beginning to catch the mist; her expression is drawn and determined, a red ribbon trailing across her shoulder.
[Shot 2] At 00:02.500, the camera tilts up into a dynamic low-angle: (S1) climbs vigorously along the rough stone wall, leg extended for balance, the Shiba Inu in its harness climbing beside her, both looking intently forward; an ancient wooden fortress rises above in dappled green light with red oni-mask banners hanging among vines. No one speaks.

overall_soundscape:
Gritty scrape of hands and claws on stone, murmured breathing, creak of vines, early birdsong emerging with the light. No spoken dialogue, no narration, no voice-over.

non_diegetic_music:
Driving percussive build, primal and sweat-stained, accelerating with each handhold.

---

### B22｜攀牆（二）氣聲（圖22→23）

- 型別：**對白** ｜ 規劃秒：**5s** ｜ 首幀：圖22 ／ 尾幀：圖23
- 提交建議：`gen_i2v_video(first_frame="圖22", last_frame="圖23", duration=5, seed=110122, out="i2v_momotaro")`

integrated_multimodal_description:
[Shot 1] High on the fortress wall, climbing: (S1) hauls herself up the stone face, mouth slightly open with exertion, skin dirt-and-sweat streaked; the Shiba Inu claws up a parallel crack, eyes on the top.
(S1)（喘著氣，近乎耳語）: 再高一點……牆裡面就是城了。
(犬): 汪。
[Shot 2] At 00:02.500, the camera cuts to a narrow wooden bridge between two watchtowers: (S1) lies flat and low on the bridge planks, barely breathing, the dog crouched still at her side; far below, two horned oni warriors cast long shadows that crawl across the deck; dappled early light filters through the trees. She waits, frozen.

overall_soundscape:
Strained breaths and scraping claws, then an abrupt hush on the bridge; the pad-pad of armored steps below echoing off the wood, the rustle of banner cloth. All spoken Mandarin lines are delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.

non_diegetic_music:
Near-silent suspended strings, then a soft ticking pulse that holds its breath at the bridge.

---

### B23｜木橋上的影子（圖23→24）

- 型別：**對白** ｜ 規劃秒：**6s** ｜ 首幀：圖23 ／ 尾幀：圖24
- 提交建議：`gen_i2v_video(first_frame="圖23", last_frame="圖24", duration=6, seed=110123, out="i2v_momotaro")`

integrated_multimodal_description:
[Shot 1] On the narrow wooden bridge: (S1) crouches so low that her chin nearly touches the planks, eyes fixed forward at the long shadows of two oni samurai on a banner-walled corridor below; her voice is a stomach-whisper timed to their steps.
(S1): 等他們走過去——一個，兩個，三個——
[Shot 2] At 00:03.000, the camera cuts to the fortress wall base: the shadows have moved on; (S1) exhales in relief and glances down at her sweat-soaked palms, then turns; above her, on a watchtower, an armored oni cub (S2) with a spear leans over, sniffing—about to spot them. Morning light begins to warm the stone.

overall_soundscape:
The scrape of armored feet crossing the deck below, wood groaning, a held silence, then a long shaky exhale and rustle of cloth; a distant clink of a spear shaft. All spoken Mandarin lines are delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.

non_diegetic_music:
Thin high tremolo strings timed to the passing footsteps, releasing into a quiet lull, then a single low hit as the cub leans over.

---

### B24｜以果結緣（圖24→25）

- 型別：**對白** ｜ 規劃秒：**7s** ｜ 首幀：圖24 ／ 尾幀：圖25
- 提交建議：`gen_i2v_video(first_frame="圖24", last_frame="圖25", duration=7, seed=110124, out="i2v_momotaro")`

integrated_multimodal_description:
[Shot 1] Fortress wall base, morning light: (S1) kneels on one knee and raises a brown fruit high over her head toward an armored oni cub (S2) perched on the watchtower, spear in hand, suspicion warring with hunger in its eyes.
(S1): 給你。我們不打架，你讓路就好。
(S2): ……走那條路。
(S1): 你看，柿子比刀有用。
[Shot 2] At 00:04.500, the camera cuts to a corner gate: a huge armored warrior with twin horns and pillar-thick arms blocks the way; (S1) steps forward and draws her katana, eyes suddenly sharp; the Shiba Inu's red-scarfed neck ruffles in the breeze behind her, and the monkey crouches over a barrel; dappled, tense forest light.

overall_soundscape:
Morning still at the wall, the cub's spear clink, soft rustle of cloth; the cut brings a heavier tone—armored movement, gravel shifting, the metallic shimmer of a drawn blade. All spoken Mandarin lines are delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese; the cub's voice is small and squeaky.

non_diegetic_music:
Quirky lightness for the fruit standoff (plucked strings), then a jarring low horn as the gate guardian appears.

---

### B25｜第一戰（圖25→26）

- 型別：**對白** ｜ 規劃秒：**6s** ｜ 首幀：圖25 ／ 尾幀：圖26
- 提交建議：`gen_i2v_video(first_frame="圖25", last_frame="圖26", duration=6, seed=110125, out="i2v_momotaro")`

integrated_multimodal_description:
[Shot 1] Corner gate face-off: the horned oni guardian (S2) towers in heavy armor, arms like columns; (S1) squares off with her blade across her body, eyes steady, stance low; the Shiba Inu and the barrel-top monkey watch from behind, sunlight dappling the packed-earth yard.
(S2): 小娃娃也敢來拆牆？
(S1): 對。我來帶牆裡的人回家。
[Shot 2] At 00:03.500, the camera cuts to the gate mechanism: (S1) clings to the door frame, both arms hooked onto the crossbar as she heaves with all her weight, sweat running off her jaw; through the gap, rows of red-skinned oni soldiers surge with torches; behind her legs the Shiba Inu braces low, guarding the retreat stair.

overall_soundscape:
Tensed forest birds falling silent, gravel crunch, the swish of bladework, a single heavy breath; then wood groaning under strain, torches crackling, distant shouting from the gate gap. All spoken Mandarin lines are delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese; the oni guardian's voice is a deep rumble.

non_diegetic_music:
Combat percussion with taiko drums and sharp strings, fierce and tight, rushing with the gate-breaking effort.

---

### B26｜城門激戰（圖26→27）

- 型別：**對白** ｜ 規劃秒：**6s** ｜ 首幀：圖26 ／ 尾幀：圖27
- 提交建議：`gen_i2v_video(first_frame="圖26", last_frame="圖27", duration=6, seed=110126, out="i2v_momotaro")`

integrated_multimodal_description:
[Shot 1] Gate frame mid-battle: (S1) strains against the crossbar, teeth gritted, sweat and grit on her skin; through the breach, oni soldiers flood with firelight; the Shiba Inu crouches below at the wooden stair, a low growl rising as she shouts.
(S1)（咬牙）: シロ——好感！
(犬): （低吼，死死把住退路的木階）
[Shot 2] At 00:03.500, the camera cuts inside the now-open corridor: the gate has cracked open a sliver—darkness pierced by torchlight revealing a long passage toward a distant hall; the battle clamor fades behind; then a close shot of (S1) crouching by a blood-streaked stone lantern, noticing a small wooden box lying in the dirt, red tassel askew. Her expression shifts from battle-fury to stillness.

overall_soundscape:
Roaring chaos—torches, shouts, wood cracking—muffled as the corridor swallows it; then a sudden intimate quiet with a small breath, gravel settling, and the faint creak of the lifted box lid. All spoken Mandarin lines are delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.

non_diegetic_music:
Full-throttle battle score with taiko and brass, cutting abruptly to a fragile music-box melody as the box appears.

---

### B27｜木匣（圖27→28）

- 型別：**對白** ｜ 規劃秒：**7s** ｜ 首幀：圖27 ／ 尾幀：圖28
- 提交建議：`gen_i2v_video(first_frame="圖27", last_frame="圖28", duration=7, seed=110127, out="i2v_momotaro")`

integrated_multimodal_description:
[Shot 1] Inside the corridor by a blood-streaked stone lantern: (S1) kneels on the ground, cradling a small wooden box carved with the character "桃" and a red tassel, carefully opening the clasp; inside lies a cloth painted with a house under a peach tree—identical to her grandmother's home; her face goes through stunned recognition.
(S1): 這是……婆婆說的，那間屋子？
(S2)（鬼兵聲，由遠而近）: 那孩子在那裡！
(S1): 總之——先保住這件東西。
[Shot 2] At 00:04.000, the camera cuts to night: (S1) leans against a wooden post of a broken tower, gazing up across the fortress at the highest tier burning with torchlight—the oni king's hall; the pheasant on her shoulder watches the rear; her hand presses the cloth to her chest, expression growing resolved.

overall_soundscape:
Dim corridor, distant drips, a rustle of cloth and the click of a wooden clasp, approaching coarse shouts far away; then night wind over the broken tower, wood creak, a low ember crackle. All spoken Mandarin lines are delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.

non_diegetic_music:
A fragile music-box waltz, bittersweet and strange; the disturbance of shouting cuts it short; the tower scene brings a lone, somber cello with a rising resolve.

---

### B28｜眺望鬼城自白（圖28→29）

- 型別：**對白** ｜ 規劃秒：**8s** ｜ 首幀：圖28 ／ 尾幀：圖29
- 提交建議：`gen_i2v_video(first_frame="圖28", last_frame="圖29", duration=8, seed=110128, out="i2v_momotaro")`

integrated_multimodal_description:
[Shot 1] Night on the broken tower: (S1) rests against a weathered wooden post, gaze fixed on the oni king's hall burning at the fortress peak; the pheasant keeps watch on her shoulder; she murmurs to herself, hand pressed to the cloth hidden in her breast.
(S1)（自言自語）: 那個人（婆婆）說，我是從桃樹下被撿到的。會不會，我家也跟這座城一樣，原本也是有屋簷的。
(S1): 不管怎樣，先打完再說。明晚，我們就進去。
[Shot 2] At 00:05.000, the camera cuts deep into the fortress dungeons: (S1) kneels before a wall of wooden bars, hands reaching through to clasp the withered hands of an old man (S2) with gray hair and scarred hands; the Shiba Inu stands muddy at her side; candle shadows quiver across prison beams and bars.

overall_soundscape:
Night wind crossing the tower, creaking posts, distant torch crackle; then the cut into the dungeon brings humid silence, a single drip, and the rough whisper of dry old hands. All spoken Mandarin lines are delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.

non_diegetic_music:
Lonely piano over night wind, contemplative; descending with the scene into a dark, warm chamber of muffled strings.

---

### B29｜天牢重逢（圖29→30）

- 型別：**對白** ｜ 規劃秒：**10s** ｜ 首幀：圖29 ／ 尾幀：圖30
- 提交建議：`gen_i2v_video(first_frame="圖29", last_frame="圖30", duration=10, seed=110129, out="i2v_momotaro")`

integrated_multimodal_description:
[Shot 1] Dungeon before the wooden bars, torchlight swaying: (S1) kneels in mud and pressed close to the bars, her hands clasping the old island elder Genzo's (S2) weathered, trembling hands; he looks at her in desperate alarm; the muddy Shiba behind her watches forward.
(S1): 您是島另一頭的上老，是不是？我是從村子裡來的，我叫桃。
(S2)（顫著聲音）: 桃……你怎麼進得來。快走！鬼王會把你——
(S1): 要走也是大家一起走。我先把牢門劈開，再往大殿去討個說法。
(S2): 那大殿上……可是真的鬼王啊。
(S1): 我知道。婆婆說過，鬼也是能講道理的——只要你先動手。
[Shot 2] At 00:07.000, the camera cuts to a torch-lit passage: (S1) sprints flat-out down the corridor, red ribbon streaming straight behind her, wind raking her face; the pack of pursuers' roars close at her back while a faint hall-light glows ahead—she does not turn around.

overall_soundscape:
Dungeon hush, whisper of breath, the rasp of old hands and faint rattling of the bars; then heavy boots, a thundering chase, shouts, and her tight breathing. All spoken Mandarin lines are delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese; the elder's voice is old and trembling.

non_diegetic_music:
Chamber strings, reticent and warm for the reunion, tense at the exchange; erupting into a breakneck running pulse as she sprints.

---

### B30｜突圍（圖30→31）

- 型別：**場景** ｜ 規劃秒：**5s** ｜ 首幀：圖30 ／ 尾幀：圖31
- 提交建議：`gen_i2v_video(first_frame="圖30", last_frame="圖31", duration=5, seed=110130, out="i2v_momotaro")`

integrated_multimodal_description:
[Shot 1] Mid-sprint down the fortress passage: (S1) runs with everything she has, hair streaming, dust and sweat on her face, feet hammering the planks; torches blur past; the camera barrels ahead of her down the corridor.
[Shot 2] At 00:02.500, the camera cuts into the grand hall: torchlight travels up the walls into a shadowed vaulted ceiling; armored oni warriors line the sides in a semicircle, spears and blades glinting; (S1) walks slowly into the open center, sweating, fighting a breathless twitch but drawing the corner of her mouth into a small confident smile as she steps toward the throne ahead. No one speaks.

overall_soundscape:
Booming footsteps and ragged breath during the sprint, fading as she enters; the hall rings with heavy silence, creaking torch flames, the scuff of her sandals on stone, armor shifting. No spoken dialogue, no narration, no voice-over.

non_diegetic_music:
Frantic chase percussion collapsing into a vast, oppressive drone; the hall simmers in a near-silent tension with low horns.

---

### B31｜大殿對峙（一）（圖31→32）

- 型別：**場景** ｜ 規劃秒：**5s** ｜ 首幀：圖31 ／ 尾幀：圖32
- 提交建議：`gen_i2v_video(first_frame="圖31", last_frame="圖32", duration=5, seed=110131, out="i2v_momotaro")`

integrated_multimodal_description:
[Shot 1] The vaulted hall, fire-glow crawling up dark timbers: armored oni line the semicircle walls; (S1) walks barefoot into the center, head high, ribs heaving, the hall's whole weight pressing on her small silhouette; banners with red oni faces hang between the torch sconces.
[Shot 2] At 00:02.500, the camera cuts to a closer medium shot: (S1) now stands in the pool of light, a small cut near her eye, mud and blood on her tunic; she draws herself straight, jaw set, and pulls the katana half an inch from its sheath—the metallic shimmer drawing every eye in the hall. No one speaks.

overall_soundscape:
A cavernous hush, torch flames swaying, the soft hiss of fire, the whisper of many armored bodies shifting, and a faint draw of steel. No spoken dialogue, no narration, no voice-over.

non_diegetic_music:
Deep sustained choir drone with slow taiko heartbeat, grandeur and menace balanced on a knife's edge.

---

### B32｜大殿對峙（二）（圖32→33）

- 型別：**場景** ｜ 規劃秒：**5s** ｜ 首幀：圖32 ／ 尾幀：圖33
- 提交建議：`gen_i2v_video(first_frame="圖32", last_frame="圖33", duration=5, seed=110132, out="i2v_momotaro")`

integrated_multimodal_description:
[Shot 1] The hall's glow on her face: (S1) crouches low mid-step onto the dais step, knuckles white on the beam beside her, muscles straining, her gaze fixed dead ahead on the throne; wet hair strands cling to her muzzle-down jaw, exhaustion and defiance mixed.
[Shot 2] At 00:02.500, the camera cuts low across the hall: (S1) grips a thick horizontal beam with both hands, leaning into a strained pull, one leg braced behind her; the Shiba Inu, small red sash worn, lies alert at her side; behind them the war banners cast their demon-mask shadows, and the armored ranks begin to close in sync. No one speaks.

overall_soundscape:
Strained breathing, wood grating under her hold, the rustle of a hundred armored bodies advancing a half-step in unison, fire hiss. No spoken dialogue, no narration, no voice-over.

non_diegetic_music:
Rising low brass with a slow war-drum cadence, tension ratcheting like a drawn bow.

---

### B33｜鬼王起身（圖33→34）

- 型別：**場景** ｜ 規劃秒：**5s** ｜ 首幀：圖33 ／ 尾幀：圖34
- 提交建議：`gen_i2v_video(first_frame="圖33", last_frame="圖34", duration=5, seed=110133, out="i2v_momotaro")`

integrated_multimodal_description:
[Shot 1] The hall holds its breath: (S1) stands at the foot of the dais, blade half-drawn, watching; slowly, impossibly, a mountain of a figure rises from the throne—black armor, twin horns, burning red eyes—the entire hall seeming to sink under the gaze it turns down on her.
[Shot 2] At 00:02.500, the camera gets a low POV behind (S1): the oni king is fully standing, a great black horned silhouette blotting out the brazier light, colossal sword drawn and trailing sparks along the floor; (S1)'s silhouette before him looks impossibly small, but she does not step back, her katana finishing its draw to the ready. No one speaks, but the air itself seems to throb.

overall_soundscape:
A heavy, stretching silence; the groan of black plate armor, the crunch of the throne scraping, brace-fire roaring, and her single steady exhale. No spoken dialogue, no narration, no voice-over.

non_diegetic_music:
A colossal sub-bass swell with a rising choir, then nearly silent—only a low vibration and one tight snare heartbeat.

---

### B34｜斬落（圖34→35）

- 型別：**對白** ｜ 規劃秒：**7s** ｜ 首幀：圖34 ／ 尾幀：圖35
- 提交建議：`gen_i2v_video(first_frame="圖34", last_frame="圖35", duration=7, seed=110134, out="i2v_momotaro")`

integrated_multimodal_description:
[Shot 1] The standoff at its peak: (S1) faces the towering oni king across inches of firelight, blade reflecting the flame; the Demon King's great sword begins its colossal swing down at her.
(S1): 鬼王——我要你做人。
[Shot 2] At 00:03.000, the camera cuts to the single instant of crossing: the giant's blade smashes down while (S1)'s katana meets it edge-to-edge and cuts upward against the momentum, a clean ascending arc slicing through the flash; the frame freezes for a heartbeat.
[Shot 3] At 00:05.500, she lands on one knee on the ground, breathing hard, blade dripping, as the towering body behind her topples and the iron armor crashes echo through the hall.
(S1): ……我負責帶人回去。你負責，睡一覺。

overall_soundscape:
The weight of the giant's swing—a groaning rush of air—met by the shocking ring of steel; a heavy, rolling crash of armor hitting stone that booms and fades; then her ragged breathing in the sudden quiet. All spoken Mandarin lines are delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.

non_diegetic_music:
A percussive clash—gong, taiko, and held chord—striking at the blade-crossing like a thunderclap, then dissipating into a thin, ringing silence.

---

### B35｜勝利低語（圖35→36）

- 型別：**對白** ｜ 規劃秒：**6s** ｜ 首幀：圖35 ／ 尾幀：圖36
- 提交建議：`gen_i2v_video(first_frame="圖35", last_frame="圖36", duration=6, seed=110135, out="i2v_momotaro")`

integrated_multimodal_description:
[Shot 1] Post-slash stillness, mid-hall: (S1) rises from the landing crouch, sword still in hand, the giant's body lying broken behind her; she straightens, lifts her head, and looks slowly across the stunned hall at the fallen king.
[Shot 2] At 00:03.000, the camera cuts to the victory tableau: (S1) stands atop the slumped, armored body, katana dripping as she raises it; the standard falls around them—visible on-screen text "鬼王" flaring in torchlight; the Shiba Inu stands straight at her feet and lets out a long battle howl that rings through the whole fortress. She whispers, almost to herself.
(S1)（低聲）: 婆婆——我回來囉。

overall_soundscape:
Dead quiet after the crash—the long howl of the dog cutting through it, armor settling, embers popping, then a single, barely audible tender breath of a word. All spoken Mandarin lines are delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.

non_diegetic_music:
Subsiding battle drones giving way to a clear, hopeful brass note as the howl lands, then one warm piano chord beneath her whisper.

---

### B36｜勝利 → 戰後（圖36→37）

- 型別：**場景** ｜ 規劃秒：**5s** ｜ 首幀：圖36 ／ 尾幀：圖37
- 提交建議：`gen_i2v_video(first_frame="圖36", last_frame="圖37", duration=5, seed=110136, out="i2v_momotaro")`

integrated_multimodal_description:
[Shot 1] The victory tableau settling: (S1) stands with dripping blade above the fallen king, the "鬼王" banner flaring, the Shiba Inu howling at her side; torchlight flickers across war-torn banners as the embers of the fight begin to die down.
[Shot 2] At 00:02.500, the camera slowly lowers and moves around her toward daybreak: (S1) steps down from the collapsed armor, exhaustedly walking through the ember-lit wreckage toward the fortress courtyard gate; the grey of dawn begins to spill through, softening the red-black scene into muted blues as the scene opens onto a clearing before dawn. She slows, looking ahead with a tired, almost gentle expression.

overall_soundscape:
The long dog howl fading, armor and embers settling, cloth snapping in morning wind; the crisp grey quiet of near-dawn, distant bird calls, her soft footsteps on ash-trampled stone. No spoken dialogue, no narration, no voice-over.

non_diegetic_music:
Noble, exhausted strings with a fading war-drum heartbeat, bleeding into a clear, cold, hopeful dawn tone as the light turns blue.

---

### B37｜戰後撫狗 → 片尾（圖37，首幀-only）

- 型別：**對白＋片尾字卡** ｜ 規劃秒：**16s** ｜ 首幀：圖37（無尾幀，結尾自然淡出）
- 提交建議：`gen_i2v_video(first_frame="圖37", duration=16, seed=110137, out="i2v_momotaro")`

integrated_multimodal_description:
[Shot 1] Before dawn, the fire still smoldering: (S1) crouches low, her skirt hem crusted with dried blood, cupping the chin of a large, fluffy Akita sitting before her, its fur matted with mud and blood; she strokes under its jaw, once, twice; her voice is soft and warm, nearly a whisper.
(S1): ……你也想家吧。打完仗的人，都是要回家的。
(S1): 那我們也回家吧。回去泡婆婆的湯，回去坐在桃樹下，把這趟「旅の記録」講成整整三天三夜都講不完的故事。
(犬): （低低「嗚」了一長聲，靠進她的膝蓋）
[Shot 2] At 00:06.000, the camera pans up from the two of them to the spreading grey dawn over the burning-out fortress; the faint shape of a distant sea and homeward islands appears on the horizon.
[Shot 3] At 00:09.500, the image dissolves to the opening railing shot: (S1), sitting on the wooden edge, chin resting on the rice ball, looking softly at the lens as through a conversation with someone off-camera; the Shiba Inu keeps its nose near the lens in the foreground.
(S1): 鬼退治のあとで。
(S1): 勝ったけど、ちょっと疲れた。
(S1): まだ撮るの？收了啦——
(S1): また、どこかへ♡
[Shot 4] At 00:14.000, slow fade toward a dark card; end-card text visible on-screen reads "新たな冒険は、まだ終わっていない。" with "新·桃太娘" beneath it; the frame fades quietly to black.

overall_soundscape:
Ember crackle and her gentle stroke against fur, the dog's low long whine, morning wind; then a film-projector hum as the railing shot returns, her soft playful breaths; a final fade-out silence over the end card. All spoken Mandarin lines are delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.

non_diegetic_music:
A quiet, bittersweet theme—piano with faint strings—tender over the petting, opening up to a wide morning air; returning as a lighter, nostalgic reprise over the railing shot, then holding a single soft chord as the card fades to black.

---

## 4. 產出前自檢（本文件）

- [ ] 幀號鏈：B01 `01→02` → … → B36 `36→37` → B37 `37`，**無跳號、無重複**。
- [ ] 37 個區塊齊全；B37 為首幀-only（其餘 36 塊皆首尾幀）。
- [ ] i2v 三欄位格式、欄位順序正確；prompt 內無 model/解析度/寬高比文字。
- [ ] `<d>` 對白逐字與 `doc\story.md` 一致，無發明、無改寫。
- [ ] 對白區塊帶腔調錨點句；場景區塊無 `<d>`、無旁白暗示。
- [ ] `overall_soundscape` / `non_diegetic_music` 每塊皆有；無預設旁白空間。
- [ ] 鏡頭時間戳嚴格遞增且 ≤ 規劃秒。
- [ ] 畫面可見文字以英文雙引號區隔（如 `"鬼ヶ島へ出発"`），字幕資料表已同步建立。
- [ ] 字幕資料表累積起點 = 前一塊累積起點 + 前塊秒數（總規劃 259s）。
- [ ] 合併解析度全片統一（`resolution="352:608"`），依 B01→B37 順序 `merge_videos`。
- [ ] 合併後以 `scale = 實際總秒 / 259` 換算產出 `.srt`；旁白（B01 末句、B37 末句）以 `<i>` 斜體包覆。