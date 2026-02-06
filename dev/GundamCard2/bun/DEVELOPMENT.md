# GundamCard2 開發文檔

## 📋 目錄

- [專案概述](#專案概述)
- [技術棧](#技術棧)
- [專案結構](#專案結構)
- [核心概念](#核心概念)
- [遊戲系統](#遊戲系統)
- [開發指南](#開發指南)
- [API文檔](#api文檔)
- [測試](#測試)
- [部署](#部署)

---

## 專案概述

GundamCard2 是一個基於 **Bun + TypeScript + React** 的鋼彈卡牌遊戲引擎，實現了：

- ✅ 完整的卡牌遊戲規則引擎
- ✅ 效果堆疊與優先權系統
- ✅ AI對戰（遺傳演算法）
- ✅ 即時多人對戰（WebSocket）
- ✅ React前端介面
- ✅ 狀態持久化

---

## 技術棧

### 後端
- **Bun** - JavaScript 運行時
- **TypeScript** - 類型安全
- **Node.js HTTP** - Web 伺服器
- **WebSocket (ws)** - 即時通訊

### 前端
- **React 18** - UI 框架
- **React Context API** - 狀態管理
- **RxJS Subject** - 事件流

### 工具庫
- **Ramda** - 函數式編程
- **JSON** - 卡片資料格式

---

## 專案結構

```
src/
├── index.ts                      # 測試入口
├── web.tsx                       # 前端入口
├── ws.ts                         # WebSocket 伺服器
├── game/                         # 🎮 遊戲核心邏輯
│   ├── define/                   # 資料結構定義
│   │   ├── Card.ts              # 卡片實例
│   │   ├── CardPrototype.ts     # 卡片原型
│   │   ├── CardText.ts          # 卡片文本與效果定義
│   │   ├── Effect.ts            # 效果系統
│   │   ├── BaSyou.ts            # 場所系統
│   │   ├── GameEvent.ts         # 遊戲事件
│   │   ├── GlobalEffect.ts      # 全域效果
│   │   ├── Timing.ts            # 時點與階段
│   │   └── ...
│   ├── gameState/               # 遊戲狀態邏輯
│   │   ├── GameState.ts         # 狀態定義
│   │   ├── CardTableComponent.ts    # 卡片管理
│   │   ├── ItemTableComponent.ts    # 物件位置管理
│   │   ├── EffectStackComponent.ts  # 效果堆疊
│   │   ├── doEffect.ts          # 效果執行
│   │   ├── createPlayCardEffects.ts # 打出卡片效果
│   │   ├── createAttackPhaseRuleEffect.ts  # 攻擊規則
│   │   ├── player.ts            # 玩家操作
│   │   ├── battleGroup.ts       # 戰鬥群組
│   │   ├── card.ts              # 卡片查詢
│   │   └── ...
│   ├── gameStateWithFlowMemory/ # 流程控制系統
│   │   ├── GameStateWithFlowMemory.ts  # 帶流程記憶的狀態
│   │   ├── Flow.ts              # 指令定義
│   │   ├── queryFlow.ts         # 查詢可用指令
│   │   ├── applyFlow.ts         # 執行指令
│   │   └── ai/                  # AI實作
│   ├── ai/                      # AI演算法
│   │   └── SelectBattleGroupGene.ts  # 戰鬥群組遺傳演算法
│   └── bridge/                  # 橋接層
├── client/                      # 🖥️ 前端元件
│   ├── component/
│   │   ├── AppView.tsx          # 根元件
│   │   ├── TableView.tsx        # 遊戲桌面
│   │   ├── CardView.tsx         # 卡片顯示
│   │   ├── HandView.tsx         # 手牌區
│   │   ├── ControlView.tsx      # 控制面板
│   │   ├── PlayerController.tsx # 玩家控制器
│   │   └── ...
│   ├── define/
│   │   └── GameContext.ts       # 遊戲上下文
│   └── tool/
│       └── appContext/          # Context API 封裝
├── server/                      # 🚀 HTTP 伺服器
│   └── index.ts                 # RESTful API
├── script/                      # 📦 資料載入
│   ├── index.ts                 # 卡片資料載入器
│   ├── bridge.ts                # 橋接定義
│   └── data/                    # JSON 卡片資料
├── debug/                       # 🧪 測試案例
│   ├── index.ts                 # 測試集合
│   ├── test179xxx_*.ts          # 特定卡片測試
│   ├── testPlayChar.ts          # 角色打出測試
│   ├── testAttackRuleEffect.ts  # 攻擊規則測試
│   └── ...
└── tool/                        # 🔧 工具函數
    ├── logger.ts                # 日誌系統
    ├── logicTree.ts             # 邏輯樹
    ├── ItemGroup.ts             # 物件分組
    ├── table/                   # 位置表系統
    └── optalg/                  # 優化演算法
```

---

## 核心概念

### 1. 場所系統 (BaSyou)

卡片在遊戲中的位置管理。

#### 場所類型

| 場所 | 日文 | 說明 |
|------|------|------|
| 牌庫 | 本国 | 生命值，耗盡即敗北 |
| 手牌 | 手札 | 玩家手中的卡片 |
| 配備區 | 配備エリア | 已配備但未出戰的單位 |
| 地球戰鬥區 | 戦闘エリア1 | 地球戰場 |
| 宇宙戰鬥區 | 戦闘エリア2 | 宇宙戰場 |
| G區 | Gゾーン | 資源/代價區 |
| 棄牌堆 | 捨て山 | 廢棄的卡片 |
| 機庫 | ハンガー | 暫存區 |
| 廢棄區 | ジャンクヤード | 永久移除 |

#### 場所定義

```typescript
// 絕對場所：[玩家ID, 場所關鍵字]
type AbsoluteBaSyou = {
  id: "AbsoluteBaSyou";
  value: [PlayerID, BaSyouKeyword];
};

// 相對場所：用於卡片效果描述
type RelatedBaSyou = {
  id: "RelatedBaSyou";
  value: [RelatedPlayerSideKeyword, BaSyouKeyword];
};
```

### 2. 卡片系統

#### 卡片原型 (CardPrototype)

靜態卡片資料，從 JSON 載入：

```typescript
type CardPrototype = {
  id: string;              // "179015_04B_U_BK058R_black"
  title: string;           // 卡片名稱
  category: CardCategory;  // 類別：ユニット、キャラクター等
  color: CardColor;        // 顏色：緑、茶、青、白、紫、黒、赤
  totalCost: number;       // 總費用
  rollCost: RollCostColor[]; // 打開費用
  battlePoint: BattlePoint; // 戰鬥力 [近戰, 中距, 遠距]
  battleArea: BattleAreaKeyword[]; // 可出戰區域
  texts: CardText[];       // 效果文本
  characteristic: string;  // 特徵
  gsign: GSign;           // G標記
  // ...
};
```

#### 卡片實例 (Card)

遊戲中的卡片實例：

```typescript
type Card = {
  id: string;         // 唯一ID
  ownerID: string;    // 擁有者
  protoID: string;    // 原型ID
  isRoll: boolean;    // 是否處於打開狀態
  isFaceDown: boolean; // 是否蓋著
};
```

### 3. 效果系統

所有遊戲行動都建模為效果。

#### 效果結構

```typescript
type Effect = {
  id: string;              // 唯一ID
  reason: EffectReason;    // 效果來源
  text: CardText;          // 效果內容
  description?: string;    // 描述（調試用）
  isOption?: boolean;      // 是否為可選效果
};

type EffectReason =
  | ["場に出る", PlayerID, CardID]                    // 進場效果
  | ["PlayCard", PlayerID, CardID, PlayOptions]      // 打出卡片
  | ["PlayText", PlayerID, CardID, TextID]           // 使用效果
  | ["GameRule", PlayerID | null, RuleOptions]       // 規則效果
  | ["Destroy", PlayerID, CardID, DestroyReason]     // 破壞
  | ["Situation", PlayerID, CardID, Situation]       // 狀況效果
  | ["Event", PlayerID, CardID, GameEvent];          // 事件觸發
```

#### 效果執行流程

```
1. 創建效果 → 2. 加入堆疊 → 3. 等待時機 → 4. 解析條件 → 5. 執行動作 → 6. 移除
```

### 4. CardText 系統

卡片效果的核心定義。

```typescript
type CardText = {
  id: string;
  title: TextTitle[];           // 效果標題
  condition?: Condition;        // 觸發條件
  actions?: Action[];           // 執行動作
  specialEffect?: TextSpeicalEffect; // 特殊能力
  // ...
};

// 條件範例
type Condition = {
  id: "Condition";
  require?: LogicTree<Condition>; // 需求樹
  cost?: LogicTree<Condition>;    // 費用
  target?: LogicTree<Condition>;  // 目標
  // ...
};

// 動作範例
type Action = {
  title: ActionTitle;
  vars?: string[];                // 變數
  isSelectAllCardInSetGroup?: string[]; // 選擇整組
  isSkipTargetMissingError?: boolean;   // 跳過目標缺失錯誤
};
```

### 5. Flow 系統

玩家操作的指令系統。

```typescript
type Flow =
  | FlowUpdateCommand          // 更新可用指令
  | FlowTriggerTextEvent       // 觸發文本事件
  | FlowNextTiming             // 進入下一時點
  | FlowSetActiveEffectID      // 設定當前效果
  | FlowDoEffect               // 執行效果
  | FlowPassPhase              // 結束階段
  | FlowSetTipSelection        // 設定選項
  | FlowMakeDestroyOrder       // 決定破壞順序
  // ...更多指令

// 遊戲循環
function gameLoop(ctx: GameStateWithFlowMemory, playerID: PlayerID) {
  while (!isGameOver(ctx)) {
    const flows = queryFlow(ctx, playerID);  // 查詢可用指令
    const selectedFlow = selectFlow(flows);   // 玩家/AI選擇
    ctx = applyFlow(ctx, playerID, selectedFlow); // 執行指令
  }
}
```

### 6. 遊戲狀態

#### GameState

```typescript
type GameState = {
  // 核心數據
  cards: { [id: string]: Card };          // 所有卡片
  table: ItemTable;                        // 位置映射表
  itemStates: { [id: string]: ItemState }; // 物件狀態
  
  // 效果系統
  effects: { [id: string]: Effect };       // 所有效果
  immediateEffect: string[];               // 立即效果堆疊
  stackEffect: string[];                   // 堆疊效果
  destroyEffect: string[];                 // 破壞效果
  commandEffects: Effect[];                // 指令效果
  globalEffectPool: { [key: string]: GlobalEffect[] }; // 全域效果池
  
  // 遊戲資訊
  phase: Phase;                            // 當前階段
  activePlayerID: PlayerID;                // 當前玩家
  turn: number;                            // 回合數
  playerStates: { [id: string]: PlayerState }; // 玩家狀態
  
  // 其他
  coins: { [id: string]: Coin };           // 指示物
  messages: Message[];                     // 訊息記錄
  // ...
};
```

#### GameStateWithFlowMemory

帶流程記憶的擴展狀態：

```typescript
type GameStateWithFlowMemory = GameState & {
  flowMemory: {
    state: "prepareDeck" | "whoFirst" | "draw6AndConfirm" | "playing";
    hasTriggerEvent: boolean;
    hasPlayerPassPhase: { [playerID: string]: boolean };
    hasPlayerPassCut: { [playerID: string]: boolean };
    hasPlayerPassPayCost: { [playerID: string]: boolean };
    shouldTriggerStackEffectFinishedEvent: boolean;
    activeEffectID: string | null;
    activeLogicID: number | null;
    activeLogicSubID: number | null;
  };
  stackEffectMemory: Effect[];
};
```

---

## 遊戲系統

### 階段系統

遊戲分為多個階段，每階段有特定規則：

```typescript
type Phase = 
  | ["整備フェイズ", "整備ステップ", "規定の効果"]
  | ["ドローフェイズ", "ドローステップ", "規定の効果"]
  | ["配備フェイズ", "配備ステップ", "タイミング"]
  | ["戦闘フェイズ", "攻撃ステップ", "規定の効果" | "タイミング"]
  | ["戦闘フェイズ", "ダメージステップ", "規定の効果"]
  | ["戦闘フェイズ", "リターンステップ", "規定の効果"]
  | ["終了フェイズ", "終了ステップ", "規定の効果" | "タイミング"];
```

#### 階段流程

```
1. 整備階段：打開所有卡片，移除臨時效果
2. 抽牌階段：抽2張牌
3. 配備階段：打出單位、角色、指令等
4. 戰鬥階段：
   a. 攻擊步驟：宣告出戰、使用效果
   b. 傷害步驟：計算戰鬥結果
   c. 回歸步驟：單位返回配備區
5. 結束階段：手牌上限、回合結束效果
```

### 戰鬥系統

#### 戰鬥群組 (BattleGroup)

```typescript
type BattleGroup = {
  rootID: string;           // 群組根卡片
  setIDs: string[];         // 群組內所有卡片
  battlePoint: BattleBonus; // [近戰, 中距, 遠距]
  hasA: boolean;            // 是否有ACE
};

// 戰鬥群組形成規則
// 1. 同色單位+角色可組隊
// 2. ACE自動成為獨立群組
// 3. 戰鬥力相加
```

#### 戰鬥計算

```typescript
function calculateBattle(
  attackerGroup: BattleGroup,
  defenderGroup: BattleGroup,
  battleArea: "地球" | "宇宙"
): BattleResult {
  // 1. 判定距離（近戰、中距、遠距）
  // 2. 比較對應戰鬥力
  // 3. 失敗方受傷害
  // 4. 處理破壞效果
}
```

### 效果堆疊

#### 堆疊類型

1. **立即效果 (ImmediateEffect)**: 立即解決，不可回應
2. **堆疊效果 (StackEffect)**: 先進後出，可插入回應
3. **破壞效果 (DestroyEffect)**: 破壞觸發的效果

#### 優先權系統

```typescript
// 回應時點 (タイミング)
// 1. 主動玩家優先使用效果
// 2. 對方玩家可回應（插入效果）
// 3. 雙方均不回應時解決頂端效果
// 4. 重複直到堆疊清空
```

### 費用系統

#### 費用類型

1. **打開費用 (RollCost)**: 打出卡片時支付
2. **總費用 (TotalCost)**: 用於判定卡片等級

#### 支付流程

```typescript
// 1. 選擇要打開的G區卡片
// 2. 檢查顏色符合
// 3. 執行打開動作
// 4. 若費用不足則取消
```

### AI 系統

#### 遺傳演算法戰鬥群組選擇

```typescript
class SelectBattleGroupGene implements IGene {
  ctx: GameState;
  score: number;
  
  // 適應度函數
  calcFitness(): number {
    // 評估戰鬥力、場面控制、手牌優勢等
  }
  
  // 突變：隨機調整單位配置
  mutate(): SelectBattleGroupGene {
    // 隨機將單位移動到戰鬥區或收回
  }
  
  // 交叉：混合兩個基因
  crossover(other: SelectBattleGroupGene): SelectBattleGroupGene {
    // 混合兩個方案的部分配置
  }
}

// 使用遺傳演算法尋找最佳戰鬥配置
const bestConfig = geneticAlgorithm({
  population: 100,
  generations: 50,
  geneFactory: () => createRandomGene(gameState),
});
```

---

## 開發指南

### 環境設置

```bash
# 安裝 Bun
curl -fsSL https://bun.sh/install | bash

# 安裝依賴
bun install

# 安裝必要套件
bun add react react-dom @types/react @types/react-dom
bun add ramda @types/ramda
bun add ws @types/ws
```

### 啟動專案

```bash
# 執行測試
bun run src/index.ts

# 啟動 HTTP 伺服器 (預設 port 3000)
bun run src/server/index.ts

# 啟動 WebSocket 伺服器 (預設 port 8080)
bun run src/ws.ts

# 前端開發（需要配合伺服器）
# 1. 先啟動伺服器
# 2. 開啟 web.html 或配置 Vite/Webpack
bun run src/web.tsx
```

### 新增卡片

#### 1. 準備 JSON 資料

在 `src/script/data/{prodid}.json`:

```json
{
  "data": [
    {
      "id": "179015_04B_U_BK058R_black",
      "info_2": "ガンダムMk-II（エゥーゴ仕様）",
      "info_3": "ユニット",
      "info_4": "4",
      "info_5": "●●黒黒",
      "info_6": "Z",
      "info_7": "3",
      "info_8": "2",
      "info_9": "1",
      "info_10": "宇宙/地球",
      "info_11": "MS",
      "info_12": "【自】：このカードが戦場に出た時...",
      "info_15": "描述文字",
      "info_16": "179015",
      "info_17": "R",
      "info_18": "黒",
      "info_25": "04B_U_BK058R_black"
    }
  ]
}
```

#### 2. 測試卡片載入

```typescript
// src/debug/test179015_04B_U_BK058R_black.ts
export async function test179015_04B_U_BK058R_black() {
  await loadPrototype("179015_04B_U_BK058R_black");
  
  let ctx = createGameStateWithFlowMemory();
  ctx = createCardWithProtoIds(
    ctx,
    AbsoluteBaSyouFn.of(PlayerA, "手札"),
    ["179015_04B_U_BK058R_black"]
  );
  
  // 測試打出
  const flows = queryFlow(ctx, PlayerA);
  console.log("可用指令:", flows);
  
  // 執行打出
  const playFlow = flows.find(f => f.id === "FlowSetActiveEffectID");
  if (playFlow) {
    ctx = applyFlow(ctx, PlayerA, playFlow);
  }
  
  // 驗證結果
  const cardInBa = getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "配備エリア"));
  if (cardInBa.length !== 1) {
    throw new Error("卡片未正確打出");
  }
}
```

#### 3. 實作特殊效果

如果卡片有特殊效果，在對應的系統檔案中實作：

```typescript
// src/game/gameState/createPlayCardEffects.ts
export function createPlayCardEffects(ctx: GameState, card: Card): Effect[] {
  const proto = getPrototype(card.protoID);
  
  // 解析卡片文本
  if (proto.texts) {
    return proto.texts.map(text => ({
      id: generateID(),
      reason: ["PlayCard", card.ownerID, card.id, {}],
      text: text,
    }));
  }
  
  return [];
}
```

### 新增效果類型

#### 1. 定義 ActionTitle

在 `src/game/define/CardText.ts`:

```typescript
export type ActionTitle =
  | string
  | ["_ロールする", "ロール" | "リロール" | "打開"]
  | ["_カード_１枚を引く", number]
  | ["新效果類型", 參數1, 參數2] // 新增這行
  // ...
```

#### 2. 實作效果處理

在 `src/game/gameState/doEffect.ts`:

```typescript
export function doAction(
  ctx: GameState,
  effect: Effect,
  action: Action,
  vars: { [key: string]: any }
): GameState {
  const [keyword, ...args] = action.title;
  
  switch (keyword) {
    case "新效果類型": {
      const [param1, param2] = args;
      // 實作效果邏輯
      return ctx;
    }
    // ...其他效果
  }
}
```

### 除錯技巧

#### 1. 使用日誌系統

```typescript
import { logCategory } from "../tool/logger";

logCategory("GameLoop", "當前階段", ctx.phase);
logCategory("Effect", "執行效果", effect);
```

#### 2. 檢查狀態快照

伺服器會自動保存狀態到 `__gameState.json`：

```bash
cat __gameState.json | jq '.cards'
```

#### 3. 單元測試

```typescript
// 隔離測試特定邏輯
export async function testSpecificLogic() {
  // 1. 創建初始狀態
  let ctx = createGameStateWithFlowMemory();
  
  // 2. 設定場景
  ctx = setupTestScenario(ctx);
  
  // 3. 執行操作
  ctx = executeAction(ctx);
  
  // 4. 驗證結果
  assertResult(ctx);
}
```

#### 4. 使用 TypeScript 類型檢查

```bash
# 檢查類型錯誤
bun run tsc --noEmit

# 或在編輯器中啟用嚴格模式
```

---

## API 文檔

### HTTP API (server/index.ts)

#### GET /api/state

取得當前遊戲狀態

**回應:**
```json
{
  "cards": {},
  "table": {},
  "phase": ["配備フェイズ", "配備ステップ", "タイミング"],
  "activePlayerID": "PlayerA"
}
```

#### POST /api/command

查詢玩家可用指令

**請求:**
```json
{
  "playerId": "PlayerA"
}
```

**回應:**
```json
{
  "flows": [
    {
      "id": "FlowSetActiveEffectID",
      "effectID": "effect_123",
      "description": "打出ガンダム"
    }
  ]
}
```

#### POST /api/apply

執行指令

**請求:**
```json
{
  "playerId": "PlayerA",
  "flow": {
    "id": "FlowSetActiveEffectID",
    "effectID": "effect_123"
  }
}
```

**回應:**
```json
{
  "success": true,
  "newState": {}
}
```

#### POST /api/new

開始新遊戲

**請求:**
```json
{
  "deckA": ["card1", "card2", ...],
  "deckB": ["card1", "card2", ...]
}
```

#### GET /api/save

儲存當前遊戲狀態到 `__gameState.json`

#### GET /api/load

從 `__gameState.json` 載入遊戲狀態

### WebSocket API (ws.ts)

#### 連線

```javascript
const ws = new WebSocket('ws://localhost:8080');

ws.onopen = () => {
  console.log('已連線');
};
```

#### 接收狀態更新

```javascript
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  switch(data.type) {
    case 'state':
      // 更新遊戲狀態
      updateGameState(data.state);
      break;
    case 'flows':
      // 更新可用指令
      updateAvailableFlows(data.flows);
      break;
  }
};
```

#### 發送指令

```javascript
ws.send(JSON.stringify({
  type: 'apply',
  playerId: 'PlayerA',
  flow: {
    id: 'FlowSetActiveEffectID',
    effectID: 'effect_123'
  }
}));
```

---

## 測試

### 執行所有測試

```bash
bun run src/index.ts
```

### 執行特定測試

```typescript
// src/debug/index.ts
export async function tests() {
  // 註解掉不需要的測試
  // await test179001_01A_CH_WT007R_white();
  await test179015_04B_U_BK058R_black(); // 只執行這個
}
```

### 測試結構

```typescript
export async function testCardName() {
  // 1. 載入卡片原型
  await loadPrototype("card_id");
  
  // 2. 創建遊戲狀態
  let ctx = createGameStateWithFlowMemory();
  
  // 3. 設定初始場景
  ctx = createCardWithProtoIds(ctx, basyou, cards);
  ctx = setPhase(ctx, phase);
  ctx = setActivePlayerID(ctx, player);
  
  // 4. 執行操作
  let flows = queryFlow(ctx, player);
  ctx = applyFlow(ctx, player, selectedFlow);
  
  // 5. 驗證結果
  if (someCondition) {
    throw new Error("測試失敗");
  }
  
  console.log("✓ 測試通過");
}
```

### 測試案例範例

```typescript
// 測試卡片進場效果
export async function testEnterBattleFieldEffect() {
  await loadPrototype("179015_04B_U_BK058R_black");
  
  let ctx = createGameStateWithFlowMemory();
  ctx = createCardWithProtoIds(
    ctx,
    AbsoluteBaSyouFn.of(PlayerA, "本国"),
    ["179015_04B_U_BK058R_black"]
  );
  
  // 模擬從本國移到場上
  const cardId = getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "本国"))[0];
  ctx = doItemMove(
    ctx,
    EffectFn.createGameRule(PlayerA),
    AbsoluteBaSyouFn.of(PlayerA, "配備エリア"),
    createStrBaSyouPair(ctx, cardId),
    {}
  );
  
  // 檢查進場效果是否觸發
  const immediateEffects = getImmediateEffects(ctx);
  if (immediateEffects.length === 0) {
    throw new Error("進場效果未觸發");
  }
  
  console.log("✓ 進場效果測試通過");
}
```

---

## 部署

### 生產環境配置

```bash
# 設定環境變數
export NODE_ENV=production
export PORT=3000
export WS_PORT=8080

# 啟動服務
bun run src/server/index.ts &
bun run src/ws.ts &
```

### Docker 部署

```dockerfile
FROM oven/bun:latest

WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install

COPY src/ ./src/

EXPOSE 3000 8080

CMD ["bun", "run", "src/server/index.ts"]
```

```bash
# 建構映像
docker build -t gundamcard2 .

# 執行容器
docker run -d -p 3000:3000 -p 8080:8080 gundamcard2
```

### 效能優化

1. **啟用狀態壓縮**
```typescript
// 只傳送必要資料給前端
function serializeGameState(ctx: GameState) {
  return {
    cards: ctx.cards,
    table: ctx.table,
    phase: ctx.phase,
    // 省略內部資料
  };
}
```

2. **快取卡片原型**
```typescript
const prototypeCache = new Map<string, CardPrototype>();

export async function loadPrototype(id: string) {
  if (prototypeCache.has(id)) {
    return prototypeCache.get(id);
  }
  const proto = await loadFromFile(id);
  prototypeCache.set(id, proto);
  return proto;
}
```

3. **使用 Worker 處理 AI**
```typescript
// 避免 AI 計算阻塞主執行緒
const aiWorker = new Worker("./ai-worker.ts");
aiWorker.postMessage({ ctx, playerId });
aiWorker.onmessage = (result) => {
  applyAIDecision(result.flow);
};
```

---

## 常見問題

### Q: 如何新增新的卡片類別？

A: 在 `src/game/define/CardPrototype.ts` 中修改 `CardCategory` 類型，並更新相關的處理邏輯。

### Q: 效果解析錯誤怎麼辦？

A: 檢查 `src/game/gameState/doEffect.ts` 中是否正確處理該 ActionTitle，並確認 CardText 定義正確。

### Q: AI 不會做決策？

A: 確認 `src/game/gameStateWithFlowMemory/ai/thinkVer1.ts` 中的評估函數是否正確，並檢查 queryFlow 返回的指令列表。

### Q: 如何調試 WebSocket 連線？

A: 使用瀏覽器開發者工具的 Network 面板查看 WebSocket 訊息，或使用 `wscat` 工具測試。

```bash
npm install -g wscat
wscat -c ws://localhost:8080
```

---

## 參考資料

### 專案檔案

- [遊戲規則實作](src/game/gameState/)
- [卡片資料](src/script/data/)
- [測試案例](src/debug/)
- [前端元件](src/client/component/)

### 外部資源

- [Bun 官方文檔](https://bun.sh/docs)
- [TypeScript 手冊](https://www.typescriptlang.org/docs/)
- [React 文檔](https://react.dev/)
- [Ramda 文檔](https://ramdajs.com/docs/)

---

## 貢獻指南

### 提交程式碼

1. Fork 專案
2. 創建功能分支: `git checkout -b feature/new-feature`
3. 提交變更: `git commit -am 'Add new feature'`
4. 推送分支: `git push origin feature/new-feature`
5. 發起 Pull Request

### 程式碼風格

- 使用 TypeScript 嚴格模式
- 遵循函數式編程原則（不可變性）
- 使用有意義的變數名稱
- 為複雜邏輯添加註釋
- 保持函數簡短（< 50 行）

---

## 授權

請依照專案需求添加適當的授權聲明。

---

**最後更新**: 2026-01-31

**文檔版本**: 1.0.0
