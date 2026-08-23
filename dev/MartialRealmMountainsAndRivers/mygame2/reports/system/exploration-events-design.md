# 探索事件 MVP 開發設計文件

## 1. 文件目的

- 在現有地圖、同格互動、回合、道具、裝備、功法、據點與結果彈窗框架上加入探索事件。
- 讓探索事件提供多選項、條件、風險與不同結果，而不是單一隨機獎勵。
- 建立可直接拆分成工程任務的資料模型、流程、UI 規範與測試標準。
- 與戰爭迷霧、Action Continuation 及現有物品掉落系統保持一致。

## 1.1 目前開發狀態

- **狀態：探索事件 MVP 與資料驅動事件框架已完成，基礎事件目錄已擴充至 13+ 種；所有事件目前統一採同格觸發。六級官階事件制度已完成設計，等級 3 中階事件尚未實作。**
- 已完成：
  - 固定失散商隊事件。
  - 事件 marker、滑鼠點擊與 Enter/Space 鍵盤互動。
  - 事件詳情 modal 與同格互動限制。
  - 交易、護送、掠奪三個選項。
  - 金錢、聲望、道具效果與回合 continuation。
  - 事件完成後標記為 `resolved`，並從地圖移除 marker。
  - 事件條件與效果的資料驅動 catalog（`src/game/events/eventCatalog.ts`）。
  - 通用事件條件判定與效果套用 resolver（`src/game/events/eventResolver.ts`）。
  - 探索事件生成器（`src/game/events/eventSpawner.ts`）。
  - 探索事件結果格式化（`src/game/actionResultFormatters.ts`）。
  - 目標規則判定（`src/game/rules/targetRules.ts`）。
  - 探索事件類型擴充至 13 種：失散商隊、流浪商人、荒廢祠堂、遺落物資箱、遊方學者、異獸足跡、村民求助、暴雨避難所、山賊勒索、採藥郎中、奇異古井、古代遺跡、受傷旅人。
  - 裝備掉落定義（`lootCatalog` in `src/game/types.ts`）。
  - 戰爭迷霧與事件發現關聯（`src/game/rules/visibilityRules.ts`）。
- 尚未完成：
  - 事件條件在 modal 中逐項顯示具體缺少原因。
  - 事件風險資料與 Creature / 世界狀態反應。
  - 中階事件「古墓秘寶」與「武學傳承」。
  - 六級官階事件分級、跨系統條件與高階獎勵的完整整合。
  - 隨機事件生成、事件期限與戰爭迷霧發現的完整整合。
  - 事件鏈、事件歷史與後續事件類型。
  - 裝備效果（`EventEffect.type: 'equipment'`）未接入事件系統。
  - 探索進度追蹤與里程碑獎勵。
  - 環境提示系統（距離感營造）。

## 2. MVP 設計範圍

### 2.0 系統邊界

- 目前不建立獨立 NPC 系統。
- 商隊以探索事件 `lost-caravan` 的形式存在。
- 商隊不保存獨立 NPC 移動、好感度、長期庫存或多次服務狀態。
- 商隊的交易、護送與掠奪全部由事件選項與事件結算處理。
- 未來若需要固定商人、治療師、情報販子或任務 NPC，再另行建立 NPC 系統文件與資料模型。

### 2.1 第一版事件（MVP）

MVP 先實作一種事件：

- **失散商隊**（`lost-caravan`）：玩家可選擇交易、護送或掠奪。

此事件用來驗證：

- 事件點 marker。
- 事件詳情 modal。
- 多選項顯示。
- 金錢、聲望、道具與裝備獎勵。
- 選項條件檢查。
- 風險與負面結果。
- 結果彈窗與 continuation。
- 事件完成後不可重複領取。

### 2.2 基礎事件目錄（已實作 13 種）

以下事件已在 `eventCatalog.ts` 實作，並依事件內容標註建議官階等級。事件等級代表最低建議官階，不等同於事件是否已完成。

#### 等級 1：基礎事件（官階 1）

| 事件名稱 | 類型 | 主要獎勵 | 特殊機制 |
|----------|------|----------|----------|
| 流浪商人 | `wandering-merchant` | 藥品（需購買） | 消耗金錢換取療傷藥/聚氣丹 |
| 遺落物資箱 | `resource-cache` | 金錢 + 回氣丹 | 一次性開取 |
| 暴雨避難所 | `storm-shelter` | 回氣丹 + 少量聲望 | 消耗金錢休整 |

#### 等級 2：基礎事件（官階 2）

| 事件名稱 | 類型 | 主要獎勵 | 特殊機制 |
|----------|------|----------|----------|
| 遊方學者 | `wandering-scholar` | 聲望（需付費） | 消耗金錢換取聲望 |
| 採藥郎中 | `traveling-herbalist` | 療傷藥 + 聲望 | 協助採藥 |
| 受傷旅人 | `wounded-traveler` | 聲望 + 療傷藥 | 援助旅人 |
| 山賊勒索 | `bandit-ransom` | 金錢或聲望 | 支付贖金 vs 拒絕 |

#### 等級 3：條件事件（官階 3）

| 事件名稱 | 類型 | 主要獎勵 | 特殊機制 |
|----------|------|----------|----------|
| 荒廢祠堂 | `abandoned-shrine` | 聲望/藥品（二選一） | 祈禱獲益 vs 取走供品扣分 |
| 異獸足跡 | `beast-tracks` | 療傷藥 + 少量聲望 | 搜刮獵物 |
| 奇異古井 | `strange-well` | 聚氣丹 + 聲望 | 神秘獎勵 |
| 古代遺跡 | `ancient-ruins` | 金錢 + 聲望 | 高價值探索 |

> 備註：上述事件目前都是已實作的基礎事件，建議等級為 1～3；「古墓秘寶」與「武學傳承」屬於待實作的等級 3 中階事件。

### 2.3 探索事件六級制度

探索事件共分六個等級，與玩家官階 1～6 對應。事件等級代表最低建議官階、條件複雜度與獎勵上限；不代表玩家達到官階後即可無條件完成事件。

| 事件等級 | 對應官階 | 條件複雜度 | 獎勵定位 | 事件設計方向 |
|----------|----------|------------|----------|--------------|
| 1 | 流民首領 | 同格、存活、基本資源 | 少量藥品、金錢、聲望 | 教學與地圖互動 |
| 2 | 村寨掌事 | 基礎資源 + 簡單選擇 | 中量消耗品、聲望 | 建立初期行動取捨 |
| 3 | 鄉鎮主事 | 建築、屬性、前置事件之一 | 裝備、功法、經驗 | 中階成長目標 |
| 4 | 地方縣佐 | 多項跨系統條件 | 稀有裝備、進階功法 | 形成中後期路線 |
| 5 | 一方太守 | 巢穴、事件鏈或區域條件 | 高階能力、永久效果 | 長期戰略目標 |
| 6 | 勢力盟主 | 多項世界狀態與重大成就 | 傳奇獎勵、劇情或勝利優勢 | 終局級探索內容 |

#### 分級原則

- 所有事件在玩家進入事件所在格時觸發詳情；事件位置不因等級而隱藏。
- 事件選項的前置條件在結算前再次驗證，避免預覽後狀態變化造成錯誤獎勵。
- 不符合條件時仍可查看事件名稱、描述與缺少條件，但不可執行該選項。
- 低等級事件不應提供可永久改變戰鬥構築的核心獎勵。
- 等級 3～4 事件可以提供裝備或功法，但不得完全取代巢穴與武館的既有定位。
- 等級 5～6 事件必須具備可追蹤的長期目標，不應只增加低階事件的數值。
- 探索事件目前不採用每回合隨機觸發；事件以地圖固定點形式生成與互動。

### 2.4 中階事件（等級 3，優先規劃）

#### 古墓秘寶（`tomb-treasure`）

- **事件等級**：3，對應官階「鄉鎮主事」。
- **觸發方式**：地圖初始化時固定生成，玩家進入事件所在格後開啟詳情。
- **建議生成數量**：每局 1 個，數量是否開放至設定頁面待定。
- **建議前置條件**：完成至少一項基礎探索目標，或持有古墓線索類物品；具體條件待確認。
- **主要獎勵**：稀有裝備、金錢與少量經驗，裝備不應每次都重複取得。
- **選項方向**：謹慎搜索、深入墓穴；不同選項對應不同風險與獎勵。
- **風險方向**：生命值損失、內力消耗或觸發局部 Creature 威脅；不得無預警摧毀據點。
- **設計目的**：把探索、風險與裝備成長連結，提供值得專程前往的中期目標。

#### 武學傳承（`martial-legacy`）

- **事件等級**：3，對應官階「鄉鎮主事」。
- **觸發方式**：地圖初始化時固定生成，玩家進入事件所在格後開啟詳情。
- **建議生成數量**：每局 1 個，數量是否開放至設定頁面待定。
- **建議前置條件**：悟性或其他角色屬性達標，且玩家尚未學會本次傳承提供的功法。
- **主要獎勵**：內功或外功學習機會，必要時提供二選一，避免直接給予過多永久能力。
- **成本方向**：消耗回合、內力、金錢或其他可預期資源；目前探索事件本身不消耗體力。
- **風險方向**：修煉失敗時損失少量內力或經驗，不應無條件移除既有功法。
- **設計目的**：把角色屬性、功法構築與探索目標連結，形成中期成長路線。

### 2.5 高階事件（等級 4～6，待實作）

以下事件為深化探索系統的下一步，針對玩家反饋「可以做的事情少」與「探索要素不夠」設計：

#### 古墓秘寶（`tomb-treasure`）

- **觸發條件**：隨機生成於森林/山地地形，探索度達 10% 後出現率提升。
- **主要獎勵**：稀有裝備（鐵劍、旅行長袍、玉佩）、中等金額金錢。
- **風險**：可能遭遇陷阱（損失少量生命值）。
- **設計目的**：提供裝備掉落管道，增加探索深度。

#### 武學傳承（`martial-legacy`）

- **觸發條件**：玩家屬性達標（如臂力 ≥ X、內力 ≥ Y）時出現。
- **主要獎勵**：學習新內功/外功技能、大量聲望。
- **風險**：修煉失敗可能損失少量內力。
- **設計目的**：將角色成長與探索綁定，提供持續探索動力。

#### 秘境入口（`secret-realm`，等級 5）

- **觸發條件**：探索度達 25%/50% 解鎖。
- **主要獎勵**：高階裝備 + 大量聲望 + 稀有道具。
- **風險**：高強度怪物守衛，可能損失生命值。
- **設計目的**：里程碑獎勵，鼓勵玩家深入探索全圖。

#### 江湖挑戰賽（`jianghu-challenge`，等級 4）

- **觸發條件**：每 N 回合刷新一次，玩家可報名參加。
- **主要獎勵**：根據玩家實力排名給予不同等級獎勵。
- **風險**：戰敗損失聲望。
- **設計目的**：提供周期性目標，增加遊戲節奏變化。

### 2.6 後續事件（未來擴充）

- 神秘祭壇：獲得屬性加成，但可能召喚 Creature。
- 廢棄營地：搜尋物資，可能發現陷阱。
- 被封鎖的道路：花費建材清理，開啟捷徑。

以下內容暫不屬於本文件的實作範圍：

- 可跨回合移動的 NPC。
- NPC 好感度與關係。
- NPC 長期商店庫存。
- NPC 招募、傭兵與任務鏈系統。

## 2.7 建築關聯事件池

探索事件不直接與單一建築永久綁定，而是採用「建築解鎖事件池」機制：

```text
據點建築存在
→ 解鎖對應建築事件池
→ 世界生成或補充事件時，從可用事件池選擇事件
→ 玩家與事件同格後查看條件與選項
→ 依建築等級、官階與世界狀態調整事件結果
```

### 2.7.1 設計規則

- 建築事件池由建築類型解鎖，不要求玩家每次都回到該建築所在據點才能查看事件。
- 事件生成時只從已解鎖且符合地圖條件的事件池選擇事件。
- 同一事件池可以包含多個事件，避免建築只對應單一固定內容。
- 建築等級可以解鎖同一事件的更高價值選項，或解鎖事件池中的新事件。
- 事件池事件仍遵守六級官階制度；建築是前置條件之一，不直接取代官階限制。
- 事件池不採用每回合強制觸發；事件仍以地圖固定事件點形式生成。
- 事件完成後標記為 `resolved`，同一事件實例不可重複結算。
- 事件池中的高價值事件應限制每局數量，避免建築提供無限收益。

### 2.7.2 建築與事件池對應

| 建築 | 事件池 ID | 事件範例 | 主要價值 |
|------|-----------|----------|----------|
| 告示牌 | `board-events` | 失落的委託、緊急求援 | 任務、金錢、情報 |
| 道具商店 | `item-shop-events` | 補給商隊遇襲、中毒商隊 | 藥品與消耗品 |
| 裝備商店 | `equipment-shop-events` | 失竊的武器箱、商隊護送 | 裝備與裝備情報 |
| 武館 | `martial-hall-events` | 流亡武者的挑戰、武學殘篇 | 功法、經驗、門派內容 |
| 醫療室 | `infirmary-events` | 荒野救援站、疫病封鎖 | 聲望、治療、情報 |
| 建料倉庫 | `warehouse-events` | 失控的建材車隊、採集點危機 | 建料與據點發展 |
| 修理工坊 | `workshop-events` | 古代機關殘骸、損壞裝備回收 | 耐久、材料、裝備 |
| 強化城牆 | `wall-events` | 城牆裂口、古城防線 | 據點生命、防禦效果 |
| 防衛營 | `barracks-events` | 失散斥候隊、邊境警報 | Creature 情報、戰鬥收益 |
| 驛站 | `waystation-events` | 斷裂的商路、迷路商隊 | 移動、路線與事件情報 |
| 交易所 | `exchange-events` | 物資調度、荒野公開交易 | 跨據點資源轉換 |
| 總管府 | `regional-management-events` | 地方治理委託、區域糧荒 | 區域聲望、政策與長期收益 |

### 2.7.3 事件池生命週期

#### Stage 1：建築解鎖

- **Player Action**：玩家在據點完成建築建造或升級。
- **System Response**：對應事件池加入可用事件池清單。
- **State Change**：更新可用事件池，不立即強制生成事件。
- **Exception Handling**：建築被摧毀或失效時，尚未生成的事件不再從該事件池產生；已生成事件依事件規則處理。

#### Stage 2：事件生成

- **Player Action**：世界初始化或既有事件被移除後補充事件。
- **System Response**：從已解鎖事件池選擇符合條件的事件類型與位置。
- **State Change**：建立 `ExplorationEventState`，保存來源事件池與事件類型。
- **Exception Handling**：沒有符合條件的事件時不生成，不應生成無法完成的事件。

#### Stage 3：事件互動

- **Player Action**：玩家與事件所在格相同時開啟事件詳情。
- **System Response**：顯示事件池來源、官階要求、建築條件、其他需求與獎勵。
- **State Change**：不符合條件時保留事件為 `available`，僅將選項設為 disabled。
- **Exception Handling**：條件在確認前失效時，重新驗證並拒絕結算。

#### Stage 4：事件完成

- **Player Action**：玩家完成事件選項。
- **System Response**：結算獎勵、風險與世界反應。
- **State Change**：事件變為 `resolved`，事件池實例完成一次消耗。
- **Exception Handling**：事件池不得因 UI 重開、重複確認或回合切換而重複發放獎勵。

### 2.7.4 事件池與建築等級

建築等級可以用三種方式影響事件池：

| 建築狀態 | 事件池效果 |
|----------|------------|
| 建築存在 | 解鎖基礎事件池 |
| 建築等級 2 | 解鎖進階選項或提高事件獎勵 |
| 建築等級 3 以上 | 解鎖高價值事件或降低事件風險 |

事件池的建築條件應該使用可泛化資料模型，例如：

```ts
type EventPoolUnlock = {
  poolId: string
  buildingType: string
  minimumBuildingLevel: number
  minimumGovernanceRank?: number
}
```

事件實例應保存來源池，方便事件歷史、平衡分析與未來事件鏈使用：

```ts
type ExplorationEventState = {
  // ... 現有欄位 ...
  sourcePoolId?: string
}
```

目前 `sourcePoolId` 屬於規劃欄位，尚未加入程式型別。

### 2.8 事件池與事件選項的雙層解鎖

事件池與事件選項採用兩個不同層次的解鎖規則：

```text
建築存在
→ 解鎖事件池
→ 事件實例生成
→ 玩家與事件同格
→ 顯示基礎選項與條件選項
→ 依玩家建築、官階、屬性與世界狀態開放不同處理方式
```

#### 2.8.1 事件池解鎖

- 事件池條件決定事件是否可以生成在地圖上。
- 例如：擁有告示牌即可解鎖 `board-events`。
- 解鎖事件池不代表玩家可以使用該事件的所有選項。
- 事件池不應直接把所有獎勵都視為玩家可取得內容。

#### 2.8.2 事件選項解鎖

- 每個事件至少提供一個基礎選項，避免沒有對應建築的玩家完全無法處理事件。
- 高級選項透過 `requirements` 依其他建築、官階、屬性、物品或世界狀態解鎖。
- 未滿足條件的選項仍顯示在 modal 中，但必須 disabled，並顯示缺少條件。
- 高級選項應提供更高價值、較低風險或不同的資源轉換，而不是只增加相同獎勵的數值。
- 所有條件必須在玩家確認時重新驗證。

#### 2.8.3 事件選項層級

| 選項層級 | 條件 | 作用 | 獎勵定位 |
|----------|------|------|----------|
| 基礎選項 | 同格、玩家存活、有效回合 | 保證事件可被處理 | 基礎資源、少量聲望或經驗 |
| 建築選項 | 擁有指定建築 | 使用據點功能解決事件 | 中量資源、額外情報或降低風險 |
| 高級建築選項 | 指定建築 + 建築等級或官階 | 提供專業化處理方式 | 高價值資源、裝備或特殊結果 |
| 世界狀態選項 | 巢穴、前置事件或區域狀態 | 反映玩家對世界的影響 | 稀有獎勵、永久效果或事件鏈入口 |

#### 2.8.4 範例：告示牌事件池

`board-events` 可以由告示牌解鎖，但事件內的選項依玩家是否擁有防衛營而不同：

事件名稱：**失散斥候**

| 選項 | 條件 | 結果 |
|------|------|------|
| 提供基礎援助 | 玩家與事件同格、存活、目前回合有效 | 聲望 +5 |
| 帶回據點 | 基礎條件 + 擁有告示牌 | 金錢 +20、經驗 +10 |
| 派遣防衛營支援 | 基礎條件 + 擁有防衛營 | 金錢 +40、聲望 +15、獲得 Creature 情報 |
| 軍事反擊 | 基礎條件 + 防衛營 + 官階達標 | 金錢 +60、稀有情報或額外獎勵 |

此範例的設計重點：

- 告示牌負責解鎖 `board-events`，讓事件有機會生成。
- 防衛營不必另外解鎖一個完全獨立的事件，也可以解鎖同一事件中的高級選項。
- 沒有防衛營時，玩家仍可選擇基礎援助或帶回據點。
- 擁有更多建築代表玩家擁有更多解法，而不是單純增加事件數量。

#### 2.8.5 建築對事件選項的作用

| 建築 | 可解鎖的選項方向 |
|------|------------------|
| 告示牌 | 接受委託、回報情報、取得任務獎勵 |
| 道具商店 | 使用藥品、取得補給、交換消耗品 |
| 裝備商店 | 鑑定裝備、交易裝備、取得裝備獎勵 |
| 武館 | 切磋、學習功法、取得門派情報 |
| 醫療室 | 救治傷者、降低生命損失、取得聲望 |
| 建料倉庫 | 搬運建料、保存物資、提高建料收益 |
| 修理工坊 | 修復裝備、拆解機關、取得特殊材料 |
| 強化城牆 | 修復防線、降低據點風險、取得防禦效果 |
| 防衛營 | 派遣援軍、處理 Creature、取得軍事情報 |
| 驛站 | 清理商路、取得路線情報、降低移動成本 |
| 交易所 | 跨據點調度、公開交易、資源轉換 |
| 總管府 | 區域治理、政策介入、長期收益 |

## 3. 事件資料模型

### 3.1 事件狀態

```ts
type ExplorationEventStatus =
  | 'hidden'
  | 'available'
  | 'resolved'
  | 'expired'
```

- `hidden`：尚未被玩家發現。
- `available`：已發現，可以查看與互動。
- `resolved`：已完成，不可再次領取獎勵。
- `expired`：因回合或世界狀態失效。

### 3.2 EventPointState

```ts
type EventPointState = {
  id: string
  type: ExplorationEventType
  name: string
  description: string
  position: Position
  status: ExplorationEventStatus
  discovered: boolean
  expiresAtRound: number | null
}
```

實際程式型別名稱為 `ExplorationEventState`；事件狀態資料仍保留在 `GameState.explorationEvents`，完成後不刪除，供未來事件歷史與事件鏈使用。

### 3.3 事件類型

目前實作（`src/game/types.ts`）：

```ts
type ExplorationEventType =
  | 'lost-caravan'              // 失散商隊
  | 'wandering-merchant'        // 流浪商人
  | 'abandoned-shrine'          // 荒廢祠堂
  | 'resource-cache'            // 遺落物資箱
  | 'wandering-scholar'         // 遊方學者
  | 'beast-tracks'              // 異獸足跡
  | 'village-request'           // 村民求助
  | 'storm-shelter'             // 暴雨避難所
  | 'bandit-ransom'             // 山賊勒索
  | 'traveling-herbalist'       // 採藥郎中
  | 'strange-well'              // 奇異古井
  | 'ancient-ruins'             // 古代遺跡
  | 'wounded-traveler'          // 受傷旅人
```

規劃擴充：

```ts
type ExplorationEventType =
  // ... 現有 13 種 ...
  | 'tomb-treasure'             // 古墓秘寶（高階裝備）
  | 'martial-legacy'            // 武學傳承（技能學習）
  | 'secret-realm'              // 秘境入口（里程碑獎勵）
  | 'jianghu-challenge'         // 江湖挑戰賽（周期目標）
  | 'mysterious-altar'          // 神秘祭壇（未來）
  | 'abandoned-camp'            // 廢棄營地（未來）
  | 'blocked-road'              // 被封鎖的道路（未來）
```

## 4. 事件選項模型

```ts
type EventChoice = {
  id: string
  label: string
  description: string
  requirements: EventRequirement[]
  rewards: EventReward[]
  riskMessage?: string
  endsPlayerTurn: boolean
}
```

目前資料驅動實作位於：

- `src/game/events/eventCatalog.ts`：事件定義、選項、條件與效果。
- `src/game/events/eventResolver.ts`：條件判定與效果套用。

新增事件時，優先新增 `ExplorationEventDefinition`，避免在 `gameStore.ts` 增加事件專屬分支。

### 4.1 條件

目前已實作低階事件條件；中階與高階事件將逐步擴充跨系統條件：

```ts
type EventRequirement =
  | { type: 'same-cell-as-event' }
  | { type: 'active-player' }
  | { type: 'player-alive' }
  | { type: 'money-at-least'; amount: number }
  | { type: 'item-owned'; itemId: string; quantity: number }
  | { type: 'building-materials-at-least'; baseId: string; amount: number }
  | { type: 'building-exists'; baseId: string; buildingType: string }
  | { type: 'minimum-level'; level: number }
  | { type: 'attribute-at-least'; attribute: string; amount: number }
  | { type: 'minimum-governance-rank'; rank: number }
  | { type: 'event-resolved'; eventType: ExplorationEventType }
  | { type: 'any-nest-destroyed' }
  | { type: 'nest-destroyed'; nestId: string }
```

條件不足時：

- 選項 disabled。
- 顯示具體缺少條件。
- 不消耗行動、金錢、道具或回合。
- `same-cell-as-event`：玩家必須與事件位於同一格；目前所有探索事件統一採用此規則。
- `building-exists`：檢查指定據點是否擁有指定建築，例如洛陽的醫療室。
- `event-resolved`：檢查指定前置事件是否已完成。
- `any-nest-destroyed`：檢查是否至少有一個巢穴已被消滅。
- `nest-destroyed`：檢查指定巢穴是否已被消滅。
- `attribute-at-least` 與 `minimum-level`：用於角色成長型中階事件。

### 4.2 獎勵（效果）

目前資料驅動實作的 `EventEffect`（`src/game/events/eventCatalog.ts`）：

```ts
type EventEffect =
  | { type: 'money'; amount: number }
  | { type: 'prestige'; amount: number }
  | { type: 'item'; itemId: string; quantity: number }
```

規劃擴充的效果類型：

```ts
type EventEffect =
  | { type: 'money'; amount: number }
  | { type: 'prestige'; amount: number }
  | { type: 'item'; itemId: string; quantity: number }
  | { type: 'equipment'; equipmentId: string; quality?: 'common' | 'uncommon' | 'rare' }
  | { type: 'skill'; skillId: string; skillType: 'inner' | 'external' }
  | { type: 'health'; amount: number }
  | { type: 'stamina'; amount: number }
  | { type: 'inner-power'; amount: number }
  | { type: 'reveal-area'; radius: number }
  | { type: 'reveal-target'; targetType: 'creature' | 'nest' | 'resource-point'; targetId: string }
  | { type: 'explore-progress'; amount: number }  // 用於探索進度計算
```

**注意**：`EventEffect.type: 'equipment'` 目前尚未接入事件系統。`lootCatalog` 雖有定義（鐵劍、旅行長袍、玉佩），但事件選擇的 effects 無法觸發裝備掉落。Phase 2 優先解決此問題。

## 5. 失散商隊 MVP 規格

事件名稱：`失散商隊`

### 5.1 交易

- 條件：玩家與事件點同格、目前是玩家回合、玩家存款至少 10。
- 結果：金錢 `-10`，獲得 `stamina-potion` ×1。
- 回合：不結束玩家回合，作為低成本互動。

### 5.2 護送

- 條件：玩家與事件點同格、玩家存活。
- 結果：聲望 `+5`。
- 風險：目前尚未接入 Creature 威脅或事件點移動。
- 回合：結束玩家回合。

### 5.3 掠奪

- 條件：玩家與事件點同格、玩家存活。
- 結果：獲得 `health-potion` ×1，聲望 `-5`。
- 風險：目前尚未接入 Creature 行動或區域威脅。
- 回合：結束玩家回合。

## 6. 事件流程

### Stage 1：事件發現

- **Player Action**：玩家進入事件視野或使用情報揭示事件。
- **System Response**：事件由 `hidden` 轉為 `available`，顯示事件 marker。
- **State Change**：`discovered = true`，保存事件位置。
- **Exception Handling**：事件已 `resolved` 或 `expired` 時不可重新發現。

### Stage 2：開啟詳情

- **Player Action**：玩家點擊事件 marker。
- **System Response**：開啟事件詳情 modal，顯示背景、位置、狀態與選項。
- **State Change**：不改變回合與資源。
- **Exception Handling**：玩家未與事件同格時可以查看，但所有需要互動的選項 disabled。

### Stage 3：選擇選項

- **Player Action**：玩家選擇交易、護送或掠奪。
- **System Response**：從事件 catalog 取得選項，並再次驗證玩家、距離、資源與事件狀態。
- **State Change**：保存待執行選項，不先扣除資源。
- **Exception Handling**：預覽後條件失效時，拒絕執行且不改變事件狀態。

### Stage 4：確認選項

- **Player Action**：玩家按下確認。
- **System Response**：由 event resolver 套用資料定義的效果與事件狀態。
- **State Change**：事件變為 `resolved`，或依事件結果移動/變更狀態。
- **Exception Handling**：同一事件不能重複結算；所有資源變化必須在同一個 Store action 內完成。

### Stage 5：結果彈窗

- **Player Action**：玩家確認或關閉結果彈窗。
- **System Response**：顯示實際獎勵、消耗與風險結果。
- **State Change**：依 `ActionContinuation` 決定是否結束回合。
- **Exception Handling**：結果彈窗未確認前不得提前進入 Creature 回合。

## 7. UI 規範

### 7.1 Event marker

- class：`.event-point-marker`。
- 支援滑鼠點擊、Enter 與 Space。
- 點擊時 `stopPropagation`，避免誤觸地圖移動。
- Tooltip 顯示事件名稱與目前狀態。
- `hidden` 不渲染。
- `available` 顯示可互動狀態。
- `resolved` 保留於遊戲狀態，但從地圖移除 marker。
- `expired` 顯示失效狀態或移除。

### 7.2 EventDetailsModal

#### Component List

- 事件標題與圖示。
- 事件描述。
- 事件位置與距離。
- 事件狀態。
- 選項清單。
- 條件提示。
- 確認、取消與關閉按鈕。

#### States

- `open` / `closed`。
- `available` / `unavailable`。
- `choice-enabled` / `choice-disabled`。
- `resolved` / `expired`。
- `confirming` / `idle`。

#### Interaction Flow

```text
事件 marker
→ 事件詳情 modal
→ 選擇方案
→ 查看條件與預期成本
→ 確認方案
→ 實際結算
→ 結果彈窗
```

#### Error Handling

- 玩家未與事件同格：顯示事件資料，互動按鈕 disabled。
- 玩家已結束回合：所有需要行動的選項 disabled。
- 金錢/道具/建料不足：顯示具體缺少數量。
- 事件已完成：顯示「事件已完成」，禁止重複領取。
- 事件已失效：顯示「事件已失效」，禁止互動。
- 目標不存在：關閉或更新 modal，不執行錯誤獎勵。

### 7.3 結果彈窗

- 使用現有 `blockingModal` 與 `ActionContinuation`。
- 顯示實際扣除與獲得項目。
- 重大事件可使用 `end-player-turn` continuation。
- 未確認前不推進下一個 Creature 回合。

## 8. 與戰爭迷霧的關聯

- 未探索區域不顯示事件 marker。
- 事件進入玩家視野後由 `hidden` 轉為 `available`。
- 已發現事件可依規則保留位置記憶。
- 情報型事件可以揭示 Creature、巢穴或資源點。
- 事件獎勵可以暫時增加視野範圍或揭示指定區域。
- Debug 地圖使用 `revealed` 模式，方便測試事件流程。
- 詳細迷霧規格見 [`reports/fog-of-war-design.md`](fog-of-war-design.md)。

### 8.1 探索進度系統（規劃）

為解決玩家反饋「探索要素不夠」，規劃加入探索進度追蹤：

```ts
type ExplorationProgress = {
  totalRelevantCells: number      // 可探索格子總數
  exploredCellIds: string[]       // 已探索格子（與 visibility.exploredCellIds 共用）
  discoveredEventIds: string[]    // 已發現事件 ID
  milestonesReached: number[]     // 已達成里程碑 [10, 25, 50, 75, 100]
}
```

#### 里程碑獎勵表

| 探索進度 | 獎勵 | 解鎖內容 |
|----------|------|----------|
| 10% | 金錢 50 + 療傷藥 ×3 | 顯示「古墓秘寶」事件類型 |
| 25% | 稀有裝備 ×1 + 聲望 30 | 顯示「秘境入口」事件類型 |
| 50% | 高階裝備 ×1 + 技能書 ×1 | 顯示「武學傳承」事件類型 |
| 75% | 傳奇道具 ×1 + 聲望 100 | 解鎖隱藏事件提示系統 |
| 100% | 傳奇裝備 ×1 + 大量聲望 | 全圖完成成就 |

#### 環境提示系統（規劃）

當玩家靠近隱藏事件時，根據距離顯示不同強度的提示：

```ts
type HintLevel = 'none' | 'whisper' | 'hint' | 'clear'

// 距離 → 提示對應
// - 50 格外：'none' — 無提示
// - 30 格外：'whisper' — 「似乎聽到遠方傳來人聲…」
// - 15 格外：'hint' — 「東方有被遺忘的痕迹」
// - 5 格內：'clear' — 事件名稱顯示
```

## 9. 與現有系統的關聯

- **道具**：受傷旅者可消耗藥品；商隊事件可提供消耗品。
- **裝備**：商隊或高風險事件可提供裝備實例。
- **功法**：高風險事件可提供功法，但不應普遍取代巢穴獎勵。
- **建築**：被封鎖道路可消耗建料；瞭望塔可增加事件發現範圍。
- **Creature**：掠奪或祭壇可能提高 Creature 威脅。
- **據點**：事件可提供任務、金錢或聲望，形成回據點的動機。
- **NPC 系統**：目前只透過事件模擬商隊與旅者，不建立獨立 NPC 狀態。
- **裝備耐久**：重大護送或風險事件可消耗裝備耐久，但 MVP 先避免跨系統隱性扣除。

## 10. 分階段開發

### Phase 1：資料與固定事件

- 新增 `EventPointState`。
- 新增 `ExplorationEventType` 與狀態。
- 建立固定的失散商隊事件。
- 新增事件點 marker。
- 新增事件詳情 modal。
- **狀態：已完成。**

### Phase 2：選項與結算

- 實作交易、護送、掠奪三個選項。
- 加入條件檢查與選項 disabled 狀態。
- 接入道具、金錢、聲望與裝備實例獎勵。
- 接入 Action Continuation。
- **狀態：已完成。**
- **補充：** 目前效果已透過 `eventCatalog.ts` 與 `eventResolver.ts` 資料驅動；裝備獎勵尚未在失散商隊中啟用。

### Phase 2：裝備掉落與獎勵深度（下一步）

- 擴充 `EventEffect` 類型，加入 `{ type: 'equipment' }`。
- 修改 `eventResolver.ts` 處理裝備效果。
- 修改 `actionResultFormatters.ts` 顯示裝備獲得提示。
- 將 `lootCatalog` 裝備實際接入至少 2 個高階事件（古墓秘寶、古代遺跡）。
- 設計獎勵分層結構（事件等級 1～6 對應不同獎勵品質）。
- **狀態：規劃中。**

### Phase 3：探索進度與環境提示

- 實作 `ExplorationProgress` 類型與進度計算。
- 加入里程碑判定與獎勵發放。
- 實作環境提示系統（距離感營造）。
- UI 加入探索進度條與事件日誌。
- **狀態：規劃中。**

### Phase 4：中階事件類型

- 實作「古墓秘寶」事件（裝備掉落）。
- 實作「武學傳承」事件（技能學習）。
- 接入據點建築、角色屬性、前置事件與巢穴狀態條件。
- 同格可查看事件；條件不足時顯示缺少條件並 disabled 結算選項。
- **狀態：規劃中，優先級提高。**

### Phase 5：高階事件類型

- 實作「秘境入口」事件（里程碑解鎖）。
- 實作「江湖挑戰賽」事件（周期目標）。
- **狀態：規劃中。**

### Phase 6：世界反應與事件鏈

- 加入事件期限與 `expired` 狀態。
- 加入 Creature 威脅與區域狀態變化。
- 加入事件鏈與前置條件。
- 加入事件記錄與結果回顧。
- 每回合最多觸發一個主要世界事件。
- **狀態：未開始。**

### Phase 7：NPC 系統（未來）

- 加入 NPC、商隊與中立據點互動。
- 可跨回合移動的 NPC。
- NPC 好感度與關係。
- NPC 長期商店庫存。
- NPC 招募、傭兵與任務鏈系統。

本階段的商隊互動仍以事件選項呈現；獨立 NPC 系統不在目前版本範圍內。

## 11. 測試與驗收

### 純函式測試

- 已完成：
  - 同格/非同格判定（`targetRules.ts`）。
  - 選項條件判定（`eventResolver.ts`）。
  - 金錢/聲望/道具效果套用（`eventResolver.ts`）。
  - 探索事件目錄結構（`eventCatalog.test.ts`）。
  - 探索事件生成器（`eventSpawner.test.ts`）。
  - 探索事件互動流程（`eventInteraction.test.ts`）。
- 待完成：
  - 事件狀態轉換獨立測試。
  - 事件期限判定。
  - 隨機事件生成測試。
  - 裝備效果套用測試（Phase 2）。
  - 探索進度計算測試（Phase 3）。

### Action 測試

- 非同格只能查看，不能結算。
- 金錢不足時交易失敗且不扣資源。
- 道具不足時救治失敗且事件不變更。
- 同一事件只能結算一次。
- 不同選項產生不同狀態結果。
- 結果彈窗確認前不結束回合。
- `resolved` 與 `expired` 事件不可再次互動。
- 裝備效果套用正確性（Phase 2）。
- 探索進度更新正確性（Phase 3）。

### UI 測試

- Marker 點擊與鍵盤 Enter/Space。
- 點擊 marker 不觸發地圖移動。
- 選項 disabled 狀態。（目前 modal 顯示同格與事件狀態限制；逐項條件原因提示待補。）
- 結果彈窗顯示實際成本與獎勵。
- 探索進度條顯示（Phase 3）。
- 環境提示訊息顯示（Phase 3）。
- 事件日誌列表顯示（Phase 3）。

### 驗收指令

```text
npm test
npm run lint
npm run build
```

## 12. 平衡風險

- 事件獎勵過強可能取代戰鬥、採集與任務。
- 高報酬事件必須附帶資源、回合、聲望或 Creature 風險。
- 永久功法獎勵應保留給高風險事件，避免成長曲線過快。
- 每回合最多觸發一個主要事件，避免資訊過載。
- 事件選項必須有不同結果，避免只有文字差異。
- 事件不得無預警摧毀玩家核心進度。

## 13. 專案追蹤

| Task Item | Owner | Status | Priority | Notes |
|---|---|---|---|---|
| 新增 `ExplorationEventState` | Gameplay | Done | High | 已完成 |
| 建立失散商隊固定事件 | Game Design / Gameplay | Done | High | 已完成 |
| 新增事件 marker 與詳情 modal | Frontend | Done | High | 已完成 |
| 建立事件 catalog 與 resolver | Gameplay | Done | High | 已完成 |
| 實作事件選項條件 | Gameplay | Done | High | 已完成 |
| 接入事件獎勵與成本 | Gameplay | Done | High | 已完成（僅 money/prestige/item） |
| 接入結果彈窗 continuation | Gameplay | Done | High | 已完成 |
| 擴充事件目錄至 13 種 | Gameplay | Done | High | 已完成 |
| 建立事件生成器 | Gameplay | Done | High | eventSpawner.ts |
| 建立視覺規則 | Gameplay | Done | High | visibilityRules.ts |
| 擴充 EventEffect 支援裝備 | Gameplay | Planned | High | Phase 2 優先 |
| 接入 lootCatalog 裝備到事件 | Gameplay | Planned | High | Phase 2 優先 |
| 定義探索事件分級規則 | Game Design | Planned | High | 官階 1～6 |
| 實作古墓秘寶事件 | Game Design / Gameplay | Planned | High | 中階；高獎勵裝備 |
| 實作武學傳承事件 | Game Design / Gameplay | Planned | High | 中階；技能學習 |
| 定義官階對應的六級事件規則 | Game Design | Planned | High | 官階 1～6 |
| 擴充跨系統事件條件 | Gameplay | Planned | High | 建築、屬性、前置事件、巢穴、官階 |
| 建立事件選項分層規則 | Game Design / Gameplay | Planned | High | 基礎選項與高級建築選項 |
| 實作事件選項 disabled 原因 | Frontend | Planned | Medium | 顯示缺少的建築或條件 |
| 實作探索進度系統 | Gameplay | Planned | Medium | Phase 3 |
| 實作里程碑獎勵 | Gameplay | Planned | Medium | Phase 3 |
| 實作環境提示系統 | Frontend / Gameplay | Planned | Medium | Phase 3 |
| 事件條件逐項原因提示 | Frontend | Planned | Medium | Modal 優化 |
| 增加事件鏈與事件期限 | Game Design / Gameplay | Planned | Medium | Phase 5 |
| 增加 Creature 世界反應 | Gameplay | Planned | Medium | Phase 5 |
| 建立獨立 NPC 系統 | Gameplay | Deferred | Low | 未來擴充 |

## 15. 與主規劃文件的關聯

- 主規劃：[`reports/game-design-master-plan.md`](game-design-master-plan.md)
- 戰爭迷霧規格：[`reports/fog-of-war-design.md`](fog-of-war-design.md)
- 玩家反饋：[`reports/bug.md`](bug.md)
- 本文件負責探索事件的資料模型、流程、UI、條件、獎勵與驗收標準。
- 主規劃文件負責整體遊戲方向、系統閉環與優先級。

---

## 附錄 A：玩家反饋對應表

| 玩家反饋 | 根本原因 | 解決方案 | 對應 Phase |
|----------|----------|----------|------------|
| "覺得目前可以做的事情比較少" | 獎勵單調，只有金錢/聲望/藥品；裝備掉落未接入 | Phase 2：擴充 EventEffect、接入 lootCatalog | Phase 2 |
| "節奏有點慢" | 事件數量少且無重複價值；缺乏階段性目標 | Phase 3：探索進度 + 里程碑；Phase 4：周期事件 | Phase 3, 4 |
| "緊張感不足" | 威脅密度太低；高階事件不足 | Phase 4：古墓秘寶、秘境入口等高報酬事件 | Phase 4 |
| "探索要素不夠" | 無進度追蹤、無環境提示、無收集慾望驅動 | Phase 3：探索進度系統 + 環境提示 | Phase 3 |

## 附錄 B：事件難度分層設計

| 層級 | 事件範圍 | 獎勵品質 | 風險等級 | 建議數量佔比 |
|------|----------|----------|----------|-------------|
| 等級 1～2 | 流浪商人、遺落物資箱、遊方學者等 | 基礎藥品、少量金錢 | 低 | 目前已實作 |
| 等級 3～4 | 古墓秘寶、武學傳承、江湖挑戰賽等 | 裝備、功法、經驗 | 中 | 中階事件優先 |
| 等級 5～6 | 秘境入口及終局事件 | 稀有能力、永久效果、劇情獎勵 | 高 | 後續擴充 |
