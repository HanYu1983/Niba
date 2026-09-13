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
| Ref-S2 | `ch2_refs/scene_court_defense.png` | 辯護席區域：木質桌椅、近法官席 | 832×1248 | B2、B8 等辯護席區塊（先用 Ref-S1 代用） |
| Ref-S3 | `ch2_refs/scene_court_camerawall.png` | 法庭頂端直播攝影機與天花板結構 | 832×1248 | B20 |
| Ref-S4 | `ch2_refs/scene_court_exit.png` | 法庭門外走廊：石柱、記者群 | 832×1248 | B26、B27、B28 |
| Ref-S5 | `ch2_refs/scene_tvwall.png` | 法庭外電視牆：黑色標題滾動 | 832×1248 | B29 |

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

## B7 — 林墨的等待（旁白，7 秒）

> **旁白全文**：「林墨在辯護席後方坐了很久。他等的，就是讓檢察官把話全部說出來的那一刻。」

```
subject_definitions:
<Subject 1> 是 <Picture 1> 裡的邊境經濟學家林墨：一名瘦削、中等身材的東亞中年男性，年近五十，
短而整齊的黑髮夾雜灰白絲、淺鬍茬、深陷疲憊的眼神、穿深炭灰西裝與皺白襯衫不打領帶。
<Subject 2> 是 <Picture 2> 裡最高法院的第三審判庭法庭空間：圓頂大廳、分裂旁聽席、高聳法官席。

summary:
[reference generation] 目標影片是法庭審判中的安靜段落：林墨坐在辯護席後方不動聲色，旁白以同一
男聲說明他的等待，檢察官與群眾的掌聲迴盪在畫外。人物與場景保留自 <Picture 1> 與 <Picture 2>。

retention_analysis:
<Subject 1>（出現在 [Shot 1]）: fully_preserved - 瘦削嚴肅面容、黑髮灰絲、深炭灰西裝與皺白襯衫。
<Subject 2>（出現在 [Shot 1]）: fully_preserved - 圓頂大廳、分裂旁聽席與高聳法官席。

detailed_description:
目標影片使用冷藍灰色調的法庭紀錄式風格，靜止中景、淺景深。旁白為**同一名低沉、冷靜、中年男聲**
，以台灣腔普通話逐字平讀、非角色對白、非畫面內發聲，全程無粵語。
[Shot 1] 00:00.000（旁白 7 秒）：林墨坐在辯護席後方，目光低垂、紋風不動，外圍的掌聲與騷動
退成遙遠的畫外聲。鏡頭：靜止中景、淺景深。旁白：（<Narrator>）<d>[中文] 林墨在辯護席後方坐了很久。
他等的，就是讓檢察官把話全部說出來的那一刻。</d>

overall_soundscape:
所有旁白以台灣腔普通話（台灣腔、無粵語、無方言）由**同一名低沉、冷靜、中年男聲**逐字平讀、
非角色對白、非畫面內發聲。畫面內無任何人物開口。其餘為遠方旁聽席掌聲與低語的畫外迴響。

non_diegetic_music:
一段低沉受限的大提琴線與稀疏鋼琴單音，平穩徐緩。
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_1=output/ch2_court_ref/zimage_00016_.png（重用）, duration=7, seed=310000（旁白專用）, out=ch2_b7_video`

---

## B22 — 千萬廢紙（旁白，7 秒）

> **旁白全文**：「那張印著領袖頭像的千萬廢紙，在邊境連半瓶水都換不到。林墨把它帶到了法庭上。」

```
subject_definitions:
<Subject 1> 是 <Picture 1> 裡的邊境經濟學家林墨：一名瘦削、中等身材的東亞中年男性，年近五十，
短而整齊的黑髮夾雜灰白絲、淺鬍茬、深陷疲憊的眼神、穿深炭灰西裝與皺白襯衫不打領帶。
<Subject 2> 是 <Picture 2> 裡最高法院的第三審判庭法庭空間：圓頂大廳、分裂旁聽席、高聳法官席。

summary:
[reference generation] 目標影片是法庭中段的情緒鋪墊：林墨的手在中景中伸進外套口袋、微微握住了
什麼，旁白以同一男聲道出那張千萬廢紙的來歷。人物與場景保留自 <Picture 1> 與 <Picture 2>。

retention_analysis:
<Subject 1>（出現在 [Shot 1]）: fully_preserved - 瘦削嚴肅面容、黑髮灰絲、深炭灰西裝與皺白襯衫。
<Subject 2>（出現在 [Shot 1]）: fully_preserved - 圓頂大廳、分裂旁聽席與高聳法官席。

detailed_description:
目標影片使用冷藍灰色調的法庭紀錄式風格，靜止中景、淺景深。旁白為**同一名低沉、冷靜、中年男聲**
，以台灣腔普通話逐字平讀、非角色對白、非畫面內發聲，全程無粵語。
[Shot 1] 00:00.000（旁白 7 秒）：林墨站在法庭中央，手伸入外套內袋、指尖觸到一張折疊的紙鈔，
他沒有掏出來，只是微微一頓。鏡頭：靜止中景、極淺景深。旁白：（<Narrator>）<d>[中文] 那張印著
領袖頭像的千萬廢紙，在邊境連半瓶水都換不到。林墨把它帶到了法庭上。</d>

overall_soundscape:
所有旁白以台灣腔普通話（台灣腔、無粵語、無方言）由**同一名低沉、冷靜、中年男聲**逐字平讀、
非角色對白、非畫面內發聲。畫面內無任何人物開口。其餘為法庭的龐大寂靜與布料摩擦的輕響。

non_diegetic_music:
一段低沉受限的大提琴線與稀疏鋼琴單音，平穩徐緩、微微下沉。
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_1=output/ch2_court_ref/zimage_00016_.png（重用）, duration=7, seed=310000（旁白專用）, out=ch2_b22_video`

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
<d>[中文] 真實？在聯邦面臨外部經濟封鎖的非常時期，任何偏離官方定調的『數字』，都是敵人用來瓦解
我們內部的武器！這不是科學，這是背叛。</d> 鏡頭：快速切換到陪審團方向的中景。

overall_soundscape:
所有台詞以台灣腔普通話（台灣腔、無粵語、無方言）逐字緩慢朗讀、由畫面內本人說出、非旁白。
其餘為法庭的龐大寂靜與大廳迴響。

non_diegetic_music:
一段低沉受限的大提琴線與稀疏鋼琴單音，平穩徐緩。
```

**參數**：`ref_image_0=output/ch2_prosecutor_ref/zimage_00017_.png（重用）, ref_image_1=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_2=output/ch2_court_ref/zimage_00016_.png（重用）, duration=16, seed=310005, out=ch2_b5_video`

---

## B6 — 紅衣掌聲（場景，無對白，8 秒）

```
subject_definitions:
<Subject 1> 是 <Picture 1> 裡最高法院的第三審判庭全景：圓頂大廳、挑高穹頂、分裂式旁聽席、
左側紅衣支持者與右側噤聲的年輕旁聽者、高聳法官席背靠憲法石牆。

summary:
[reference generation] 目標影片是檢察官定罪演說後萬眾寂靜中的反應鏡：旁聽席紅衣群眾鼓掌示好、
聲浪漸湧，法官敲響法槌卻未真正制止。場景完整保留自 <Picture 1>。

retention_analysis:
<Subject 1>（出現在 [Shot 1]）: fully_preserved - 圓頂大廳、分裂旁聽席、紅衣左側群眾、
噤聲右側與高聳法官席。

detailed_description:
目標影片使用冷藍灰色調的法庭紀錄式風格，中景與俯角切換、掌聲浪起。
[Shot 1] 00:00.000（場景 4 秒）：旁聽席紅衣群眾鼓掌，掌聲由散而密。鏡頭：中景、輕微推近。
[Shot 2] 00:04.000（場景 4 秒）：法官敲響法槌，喊聲被掌聲淹沒，紅衣群眾不減反增。
鏡頭：俯角全景、沉穩不動。無台詞。

overall_soundscape:
法庭的龐大寂靜被掌聲打斷：零落掌聲湧成鼓掌與叫好的浪頭，風聲般的歡呼，法槌被淹沒的悶響。

non_diegetic_music:
N/A
```

**參數**：`ref_image_0=output/ch2_court_ref/zimage_00016_.png（重用）, duration=8, seed=310006, out=ch2_b6_video`

---

## B8 — 林墨起身（場景，無對白，5 秒）

```
subject_definitions:
<Subject 1> 是 <Picture 1> 裡的邊境經濟學家林墨：一名瘦削、中等身材的東亞中年男性，年近五十，
短而整齊的黑髮夾雜灰白絲、淺鬍茬、深陷疲憊的眼神、穿深炭灰西裝與皺白襯衫不打領帶。
<Subject 2> 是 <Picture 2> 裡最高法院的第三審判庭法庭空間：圓頂大廳、分裂旁聽席、高聳法官席
背靠憲法石牆。

summary:
[reference generation] 目標影片是紅衣掌聲與法官破例容忍後的轉折：林墨在掌聲中緩緩站起，
不看檢察官、也不看旁聽席，目光落在法官席後方憲法牆。人物與場景完整保留自 <Picture 1>
與 <Picture 2>。

retention_analysis:
<Subject 1>（出現在 [Shot 1]）: fully_preserved - 瘦削嚴肅面容、黑髮灰絲、淺鬍茬、
深陷疲憊眼神，與深炭灰西裝及皺白襯衫。
<Subject 2>（出現在 [Shot 1]）: fully_preserved - 圓頂大廳、分裂旁聽席與高聳法官席。

detailed_description:
目標影片使用冷藍灰色調的法庭紀錄式風格，靜止中景、淺景深，掌聲退後。
[Shot 1] 00:00.000（場景 5 秒）林墨雙手撐桌、在辯護席上緩緩站起，動作沉穩，目光不看檢察官、
不看旁聽席，直視法官席後方憲法石牆。鏡頭：靜止中景、淺景深、極輕微上升。無台詞。

overall_soundscape:
掌聲逐漸收束成偶爾零落的拍擊與低語；林墨撐桌起身時布料摩擦、椅子退後的輕響；法庭的
龐大寂靜浮回。

non_diegetic_music:
一段低沉受限的大提琴單音，幾乎不動。
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_1=output/ch2_court_ref/zimage_00016_.png（重用）, duration=5, seed=310008, out=ch2_b8_video`

---

## B9 — 要求傳喚（對白，4 秒）

```
subject_definitions:
<Subject 1> 是 <Picture 1> 裡的邊境經濟學家林墨：一名瘦削、中等身材的東亞中年男性，年近五十，
短而整齊的黑髮夾雜灰白絲、淺鬍茬、深陷疲憊的眼神、穿深炭灰西裝與皺白襯衫不打領帶。
<Subject 2> 是 <Picture 2> 裡最高法院的第三審判庭法庭空間：圓頂大廳、分裂旁聽席、高聳法官席。

summary:
[reference generation] 目標影片是林墨起身後的第一句話：他提高聲量、語調沉穩地要求傳喚一名
關鍵證人，法庭空氣重新凍結。人物與場景完整保留自 <Picture 1> 與 <Picture 2>。

retention_analysis:
<Subject 1>（出現在 [Shot 1]）: fully_preserved - 瘦削嚴肅面容、黑髮灰絲、深炭灰西裝與皺白襯衫。
<Subject 2>（出現在 [Shot 1]）: fully_preserved - 圓頂大廳、分裂旁聽席與高聳法官席。

detailed_description:
目標影片使用冷藍灰色調的法庭紀錄式風格，靜止中景、淺景深。所有台詞以**台灣腔普通話**逐字、
緩慢、由畫面內本人說出、非旁白、無粵語。
[Shot 1] 00:00.000（對白 4 秒）林墨面向法官席，沉聲開口，<Subject 1>（S1）(S1) says,
<d>[中文] 法官閣下，辯方要求傳喚一名關鍵證人。</d> 鏡頭：靜止中景、淺景深。

overall_soundscape:
所有台詞以台灣腔普通話（台灣腔、無粵語、無方言）逐字緩慢朗讀、由畫面內本人說出、非旁白。
其餘為法庭的龐大寂靜與大廳迴響。

non_diegetic_music:
一段低沉受限的大提琴單音，幾乎不動。
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_1=output/ch2_court_ref/zimage_00016_.png（重用）, duration=4, seed=310009, out=ch2_b9_video`

---

## B10 — 法官：「誰？」（對白，1 秒）

```
subject_definitions:
<Subject 1> 是 <Picture 1> 裡最高法院的第三審判庭全景：圓頂大廳、挑高穹頂、分裂式旁聽席、
高聳法官席背靠憲法石牆，法官端坐其上。

summary:
[reference generation] 目標影片是緊湊的一擊：法官從高處簡短追問一個字，聲音不高，卻讓
整個法庭貼在沉默上。場景完整保留自 <Picture 1>。

retention_analysis:
<Subject 1>（出現在 [Shot 1]）: fully_preserved - 圓頂大廳、分裂旁聽席、高聳法官席與憲法石牆。

detailed_description:
目標影片使用冷藍灰色調的法庭紀錄式風格，靜止全景、方形鏡位。所有台詞以**台灣腔普通話**逐字、
極慢、由畫面內高處法官本人說出、非旁白、無粵語。
[Shot 1] 00:00.000（對白 1 秒）法官席上老年法官低頭看向林墨，只問一個字，<Subject 1>（S1）(S1) says,
<d>[中文] 誰？</d> 鏡頭：靜止全景、方形鏡位。

overall_soundscape:
所有台詞以台灣腔普通話（台灣腔、無粵語、無方言）逐字緩慢朗讀、由畫面內本人說出、非旁白。
單字落下後法庭的龐大寂靜與大廳迴響。

non_diegetic_music:
N/A
```

**參數**：`ref_image_0=output/ch2_court_ref/zimage_00016_.png（重用）, duration=1, seed=310010, out=ch2_b10_video`

---

## B11 — 林墨點名統計局長（對白，7 秒）

```
subject_definitions:
<Subject 1> 是 <Picture 1> 裡的邊境經濟學家林墨：一名瘦削、中等身材的東亞中年男性，年近五十，
短而整齊的黑髮夾雜灰白絲、淺鬍茬、深陷疲憊的眼神、穿深炭灰西裝與皺白襯衫不打領帶。
<Subject 2> 是 <Picture 2> 裡最高法院的第三審判庭法庭空間：圓頂大廳、分裂旁聽席、高聳法官席
背靠憲法石牆。

summary:
[reference generation] 目標影片是林墨接住法官追問、當庭點名的瞬間：他不多猶豫便點出「聯邦統計局
局長」與「原始運算公式」，聲音平穩構成法庭張力的轉折。人物與場景完整保留自 <Picture 1>
與 <Picture 2>。

retention_analysis:
<Subject 1>（出現在 [Shot 1]）: fully_preserved - 瘦削嚴肅面容、黑髮灰絲、淺鬍茬、
深陷疲憊眼神，與深炭灰西裝及皺白襯衫。
<Subject 2>（出現在 [Shot 1]）: fully_preserved - 圓頂大廳、分裂旁聽席與高聳法官席。

detailed_description:
目標影片使用冷藍灰色調的法庭紀錄式風格，靜止中景、淺景深。所有台詞以**台灣腔普通話**逐字、
緩慢、由畫面內本人說出、非旁白、無粵語。
[Shot 1] 00:00.000（對白 7 秒）林墨站在原地，望向法官席沉聲作答，<Subject 1>（S1）(S1) says,
<d>[中文] 聯邦統計局局長。以及，這份訴狀中提到的那份『官方核實數據』的原始運算公式。</d>
鏡頭：靜止中景、淺景深。

overall_soundscape:
所有台詞以台灣腔普通話（台灣腔、無粵語、無方言）逐字緩慢朗讀、由畫面內本人說出、非旁白。
其餘為法庭的龐大寂靜與大廳迴響、線索將爆的前壓感。

non_diegetic_music:
一段低沉受限的大提琴單音，幾乎不動。
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_1=output/ch2_court_ref/zimage_00016_.png（重用）, duration=7, seed=310011, out=ch2_b11_video`

---

## B12 — 法庭沉默（場景，無對白，3 秒）

```
subject_definitions:
<Subject 1> 是 <Picture 1> 裡最高法院的第三審判庭全景：圓頂大廳、挑高穹頂、分裂式旁聽席、
左側紅衣支持者與右側噤聲的年輕旁聽者、高聳法官席背靠憲法石牆。

summary:
[reference generation] 目標影片是關鍵詞落地的真空：法庭陷入沉默，檢察官臉色微變、旁聽席人人
屏住呼吸。場景完整保留自 <Picture 1>。

retention_analysis:
<Subject 1>（出現在 [Shot 1]）: fully_preserved - 圓頂大廳、分裂旁聽席、紅衣左側群眾、
噤聲右側與高聳法官席。

detailed_description:
目標影片使用冷藍灰色調的法庭紀錄式風格，靜止全景、微緩推進。
[Shot 1] 00:00.000（場景 3 秒）法庭全場沉默，檢察官在席上微微一僵、面色稍變，無人吭聲。
鏡頭：靜止全景、微緩推進。無台詞。

overall_soundscape:
法庭的龐大寂靜被推到極致，只剩空調的低嗡與零星的座椅輕響；沒有掌聲、沒有叫囂。

non_diegetic_music:
N/A
```

**參數**：`ref_image_0=output/ch2_court_ref/zimage_00016_.png（重用）, duration=3, seed=310012, out=ch2_b12_video`

---

## B13 — 檢察官反制（對白，8 秒）

```
subject_definitions:
<Subject 1> 是 <Picture 1> 裡的檢察官：中年男性、削瘦、銳利眼神、深色法袍、胸前佩聯邦檢察徽章。
<Subject 2> 是 <Picture 2> 裡最高法院的第三審判庭法庭空間：圓頂大廳、分裂旁聽席、高聳法官席。

summary:
[reference generation] 目標影片是檢察官的閃電反制：他以《安全法》擋下交出運算模型的要求，
語氣法律條文般冷硬。人物與場景完整保留自 <Picture 1> 與 <Picture 2>。

retention_analysis:
<Subject 1>（出現在 [Shot 1]）: fully_preserved - 削瘦面容、銳利眼神、深色法袍與檢察徽章。
<Subject 2>（出現在 [Shot 1]）: fully_preserved - 圓頂大廳、分裂旁聽席與高聳法官席。

detailed_description:
目標影片使用冷藍灰色調的法庭紀錄式風格，靜止中景、淺景深。所有台詞以**台灣腔普通話**逐字、
緩慢、由畫面內本人說出、非旁白、無粵語。
[Shot 1] 00:00.000（對白 8 秒）檢察官搶在林墨之前面向法官席開口，<Subject 1>（S1）(S1) says,
<d>[中文] 林委員，這涉及國家機密，官方數據的運算模型受《安全法》保護，無須對公眾公開。</d>
鏡頭：靜止中景、淺景深。

overall_soundscape:
所有台詞以台灣腔普通話（台灣腔、無粵語、無方言）逐字緩慢朗讀、由畫面內本人說出、非旁白。
其餘為法庭的龐大寂靜與大廳迴響。

non_diegetic_music:
一段低沉受限的大提琴線與稀疏鋼琴單音，平穩徐緩。
```

**參數**：`ref_image_0=output/ch2_prosecutor_ref/zimage_00017_.png（重用）, ref_image_1=output/ch2_court_ref/zimage_00016_.png（重用）, duration=8, seed=310013, out=ch2_b13_video`

---

## B14 — 數據與教條（對白，5 秒）

```
subject_definitions:
<Subject 1> 是 <Picture 1> 裡的邊境經濟學家林墨：一名瘦削、中等身材的東亞中年男性，年近五十，
短而整齊的黑髮夾雜灰白絲、淺鬍茬、深陷疲憊的眼神、穿深炭灰西裝與皺白襯衫不打領帶。
<Subject 2> 是 <Picture 2> 裡最高法院的第三審判庭法庭空間：圓頂大廳、分裂旁聽席、高聳法官席。

summary:
[reference generation] 目標影片是林墨一句話頂回法律檻：他聲音不高卻一字一字踩得很實，點破
「不能質疑的就不是數據」。人物與場景完整保留自 <Picture 1> 與 <Picture 2>。

retention_analysis:
<Subject 1>（出現在 [Shot 1]）: fully_preserved - 瘦削嚴肅面容、黑髮灰絲、深炭灰西裝與皺白襯衫。
<Subject 2>（出現在 [Shot 1]）: fully_preserved - 圓頂大廳、分裂旁聽席與高聳法官席。

detailed_description:
目標影片使用冷藍灰色調的法庭紀錄式風格，靜止中景、淺景深。所有台詞以**台灣腔普通話**逐字、
緩慢、由畫面內本人說出、非旁白、無粵語。
[Shot 1] 00:00.000（對白 5 秒）林墨不追不趕，面向法官席徐徐回話，<Subject 1>（S1）(S1) says,
<d>[中文] 如果數據不能被質疑，那它就不是數據，而是教條。</d> 鏡頭：靜止中景、淺景深。

overall_soundscape:
所有台詞以台灣腔普通話（台灣腔、無粵語、無方言）逐字緩慢朗讀、由畫面內本人說出、非旁白。
其餘為法庭的龐大寂靜與大廳迴響。

non_diegetic_music:
一段低沉受限的大提琴單音，幾乎不動。
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_1=output/ch2_court_ref/zimage_00016_.png（重用）, duration=5, seed=310014, out=ch2_b14_video`

---

## B15 — 質問通膨率（對白，23 秒）

```
subject_definitions:
<Subject 1> 是 <Picture 1> 裡的邊境經濟學家林墨：一名瘦削、中等身材的東亞中年男性，年近五十，
短而整齊的黑髮夾雜灰白絲、淺鬍茬、深陷疲憊的眼神、穿深炭灰西裝與皺白襯衫不打領帶。
<Subject 2> 是 <Picture 2> 裡最高法院的第三審判庭法庭空間：圓頂大廳、分裂旁聽席、高聳法官席
背靠憲法石牆。

summary:
[reference generation] 目標影片是林墨把矛盾拋回法庭的長句質問：他把被告少年與官方百分之二通膨率的
因果攤開，聲音依然低平。人物與場景完整保留自 <Picture 1> 與 <Picture 2>。

retention_analysis:
<Subject 1>（出現在 [Shot 1]）: fully_preserved - 瘦削嚴肅面容、黑髮灰絲、淺鬍茬、
深陷疲憊眼神，與深炭灰西裝及皺白襯衫。
<Subject 2>（出現在 [Shot 1]）: fully_preserved - 圓頂大廳、分裂旁聽席與高聳法官席。

detailed_description:
目標影片使用冷藍灰色調的法庭紀錄式風格，靜止中景、淺景深。所有台詞以**台灣腔普通話**逐字、
緩慢、由畫面內本人說出、非旁白、無粵語。
[Shot 1] 00:00.000（對白 23 秒）林墨將手指向被告席艾倫，話頭轉向法官席一字一字質問，
<Subject 1>（S1）(S1) says, <d>[中文] 今天，你們以『不實資訊』起訴這名少年，但在法律上，要證明
他的資訊為『假』，你們必須先證明官方的資訊為『真』。請告訴我，那百分之二的通膨率，是否包含了
房租、能源與進口糧食？還是你們在運算時，刻意剔除了一切會讓數字難看的變數？</d>
鏡頭：靜止中景、淺景深，末段輕推。

overall_soundscape:
所有台詞以台灣腔普通話（台灣腔、無粵語、無方言）逐字緩慢朗讀、由畫面內本人說出、非旁白。
其餘為法庭的龐大寂靜與大廳迴響。

non_diegetic_music:
一段低沉受限的大提琴線與稀疏鋼琴單音，平穩徐緩。
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_1=output/ch2_court_ref/zimage_00016_.png（重用）, duration=23, seed=310015, out=ch2_b15_video`

---

## B16 — 原地站定（場景，無對白，4 秒）

```
subject_definitions:
<Subject 1> 是 <Picture 1> 裡的邊境經濟學家林墨：一名瘦削、中等身材的東亞中年男性，年近五十，
短而整齊的黑髮夾雜灰白絲、淺鬍茬、深陷疲憊的眼神、穿深炭灰西裝與皺白襯衫不打領帶。
<Subject 2> 是 <Picture 2> 裡最高法院的第三審判庭法庭空間：圓頂大廳、分裂旁聽席、高聳法官席。

summary:
[reference generation] 目標影片是長句質問落下的停頓：林墨站在原地、胸膛起伏，全場跟著屏息。
人物與場景完整保留自 <Picture 1> 與 <Picture 2>。

retention_analysis:
<Subject 1>（出現在 [Shot 1]）: fully_preserved - 瘦削嚴肅面容、黑髮灰絲、深炭灰西裝與皺白襯衫。
<Subject 2>（出現在 [Shot 1]）: fully_preserved - 圓頂大廳、分裂旁聽席與高聳法官席。

detailed_description:
目標影片使用冷藍灰色調的法庭紀錄式風格，靜止中景、微緩推近。
[Shot 1] 00:00.000（場景 4 秒）林墨放下指向艾倫的手，在原地站定，胸膛輕輕起伏、目光平視法官席。
鏡頭：靜止中景、微緩推近。無台詞。

overall_soundscape:
法庭的龐大寂靜；林墨短促的呼吸聲、布料拉緊的輕響與零落低語。

non_diegetic_music:
一段低沉受限的大提琴單音，幾乎不動。
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_1=output/ch2_court_ref/zimage_00016_.png（重用）, duration=4, seed=310016, out=ch2_b16_video`

---

## B17 — 檢察官拍桌（對白，10 秒）

```
subject_definitions:
<Subject 1> 是 <Picture 1> 裡的檢察官：中年男性、削瘦、銳利眼神、深色法袍、胸前佩聯邦檢察徽章。
<Subject 2> 是 <Picture 2> 裡最高法院的第三審判庭法庭空間：圓頂大廳、分裂旁聽席、高聳法官席。

summary:
[reference generation] 目標影片是檢察官被戳中的爆點：他拍桌而起、指控林墨擾亂視聽，話鋒直指立場。
人物與場景完整保留自 <Picture 1> 與 <Picture 2>。

retention_analysis:
<Subject 1>（出現在 [Shot 1]）: fully_preserved - 削瘦面容、銳利眼神、深色法袍與檢察徽章。
<Subject 2>（出現在 [Shot 1]）: fully_preserved - 圓頂大廳、分裂旁聽席與高聳法官席。

detailed_description:
目標影片使用冷藍灰色調的法庭紀錄式風格，動態中景、淺景深。所有台詞以**台灣腔普通話**逐字、
緩慢、由畫面內本人說出、非旁白、無粵語。
[Shot 1] 00:00.000（對白 10 秒）檢察官手掌重擊自己面前的桌案，起身開罵，<Subject 1>（S1）(S1) says,
<d>[中文] 你這是在擾亂視聽！這是立場問題！你到底是站在聯邦這一邊，還是站在那些想看我們崩潰的人那一邊？</d>
鏡頭：動態中景、淺景深，輕微搖晃。

overall_soundscape:
所有台詞以台灣腔普通話（台灣腔、無粵語、無方言）逐字緩慢朗讀、由畫面內本人說出、非旁白。
其餘為拍桌的悶響、法庭的龐大寂靜與大廳迴響。

non_diegetic_music:
一段低沉受限的大提琴線與稀疏鋼琴單音，平穩徐緩。
```

**參數**：`ref_image_0=output/ch2_prosecutor_ref/zimage_00017_.png（重用）, ref_image_1=output/ch2_court_ref/zimage_00016_.png（重用）, duration=10, seed=310017, out=ch2_b17_video`

---

## B18 — 紅衣叫囂（場景，群聲，7 秒）

```
subject_definitions:
<Subject 1> 是 <Picture 1> 裡最高法院的第三審判庭全景：圓頂大廳、挑高穹頂、分裂式旁聽席、
左側紅衣支持者與右側噤聲的年輕旁聽者、高聳法官席背靠憲法石牆。

summary:
[reference generation] 目標影片是旁聽席群情激憤的群戲：紅衣群眾起身叫囂、往林墨方向指手指，
叫喊聲此起彼落卻不被聽清任何一句。場景完整保留自 <Picture 1>。

retention_analysis:
<Subject 1>（出現在 [Shot 1]）: fully_preserved - 圓頂大廳、分裂旁聽席、紅衣左側群眾、
噤聲右側與高聳法官席。

detailed_description:
目標影片使用冷藍灰色調的法庭紀錄式風格，俯角與中景交錯、群體律動。
[Shot 1] 00:00.000（場景 4 秒）：紅衣旁聽席群眾起身，手指林墨方向叫囂。鏡頭：俯角全景。
[Shot 2] 00:04.000（場景 3 秒）：叫聲浪潮高漲，法警上前壓抑秩序。鏡頭：中景、快速橫移。
無清晰台詞——群聲（畫外含糊喊叫，不蓋任何對白）。

overall_soundscape:
群眾的叫囂與口哨像浪潮般湧動，聽不清單獨字句的模糊喊叫、跺地板聲、法警的壓抑指令。

non_diegetic_music:
N/A
```

**參數**：`ref_image_0=output/ch2_court_ref/zimage_00016_.png（重用）, duration=7, seed=310018, out=ch2_b18_video`

---

## B19 — 別低頭（對白，3 秒）

```
subject_definitions:
<Subject 1> 是 <Picture 1> 裡的邊境經濟學家林墨：一名瘦削、中等身材的東亞中年男性，年近五十，
短而整齊的黑髮夾雜灰白絲、淺鬍茬、深陷疲憊的眼神、穿深炭灰西裝與皺白襯衫不打領帶。
<Subject 2> 是 <Picture 2> 裡被告席上的少年艾倫：19 歲、瘦弱、短髮、白色襯衫、恐懼表情。
<Subject 3> 是 <Picture 3> 裡最高法院的第三審判庭法庭空間：圓頂大廳、分裂旁聽席、高聳法官席。

summary:
[reference generation] 目標影片是喧囂中唯一的低語：林墨在叫囂裡轉過身，對被告席少年說了一句
安撫的話。人物與場景完整保留自 <Picture 1>、<Picture 2> 與 <Picture 3>。

retention_analysis:
<Subject 1>（出現在 [Shot 1]）: fully_preserved - 瘦削嚴肅面容、黑髮灰絲、深炭灰西裝與皺白襯衫。
<Subject 2>（出現在 [Shot 1]）: fully_preserved - 少年瘦弱身形、短髮、白襯衫、恐懼表情。
<Subject 3>（出現在 [Shot 1]）: fully_preserved - 圓頂大廳、分裂旁聽席與高聳法官席。

detailed_description:
目標影片使用冷藍灰色調的法庭紀錄式風格，過肩中近景、淺景深。所有台詞以**台灣腔普通話**逐字、
緩慢、由畫面內本人說出、非旁白、無粵語。
[Shot 1] 00:00.000（對白 3 秒）林墨轉過身對被告席上的少年放低聲音，<Subject 1>（S1）(S1) says,
<d>[中文] 別低頭，這不是你的審判。</d> 鏡頭：過肩中近景、淺景深。

overall_soundscape:
所有台詞以台灣腔普通話（台灣腔、無粵語、無方言）逐字緩慢朗讀、由畫面內本人說出、非旁白。
其餘為遠方叫囂退成畫外低浪、法庭的龐大寂靜。

non_diegetic_music:
一段低沉受限的大提琴單音，幾乎不動。
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_1=output/ch2_allen_ref/zimage_00015_.png（重用）, ref_image_2=output/ch2_court_ref/zimage_00016_.png（重用）, duration=3, seed=310019, out=ch2_b19_video`

---

## B20 — 望向直播攝影機（場景，無對白，3 秒）

```
subject_definitions:
<Subject 1> 是 <Picture 1> 裡最高法院的第三審判庭全景：圓頂大廳、挑高穹頂、分裂式旁聽席、
左側紅衣支持者與右側噤聲的年輕旁聽者、高聳法官席背靠憲法石牆。

summary:
[reference generation] 目標影片是觀眾與直播的連接點：林墨抬頭望向法庭頂端亮著紅點的大型直播
攝影機，鏡頭跟著他的視線拉近到鏡頭本身。場景完整保留自 <Picture 1>。

retention_analysis:
<Subject 1>（出現在 [Shot 1]）: fully_preserved - 圓頂大廳、分裂旁聽席、紅衣左側群眾、
噤聲右側與高聳法官席。

detailed_description:
目標影片使用冷藍灰色調的法庭紀錄式風格，仰角與俯角對切、紅點呼吸般亮著。
[Shot 1] 00:00.000（場景 3 秒）林墨站在法庭中央，抬頭望向高處大型直播攝影機，紅燈一明一滅。
鏡頭：仰角人物中景，視線導引後切至攝影機特寫。無台詞。

overall_soundscape:
法庭的龐大寂靜；攝影機鏡頭推近的高頻低嗡與伺服機構運作聲。

non_diegetic_music:
一段低沉受限的大提琴單音，幾乎不動。
```

**參數**：`ref_image_0=output/ch2_court_ref/zimage_00016_.png（重用）, duration=3, seed=310020, out=ch2_b20_video`

---

## B21 — 全國直播宣言（對白，26 秒）

```
subject_definitions:
<Subject 1> 是 <Picture 1> 裡的邊境經濟學家林墨：一名瘦削、中等身材的東亞中年男性，年近五十，
短而整齊的黑髮夾雜灰白絲、淺鬍茬、深陷疲憊的眼神、穿深炭灰西裝與皺白襯衫不打領帶。
<Subject 2> 是 <Picture 2> 裡最高法院的第三審判庭法庭空間：圓頂大廳、分裂旁聽席、高聳法官席
背靠憲法石牆，頂端大型直播攝影機紅燈明滅。

summary:
[reference generation] 目標影片是林墨直接面對全國直播的宣言：他無視法官敲槌，直視攝影機逐字
對觀眾演說，字句平穩、冷靜。人物與場景完整保留自 <Picture 1> 與 <Picture 2>。

retention_analysis:
<Subject 1>（出現在 [Shot 1]）: fully_preserved - 瘦削嚴肅面容、黑髮灰絲、淺鬍茬、
深陷疲憊眼神，與深炭灰西裝及皺白襯衫。
<Subject 2>（出現在 [Shot 1]）: fully_preserved - 圓頂大廳、分裂旁聽席與高聳法官席。

detailed_description:
目標影片使用冷藍灰色調的法庭紀錄式風格，靜止中景、直視鏡頭。所有台詞以**台灣腔普通話**逐字、
緩慢、由畫面內本人說出、非旁白、無粵語。
[Shot 1] 00:00.000（對白 26 秒）林墨站定、微微抬頭直視法庭頂端的直播攝影機紅燈，<Subject 1>
（S1）(S1) says, <d>[中文] 各位國民，今天政府告訴我們，懷疑數字就是背叛。但我要告訴各位，
當一個政府開始用『立場』來代替『加減法』時，你們手中的積蓄、你們對未來的計畫，都將建立在
沙灘上。如果我們容許政府提告一個說出超市價格的孩子，那麼明天，當政府說一加一等於五的時候，
你們也只能點頭。</d> 鏡頭：靜止中景、淺景深、直視鏡頭。

overall_soundscape:
所有台詞以台灣腔普通話（台灣腔、無粵語、無方言）逐字緩慢朗讀、由畫面內本人說出、非旁白。
其餘為法官遠方憤怒的槌聲、法庭騷動的低語與直播攝影機的伺服聲。

non_diegetic_music:
一段低沉受限的大提琴線與稀疏鋼琴單音，對白中穩步上行、幾乎不動。
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_1=output/ch2_court_ref/zimage_00016_.png（重用）, duration=26, seed=310021, out=ch2_b21_video`

---

## B23 — 高舉千萬廢紙（場景，無對白，6 秒）

```
subject_definitions:
<Subject 1> 是 <Picture 1> 裡的邊境經濟學家林墨：一名瘦削、中等身材的東亞中年男性，年近五十，
短而整齊的黑髮夾雜灰白絲、淺鬍茬、深陷疲憊的眼神、穿深炭灰西裝與皺白襯衫不打領帶。
<Subject 2> 是 <Picture 2> 裡最高法院的第三審判庭法庭空間：圓頂大廳、分裂旁聽席、高聳法官席。

summary:
[reference generation] 目標影片是宣言後的高潮動作：林墨從口袋掏出那張印著領袖頭像的千萬面額廢紙、
高舉過頭，紅衣群眾與法官的反應凝住。人物與場景完整保留自 <Picture 1> 與 <Picture 2>。

retention_analysis:
<Subject 1>（出現在 [Shot 1]）: fully_preserved - 瘦削嚴肅面容、黑髮灰絲、深炭灰西裝與皺白襯衫。
<Subject 2>（出現在 [Shot 1]）: fully_preserved - 圓頂大廳、分裂旁聽席與高聳法官席。

detailed_description:
目標影片使用冷藍灰色調的法庭紀錄式風格，中景、緩慢上搖。
[Shot 1] 00:00.000（場景 6 秒）林墨從外套口袋掏出那張印著領袖頭像的千萬面額廢紙、雙手高舉過頭，
紙張微微在光下滑出一道弧。鏡頭：中景上搖至紙面。無台詞。

overall_soundscape:
法庭的龐大寂靜；廢紙抽出的紙張摩擦聲、林墨的呼吸聲與衣料聲，零落壓抑的騷動。

non_diegetic_music:
一段低沉受限的大提琴單音，微微上行、凝住。
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_1=output/ch2_court_ref/zimage_00016_.png（重用）, duration=6, seed=310023, out=ch2_b23_video`

---

## B24 — 法官宣布休庭（場景，無對白，4 秒）

```
subject_definitions:
<Subject 1> 是 <Picture 1> 裡最高法院的第三審判庭全景：圓頂大廳、挑高穹頂、分裂式旁聽席、
高聳法官席背靠憲法石牆，法官端坐其上。
<Subject 2> 是 <Picture 2> 裡被告席上的少年艾倫：19 歲、瘦弱、短髮、白色襯衫、恐懼表情。

summary:
[reference generation] 目標影片是宣言瓦解後的法庭收尾：法官在一陣死寂後宣布休庭、艾倫被法警
強行帶離被告席，旁聽席起身騷動。場景與人物完整保留自 <Picture 1> 與 <Picture 2>。

retention_analysis:
<Subject 1>（出現在 [Shot 1]）: fully_preserved - 圓頂大廳、分裂旁聽席與高聳法官席。
<Subject 2>（出現在 [Shot 1]）: fully_preserved - 少年瘦弱身形、短髮、白襯衫、恐懼表情。

detailed_description:
目標影片使用冷藍灰色調的法庭紀錄式風格，寬景、中速橫移。
[Shot 1] 00:00.000（場景 4 秒）法官敲下法槌、宣布休庭，艾倫被兩名法警自被告席帶走，旁聽席
轟然騷動。鏡頭：寬景、中速橫移。無台詞。

overall_soundscape:
法庭的死寂被法槌敲響打破：休庭的騷動聲、法警拉動艾倫的衣料與腳步聲、旁聽席起身的座椅聲。

non_diegetic_music:
一段低沉受限的大提琴單音，幾乎不動。
```

**參數**：`ref_image_0=output/ch2_court_ref/zimage_00016_.png（重用）, ref_image_1=output/ch2_allen_ref/zimage_00015_.png（重用）, duration=4, seed=310024, out=ch2_b24_video`

---

## B25 — 標籤不能當飯吃（對白，15 秒）

```
subject_definitions:
<Subject 1> 是 <Picture 1> 裡的邊境經濟學家林墨：一名瘦削、中等身材的東亞中年男性，年近五十，
短而整齊的黑髮夾雜灰白絲、淺鬍茬、深陷疲憊的眼神、穿深炭灰西裝與皺白襯衫不打領帶。
<Subject 2> 是 <Picture 2> 裡最高法院的第三審判庭法庭空間：圓頂大廳、分裂旁聽席、高聳法官席。

summary:
[reference generation] 目標影片是林墨補完最後一擊的對白：在休庭的騷動中，他站在原地、平聲補上
關於標籤與廢紙的論斷。人物與場景完整保留自 <Picture 1> 與 <Picture 2>。

retention_analysis:
<Subject 1>（出現在 [Shot 1]）: fully_preserved - 瘦削嚴肅面容、黑髮灰絲、深炭灰西裝與皺白襯衫。
<Subject 2>（出現在 [Shot 1]）: fully_preserved - 圓頂大廳、分裂旁聽席與高聳法官席。

detailed_description:
目標影片使用冷藍灰色調的法庭紀錄式風格，靜止中景、淺景深。所有台詞以**台灣腔普通話**逐字、
緩慢、由畫面內本人說出、非旁白、無粵語。
[Shot 1] 00:00.000（對白 15 秒）林墨站在原地、目光掃過法官席與旁聽席，平聲開口，
<Subject 1>（S1）(S1) says, <d>[中文] 我在南方的鄰居那裡學到了一件事：標籤不能當飯吃，
口號不能折抵債務。如果這座法庭今天判處真實有罪，那麼這張廢紙，就是歐若拉聯邦明天的樣子。</d>
鏡頭：靜止中景、淺景深。

overall_soundscape:
所有台詞以台灣腔普通話（台灣腔、無粵語、無方言）逐字緩慢朗讀、由畫面內本人說出、非旁白。
其餘為休庭騷動的低浪、法警與艾倫遠去的腳步聲。

non_diegetic_music:
一段低沉受限的大提琴線與稀疏鋼琴單音，平穩徐緩。
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_1=output/ch2_court_ref/zimage_00016_.png（重用）, duration=15, seed=310025, out=ch2_b25_video`

---

## B26 — 走出法庭（場景，無對白，3 秒）

```
subject_definitions:
<Subject 1> 是 <Picture 1> 裡的邊境經濟學家林墨：一名瘦削、中等身材的東亞中年男性，年近五十，
短而整齊的黑髮夾雜灰白絲、淺鬍茬、深陷疲憊的眼神、穿深炭灰西裝與皺白襯衫不打領帶。
<Subject 2> 是 <Picture 2> 裡最高法院的第三審判庭法庭空間：圓頂大廳、分裂旁聽席、高聳法官席，
連接通往門外走廊的高低月台。

summary:
[reference generation] 目標影片是法庭收束後林墨走出門外的動線：他推開重重法警與人群，走向門口，
無數支麥克風從走廊兩側湧上。人物與場景完整保留自 <Picture 1> 與 <Picture 2>。

retention_analysis:
<Subject 1>（出現在 [Shot 1]）: fully_preserved - 瘦削嚴肅面容、黑髮灰絲、深炭灰西裝與皺白襯衫。
<Subject 2>（出現在 [Shot 1]）: fully_preserved - 圓頂大廳、分裂旁聽席與高聳法官席。

detailed_description:
目標影片使用冷藍灰色調的法庭紀錄式風格，中景、手持微晃。
[Shot 1] 00:00.000（場景 3 秒）林墨自法庭內走出、穿過法警與湧上的記者群，走廊兩側麥克風如林。
鏡頭：中景、手持微晃、跟拍走向。無台詞。

overall_soundscape:
走廊上的人群與麥克風雜訊底噪、法警維持秩序的指令、快步走動與相機快門的亂響。

non_diegetic_music:
一段低沉受限的大提琴單音，幾乎不動。
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_1=output/ch2_court_ref/zimage_00016_.png（重用）, duration=3, seed=310026, out=ch2_b26_video`

---

## B27 — 記者群問（對白，14 秒）

```
subject_definitions:
<Subject 1> 是 <Picture 1> 裡的邊境經濟學家林墨：一名瘦削、中等身材的東亞中年男性，年近五十，
短而整齊的黑髮夾雜灰白絲、淺鬍茬、深陷疲憊的眼神、穿深炭灰西裝與皺白襯衫不打領帶。
<Subject 2> 是 <Picture 2> 裡最高法院的第三審判庭法庭空間：圓頂大廳、分裂旁聽席、高聳法官席，
門外走廊湧入一群記者。

summary:
[reference generation] 目標影片是林墨走出法庭後被記者包圍質問的混亂片段：數名記者爭先提問，
林墨停下腳步、沉默片刻。人物與場景完整保留自 <Picture 1> 與 <Picture 2>。

retention_analysis:
<Subject 1>（出現在 [Shot 1]）: fully_preserved - 瘦削嚴肅面容、黑髮灰絲、深炭灰西裝與皺白襯衫。
<Subject 2>（出現在 [Shot 1]）: fully_preserved - 圓頂大廳、分裂旁聽席與走廊記者群。

detailed_description:
目標影片使用冷藍灰色調的法庭紀錄式風格，中景、手持微晃。所有台詞以**台灣腔普通話**逐字、
緩慢、由畫面內記者在壓力下提出、非旁白、無粵語。
[Shot 1] 00:00.000（對白 14 秒）林墨走出法庭大門即被麥克風包圍，一名記者搶先發問，
<Subject 3>（S3）是 <Picture 2> 走廊裡的一名記者（<Subject 3>（S3）(S3) says,
<d>[中文] 林委員，你真的要在下週推動那個法案嗎？</d>）另一名記者追問，
<Subject 4>（S4）是 <Picture 2> 走廊裡的另一名記者（<Subject 4>（S4）(S4) says,
<d>[中文] 你這是在公然挑釁司法權嗎？</d>）後排又有一人喊出，
<Subject 5>（S5）是 <Picture 2> 走廊裡的一名記者（<Subject 5>（S5）(S5) says,
<d>[中文] 有人說你收了外國政府的錢，才要破壞聯邦的團結，你怎麼回應？</d>）
林墨停下腳步、沉默看向提問的記者。鏡頭：中景、手持微晃。

overall_soundscape:
所有台詞以台灣腔普通話（台灣腔、無粵語、無方言）由畫面內記者逐字緩慢說出、非旁白。
其餘為走廊上此起彼落的提問群聲、麥克風與人群的雜訊底噪、相機快門亂響。

non_diegetic_music:
一段低沉受限的大提琴單音，幾乎不動。
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_1=output/ch2_court_ref/zimage_00016_.png（重用）, duration=14, seed=310027, out=ch2_b27_video`

---

## B28 — 我沒收錢（對白，12 秒）

```
subject_definitions:
<Subject 1> 是 <Picture 1> 裡的邊境經濟學家林墨：一名瘦削、中等身材的東亞中年男性，年近五十，
短而整齊的黑髮夾雜灰白絲、淺鬍茬、深陷疲憊的眼神、穿深炭灰西裝與皺白襯衫不打領帶。
<Subject 2> 是 <Picture 2> 裡最高法院的第三審判庭法庭空間：圓頂大廳、分裂旁聽席、高聳法官席，
門外走廊的石柱與記者群。

summary:
[reference generation] 目標影片是林墨對記者「收了多少錢」指控的回應：他停下腳步、直視提問者，
語氣平淡卻堅定。人物與場景完整保留自 <Picture 1> 與 <Picture 2>。

retention_analysis:
<Subject 1>（出現在 [Shot 1]）: fully_preserved - 瘦削嚴肅面容、黑髮灰絲、深炭灰西裝與皺白襯衫。
<Subject 2>（出現在 [Shot 1]）: fully_preserved - 圓頂大廳、分裂旁聽席與走廊石柱。

detailed_description:
目標影片使用冷藍灰色調的法庭紀錄式風格，靜止中景、淺景深。所有台詞以**台灣腔普通話**逐字、
緩慢、由畫面內本人說出、非旁白、無粵語。
[Shot 1] 00:00.000（對白 12 秒）林墨停下腳步、直視問他收錢的記者，平聲開口，
<Subject 1>（S1）(S1) says, <d>[中文] 我沒收錢，我只是不想在未來的某一天，我的孩子必須拿著
幾億張印著我頭像的廢紙，去換一塊發霉的麵包。</d> 鏡頭：靜止中景、淺景深。

overall_soundscape:
所有台詞以台灣腔普通話（台灣腔、無粵語、無方言）逐字緩慢朗讀、由畫面內本人說出、非旁白。
其餘為記者群被鎮住後收聲的雜訊低浪、偶爾相機快門聲。

non_diegetic_music:
一段低沉受限的大提琴線與稀疏鋼琴單音，平穩徐緩。
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_1=output/ch2_court_ref/zimage_00016_.png（重用）, duration=12, seed=310028, out=ch2_b28_video`

---

## B29 — 電視牆標題（場景，無對白，3 秒）

```
subject_definitions:
<Subject 1> 是 <Picture 1> 裡最高法院的第三審判庭法庭空間：圓頂大廳、分裂旁聽席、高聳法官席，
法庭外的電視牆字幕：黑底白字滾動《數據修正主義者的野心：林墨與其背後的陰謀》。

summary:
[reference generation] 目標影片是法庭外的冷收束：林墨推開人群走向座車，身後的電視牆已開始滾動
檄文一般的標題，黑字壓在冷灰底色上。場景完整保留自 <Picture 1>。

retention_analysis:
<Subject 1>（出現在 [Shot 1]）: fully_preserved - 圓頂大廳、分裂旁聽席、法庭外電視牆與黑色標題。

detailed_description:
目標影片使用冷藍灰色調的法庭紀錄式風格，上搖鏡頭、冷光。
[Shot 1] 00:00.000（場景 3 秒）林墨的背影走向座車，鏡頭上搖帶到法庭外電視牆，
黑色標題開始滾動：『數據修正主義者的野心：林墨與其背後的陰謀』。鏡頭：上搖至牆面。無台詞。

overall_soundscape:
走廊與馬路的環境底噪、車門關上的悶響，電視牆的冷光嗡嗡聲。

non_diegetic_music:
一段低沉受限的大提琴單音，微微下沉、收束。
```

**參數**：`ref_image_0=output/ch2_court_ref/zimage_00016_.png（重用）, duration=3, seed=310029, out=ch2_b29_video`

---

## 腔調錨點（B0–B29 全部以此為準）

- **`<d>` 語言標籤維持 `[中文]` 不改**；腔調不由標籤決定。
- **角色對白控制點＝ `overall_soundscape` 首句錨點**：
  `所有台詞以台灣腔普通話（台灣腔、無粵語、無方言）逐字緩慢朗讀、由畫面內本人說出、非旁白。`
- **旁白控制點＝同一組聲線描述**（見 B0/B7/B22）：`同一名低沉、冷靜、中年男聲……逐字平讀、
  非角色對白、非畫面內發聲`，並搭配**旁白專用 seed 310000**（標定後鎖定）。
  全部旁白區塊（B0、B7、B22）只可有旁白、不可有畫面內角色開口。
- 每支 r2v 獨立 seed；seed 需先查黑名單（guide §5.2），實測若歪粵腔即記入黑名單並換 seed。
- B1 無對白，故 `overall_soundscape` 不含腔調錨點（無音訊需要錨定）。

---

## 已寫出提示詞的區塊（B0–B29 全部）完成後：合併

已寫出完整六欄位提示詞的區塊依序合併為 Ch2 全文：旁白身世 → 開庭 → 直播宣言 → 車前收束（約 259 秒）：

```
merge_videos(
  files = [
    "ch2_b0_video/xxx.mp4",
    "ch2_b1_video/xxx.mp4",
    "ch2_b2_video/xxx.mp4",
    "ch2_b3_video/xxx.mp4",
    "ch2_b4_video/xxx.mp4",
    "ch2_b5_video/xxx.mp4",
    "ch2_b6_video/xxx.mp4",
    "ch2_b7_video/xxx.mp4",
    "ch2_b8_video/xxx.mp4",
    "ch2_b9_video/xxx.mp4",
    "ch2_b10_video/xxx.mp4",
    "ch2_b11_video/xxx.mp4",
    "ch2_b12_video/xxx.mp4",
    "ch2_b13_video/xxx.mp4",
    "ch2_b14_video/xxx.mp4",
    "ch2_b15_video/xxx.mp4",
    "ch2_b16_video/xxx.mp4",
    "ch2_b17_video/xxx.mp4",
    "ch2_b18_video/xxx.mp4",
    "ch2_b19_video/xxx.mp4",
    "ch2_b20_video/xxx.mp4",
    "ch2_b21_video/xxx.mp4",
    "ch2_b22_video/xxx.mp4",
    "ch2_b23_video/xxx.mp4",
    "ch2_b24_video/xxx.mp4",
    "ch2_b25_video/xxx.mp4",
    "ch2_b26_video/xxx.mp4",
    "ch2_b27_video/xxx.mp4",
    "ch2_b28_video/xxx.mp4",
    "ch2_b29_video/xxx.mp4"
  ],
  resolution = "352:608",
  out = "ch2_full"
)
```

> **B0–B29 全部區塊均已完成提示詞撰寫。** 對白皆逐字對照 `story1.md` 第二章（lines 67–113），
> 無省略、無自創。
