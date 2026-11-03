# block_001_railing_push_lens 驗收方法說明

本文記錄 `block_001_railing_push_lens` 每一條驗收結論**是怎麼得到的**：用了哪個工具、什麼參數、判準是什麼，以及哪些地方只是粗檢、不能過度宣稱。

- 受檢檔案：`output/render/test_stroy2/block_001_railing_push_lens_00001_.mp4`
- 送出的提示詞：`test_stroy2/block_001_railing_push_lens.compiled.json`（4,787 字元的 JSON payload，與送進 ComfyUI 的完全同一份）
- 參考圖：`output/refs/loc_dock/plate_00001_.png`、`output/refs/char_momo/plate_00004_.png`、`output/refs/char_shiro/plate_00001_.png`
- 對照的前一個鏡頭：`output/render/test_stroy2/block_001_railing_riceball_00001_.mp4`

> 這份文件比 `QA_METHOD_block_001.md` 多兩個項目：**多密度抽幀**（0.4 s／0.1 s 兩層）與**接戲連續性比對**（跨 clip）。原因是這個 block 只有 4 秒且動作是推鏡，單一 6 格總表不足以判斷「是推近還是跳接」。

---

## 0. 工具鏈

| 用途 | 工具 | 實際路徑／指令 |
|---|---|---|
| 解碼、抽幀、拼圖 | `ffmpeg-static` | `gen_video/node_modules/ffmpeg-static/ffmpeg.exe`（由 `video-qa/scripts/ffmpeg.mjs` 解析） |
| 時長／解析度／音量／音高 | `video-qa/scripts/probe.mjs` | `node .opencode\skills\video-qa\scripts\probe.mjs <mp4> --json` |
| 均勻總表 | `video-qa/scripts/sheet.mjs` | `node .opencode\skills\video-qa\scripts\sheet.mjs <mp4> --frames N --tile CxR --out <dir>` |
| 指定時間窗密集抽幀 | 直接呼叫 ffmpeg | `-ss <起點> -t <長度> -vf "fps=10,scale=W:-2,tile=CxR:padding=2:margin=2" -frames:v 1` |

這台機器**沒有** `ffprobe`、`python`、`magick`：

- 容器資訊來自 `ffmpeg -i` 的 stderr header，由 `probe.mjs` 用正規表達式抓 `Duration`、`WxH`、`fps`、`Audio:`。
- 所有畫面判斷都來自抽幀拼出的 PNG，不是播放器截圖，也不是逐幀人工掃描。

---

## 1. 先確認「驗的是什麼」

驗收必須綁定送出的提示詞，否則「畫面不對」無法區分是模型失誤還是提示詞沒寫。因此第一步是核對提交紀錄：

| 項目 | 值 | 來源 |
|---|---|---|
| 工作流 | `video_minimax_h3_r2v.json` | `minimax_r2v` 回傳 |
| prompt | 完整 `compile_block` payload | `block_001_railing_push_lens.compiled.json` |
| 解析度 | 608×352 | 提交參數 |
| 幀數 | 107 frames（4.46 s @ 24 fps） | 提交參數 |
| turbo | `true`（4-step ref2v LoRA） | 提交參數 |
| seed | 20261104 | 提交參數 |
| 參考圖順序 | `ref_image_0` = 場景、`1` = 桃、`2` = 柴犬 | 上傳後檔名 `mcp_*_plate_*.png` |

**4 秒為什麼變成 4.46 秒**：MiniMax H3 只接受 `17k + 5` 的幀數。

```text
quantiseFrames(4, 24):
  target = 96
  5 + 17 × floor((96 − 5) / 17) = 5 + 17 × 5 = 90   → 90 < 96，往上跳一格
  90 + 17 = 107 frames → 107 / 24 = 4.458 s
```

這是編譯器既定行為（`render_plan.mjs` 的同一支函式），不是生成異常。

---

## 2. 音訊三項

### 2.1 有聲

**做法**：`probe.mjs` 用 `ffmpeg -ac 1 -ar 16000 -f s16le -` 把音軌解成單聲道 16 kHz PCM，再轉 Float32 取樣陣列。

**判準**：

1. header 出現 `Stream #…: Audio:` → `audio: true`。
2. 樣本數 > 0，且 0.25 秒窗 RMS 峰值 > 0.02。

**結果**：`peakRms = 0.242`，遠高於 0.02 → 有內容，不是全靜音。

> 這只證明「音軌裡有波形」。內容是不是那兩句台詞，見第 5.4 節（而那一節也只是粗檢）。

### 2.2 發聲區間

**做法**：對 0.25 秒窗的 RMS 序列取門檻：

```text
threshold = max(0.02, peakRms × 0.25) = max(0.02, 0.0605) = 0.0605
```

高於門檻的第一個窗 → `speechStart`；最後一個 → `speechEnd`。

**結果**：

```text
speechStart = 2.00 s
speechEnd   = 4.00 s
```

完整包絡（每 0.25 秒）：

```text
0.00:0.015  0.25:0.044  0.50:0.053  0.75:0.060  1.00:0.002  1.25:0.002
1.50:0.003  1.75:0.002  2.00:0.242  2.25:0.168  2.50:0.239  2.75:0.084
3.00:0.004  3.25:0.197  3.50:0.158  3.75:0.214  4.00:0.185
```

**怎麼讀**：

- 2.00–2.75 s 是第一句、3.25–4.00 s 是第二句，中間 3.00 s 的低谷是**句間停頓**。兩句台詞、兩段能量，數量相符。
- 頭 1.75 秒只有 0.015–0.060 的低能量：環境聲加上笑聲，**但 0.75 s 的 0.060 剛好差一點沒過門檻 0.0605**，所以 `speechStart` 被報成 2.00 s。也就是說「笑聲有沒有被算成語音」取決於門檻的最後一位小數——這是能量門檻的固有粗糙度，不是判斷錯誤，但也不該拿 `speechStart` 當「她從第 2 秒才開口」的硬證據。

### 2.3 「女聲」與跨 clip 聲線

**做法**：40 ms 窗、20 ms hop 做自相關估基頻（F0）：

- 只在窗能量 RMS ≥ 0.02 時估（避開底噪）。
- 搜尋 lag 對應 70–300 Hz。
- 正規化自相關 `best / energy ≥ 0.3` 才採用。
- 取中位數與四分位距。

**本次結果**：

```text
f0Median = 238.8 Hz
f0Iqr    = [177.8, 271.2]
voiced   = 101 frames
```

**與上一個 block 比較**（這是這次新增的檢查）：

| clip | f0Median |
|---|---|
| `block_001_railing_riceball` | 216.2 Hz |
| `block_001_railing_push_lens` | 238.8 Hz |
| 差異 | +10.45 % |

`probe.mjs` 的跨 clip 警示線是 `max(18 Hz, 12 %)`；以 216.2 Hz 為基準約等於 **25.9 Hz / 12 %**。10.45 % 未觸線，所以不標記。

**但要注意**：同一個角色、同一個場景、相差 22.6 Hz，已經接近可聽聞的差別。基頻會隨語氣改變（這個 block 是笑著說話，本來就會偏高），所以不能據此判定「換人」，但也不能宣稱「聲線一致」。正確說法是：**在容忍範圍內，未觸發警示**。

---

## 3. 抽幀策略：為什麼要三種密度

4.46 秒的推鏡，6 格（每 0.71 秒）只能看到「遠 → 近」，看不到「中間有沒有切」。所以這次分三層：

| 圖 | 指令重點 | 取樣 | 用途 |
|---|---|---|---|
| `qa/block_001_railing_push_lens_00001_.png` | `sheet.mjs` 預設 6 格、`3x2`、寬 304 | 每 0.71 s（0 / 0.71 / 1.42 / 2.13 / 2.84 / 3.55） | 全片概觀：鏡別、造型、有無字幕 |
| `qa/push_lens_12/…png` | `--frames 12 --tile 4x3 --width 320` | 每 0.40 s | 動作節奏：躲 → 起身 → 指鏡頭 |
| `qa/push_lens_zoom_090_230.png` | `-ss 0.9 -t 1.4 -vf "fps=10"`、`5x3` | 每 0.10 s（0.9–2.2） | **只驗推鏡是否連續**，這是本次關鍵 |
| `qa/push_lens_tail.png` | `-ss 3.8 -t 0.7 -vf "fps=10"`、`4x2` | 每 0.10 s（3.8–4.5） | 收尾是否有凍結、字幕、變形 |

6 格的間隔算式：

```text
gap = max(0.4, (4.46 − 0.2) / 6) = 0.71 s
```

`sheet.mjs` 刻意從第 0.4 秒附近起算、避開首末幀（首幀常是 fade、末幀常是重複定格）。

**為何 0.1 秒窗口選 0.9–2.3**：0.4 秒總表顯示 1.2 s 與 1.6 s 兩格落差最大（她從彎腰變成正面），最可疑的切點就在那裡；0.1 秒取樣把這段拆成 14 格。

---

## 4. 推鏡連續性（這次的核心爭點）

**問題**：`action` 寫的是 `The camera nudges closer`。如果模型把它做成「兩個鏡頭硬切」，剪起來會像跳接，但 6 格總表看起來仍然「合理」。

**做法**：在 0.9–2.2 秒逐 0.1 秒取樣，逐格比對四件事：

1. 主體在畫面中的**高度比例**是否單調增加（推鏡的特徵）；
2. 背景元素（左側木樁、右側酒桶、船屋窗格）是否隨之等比例放大、且相對位置不變；
3. 有無**透視跳變**（同一物件突然變大很多、或角度改變）；
4. 主體動作是否連續（有沒有姿勢瞬間跳位）。

**結果**：

- 0.9–1.3 s：桃彎腰低於畫面中線，木樁貼在畫面左緣、酒桶在右三分線。
- 1.4–1.7 s：她直起身，同時畫面整體放大，酒桶與窗格的相對位置保持不變 — 是**同時推鏡＋主體起身**，不是換機位。
- 1.8–2.2 s：進入中近景後穩定，背景比例不再突變。

12 格總表（每 0.4 s）也顯示 1.2 s → 1.6 s 之間存在**動態模糊過渡格**，這是連續運動的特徵；硬切通常會看到一格完全清晰的新機位。

**限制**：0.1 秒取樣只能排除 **≥ 0.1 秒**的切點。單幀（1/24 秒）的閃切理論上可能落在兩格之間。真正的完全排除需要逐幀差異分析（例如 `ffmpeg` 的 `signalstats` 或 `tblend=difference`），本次沒做。

---

## 5. 逐條畫面結論

### 5.1 動作三要素是否到位

**對照來源**：payload 的 `action.description`：

> The camera nudges closer; Momo ducks her head away from the lens, laughing, then turns back and points at the camera; the red ribbon swings and the dog's nose bumps the glass.

**做法**：在 12 格總表上，把句子拆成四個可觀測事件，逐一找對應格：

| 事件 | 出現位置（約） | 證據 |
|---|---|---|
| 躲開鏡頭 | 0.0–1.3 s | 前 4 格她低頭、側身，臉部被頭髮遮住 |
| 笑 | 1.3–2.0 s | 起身時嘴張開、眼睛彎起 |
| 回身指鏡頭 | 2.0–4.4 s | 第 6 格起出現食指指向鏡頭，持續到結尾 |
| 狗鼻貼近鏡頭 | 2.8–4.4 s | 後段狗頭由中景放大到佔右半，最後一格鼻頭幾乎貼齊畫面 |

紅緞帶在 1.3–2.0 s 有明顯甩動（與她直身的動作同步）。

**限制**：這是「元素存在性」核對，不是動作品質評分；也沒有量測她與鏡頭的實際距離。

### 5.2 造型

**對照來源**：

- `present_characters[char_momo].outfit` = `Loose cream yukata with red floral patterns, red ribbon in her ponytail, bare feet`
- `present_characters[char_shiro].outfit` = `No saddle, natural tan and cream coat`
- 角色參考圖 `char_momo/plate_00004_.png`、`char_shiro/plate_00001_.png`

**結果**：

- 米白底紅花浴衣 → 有（六格皆有）。
- 馬尾紅緞帶 → 有（1.3 s 甩動最清楚）。
- 赤腳 → **無法確認**：全片最高只到腰部以下一點，0.9–1.3 s 雖有下半身，但腳被木棧板邊緣與姿勢遮住。
- 狗無鞍具、毛色 tan/cream → 有。

所以正確結論是「三項確認、一項視角受限」，不是「造型全部正確」。

### 5.3 對嘴

**實際做法（粗檢）**：

1. 從 `probe.mjs` 取發聲區間 2.00–4.00 s。
2. 對照 12 格的取樣時刻，檢查 2.0 s 之後的格子嘴部是否張開、2.0 s 之前是否閉合。
3. 用 0.1 秒尾段圖確認最後 0.5 秒嘴是否收合。

**結果**：2.0 s 之後的 5 格皆為張嘴或正在說話的表情；4.2 s 之後嘴閉合；沒有出現「有聲音但嘴死閉」或「嘴大動但靜音」的矛盾。

**限制（重要）**：這**不是**對嘴驗證。0.4／0.1 秒取樣無法對到音素，也沒有聽音軌。能說的最多是「**沒有明顯的對嘴矛盾**」。真要驗，得把音軌放大到波形層級對齊，或至少以 24 fps 逐幀搭配聆聽。

### 5.4 無字幕、無浮水印、無多餘人物

**做法**：

1. 三組圖全掃，重點看下三分之一（字幕）與四角（浮水印）。
2. 數人頭：應為桃 1 人 + 柴犬 1 隻。
3. 找重複肢體、半透明殘影、第二張臉。

**結果**：全部乾淨。尾段 0.1 秒圖（3.8–4.5 s）也沒有出現常見的「最後 0.3 秒浮水印」。

**限制**：只在取樣時刻看過。若字幕只出現 <0.1 秒且落在取樣之間，會漏掉。

### 5.5 接戲連續性（新增項目）

這是上一個 block 沒做、但這次必須做的檢查，因為兩個 block 屬於同一個 `seg_001`、同一個鏡頭。

**做法**：

1. 讀 `test_stroy2/build/beats_a.mjs`，確認兩個 beat 的意圖是「同一顆鏡頭持續推近」（`railing_riceball` → `railing_push_lens`，後者 `refs: [["seg_001","railing_riceball"]]`）。
2. 抽上一個 clip 的 6 格總表（取樣到 6.5 s，**不是**逐幀的末幀）與本 clip 的首格並排比對：人物**姿態**、**畫面高度**、**背景物件**。
3. 檢查 payload 的 `action` 是否真的寫了「維持前一鏡頭的機位」。

**結果**：

| 項目 | `railing_riceball`（前） | `railing_push_lens`（本） | 一致？ |
|---|---|---|---|
| 姿態 | **坐在木欄邊** | **站在木桶旁彎腰** | 否 |
| 背景 | 海面＋木欄佔滿畫面 | 海面＋酒桶＋船屋側牆 | 否（多了酒桶） |
| 機位高度 | 與坐姿同高 | 站立視高 | 否 |

**根因**：本 block 的 `action` 只寫 `The camera nudges closer`，**沒有寫「她仍坐在欄邊」**，而 r2v 的 3 個參考圖名額已被「場景＋兩個角色」佔滿，無法再放前一顆鏡頭的畫面當連續性參考。模型於是自由選了一個新站位。

**限制**：這是「與前一個 clip 比對」的判斷，只能指出不一致，不能保證換 seed 就會一致；`referenced_blocks` 欄位目前只是紀錄，並未進入生成流程。

### 5.6 光線

**對照來源**：payload 的 `action.description` 含 `warm dusk light`（沿用 `seg_001` 的設定）。

**做法**：目視六格的陰影長度、方向與色溫傾向。

**結果**：陰影短、對比高、天空為明亮青藍，屬**午後日光**，不是黃昏的低角度暖光。

**限制**：這是目視判斷，**沒有量測色溫**。若要客觀化，可對抽出的幀跑 `ffmpeg` 的 `signalstats` 取 `YAVG`／`UAVG`／`VAVG`，或計算平均 RGB 比值；本次沒做。

---

## 6. 這次**沒有**做的事

1. **沒有試聽**音軌。兩句台詞是否真的照 `まだ撮るの。` / `また、どこかへ。` 唸完、有沒有插入雜音，未確認。
2. **沒有逐幀**（24 fps）檢查切點與對嘴；最密只到 0.1 秒。
3. **沒有做逐幀差異分析**（`tblend=difference` / `signalstats`），所以「無切點」只到 0.1 秒解析度。
4. **沒有量測色溫與照度**，「午後 vs 黃昏」是目視。
5. **沒有確認赤腳**（視角受限）。
6. **沒有把前一顆鏡頭當參考圖**（r2v 名額上限 3，已滿），因此連續性只能事後比對，不能事前約束。
7. **沒有取前一顆鏡頭的真正末幀**做比對，用的是它的 6 格總表（最後一格約 6.5 s）；若上一顆在 6.5–8 s 之間有位移，這份比對會漏看。

---

## 7. 重現指令

```powershell
cd D:\han\Niba\dev\Project21

# 1. 技術數據（時長、解析度、fps、音量包絡、F0）
node .opencode\skills\video-qa\scripts\probe.mjs `
  "output\render\test_stroy2\block_001_railing_push_lens_00001_.mp4" --json

# 2. 6 格總表
node .opencode\skills\video-qa\scripts\sheet.mjs `
  "output\render\test_stroy2\block_001_railing_push_lens_00001_.mp4" `
  --out output\render\test_stroy2\qa

# 3. 12 格動作節奏
node .opencode\skills\video-qa\scripts\sheet.mjs `
  "output\render\test_stroy2\block_001_railing_push_lens_00001_.mp4" `
  --frames 12 --tile 4x3 --width 320 `
  --out output\render\test_stroy2\qa\push_lens_12

# 4. 推鏡密集檢查（0.9–2.3 s，每 0.1 s）
$ff = node .opencode\skills\video-qa\scripts\ffmpeg.mjs
& $ff -hide_banner -loglevel error -y -ss 0.9 -t 1.4 `
  -i "output\render\test_stroy2\block_001_railing_push_lens_00001_.mp4" `
  -vf "fps=10,scale=320:-2,tile=5x3:padding=2:margin=2" -frames:v 1 `
  "output\render\test_stroy2\qa\push_lens_zoom_090_230.png"

# 5. 尾段（3.8–4.5 s，每 0.1 s）
& $ff -hide_banner -loglevel error -y -ss 3.8 -t 0.7 `
  -i "output\render\test_stroy2\block_001_railing_push_lens_00001_.mp4" `
  -vf "fps=10,scale=360:-2,tile=4x2:padding=2:margin=2" -frames:v 1 `
  "output\render\test_stroy2\qa\push_lens_tail.png"
```

---

## 8. 結論摘要

| 檢查項 | 方法 | 證據強度 | 結論 |
|---|---|---|---|
| 有聲 | 音軌解碼 + RMS 峰值 0.242 | 強（數值） | 通過 |
| 發聲區間 | RMS 門檻 0.0605 → 2.00–4.00 s | 強（數值） | 通過（頭段笑聲貼近門檻） |
| 女聲 | 自相關 F0 238.8 Hz | 中（非聲紋） | 通過 |
| 跨 clip 聲線 | 與 216.2 Hz 比，差 10.45 % | 中 | 未觸警示線，但已接近 |
| 推鏡連續 | 0.9–2.2 s 每 0.1 s 目視 | 中（解析度 0.1 s） | 連續，無跳接 |
| 動作三要素 | 12 格 vs `action` | 中 | 通過 |
| 造型 | 12 格 vs `outfit` | 中（赤腳無法確認） | 大致通過 |
| 對嘴 | 取樣格 vs 發聲區間 | 弱（粗檢） | 無明顯矛盾 |
| 字幕／浮水印／閒人 | 三組圖目視 | 中 | 通過 |
| 接戲連續性 | 與前一 clip 比對姿態與背景 | 中（單向比對） | **不通過**（站姿 vs 坐姿、多了酒桶） |
| 光線 | 目視陰影與色溫 | 弱 | **不符計畫**（午後 vs 黃昏） |

判定：**retake**。畫面本身與動作都成立，但接戲不連會直接毀掉 `seg_001` 的連續感；這是這個 block 與上一個 block 的差別所在——上一個是「可用的瑕疵」，這一個是「剪起來會跳」。
