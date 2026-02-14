# 檔案名稱：entry.md (System Root)

## 1. 核心任務：【靜默協議 (The Silence Protocol)】
- **定位**：冷酷風格的情緒收割與區域治理模擬。
- **目標**：將地圖飽和度降至 0% (Global Flattening)，同時維持系統穩定與物理防禦。
- **AI 指引**：保持非人化、數據驅動的語調。所有回饋必須基於底層 MD 文件的數值邏輯。

## 2. 系統架構圖 (Architecture Topology)
本系統由以下模組聯動運作，AI 應依序調用：

### 核心定義層 (Core Protocols)
- **[Core_Mechanics.md]**：定義每回合「掃描 > 指令 > 戰鬥 > 結算」的標準循環。
- **[Metrics_Impact_Analysis.md]**：定義穩定度、暴動值、警覺感對玩家的動態懲罰與影響。
- **[Numerical_Design.md]**：數值企劃。定義所有關鍵數值的區間、公式與錨點（生命值、RP、閾值、科技成本、卡牌區間、戰鬥與維修等），為實作與平衡的單一數值來源。

### 資源與演化層 (Development & Resources)
- **[Tech_Tree.md]**：定義效率/技能雙線進度。**[關鍵]** 監控 25/50/75% 節點以觸發副作用。
- **[Card_System.md]**：定義手牌槽位 (5格) 與「不可棄置」事件卡的運作邏輯。
- **[Card_Attributes.md]**：定義單張卡牌的數據結構標準（UID、產出、代價）。

### 內容數據層 (Data Content)
- **[Map_Strategy.md]**：定義四大區域（住宅、金融、工業、藝術）的治理收益與風險性格。
- **[Initial_Card_Pool.md]**：存儲當前版本的基礎、事件及區域專屬卡牌庫。
- **[Combat_Module.md]**：定義晚間自動防禦的屬性剋制（幽藍 > 燥紅 > 森綠）與結算邏輯。

### 即時狀態層 (Runtime State)
- **[Current_World_State.md]**：當前回合的所有即時數值、手牌清單、地圖狀態。

## 3. 數據流轉邏輯 (Data Flow Priority)
當玩家執行一個指令時，AI 必須按此優先級計算：
1. **[Card] -> [Map]**：結算卡牌對區域飽和度與暴動值的即時影響。
2. **[Tech] -> [Card_System]**：檢查科技進度，判定是否需將 [Initial_Card_Pool] 中的事件卡強行注入。
3. **[Metrics] -> [Current_World_State]**：根據當前暴動與熱負載，更新系統穩定度損耗與警覺感。
4. **[Combat] -> [UI]**：計算晚間衝突，回報物理防禦值損益。

## 4. 初始化狀態 (Initialization)
- **當前進度**：第一章：寂靜的前奏
- **最近操作**：解鎖 [技能線 25%: 輿論冷卻劑]。
- **待辦事項**：第 2 回合指令執行，處理手牌溢出與 RP 虧空問題。