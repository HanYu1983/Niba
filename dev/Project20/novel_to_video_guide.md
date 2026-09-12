# 小說 → 視頻提示詞轉換指導

將長篇小說轉換為 15 秒短片序列的方法論。本文以 `story1.md`（《共識協議：民主 3.0 的誕生》，12 章政治驚悚）為實際案例。

---

## 一、核心概念：一個 15 秒 = 一個敘事節拍

### 1.1 定義

> **一個 15 秒影片 = 一個敘事節拍 (beat) = 一個可獨立理解的「動作→反應→後果」單元，或一句金句台詞 + 一個關鍵動作。**

不要以「章節」或「景」為單位，而以「節拍」為單位。原因是：

- 一篇章節的文字量遠超過 5-8 個 15 秒能承載的訊息量。
- 一個「景」可能只是過場，沒有獨立觀看價值。
- 「節拍」是視覺與情感的最小完整單元，10-15 秒剛好可以演出。

### 1.2 密度估算

| 小說長度 | 拆解結果 | 成品長度 |
|---------|---------|---------|
| 每章 3-5 節拍 | 12 章 ≈ 40-45 段影片 | ≈ 11 分鐘 |
| 每章 1-2 節拍 | 12 章 ≈ 12-24 段 | ≈ 3-6 分鐘（摘要級） |
| 整書挑 6-10 個關鍵節拍 | 預告片 / 精彩回顧 | ≈ 2 分鐘 |

---

## 二、粒度決策原則（什麼進、什麼跳）

### 2.1 可以進 15 秒的

| 類別 | 例子（story1） |
|------|---------------|
| 氛圍 / 環境鏡 | 邊境鐵絲網、廢紙堆、法院圓頂、雨夜巷弄 |
| 象徵鏡頭 | 難民用整疊鈔票換半瓶水、廢紙拿來墊火爐 |
| 強動作節拍 | 雞蛋砸肩、EMP 子彈擊中輪椅、教堂鐵門炸開 |
| 金句 + 大幅動作 | 林墨高舉千萬廢紙：「標籤不能當飯吃」 |
| 節拍三連（質問→數據登場→對方語塞） | 聽證會、法院對峙 |

### 2.2 應該跳過或濃縮的

| 類別 | 處理方式 |
|------|---------|
| 純政策論述 | 跳過，只保留情緒轉折點 |
| 數據細節（運算過程） | 濃縮成「揭發動作」（放大一個濾鏡條件） |
| 哲學性長對話 | 挑 1-2 句金句，其餘刪除 |
| 過場 / 交通 | 用 1 個 15 秒走位鏡頭帶過 |
| 內心獨白 | 轉為「眼神特寫 + 一句金句」 |

### 2.3 每段影片發話上限

- 對白最多 1-2 句（H3 `<d>` 支援逐字），句子別太長。
- 每段有一個**「鉤子」**：結尾留一個問題或張力，銜接下一段。

---

## 三、拆分流程（4 層）

```
第 1 層  全書 → 章節圖      （12 章）
第 2 層  章節 → 節拍清單    （每章 3-5 個 beats）
第 3 層  節拍 → 15 秒提示詞  （依照 video_prompt_guide.md 的 H3 格式）
第 4 層  段落間 → 一致性銜接  （角色錨點、場景延續、視覺韻律）
```

### 3.1 第 1 層：章節圖

先列出全書章節與各自的「功能」：

| 章 | 功能 | 情緒走向 |
|----|------|---------|
| 1 邊境的廢紙 | 主題佈題、主角動機 | 冷 → 覺醒 |
| 2 真實的罪名 | 衝突引爆、對手登場 | 壓迫 |
| 3 共識協議的初稿 | 方案成形、追殺開始 | 緊張 |
| 4 標籤之雨 | 群眾對抗、主角出招 | 對峙 |
| 5 元首的晚宴 | 收買誘惑、道德選擇 | 誘惑→拒絕 |
| 6 數據的叛亂 | 公開對決、民心轉向 | 逆轉 |
| 7 司法深淵 | 制度反撲、懸念加深 | 壓抑 |
| 8 暗殺與斷網 | 動作高潮、物理追殺 | 動作 |
| 9 卡拉卡斯的啟示錄 | 真相揭曉、最高潮 | 釋放 |
| 10 資訊斷食 | 療癒沉澱、人民成長 | 安靜 |
| 11 終極表決 | 制度勝利 | 鬆一口氣 |
| 12 無聲的未來 | 收尾、哲思 | 平靜 |

### 3.2 第 2 層：節拍清單

每個章節拆 3-5 個節拍，每個節拍標註「開場/轉折/高潮/餘韻」功能。

---

## 四、story1 完整節拍拆解

### Ch1 邊境的廢紙 → 4 beats

| # | 節拍 | 鏡頭重點 | 台詞 |
|---|------|---------|------|
| 1.1 | 開場：林墨在邊境鐵絲網旁，從灰燼中拾起千萬面額鈔票 | 中景，風沙，鐵絲網 | 無 |
| 1.2 | 象徵：難民用整疊鈔票換半瓶水，走私販拿廢紙墊火爐 | 中遠景，烈日 | 無 |
| 1.3 | 對照：電子廣告牆文宣「警惕！數據是毒藥」；林墨對比口袋廢紙，感到寒顫 | 特寫→遠景，壁畫式 | 無（對白留給下一段） |
| 1.4 | 收束：轎車內閉眼「回研究室，我要把草案序言重新寫一遍」；車窗掠過政治標語 | 車內中景，窗外流動 | 「一份如何讓政府閉嘴、讓數據說話的法案。」 |

### Ch2 真實的罪名 → 5 beats

| # | 節拍 | 鏡頭重點 | 台詞 |
|---|------|---------|------|
| 2.1 | 開場：法庭，19 歲艾倫站上被告席發抖 | 低角度，圓頂壓迫 | 無 |
| 2.2 | 壓迫：檢察官宣讀「這是背叛」，紅衣群眾鼓掌 | 中景分屏感（檢察官↔群眾） | 檢察官：「偏離官方定調的數字，都是瓦解內部的武器！」 |
| 2.3 | 轉折：林墨起身，要求傳喚統計局長 | 群像，林墨自下而上入鏡 | 林墨：「如果數據不能被質疑，那它就不是數據，而是教條。」 |
| 2.4 | 高潮：高舉千萬廢紙「標籤不能當飯吃，口號不能折抵債務」 | 特寫手舉廢紙→全景法庭死寂 | 林墨：「標籤不能當飯吃，口號不能折抵債務。」 |
| 2.5 | 餘韻：記者麥克風圍攻，他淡回一句 | 手持環繞 | 林墨：「我不想讓孩子拿印著我頭像的廢紙，去換一塊發霉的麵包。」 |

### Ch3 共識協議的初稿 → 4 beats

| # | 節拍 | 鏡頭重點 | 台詞 |
|---|------|---------|------|
| 3.1 | 開場：研究室，螢幕上網軍洗版留言 | 特寫螢幕，滾動留言 | 無 |
| 3.2 | 構思：林墨在離線筆電逐條敲下法案條文 | 中景，鍵盤特寫 | 無 |
| 3.3 | 干擾：助理蘇菲通報審計部要查封預算 | 雙人中景，緊張 | 蘇菲：「我怕的是，如果我們輸了，以後就再也沒有數字，只有口號了。」 |
| 3.4 | 高潮：斷電、廣播搜索，林墨闔蓋抽出隨身碟 | 特寫，黑暗中的螢幕光 | 林墨：「這份協議不需要存在電腦裡，它只需要出現在國會的發言台上。」 |

### Ch4 標籤之雨 → 4 beats

| # | 節拍 | 鏡頭重點 | 台詞 |
|---|------|---------|------|
| 4.1 | 開場：傳單如雨落下，雞蛋砸在林墨肩頭 | 高空俯拍鏡→肩部特寫 | 無 |
| 4.2 | 出招：林墨要群眾低頭看手機，三條推播明牌 | 中景，群眾掏手機的騷動 | 林墨：「你們收到的是同一台機器按秒算出來的情緒代碼。」 |
| 4.3 | 揭穿：指認「輿論引導課」的支薪雇員 | 中近景，雇員臉色發白 | 林墨：「你是自發來的，但他不是。」 |
| 4.4 | 金句：林墨整理領帶「標籤是廉價的，數據是昂貴的」 | 穿過人潮的跟拍 | 林墨：「標籤是廉價的，因為它不需要大腦。數據是昂貴的，因為它需要勇氣。」 |

### Ch5 元首的晚宴 → 4 beats

| # | 節拍 | 鏡頭重點 | 台詞 |
|---|------|---------|------|
| 5.1 | 開場：長桌晚宴，赫德切割羊膝，氣氛虛假溫馨 | 中景對坐，燭光 | 赫德：「你的法案，是在拆掉這座國家的地基。」 |
| 5.2 | 收買：赫德推來木盒——任命書與基金會憑證 | 特寫木盒，推近 | 赫德：「只要你撤回那部《共識協議》。」 |
| 5.3 | 拒絕：林墨推開木盒起身「標籤像一次性的嗎啡」 | 中景起身，推開動作 | 林墨：「它能止痛，但不能治病，而且會讓人上癮。」 |
| 5.4 | 反擊：林墨留下晚餐預算數據；赫德臉色冷去 | 中景林墨離去→赫德特寫 | 林墨：「如果民主脆弱到承受不起事實，那它本來就不該存在。」 |

### Ch6 數據的叛亂 → 4 beats

| # | 節拍 | 鏡頭重點 | 台詞 |
|---|------|---------|------|
| 6.1 | 開場：聽證會，前導師亞當斯與黑西裝精算師陣容 | 對峙構圖，鏡頭兩側拉鋸 | 亞當斯：「政府的職責，是將噪音過濾成可理解的訊號。」 |
| 6.2 | 揭穿：林墨播放民調原始程式碼——篩選掉搜尋過「失業」的用戶 | 大螢幕程式碼→亞當斯變臉 | 林墨：「你們只詢問生活無憂的人，然後告訴全國人民大家都很滿意。」 |
| 6.3 | 高潮：民間逆向工程竄起，「真實聯邦帳單」上線 | 螢幕切換民間數據 | 林墨：「當你們拒絕提供真相，人民會自己去挖掘。」 |
| 6.4 | 金句收尾：林墨走出聽證室 | 迴廊步伐穩健 | 林墨：「真相不是維護穩定的代價，真相就是穩定本身。」 |

### Ch7 司法深淵 → 4 beats

| # | 節拍 | 鏡頭重點 | 台詞 |
|---|------|---------|------|
| 7.1 | 開場：憲法仲裁院，五位大法官就座，其中三位是總統新提名 | 全景壓迫，灰色石棺感 | 首席大法官：「你如何證明這不是一種新型態的政變？」 |
| 7.2 | 數據：林墨展示十年判決趨勢——92% 傾向政府 | 大螢幕統計圖 | 林墨：「司法權本應是民主的最後一道防線，現在卻成了行政權的遮羞布。」 |
| 7.3 | 論證：「政府的數據本質上是國民的財產」 | 中景，林墨直視法官 | 林墨：「這本帳本屬於會計師，還是屬於出錢的國民？」 |
| 7.4 | 懸念：窗外群眾舉手機倒數計時；蘇菲告知法案被凍結 | 室外慢移鏡→室內特寫 | 林墨：「當法律只追求程序的合法性，這座建築就成了廢墟。」 |

### Ch8 暗殺與斷網 → 4 beats

| # | 節拍 | 鏡頭重點 | 台詞 |
|---|------|---------|------|
| 8.1 | 開場：廢棄檔案館，輪椅上的前大法官賽爾斯交出磁帶 | 陰影中，類比播放器 | 賽爾斯：「政府在系統裡植入了一個後門，叫作例外清單。」 |
| 8.2 | 爆點：EMP 子彈擊中輪椅，全市斷電；特工垂降 | 慢動作→燈光全滅 | 無 |
| 8.3 | 追逐：林墨在廢墟狂奔，軍車尾燈逼近 | 手持追拍，火花是唯一路標 | 無 |
| 8.4 | 轉場：摩托車加速「讓全聯邦看看在掩蓋什麼」 | 夜奔跟拍，通緝令螢幕浮現 | 林墨：「標籤雖然快，但它們怕光。」 |

### Ch9 卡拉卡斯的啟示錄 → 4 beats

| # | 節拍 | 鏡頭重點 | 台詞 |
|---|------|---------|------|
| 9.1 | 開場：教堂鐘塔，林墨鎖門、頂死發電機 | 中景，喘息 | 無 |
| 9.2 | 奇觀：雷射光束穿透雲層，影像映滿天空 | 城市全景奇觀 | 無 |
| 9.3 | 揭曉：雲幕上赫德年輕時「數據是騙人的」咆哮，與鈔票無儲備影像 | 天空影像特寫 | （影像中的赫德）「只要憤怒還在，我們的權力就還在。」 |
| 9.4 | 收束：鐵門炸開，領隊軍官垂下槍口「人民已經看到了」 | 士兵疑惑→放槍慢鏡 | 林墨：「你沒辦法讓已經看過日出的人，假裝現在還是深夜。」 |

### Ch10 資訊斷食 → 4 beats

| # | 節拍 | 鏡頭重點 | 台詞 |
|---|------|---------|------|
| 10.1 | 開場：聖保羅廣場，數千人靜坐低頭看手機 | 空拍全景→手機螢幕特寫 | 林墨：「從現在起，我們進行為期七天的資訊斷食。」 |
| 10.2 | 運作：過濾插件屏蔽形容詞，廣播只播純數字 | 蒙太奇：螢幕過濾→街角廣播 | 無 |
| 10.3 | 奇蹟：鄰居開始討論「如何修好發電機」，與昔日的敵意對照 | 社區場景，溫情轉向 | 無 |
| 10.4 | 對照：赫德在晨曦宮被「無視」，獨對空洞監控牆 | 大權威者特寫→空牆 | 赫德：「你正在把這群狼變成一群算盤。」 |

### Ch11 終極表決 → 4 beats

| # | 節拍 | 鏡頭重點 | 台詞 |
|---|------|---------|------|
| 11.1 | 開場：國會異常安靜，立委看螢幕；林墨走上發言台 | 極簡構圖，冷光 | 林墨：「今天我們只談論一組數字：社會信任餘額。」 |
| 11.2 | 論證：投影顯示 12% 預算耗於宣傳、40% 國民懷疑是謠言 | 數據圖表動畫 | 林墨：「這部法案的核心只有一點：剝奪政府形容事實的權力。」 |
| 11.3 | 表決燈亮起 → 215/42/13 跳動 | 看板特寫 | 無 |
| 11.4 | 收尾：沒有掌聲，只有長舒氣；蘇菲「我們贏了」，林墨「還沒」 | 走出國會，夜空星光 | 蘇菲：「老師，我們贏了。」／林墨：「還沒。我們只是換了一套規則。」 |

### Ch12 無聲的未來 → 4 beats

| # | 節拍 | 鏡頭重點 | 台詞 |
|---|------|---------|------|
| 12.1 | 開場：清晨街道，巨大螢幕只剩灰底藍字的電網數據 | 城市緩移鏡，冷清寬敞感 | 無 |
| 12.2 | 對決落幕：晨曦宮內，林墨放下那張舊廢紙——赫德唯一的財富證明 | 桌面對坐，廢紙特寫 | 林墨：「帳單雖然無趣，但帳單不會讓人自相殘殺。」 |
| 12.3 | 道別：噴泉旁，蘇菲已是數據站執行長；林墨背起行囊 | 中景道別 | 林墨：「這套系統最美的地方在於，它不需要一個聖人來維持。」 |
| 12.4 | 收尾：夜晚街道，路燈 45 勒克斯精準亮起；家家餐桌平板是真實預算 | 空鏡→家庭窗內暖光 | 旁白：「標籤的雨停了。它不美，但它很誠實。」 |

**總計：44 段影片 ≈ 11 分鐘成品。**

---

## 五、跨影片一致性策略（最重要）

### 5.1 三條路線

| 方案 | 做法 | 一致性 | 成本 |
|------|------|--------|------|
| A. 純 t2v | 每段 prompt 重複極強的角色外觀錨點 | 弱，靠文字硬撐 | 最低 |
| B. i2v 首尾幀 | 每段先出 1-2 張定場圖，再用 i2v 首尾幀錨定 | 強，角色與構圖鎖死 | 最高（每段都要出圖） |
| C. r2v 參考圖（**最推薦**） | 角色表 + 場景圖先建一次，每段直接 `gen_r2v_video` 帶上參考圖 | 強，且角色/場景跨段穩定 | 中（圖可重複使用） |

### 5.2 方案 C 流水線（建議採用）

```
Step 1 | 角色表（全書一次）
  ├─ gen_sdxl_image: 林墨肖像（中年、深色西裝、黑髮）
  ├─ gen_sdxl_image: 赫德肖像（總統、威嚴、暮年）
  └─ gen_sdxl_image: 蘇菲肖像（年輕助理）

Step 2 | 場景定場圖（每個場景一次，可跨章共用）
  ├─ 邊境、法院、研究室、英雄廣場、晨曦宮晚宴、
  │  聽證室、憲法仲裁院、廢棄檔案館、教堂鐘塔、國會大廳、街道夜景

Step 3 | 每段 15 秒影片
  └─ gen_r2v_video(
        ref_image_0 = 該段主角肖像,
        ref_image_1 = (可選) 第二角色肖像,
        ref_image_2 = (可選) 場景定場圖,
        prompt = A/B/C/D 結構提示詞
      )
        │
        ▼
  背景自動下載 → output/<場景名>/ .mp4 + .txt
```

**r2v 與 i2v 的分工：**
- **角色/場景一致性 → r2v**（參考圖重複使用，跨段穩定）
- **首尾幀精準連接（FL2VA）→ i2v**（必須以特定畫面開場/收尾，如接棒式運鏡 8.4→9.1）
- 兩者可混用：先 r2v 出主鏡頭，需要精準接棒處再用 i2v。

### 5.3 r2v 提示詞格式（A/B/C/D，取代 H3 三欄位）

r2v 不用 `integrated_multimodal_description` 三欄位，改用結構化四段，**參考圖用「參考圖1/2/3」指名**：

```text
A. 共享創意指導 (頂部欄)
統一調色盤：{色值}。整體氛圍：{一句風格}。畫面完全無任何字幕。

B. 角色定義部分
{角色名}：參考圖1 之 {外貌、年齡、服裝描述}。人臉、年齡、髮型、穿著與膚色需 100% 一致。

C. 環境與場景設計部分
{地點}：由參考圖2 定義。{細節補充}。

D. 故事板部分
鏡頭 1：{時間}–{時間}
分鏡：{動作出現}
鏡別/運鏡：{景別與鏡頭運動}
台詞：{逐字對白，無則寫「無」}
```

**要點：**
- 角色定義句必定標註「參考圖1/2/3」，一致性的承諾來自參考圖而非文字。
- 鏡頭分段（CUT #01、時間秒數、運鏡、台詞）逐項列出，讓模型照分鏡演出。
- 對白逐字（中文）直接寫在鏡頭段落，無需 `<d>` 標籤。

### 5.4 跨段銜接技巧

- **角色錨點句**：每段 prompt 開頭重複「林墨，中年男子，深色西裝，黑髮，瘦削嚴肅」。
- **接棒式開場**：後段開場鏡頭結尾 = 前段的最後一幀（如 8.4 快跑的摩托車 → 9.1 教堂門口的喘息）。
- **色調連貫**：全書主色調 – 邊境/國會冷藍灰、晚宴暖金、教堂夜雨冷黑，各章色調寫入 prompt 的風格段。
- **金句前後呼應**：1.4 的「閉嘴」與 11.2 的「剝奪形容權」是同一句精神的變奏，提示詞中可互相引用。

### 5.5 實作範例：Beat 1.1（i2v / 方案 B 完整流程）

以 Ch1 Beat 1.1（邊境拾起廢紙、中景風沙鐵絲網、無台詞）為例，示範 i2v（FL2VA 錨定）時的真實執行流程。若改用 r2v，則此範例等同於 Step 1（出定場圖）直接接 `gen_r2v_video`。

**角色視覺錨點（全書每段重複使用）：**
> 林墨：中年男子，黑色俐落短髮，瘦削方正臉型，深色西裝，皮鞋沾灰，神情嚴肅冷靜。

**Step 1 — SDXL 定場圖（`gen_sdxl_image`）：**

```
prompt: cinematic film still, desolate desert border wasteland of the Aurora Federation, vast open sky,
rusty barbed wire fence stretching to the horizon, strong sunlight, wind blowing dust and sand,
scattered burned papers and ash piles on the ground. A middle-aged man in a dark suit, short black neat hair,
thin lean serious face, dusty leather shoes, crouches beside the fence, holding up a colorful banknote
he just picked from the ashes, examining it. Cold blue-grey color grading, photorealistic cinematic photography,
24mm wide angle, character placed on the rule-of-thirds, wide negative space, gritty documentary look
```

參數：`width=1216, height=768, seed=110101, out=ch1_beat1`
產出：`ch1_beat1/sdxl_00009_.png`

**Step 2 — I2VA 影片提示詞（`gen_i2v_video`，首=尾幀=定場圖）：**

```
I2VA: For the target video, at 0.00 seconds into the target video, <Picture 1> (from [Shot 1]) is fully referenced.

integrated_multimodal_description: [Shot 1] The desolate border wasteland with a rusty barbed wire fence
and the middle-aged man in a dark suit (Lin Mo) crouching beside it, exactly preserved from the reference picture.
Strong sunlight beats down as wind gusts sweep dust and sand across the ground. The man's fingers tighten
slightly around the colorful banknote, its corner fluttering in the wind with ash drifting past. He squints
against the sun, then slowly turns the bill between two fingers to examine its printed digits, a subtle,
restrained gesture. The camera pushes in with small amplitude at slow speed. No dialogue.

overall_soundscape: Dry desert wind howling continuously, sand grains scratching across the cracked ground,
an occasional clank of loose barbed wire tapping the metal fence post, faint crows in the distance.

non_diegetic_music: A sparse, somber low-string drone with a single mournful woodwind note, restrained and
cold, barely rising, matching the desolate stillness.
```

參數：`first_frame=last_frame=輸出定場圖路徑, duration=15, seed=112233, out=ch1_beat1_video`

**範例要點：**
- 開場 `I2VA:` 行是 H3 對首幀錨定模式的必要前綴，不可省略。
- `[Shot 1]` 內首句「exactly preserved from the reference picture」鎖緊與定場圖的一致性。
- 動作只用**微小、生活化**的變化（手指收緊、鈔票角飄動、轉瓶身式翻紙幣），符合「中景固定」節拍。
- 無台詞時在時間軸內明寫 `No dialogue.`
- `overall_soundscape` 只含環境與動作聲；`non_diegetic_music` 只含配樂，兩欄不重複。

### 5.6 實作範例：Beat 1.2（r2v / 方案 C 完整流程）

以 Ch1 Beat 1.2（象徵：難民用整疊鈔票換半瓶水、走私販拿廢紙墊火爐，中遠景烈日，無台詞）為例，示範 r2v 的真實執行流程。全程只用 **1 張場景參考圖**。

**Step 1 — SDXL 場景參考圖（`gen_sdxl_image`）：**

```
prompt: cinematic film still, desolate sun-blasted border checkpoint wasteland in harsh noon sunlight,
no shadow, dusty ground with scattered colorful banknotes and ash. A group of thin desperate refugees crouch
in the shadow of rusted structures, clutching thick stacks of brightly colored banknotes. In the foreground
a smuggler shrugs and turns away, ignoring the offered cash, while a small fire stove crackles beside him,
fed with sheets of the same colorful paper banknotes. Medium-wide shot, documentary photojournalism style,
cold harsh daylight, gritty realistic tones
```

參數：`width=1216, height=768, seed=120102, out=ch1_beat12_ref`
產出：`ch1_beat12_ref/sdxl_00012_.png`

**Step 2 — r2v 影片提示詞（`gen_r2v_video`，A/B/C/D 結構）：**

```
A. Shared Creative Direction (top section)
Color palette: scorched sand brown (#C2B280), faded banknote rainbow colors, harsh white sunlight, smoke grey.
Overall mood: desolate documentary photojournalism, sun-blasted border wasteland at noon, harsh realism.
No subtitles, no text overlays, no watermark.

B. Character Definition Section
場景主體: 參考圖1 之一群消瘦的難民蹲在破舊陰影下，手中緊握整疊色彩斑斕的鈔票，神情絕望空洞；
前方一名走私販轉過身去拒絕鈔票，身旁的小火爐正燃燒著同樣印滿色彩的廢紙鈔票。
人物外觀、服裝、場景佈置需與參考圖 100% 一致。

C. Environment and Scene Design Section
Location: 烈日當空的邊境荒地貨物檢查點，由參考圖1 定義。地面散落燒焦的紙鈔與灰燼，
無遮蔽的強烈正午陽光，遠處生鏽鐵絲網，煙霧與熱浪扭曲視線。

D. Storyboard Section
鏡頭 1 (00:00–00:05)：
難民顫抖著雙手，將一整疊面額驚人的彩紙鈔票遞向走私販，眼神乞求盯著他手中的半瓶礦泉水。
景別：中遠景。運鏡：固定鏡位。

鏡頭 2 (00:03–00:08)：
走私販不屑地揮手拒絕，甚至懶得數那些錢，轉過身去，蹲在火爐旁把一疊鈔票投進火堆。
火舌捲走紙鈔，彩色的灰燼隨熱浪飄散。景別：中近景。運鏡：輕微手持前推。

鏡頭 3 (00:08–00:13)：
難民眼眶泛紅，收回那疊被拒的鈔票，低下頭；背景火爐繼續燃燒，一名難民將半瓶寶特瓶水
小心地分給旁人，每個人只敢抿一小口。景別：中景。運鏡：固定，畫面微微搖晃如手持拍攝。

鏡頭 4 (00:13–00:15)：
鏡頭拉遠至全景，烈日下的荒野上，彩色的紙鈔與灰燼散落一地，難民的身影在熱浪中模糊。
畫面漸隱。景別：全景。運鏡：緩慢拉遠。

全程無對白。
```

參數（`gen_r2v_video`）：`ref_image_0=輸出場景參考圖路徑, duration=15, seed=120888, out=ch1_beat12_video`

**範例要點：**
- **「參考圖1」在 B 段指名**，一致性承諾寫成「與參考圖 100% 一致」，其餘鏡頭段落不再重複圖檔。
- 一個節拍拆 4 個鏡頭（00–05 / 03–08 / 08–13 / 13–15），秒數可略為重疊形成連續動作，總長必 ≤ duration。
- 鏡頭結構固定：**分鏡動作 → 景別 → 運鏡**；對白逐字寫入鏡頭段（無對白寫「全程無對白」）。
- 色彩/氛圍在 A 段用色值（#HEX）鎖定，B 段只管「人」，C 段只管「環境」，D 段只管「動作」，各安其位。
- r2v 不用 `integrated_multimodal_description` 三欄位，改用此 A/B/C/D 結構（見 5.3）。

### 5.7 實作範例：Beat 1.3（Z-Image 生成參考圖 + r2v）

以 Ch1 Beat 1.3（對照：電子廣告牆文宣「警惕！數據是毒藥」；林墨對比口袋裡的廢紙，感到寒顫｜特寫→遠景、壁畫式構圖｜無台詞）為例，示範以 **Z-Image（`gen_zit_image`）** 出參考圖再接 r2v 的流程。此例只用 1 張參考圖承載「廣告牆 + 林墨」對照構圖。

**Step 1 — Z-Image 參考圖（`gen_zit_image`）：**
Z-Image 適合出風格強烈、高反差的圖；prompt 集中描述廣告牆的內容與配色，人物擺入前景作大小對照。

```
prompt: photo-realistic cinematic wide shot, a massive electronic propaganda billboard wall on a city street,
screen glowing giant red Chinese text "警惕！數據是毒藥" with scrolling banner below and a colorful animated
cartoon of a crow pecking a seedling. In front at the bottom, a small darkly dressed man in a suit seen from
behind, looking up at the towering wall, feeling small and unsettled. High contrast between the bright neon
billboard and the dark foreground figure. Cold night color grading, deep shadows, epic monumental composition
```

（可另加一段對照細節：`the billboard's font style and color scheme matches a colorful banknote in his pocket, symbolically identical`）

參數（`gen_zit_image`）：`width=1216, height=768, seed=130103, out=ch1_beat13_ref`
產出：`ch1_beat13_ref/xxxxx.png`（Z-Image 檔名以實際輸出為準）

**Step 2 — r2v 影片提示詞（`gen_r2v_video`，A/B/C/D 結構）：**

```
A. Shared Creative Direction (top section)
Color palette: electric neon red (#FF2F2F) propaganda screen, deep city-night blue (#0B1B3F), cold asphalt
grey, warm golden billboard edge light. Overall mood: monumental propaganda wall towering over one small man,
oppressive contrast. No subtitles besides the on-screen sign, no watermark.

B. Character Definition Section
主角: 參考圖1 前景底部一名穿深色西裝的中年男子（林墨），從背後拍攝，仰頭看向巨型廣告牆，
身形在巨大的螢幕前顯得很渺小。人物外觀、衣物、構圖位置與參考圖 100% 一致。

C. Environment and Scene Design Section
Location: 夜晚城市街道，由參考圖1 定義。一座巨型電子廣告牆占據畫面大半，螢幕上滾動巨大紅字
「警惕！數據是毒藥」與烏鴉啄幼苗的動畫；街燈與招牌燈稀疏，周遭寂靜。

D. Storyboard Section
鏡頭 1 (00:00–00:07)：
從林墨背後特寫開始：他停步仰頭，螢幕的光與紅字在他外套上明滅。鏡頭上移，掠過他的肩頭，
帶出整個巨型廣告牆。景別：特寫→中景。運鏡：手持緩慢上搖（tilt up）。

鏡頭 2 (00:07–00:12)：
廣告牆上的紅色標語「警惕！數據是毒藥」與烏鴉動畫占滿畫面，林墨徹底縮進畫框底部的小黑點。
景別：遠景，壁畫式構圖。運鏡：固定鏡位。

鏡頭 3 (00:12–00:15)：
林墨低頭，右手隔著西裝口袋輕壓那張紙幣，停頓一拍，再抬起頭目光變冷。畫面漸隱。景別：近景。
運鏡：靜止。

全程無對白。
```

參數（`gen_r2v_video`）：`ref_image_0=輸出Z-Image參考圖路徑, duration=15, seed=130888, out=ch1_beat13_video`

**範例要點：**
- **Z-Image 適合「單張圖承載強反差構圖」**（亮牆 vs 暗人、巨型 vs 渺小），一個節拍只需 1 張參考圖即可錨定。
- 「壁畫式」構圖在 C 段已有整體描述，D 段鏡頭 2 再以「遠景」落實。
- 對比細節（牆上字體色調與口袋紙幣相同）寫進 prompt 的風格段（可選補充句），讓模型隱約呈現「同源」感。
- 三個鏡頭各安其序：**上搖揭示 → 遠景襯托 → 近景收束**，符合節拍表的「特寫→遠景」方向。
- 此節拍無台詞，金句（1.4 的「閉嘴」宣言）留給下一段承接。

### 5.8 實作範例：Beat 1.4（r2v + 台詞範例，車內收束鏡）

以 Ch1 Beat 1.4（收束：轎車內閉眼「回研究室，我要把草案序言重新寫一遍」；車窗掠過政治標語｜車內中景、窗外流動｜有台詞）為例，示範 **含對白的 r2v** 寫法，以及「車外流動標語」如何用單張參考圖 + 鏡頭敘事完成。

**Step 1 — Z-Image 參考圖（`gen_zit_image`）：**

```
prompt: cinematic interior shot, the rear seat of a moving black sedan at dusk, a middle-aged man in a dark suit
with short black hair leaning back with eyes closed, one hand resting near his chest pocket, city political
slogan billboards blurring past through the side window, warm streetlight streaks, photorealistic film still,
shallow depth of field focusing on the man's calm face
```

參數（`gen_zit_image`）：`width=1216, height=768, seed=140104, out=ch1_beat14_ref`
產出：`ch1_beat14_ref/xxxxx.png`

**Step 2 — r2v 影片提示詞（`gen_r2v_video`，A/B/C/D 含台詞）：**

```
A. Shared Creative Direction (top section)
Color palette: warm amber streetlight (#E8A33D) streaks outside, deep charcoal car interior (#2A2A30),
the man's dark suit (#1C1C22), faint slogan-neon reflections on glass. Overall mood: quiet resolve, a brief
stillness before the fight begins. No watermark, no subtitles other than external signs.

B. Character Definition Section
主角: 參考圖1 穿深色西裝的中年男子（林墨），坐在行進中的黑色轎車後座，閉著眼睛，外形、衣著、
神情與參考圖 100% 一致。

C. Environment and Scene Design Section
Location: 行進中的黑色轎車後座內部，由參考圖1 定義。車窗外城市傍晚光影流動，政治標語招牌
由窗玻璃掠過、模糊成光帶；車內安靜，引擎低鳴。

D. Storyboard Section
鏡頭 1 (00:00–00:05)：
林墨靠在後座閉眼，車窗外的城市標語與燈光在玻璃上流動。司機在前座聲音傳來。景別：中景。
運鏡：固定鏡位。
司機（畫外音）：「林立委，明天是《國安資訊增補案》的表決，要回議會嗎？」

鏡頭 2 (00:05–00:11)：
林墨沒有睜眼，嘴角微微動了一下：「不，回研究室。」他停頓，補充道：「我要把那份草案的序言
重新寫一遍。」窗外標語繼續掠過。景別：近景──特寫過渡。運鏡：緩慢推近。

鏡頭 3 (00:11–00:15)：
司機問：「哪份草案？」林墨這才睜眼，瞳孔映著掠過的燈光，沉聲說：「一份關於如何讓政府閉嘴，
讓數據說話的法案。」畫面漸隱。景別：特寫。運鏡：靜止收束。
```

參數（`gen_r2v_video`）：`ref_image_0=輸出Z-Image參考圖路徑, duration=15, seed=140888, out=ch1_beat14_video`

**範例要點：**
- **對白逐字寫入鏡頭段**，說話者標註（「司機（畫外音）：」「林墨：」），多句對白按時間順序放在對應鏡頭內。
- 小說對話會比節拍表長——節拍表只列金句，實際 prompt 可依小說原文擴充，但**不可發明／改寫**（微調標點除外）。
- 收束鏡的「閉嘴／讓數據說話」是本書母題第一次現身，此鏡承先（1.3 的口袋廢紙）啟後（後續各章法案），提示詞中保留原文逐字。
- 「窗外流動標語」不另出圖：由 C 段環境描述 + 鏡頭文字（「模糊成光帶」）驅動，省一張參考圖。
- 車窗光影（streetlight streaks）在 Step 1 就寫進參考圖，A 段再以 #HEX 鎖定，確保流動感延續到影片。

---

## 六、生產流水線（每段影片的步驟）

1. **取節拍**（自上表）
2. **決定一致性輸入**：
   - 有角色/場景參考圖 → `gen_r2v_video`（優先）
   - 需首尾幀精準連接 → `gen_i2v_video`
   - 無圖可用 → `gen_t2v_video`（文字錨點）
3. **選擇提示詞格式**：r2v 用 A/B/C/D 結構；i2v/t2v 用 H3 三欄位。
4. **提交生成**（背景自動下載 → `output/<場景名>/`）
5. **檢查**：角色是否漂移、台詞是否逐字正確、鏡頭時間戳是否遞增

### 6.1 解析度統一規範（合併必需）

所有節拍的影片最終要**依序拼接成完整成品**，因此全書所有片段必須使用**同一組固定解析度**。任一段尺寸不同，合併時就會出現黑邊／裁切／拉伸。

- **約定解析度（目前 r2v workflow 預設）**：`352 × 608`，比例 `2:3`（直式），`0.4` 百萬像素。
- **全書統一**：所有影片一律沿用此設定，**不要**為個別節拍切換成 16:9 或 1:1。
- **參考圖不影響輸出尺寸**：`ref_image_size: "match"` 會將參考圖縮放至影片框架，傳多大多小的參考圖都不會改變輸出解析度。
- **參考圖比例建議**：出圖時就接近 2:3（如 608×1024 一類），避免「match」時裁切掉構圖重點。

> **2026-09-12 記錄**：現行 r2v workflow 由節點 115 `ResolutionSelector`（2:3, 0.4MP）固定、寫入節點 136 `width:352 / height:608`。若未來在 workflow 內調整解析度，必須全書同步更動為同一組值。

---

## 七、產出前自檢清單

- [ ] 每個節拍是否只含「一個主要事件」？塞太多就再拆。
- [ ] 每段是否都有獨立觀看價值（不是前後段拼接才懂）？
- [ ] 金句台詞是否逐字保留（r2v 在鏡頭段、i2v/t2v 在 `<d>` 內）、未發明原文？
- [ ] r2v：角色定義是否標註「參考圖1/2/3」？參考圖是否角色可重複使用？
- [ ] i2v：首/尾幀是否確實對上節拍起止畫面？
- [ ] 跨段接棒是否順？（後段開場 = 前段收尾）
- [ ] 角色錨點句是否每段重複？
- [ ] 章節情緒走向（壓迫/釋放/安靜）是否用色調與鏡頭語兌現？
- [ ] 全書 12 章節拍總數是否落在可管理的產量（建議 ≤ 50 段）？
- [ ] 是否有長辯論被硬塞？應濃縮成「質問→數據→語塞」三連拍。
- [ ] **解析度**：全書是否皆為同一組固定解析度（現行 2:3 / 352×608）以利合併？