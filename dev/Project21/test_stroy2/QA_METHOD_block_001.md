# block_001 驗收方法說明

本文記錄 `block_001_railing_riceball` 的每一條驗收結論**是怎麼得到的**：用了哪個工具、什麼參數、判準是什麼，以及哪些地方只是粗檢、不能過度宣稱。

- 受檢檔案：`output/render/test_stroy2/block_001_railing_riceball_00001_.mp4`
- 對照資料：`test_stroy2/block_001_railing_riceball.compiled.json`（即送給 r2v 的同一份 payload）
- 參考圖：`output/refs/loc_dock/plate_00001_.png`、`output/refs/char_momo/plate_00004_.png`、`output/refs/char_shiro/plate_00001_.png`

---

## 0. 工具鏈

| 用途 | 工具 | 實際路徑／指令 |
|---|---|---|
| 解碼、抽幀、拼圖 | `ffmpeg-static` | `gen_video/node_modules/ffmpeg-static/ffmpeg.exe`（由 `video-qa/scripts/ffmpeg.mjs` 自動解析） |
| 抽幀與總表 | `video-qa/scripts/sheet.mjs` | `node .opencode\skills\video-qa\scripts\sheet.mjs <mp4> --out <dir>` |
| 時長／解析度／音量／音高 | `video-qa/scripts/probe.mjs` | `node .opencode\skills\video-qa\scripts\probe.mjs <mp4> --json` |

這台機器**沒有** `ffprobe`、`python`、`magick`，所以：

- 容器資訊不是用 `ffprobe` 讀的，是 `probe.mjs` 呼叫 `ffmpeg -i` 後，從 stderr 的 stream header 正規表達式抓 `Duration`、`WxH`、`fps`、`Audio:`。
- 所有畫面判斷都來自同一張 6 格 PNG，不是播放器截圖。

---

## 1. 「有聲」

**做法**：`probe.mjs` 先用 `ffmpeg -ac 1 -ar 16000 -f s16le -` 把音軌解成單聲道 16 kHz PCM，再轉成 Float32 取樣陣列。

**判準**：

1. header 必須出現 `Stream #…: Audio:` → 這次回傳 `audio: true`。
2. 解出的樣本數量大於 0，且 0.25 秒窗的 RMS 峰值 > 0.02 → 視為「有內容」，不是全靜音。
3. 本次 `peakRms = 0.401`，遠高於 0.02。

> 這一步只能證明「音軌裡有波形」，不代表內容是對的台詞；內容正確性要靠第 5 節的口型粗檢與人工試聽。

---

## 2. 「女聲」

**做法**：同一次解碼後，`probe.mjs` 以 40 ms 窗、20 ms hop 做**自相關**（autocorrelation）估基頻：

- 只在窗口能量 RMS ≥ 0.02 時才估（避開室內底噪）。
- 搜尋 lag 對應 70–300 Hz。
- 正規化自相關 `best / energy ≥ 0.3` 才採用，否則是氣音／雜訊。
- 取所有可信窗口的 F0 中位數與四分位距。

**結果**：

```text
f0Median = 216.2 Hz
f0Iqr    = [168.4, 250.0]
voicedFrames = 178
```

**怎麼解讀**：

- 成人女聲的說話基頻典型落在約 165–255 Hz；216 Hz 落在這個區間內。
- IQR 168–250 Hz 表示音高有起伏（正常語調），不是單一頻率的合成音。
- 這**不是**聲紋鑑定：同一個角色在不同 clip 之間仍可能換聲。要確認「全片是同一人」，得把所有 block 的 `f0Median` 放在一起比，`probe.mjs` 在 ≥3 個 clip 時會自動標出偏離全片中位數超過 `max(18 Hz, 12%)` 的 clip。

---

## 3. 「發聲區間合理、沒有整段靜音」

**做法**：對 0.25 秒窗的 RMS 序列取門檻：

```text
threshold = max(0.02, peakRms × 0.25)
```

高於門檻的第一個窗 → `speechStart`；最後一個 → `speechEnd`。

**結果**：

```text
speechStart = 0.50 s
speechEnd   = 7.50 s
```

**怎麼解讀**：

- 8 秒的 clip，聲音從 0.5 秒進、7.5 秒收，頭尾各留約 0.5 秒的環境聲，這是合理的對白鏡頭節奏。
- 中間的低谷（例如 1.75–2.50 秒、5.00–5.75 秒）是**句與句之間的停頓**，不是整段靜音；整段靜音的定義是 `speechStart === null`，這次不是。
- 台詞有三句，停頓數量與句數相符，屬正面證據。

**限制**：這是「能量」判斷，不是語音辨識。它不會告訴你唸的是不是 `鬼退治のあとで。`，只會告訴你「有人在這段時間說話」。

---

## 4. 畫面：6 格總表怎麼來的

```powershell
node .opencode\skills\video-qa\scripts\sheet.mjs `
  "output\render\test_stroy2\block_001_railing_riceball_00001_.mp4" `
  --out output\render\test_stroy2\qa
```

- 預設 `--frames 6`、`--tile 3x2`、`--width 304`。
- 取樣間隔 `gap = max(0.4, (duration − 0.2) / frames) = max(0.4, 7.8 / 6) = 1.30 秒`。
- 所以六格大約落在 **0 / 1.3 / 2.6 / 3.9 / 5.2 / 6.5 秒**。
- 抽幀刻意避開第一幀與最後一幀（首幀常是 fade、末幀常是重複定格）。

輸出：`output/render/test_stroy2/qa/block_001_railing_riceball_00001_.png`

---

## 5. 逐條畫面結論的依據

### 5.1 單一鏡頭：六格沒有跳接、變焦或溶接

**做法**：把 6 格當成時間序列，逐格比對四件事：

1. 主體身份（臉、髮型、髮色）是否同一人；
2. 機位與焦段（人物在畫面中的大小與位置）是否穩定；
3. 背景元素（木欄、海面、船桅、屋簷）是否連續；
4. 光線方向與色溫是否一致。

**結果**：六格的桃都是同一張臉、同一件浴衣、同一側光；木欄與海平線位置固定；沒有出現「前 3 格近景、後 3 格全景」的跳接。

**限制**：6 格只能涵蓋約 1.3 秒一次的取樣。長度 <1.3 秒的溶接或閃切理論上可能落在兩格之間。要完全排除，得抽 12–24 格或逐幀掃。

### 5.2 構圖正確：木欄邊近景，シロ 的鼻尖佔左前景，桃在右側吃飯糰

**對照來源**：payload 的 `action.description`：

> Handheld close-up at the weathered dock railing: Momo sits with a rice ball at her lips, the Shiba's snout filling the left foreground in soft focus…

**做法**：把六格與這段文字逐項對照「有沒有這個元素、在哪個位置」。

**結果**：

- 木欄／木棧道在畫面右後方與下緣 → 有。
- 桃在畫面右半，手拿飯糰、嘴邊有食物 → 有。
- 柴犬鼻尖與頭部佔左半前景，比例約三分之一 → 有。

**限制**：這是「元素與位置」的核對，不是構圖美學評分；也沒有量測實際焦距。

### 5.3 造型：米白底紅花浴衣、馬尾紅緞帶、赤腳；狗無鞍具

**對照來源**：

- `present_characters[char_momo].outfit` = `Loose cream yukata with red floral patterns, red ribbon in her ponytail, bare feet`
- `present_characters[char_shiro].outfit` = `No saddle, natural tan and cream coat`
- 角色參考圖 `char_momo/plate_00004_.png`、`char_shiro/plate_00001_.png`

**做法**：在六格中找這四個特徵：底色、花紋、緞帶、鞍具。

**結果**：

- 浴衣底色米白、有紅色花紋 → 有。
- 馬尾與紅緞帶 → 有（緞帶在右後方，隨動作擺動）。
- 赤腳 → 取樣角度只看到上半身與桌面，**看不到腳**，此項屬「無法確認」，不是「已確認」。
- 狗身上沒有鞍具或背帶 → 有（左前景只見頭頸）。

> 準確的說法應該是：三項確認、一項視角受限。上一則訊息把它們併成一句，這裡修正。

### 5.4 嘴巴與日文台詞同步

**實際做法（粗檢）**：

1. 從 `probe.mjs` 拿到發聲區間 0.5–7.5 秒。
2. 對照六格的取樣時間（0 / 1.3 / 2.6 / 3.9 / 5.2 / 6.5 秒）。
3. 檢查落在發聲區間內的格子，嘴部是否張開或有咀嚼動作；落在 0–0.5 秒與 7.5–8 秒的格子，嘴是否閉合。

**結果**：發聲區間內的格子都可見張嘴／咀嚼；頭尾兩格沒有出現「大聲說話但嘴閉死」的矛盾。

**限制（重要）**：六格、1.3 秒間隔**不足以證明脣形同步到音素等級**。真正的對嘴檢查需要：

- 逐幀（24 fps）或至少 6–8 fps 抽幀，對齊音檔波形；
- 或直接把音軌聽一遍，確認三句台詞的順序與結尾。

這次沒有做上述兩件事，所以正確的結論是「**沒有明顯的對嘴矛盾**」，而不是「已驗證同步」。

### 5.5 無字幕、無浮水印、無多餘人物

**做法**：

1. 六格全圖掃描，特別是畫面下三分之一（字幕常見位置）與四角（浮水印常見位置）。
2. 數人頭：画面中應只有桃一人 + 一隻狗。
3. 檢查是否有第二張臉、半透明殘影、重複的手。

**結果**：六格皆無文字、無 logo、無第三方人物；沒有殘影或重複肢體。

**限制**：只在 6 個時間點看過。若字幕只出現 0.5 秒且剛好落在取樣之間，這份檢查會漏掉。payload 內有要求「無字幕」的敘述，但模型不保證遵守，仍建議完片前做一次全片抽樣。

### 5.6 兩個小瑕疵的判定依據

| 瑕疵 | 依據 |
|---|---|
| 狗臉是清楚的，不是柔焦 | payload 寫 `the Shiba's snout filling the left foreground **in soft focus**`；六格裡狗的眼、鼻、毛髮邊緣都銳利，景深沒有落在牠身上 |
| 光線偏午後明亮，不像黃昏暖光 | payload 寫 `warm dusk light`；六格的海面與木欄是高對比日光、陰影短，色溫偏中性，沒有黃昏的低角度長影 |

兩項都屬於「與計畫文字不符，但不影響敘事」的等級，所以判定 `keep` 而非 `retake`。

---

## 6. 這次**沒有**做的事

為避免把粗檢說成驗證，明確列出缺口：

1. **沒有試聽**音軌（只量了能量與基頻）。台詞是否真的照三句唸完、有沒有插入雜音，未確認。
2. **沒有逐幀**檢查跳接與對嘴；6 格間隔 1.3 秒。
3. **沒有跨 clip 比對**聲線與場景連續性（目前只有這一個 block）。
4. **沒有量測**焦距、景深、色溫；「柔焦」與「黃昏」是目視判斷。
5. **沒有確認赤腳**（取樣角度看不到）。

要補的話，建議順序：先聽一次音軌 → 對有疑慮的 clip 抽 12 格 → 全片完成後再跑一次 `probe.mjs` 的多 clip 音高比較。

---

## 7. 重現指令

```powershell
cd D:\han\Niba\dev\Project21

# 1. 技術數據（時長、解析度、fps、音量包絡、F0）
node .opencode\skills\video-qa\scripts\probe.mjs `
  "output\render\test_stroy2\block_001_railing_riceball_00001_.mp4" --json

# 2. 6 格總表
node .opencode\skills\video-qa\scripts\sheet.mjs `
  "output\render\test_stroy2\block_001_railing_riceball_00001_.mp4" `
  --out output\render\test_stroy2\qa

# 3. 更密的抽樣（需要時）
node .opencode\skills\video-qa\scripts\sheet.mjs `
  "output\render\test_stroy2\block_001_railing_riceball_00001_.mp4" `
  --frames 12 --tile 4x3 --width 320 --out output\render\test_stroy2\qa
```

---

## 8. 結論摘要

| 檢查項 | 方法 | 證據強度 | 結論 |
|---|---|---|---|
| 有聲 | 音軌解碼 + RMS 峰值 | 強（數值） | 通過 |
| 女聲 | 自相關 F0 中位數 216 Hz | 中（非聲紋） | 通過 |
| 發聲區間 | RMS 門檻 0.5–7.5 s | 強（數值） | 通過 |
| 單一鏡頭 | 6 格目視比對 | 中（取樣間隔 1.3 s） | 通過 |
| 構圖 | 6 格 vs. action 描述 | 中 | 通過 |
| 造型 | 6 格 vs. outfit 欄位 | 中（赤腳無法確認） | 大致通過 |
| 對嘴 | 六格 vs. 發聲區間 | 弱（粗檢） | 無明顯矛盾 |
| 字幕／浮水印／閒人 | 6 格目視 | 中 | 通過 |
| 柔焦 | 目視景深 | 弱 | 不符計畫 |
| 黃昏光 | 目視色溫與陰影 | 弱 | 不符計畫 |

判定：`keep`（可用），瑕疵列為下一 take 的改進項。
