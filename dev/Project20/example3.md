# Ch2 區塊獨立提示詞 — B1–B5（實作範例 3：每區塊一支 r2v，參考圖統一管理）

> 本範例承接 example2.md 的「總表：區塊分割與計秒」，將每個區塊視為**一支獨立的 r2v**，
> 並建立統一的參考圖管理表——角色/場景肖像一次性生成後，各區塊按表引用。
> 本文件先完成 B1–B5（共 35 秒）。

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

> 以下角色/場景肖像於 Ch2 開拍前統一生成，存入 `ch2_refs/` 目錄。
> 每支 r2v 透過 `ref_image_0 / ref_image_1 / ref_image_2` 按表取用。

| 編號 | 檔名 | 內容 | 尺寸建議 | 用途 |
|------|------|------|----------|------|
| Ref-C1 | `ch2_refs/char_linmo.png` | 林墨肖像：瘦削中年男性、黑髮灰絲、淺鬍茬、深炭灰西裝、皺白襯衫 | 608×1024 (2:3) | 所有含林墨的區塊 |
| Ref-C2 | `ch2_refs/char_prosecutor.png` | 檢察官肖像：中年男性、削瘦、銳利眼神、深色法袍、胸針 | 608×1024 | B3、B5 |
| Ref-C3 | `ch2_refs/char_allen.png` | 艾倫肖像：19 歲少年、瘦弱、短髮、白色襯衫、恐懼表情 | 608×1024 | B4 |
| Ref-C4 | `ch2_refs/char_judge.png` | 法官肖像：老年男性、銀髮、法袍、嚴肅 | 608×1024 | 後續 beat 如需特寫 |
| Ref-S1 | `ch2_refs/scene_courtroom.png` | 最高法院第三審判庭全景：圓頂大廳、分裂旁聽席、紅衣左/噤聲右、憲法石牆 | 608×1024 | B1、B6 等全景區塊 |
| Ref-S2 | `ch2_refs/scene_court_defense.png` | 辯護席區域：木質桌椅、近法官席 | 608×1024 | B2、B7 等辯護席區塊 |
| Ref-S3 | `ch2_refs/scene_court_camerawall.png` | 法庭頂端直播攝影機與天花板結構 | 608×1024 | B19 |
| Ref-S4 | `ch2_refs/scene_court_exit.png` | 法庭門外走廊：石柱、記者群 | 608×1024 | B24、B25、B26 |
| Ref-S5 | `ch2_refs/scene_tvwall.png` | 法庭外電視牆：黑色標題滾動 | 608×1024 | B27 |

> **建置方式**：每張以 `gen_sdxl_image` 生成，prompt 中明確指定角色外觀錨點（與 guide §5.3 一致）。
> 所有圖尺寸統一 608×1024（2:3 比例），確保 r2v 輸出不裁切。

---

## 區塊 × 參考圖對照表

| 區塊 | ref_image_0 | ref_image_1 | ref_image_2 | duration |
|------|-------------|-------------|-------------|----------|
| B1 | — (無角色) | — | Ref-S1 法庭全景 | 4 |
| B2 | Ref-C1 林墨 | — | Ref-S2 辯護席 | 5 |
| B3 | Ref-C2 檢察官 | Ref-C3 艾倫 | Ref-S1 法庭全景 | 15 |
| B4 | Ref-C3 艾倫 | — | Ref-S1 法庭全景 | 7 |
| B5 | Ref-C2 檢察官 | Ref-C1 林墨 | Ref-S1 法庭全景 | 16 |

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

**參數**：`ref_image_0=ch2_refs/scene_courtroom.png, duration=4, seed=310001, out=ch2_b1_video`

---

## B2 — 林墨望向被告席（場景，無對白，5 秒）

```
subject_definitions:
<Subject 1> 是 <Picture 1> 裡的邊境經濟學家林墨：一名瘦削、中等身材的東亞中年男性，年近五十，
短而整齊的黑髮夾雜灰白絲、淺鬍茬、深陷疲憊的眼神、穿深炭灰西裝與皺白襯衫不打領帶。
<Subject 2> 是 <Picture 2> 裡的辯護席區域：木質桌椅、近法官席的位置。

summary:
[reference generation] 目標影片是法庭辯護席上的中景：林墨安靜坐在桌後，視線越過群眾望向
被告席少年艾倫，神情複雜。人物與場景完整保留自 <Picture 1> 與 <Picture 2>。

retention_analysis:
<Subject 1>（出現在 [Shot 1]）: fully_preserved - 他的瘦削嚴肅面容、黑髮灰絲、淺鬍茬、
深陷疲憊眼神，與深炭灰西裝及皺白襯衫。
<Subject 2>（出現在 [Shot 1]）: fully_preserved - 木質辯護席與近法官席的位置。

detailed_description:
目標影片使用冷藍灰色調的法庭紀錄式風格，靜止中景、淺景深。
[Shot 1] 00:00.000（場景 5 秒）林墨坐在辯護席後方，視線越過群眾望向被告席少年。鏡頭：靜止中景、
淺景深。無台詞。

overall_soundscape:
法庭的龐大寂靜、林墨的輕微呼吸聲、遠處旁聽席的低語迴響。

non_diegetic_music:
一段低沉受限的大提琴單音，幾乎不動。
```

**參數**：`ref_image_0=ch2_refs/char_linmo.png, ref_image_1=ch2_refs/scene_court_defense.png, duration=5, seed=310002, out=ch2_b2_video`

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

**參數**：`ref_image_0=ch2_refs/char_prosecutor.png, ref_image_1=ch2_refs/char_allen.png, ref_image_2=ch2_refs/scene_courtroom.png, duration=15, seed=310003, out=ch2_b3_video`

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

**參數**：`ref_image_0=ch2_refs/char_allen.png, duration=7, seed=310004, out=ch2_b4_video`

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

**參數**：`ref_image_0=ch2_refs/char_prosecutor.png, ref_image_1=ch2_refs/char_linmo.png, ref_image_2=ch2_refs/scene_courtroom.png, duration=16, seed=310005, out=ch2_b5_video`

---

## 腔調錨點（B1–B5 全部以此為準）

- **`<d>` 語言標籤維持 `[中文]` 不改**；腔調不由標籤決定。
- **真正的腔調控制點＝ `overall_soundscape` 首句錨點**：
  `所有台詞以台灣腔普通話（台灣腔、無粵語、無方言）逐字緩慢朗讀、由畫面內本人說出、非旁白。`
- 每支 r2v 獨立 seed；seed 需先查黑名單（guide §5.2），實測若歪粵腔即記入黑名單並換 seed。
- B1 無對白，故 `overall_soundscape` 不含腔調錨點（無音訊需要錨定）。

---

## B1–B5 完成後：合併

B1–B5 依序合併為 Ch2 前 35 秒：

```
merge_videos(
  files = [
    "ch2_b1_video/xxx.mp4",
    "ch2_b2_video/xxx.mp4",
    "ch2_b3_video/xxx.mp4",
    "ch2_b4_video/xxx.mp4",
    "ch2_b5_video/xxx.mp4"
  ],
  resolution = "1408:2432",
  out = "ch2_part1"
)
```

> 合併前先以 `upscale_video` 逐支放大至 1408×2432（RealESRGAN x4），再合併。
