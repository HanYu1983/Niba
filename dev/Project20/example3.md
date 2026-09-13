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
| Ref-C4 | `ch2_refs/char_judge.png` | 法官肖像：老年男性、銀髮、法袍、嚴肅 | 832×1248 | 後續 beat 如需特寫（B1–B5 未用到） |
| Ref-S1 | `output/ch2_court_ref/zimage_00016_.png` | 最高法院第三審判庭全景：圓頂大廳、分裂旁聽席、紅衣左/噤聲右、憲法石牆 | 832×1248 | B1、B2、B3、B5 等全景/坐席區塊 |
| Ref-S2 | `ch2_refs/scene_court_defense.png` | 辯護席區域：木質桌椅、近法官席 | 832×1248 | B2、B7 等辯護席區塊（先用 Ref-S1 代用） |
| Ref-S3 | `ch2_refs/scene_court_camerawall.png` | 法庭頂端直播攝影機與天花板結構 | 832×1248 | B19 |
| Ref-S4 | `ch2_refs/scene_court_exit.png` | 法庭門外走廊：石柱、記者群 | 832×1248 | B24、B25、B26 |
| Ref-S5 | `ch2_refs/scene_tvwall.png` | 法庭外電視牆：黑色標題滾動 | 832×1248 | B27 |

> **建置方式**：每張以 `gen_zit_image`（Z-Image，832×1248 直式 2:3）生成，prompt 中明確指定角色外觀
> 錨點（與 guide §5.3 一致）。Z-Image 出圖直接 2:3，r2v `ref_image_size: match` 縮放時不切構圖重點。
> 所有圖尺寸統一 832×1248（2:3 比例），確保 r2v 輸出不裁切。

---

## 區塊 × 參考圖對照表

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
<Subject 1> 是 <Picture 1> 裡的少年艾倫：19 歲、瘦弱、短髮、白襯衫，一名數據科學系學生，素淨而專注。
<Subject 2> 是 <Picture 2> 裡最高法院的第三審判庭：圓頂大廳、分裂式旁聽席、高聳法官席背靠憲法石牆。

summary:
[reference generation] 目標影片是艾倫身世的蒙太奇開場：超市比價、統計圖對照、社群貼文發布，
畫面最後收在法庭，旁白以同一男聲平讀其身世與罪名。人物與法庭保留自 <Picture 1> 與 <Picture 2>。

retention_analysis:
<Subject 1>（出現在 [Shot 1]、[Shot 4]）: fully_preserved - 少年瘦弱身形、短髮、白襯衫、素淨學生樣。
<Subject 2>（出現在 [Shot 4]）: fully_preserved - 圓頂大廳、分裂旁聽席與高聳法官席。

detailed_description:
目標影片使用冷藍灰色調的紀錄式風格，手持微晃、慢速蒙太奇。旁白為**同一名低沉、冷靜、中年男聲**
，以台灣腔普通話逐字平讀、非角色對白、非畫面內發聲，全程無粵語。
[Shot 1] 00:00.000（旁白約 6 秒）：艾倫在超市走道拿起貨架商品、低頭對照手機螢幕上的標價，神情專注。
鏡頭：手持中景。旁白：（<Narrator>）<d>[中文] 那少年叫艾倫，今年才十九歲，是一名數據科學系的學生。</d>
[Shot 2] 00:06.000（旁白約 4 秒）：手機螢幕特寫，一張「政府公布 2% 對比實測 15%」的統計對照圖正在生成。
鏡頭：手機特寫、淺景深。旁白：（<Narrator>）<d>[中文] 他的罪名是『散布不實資訊以意圖顛覆聯邦秩序』。</d>
[Shot 3] 00:10.000（旁白約 7 秒）：艾倫手指點下「發布」，社群貼文送出，按讚與轉發數字開始跳動。
鏡頭：手機螢幕→過肩鏡頭。旁白：（<Narrator>）<d>[中文] 而他所做的『罪行』，僅僅是將政府公布的
『通膨率百分之二』與他實地走訪五十家超市後彙整的『物價漲幅百分之十五』做成對照圖，發布在個人的社群平台上。</d>
[Shot 4] 00:17.000（場景收尾 6 秒）：畫面淡入法庭，被告席上的艾倫垂首而立，旁聽席隱約騷動。
鏡頭：靜止寬景、微仰。無台詞。

overall_soundscape:
所有旁白以台灣腔普通話（台灣腔、無粵語、無方言）由**同一名低沉、冷靜、中年男聲**逐字平讀、
非角色對白、非畫面內發聲。畫面內無任何人物開口。其餘為超市的日常低噪（道內廣播、購物車聲）、
手機操作音、按讚提示音，與法庭展開時的龐大寂靜與低語迴響。

non_diegetic_music:
一段低沉受限的大提琴線與稀疏鋼琴單音，平穩徐緩，蒙太奇中微微上行、收束於法庭的寂靜。
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

## B1 — 法庭全景（場景，無對白，4 秒）

```
subject_definitions:
<Subject 1> 是 <Picture 1> 裡最高法院的第三審判庭全景：圓頂大廳、挑高穹頂、分裂式旁聽席、
左側紅衣支持者與右側噤聲的年輕旁聽者、高聳法官席背靠憲法石牆。

summary:
[reference generation] 目標影片是法庭審判的開場全景鏡：從走道低位仰拍，緩慢展示法庭的壓迫建築
與分裂的旁聽席， establishing shot 奠定整場審判的張力基調。場景完整保留自 <Picture 1>。

retention_analysis:
<Subject 1>（出現在 [Shot 1]）: fully_preserved - 圓頂大廳、分裂旁聽席、紅衣左側、噤聲右側、
高聳法官席與冷石建築。

detailed_description:
目標影片使用冷藍灰色調的法庭紀錄式風格，慢速鏡頭與冷光斜切。
[Shot 1] 00:00.000 開場（場景 4 秒）：低走道位置的全景群像，旁聽席坐滿群眾、紅衣左側／噤聲右側，
高聳法官席背靠憲法石牆。鏡頭：靜止寬景、極微仰升。無台詞。

overall_soundscape:
法庭的龐大寂靜、偶爾的座椅輕響與低語迴響，冷空氣中的嗡嗡聲。

non_diegetic_music:
N/A
```

**參數**：`ref_image_0=output/ch2_court_ref/zimage_00016_.png, duration=4, seed=310001, out=ch2_b1_video`

---

## B2 — 林墨望向被告席（場景，無對白，5 秒）

```
subject_definitions:
<Subject 1> 是 <Picture 1> 裡的邊境經濟學家林墨：一名瘦削、中等身材的東亞中年男性，年近五十，
短而整齊的黑髮夾雜灰白絲、淺鬍茬、深陷疲憊的眼神、穿深炭灰西裝與皺白襯衫不打領帶。
<Subject 2> 是 <Picture 2> 裡最高法院的第三審判庭法庭空間：圓頂大廳、分裂旁聽席、高聳法官席，
視線可自辯護席越過旁聽席望向被告席。

summary:
[reference generation] 目標影片是法庭辯護席上的中景：林墨安靜坐在桌後，視線越過群眾望向
被告席少年艾倫，神情複雜。人物與場景完整保留自 <Picture 1> 與 <Picture 2>。

retention_analysis:
<Subject 1>（出現在 [Shot 1]）: fully_preserved - 他的瘦削嚴肅面容、黑髮灰絲、淺鬍茬、
深陷疲憊眼神，與深炭灰西裝及皺白襯衫。
<Subject 2>（出現在 [Shot 1]）: fully_preserved - 圓頂大廳、分裂旁聽席與高聳法官席。

detailed_description:
目標影片使用冷藍灰色調的法庭紀錄式風格，靜止中景、淺景深。
[Shot 1] 00:00.000（場景 5 秒）林墨坐在辯護席後方，視線越過群眾望向被告席少年。鏡頭：靜止中景、
淺景深。無台詞。

overall_soundscape:
法庭的龐大寂靜、林墨的輕微呼吸聲、遠處旁聽席的低語迴響。

non_diegetic_music:
一段低沉受限的大提琴單音，幾乎不動。
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_1=output/ch2_court_ref/zimage_00016_.png（重用）, duration=5, seed=310002, out=ch2_b2_video`

---

## B3 — 檢察官質問艾倫（對白，15 秒）

```
subject_definitions:
<Subject 1> 是 <Picture 1> 裡的檢察官：中年男性、削瘦、銳利眼神、深色法袍、胸前佩聯邦檢察徽章。
<Subject 2> 是 <Picture 2> 裡被告席上的少年艾倫：19 歲、瘦弱、短髮、白色襯衫、恐懼表情。
<Subject 3> 是 <Picture 3> 裡最高法院的第三審判庭全景：圓頂大廳、分裂式旁聽席、左側紅衣支持者。

summary:
[reference generation] 目標影片是法庭對峙的開端：檢察官在席上起立、面向被告席上的少年艾倫
逐字質問，語氣步步進逼。人物與場景完整保留自 <Picture 1>、<Picture 2> 與 <Picture 3>。

retention_analysis:
<Subject 1>（出現在 [Shot 1]）: fully_preserved - 削瘦面容、銳利眼神、深色法袍與檢察徽章。
<Subject 2>（出現在 [Shot 1]）: fully_preserved - 少年瘦弱身形、短髮、白襯衫、恐懼表情。
<Subject 3>（出現在 [Shot 1]）: fully_preserved - 圓頂大廳、分裂旁聽席。

detailed_description:
目標影片使用冷藍灰色調的法庭紀錄式風格，靜止中景、淺景深。所有台詞以**台灣腔普通話**逐字、
緩慢、由畫面內本人說出、非旁白、無粵語。
[Shot 1] 00:00.000（對白 15 秒）檢察官在檢察官席起立、面向被告席質問，<Subject 1>（S1）(S1) says,
<d>[中文] 被告人艾倫，你是否承認，你在未經官方核實的情況下，私自發布具誘導性的數據，導致
民眾對聯邦財政產生不信任，甚至引發了上週的超市搶購潮？</d> 鏡頭：靜止中景、淺景深。

overall_soundscape:
所有台詞以台灣腔普通話（台灣腔、無粵語、無方言）逐字緩慢朗讀、由畫面內本人說出、非旁白。
其餘為法庭的龐大寂靜與大廳迴響。

non_diegetic_music:
一段低沉受限的大提琴線與稀疏鋼琴單音，平穩徐緩。
```

**參數**：`ref_image_0=output/ch2_prosecutor_ref/zimage_00017_.png（重用）, ref_image_1=output/ch2_allen_ref/zimage_00015_.png（重用）, ref_image_2=output/ch2_court_ref/zimage_00016_.png（重用）, duration=15, seed=310003, out=ch2_b3_video`

---

## B4 — 艾倫顫抖回答（對白，7 秒）

```
subject_definitions:
<Subject 1> 是 <Picture 1> 裡被告席上的少年艾倫：19 歲、瘦弱、短髮、白色襯衫、恐懼表情。

summary:
[reference generation] 目標影片是被告席上少年的近景特寫：艾倫顫抖開口、聲音發顫地為自己辯護，
強調他只是拍下真實數字。人物完整保留自 <Picture 1>。

retention_analysis:
<Subject 1>（出現在 [Shot 1]）: fully_preserved - 少年瘦弱身形、短髮、白襯衫、恐懼顫抖的表情。

detailed_description:
目標影片使用冷藍灰色調的法庭紀錄式風格，靜止中近景、淺景深、微顫。所有台詞以**台灣腔普通話**
逐字、緩慢、由畫面內本人說出、非旁白、無粵語。
[Shot 1] 00:00.000（對白 7 秒）被告席上少年艾倫顫抖開口，<Subject 1>（S1）(S1) says,
<d>[中文] 我只是……我只是拍下標價，然後做了平均值。那些都是真實的數字……</d> 鏡頭：靜止中近景、
淺景深、微顫。

overall_soundscape:
所有台詞以台灣腔普通話（台灣腔、無粵語、無方言）逐字緩慢朗讀、由畫面內本人說出、非旁白。
其餘為法庭寂靜中艾倫顫抖的氣音與輕微座椅聲。

non_diegetic_music:
一段低沉受限的大提琴單音，幾乎不動。
```

**參數**：`ref_image_0=output/ch2_allen_ref/zimage_00015_.png（重用）, duration=7, seed=310004, out=ch2_b4_video`

---

## B5 — 檢察官冷笑定罪（對白，16 秒）

```
subject_definitions:
<Subject 1> 是 <Picture 1> 裡的檢察官：中年男性、削瘦、銳利眼神、深色法袍、胸前佩聯邦檢察徽章。
<Subject 2> 是 <Picture 2> 裡的邊境經濟學家林墨：一名瘦削、中等身材的東亞中年男性，年近五十，
短而整齊的黑髮夾雜灰白絲、淺鬍茬、深陷疲憊的眼神、穿深炭灰西裝與皺白襯衫不打領帶。
<Subject 3> 是 <Picture 3> 裡最高法院的第三審判庭全景：圓頂大廳、分裂式旁聽席、左側紅衣支持者。

summary:
[reference generation] 目標影片是法庭對峙的定罪時刻：檢察官冷笑一聲轉向陪審團，將「懷疑官方
數字」上升為「背叛」，語氣從質問轉為宣判。人物與場景完整保留自 <Picture 1>、<Picture 2>
與 <Picture 3>。

retention_analysis:
<Subject 1>（出現在 [Shot 1]）: fully_preserved - 削瘦面容、銳利眼神、深色法袍與檢察徽章。
<Subject 2>（出現在 [Shot 1]）: fully_preserved - 瘦削嚴肅面容、黑髮灰絲、深炭灰西裝。
<Subject 3>（出現在 [Shot 1]）: fully_preserved - 圓頂大廳、分裂旁聽席。

detailed_description:
目標影片使用冷藍灰色調的法庭紀錄式風格，靜止中景、快速切換。所有台詞以**台灣腔普通話**逐字、
緩慢、由畫面內本人說出、非旁白、無粵語。
[Shot 1] 00:00.000（對白 16 秒）檢察官冷笑一聲轉向陪審團，<Subject 1>（S1）(S1) says,
<d>[中文] 在聯邦面臨外部經濟封鎖的非常時期，任何偏離官方定調的『數字』，都是敵人用來瓦解
我們內部的武器！這不是科學，這是背叛。</d> 鏡頭：快速切換到陪審團方向的中景。

overall_soundscape:
所有台詞以台灣腔普通話（台灣腔、無粵語、無方言）逐字緩慢朗讀、由畫面內本人說出、非旁白。
其餘為法庭的龐大寂靜與大廳迴響。

non_diegetic_music:
一段低沉受限的大提琴線與稀疏鋼琴單音，平穩徐緩。
```

**參數**：`ref_image_0=output/ch2_prosecutor_ref/zimage_00017_.png（重用）, ref_image_1=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_2=output/ch2_court_ref/zimage_00016_.png（重用）, duration=16, seed=310005, out=ch2_b5_video`

---

## 腔調錨點（B0–B5 全部以此為準）

- **`<d>` 語言標籤維持 `[中文]` 不改**；腔調不由標籤決定。
- **角色對白控制點＝ `overall_soundscape` 首句錨點**：
  `所有台詞以台灣腔普通話（台灣腔、無粵語、無方言）逐字緩慢朗讀、由畫面內本人說出、非旁白。`
- **旁白控制點＝同一組聲線描述**（見 B0）：`同一名低沉、冷靜、中年男聲……逐字平讀、
  非角色對白、非畫面內發聲`，並搭配**旁白專用 seed 310000**（標定後鎖定）。
- 每支 r2v 獨立 seed；seed 需先查黑名單（guide §5.2），實測若歪粵腔即記入黑名單並換 seed。
- B1 無對白，故 `overall_soundscape` 不含腔調錨點（無音訊需要錨定）。

---

## B0–B5 完成後：合併

B0–B5 依序合併為 Ch2 前 70 秒（旁白身世 → 開庭）：

```
merge_videos(
  files = [
    "ch2_b0_video/xxx.mp4",
    "ch2_b1_video/xxx.mp4",
    "ch2_b2_video/xxx.mp4",
    "ch2_b3_video/xxx.mp4",
    "ch2_b4_video/xxx.mp4",
    "ch2_b5_video/xxx.mp4"
  ],
  resolution = "352:608",
  out = "ch2_part1"
)
```
