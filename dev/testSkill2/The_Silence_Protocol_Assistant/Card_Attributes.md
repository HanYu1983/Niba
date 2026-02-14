# 檔案名稱：Card_Attributes.md

## 1. 基礎標籤 (Identification)
- **卡牌 ID (UID)**：唯一識別碼（如：S-001 代表 Scenario 第 1 張）。
- **卡牌名稱 (Name)**：具有冷酷或哲學意味的標題。
- **類型 (Type)**：
    - **[情境 (Scenario)]**：標準資源卡。
    - **[事件 (Event)]**：副作用強制卡，不可棄置。
    - **[淨化 (Purify)]**：格式化專用卡。
- **區域 (Target Zone)**：指定施放的區域（住宅、金融、工業、藝術、或全域）。

## 2. 資源產出 (Resource Yield)
- **研究點數 (RP Yield)**：執行後獲得的點數。
- **情緒屬性 (Emotional Essence)**：產出的情緒類型（幽藍、燥紅、森綠），用於科技研發的特定加成。

## 3. 系統影響 (System Impact)
- **穩定度損耗 (Stability Cost)**：執行後對 [系統穩定度] 的影響（通常為負值）。
- **暴動值增幅 (Riot Instigation)**：對目標區域 [暴動值] 的影響。
- **警覺感加權 (Alertness Increase)**：對敵方組織警戒程度的影響。

## 4. 戰鬥預覽 (Combat Preview)
- **殘留威脅 (Residual Threat)**：若此卡被「棄置」或執行失敗，在地圖上生成的心魔類型與強度。
- **屬性對抗 (Attribute Logic)**：該卡牌情緒所屬的剋制屬性，影響晚間防禦的演算。

## 5. 執行代價 (Execution Cost)
- **電力負荷 (Power Drain)**：執行此卡所需的行動力（預設每回合 1 點）。
- **研發前置 (Tech Requirement)**：部分高階卡牌需特定科技線百分比才能解鎖。

## 6. 風味敘述 (Flavor Text)**
- **控制台日誌 (Console Log)**：以冰冷的 AI 視角對該事件進行的簡短註解。