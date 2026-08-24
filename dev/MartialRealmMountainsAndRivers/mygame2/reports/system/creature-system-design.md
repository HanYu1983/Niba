# Creature 怪物系統設計文件

## 1. 文件目的

- 定義 Creature 的資料模型、生成、回合行為、目標選擇、移動、攻擊與呈現流程。
- 為新增 Creature 類型、行為分類與巢穴內容提供可執行規格。
- 本文件描述遊戲規則與工程接口，不直接修改戰鬥數值平衡。

### 1.1 截至 2026-08-08 的開發進度

| 區域 | 進度 | 說明 |
|---|---|---|
| Creature 行為與流派映射 | 已完成 | 五種行為、流派對應、中文名稱與流派 Icon 已接入。 |
| Creature 五維屬性 | 已完成 | 初始與巢穴生成都會套用流派修正、等級成長與身法下限。 |
| 目標優先級 | 核心功能已完成 | 掠奪、獵殺、攻城型與距離排序已接入；守巢型專屬警戒／回防仍待完成。 |
| Creature 移動與巡邏 | 已完成 | 依體力連續移動、地形成本、阻擋與巡邏已接入。 |
| 防禦設施互動 | 已完成 | 箭塔先手與 Creature 攻擊防禦設施已接入。 |
| Creature 回合動畫 | 已完成 | action snapshot、`activeCreatureId`、popup 過濾與 500ms 間隔已接入。 |
| Creature 外功 AI | 尚未完成 | 目前 Creature 使用普通攻擊互動，尚未建立 AI 外功選擇與內力回退流程。 |
| Creature catalog | 尚未完成 | 目前仍以行為映射與生成點資料為主，尚未建立獨立 `creatureCatalog.ts`。 |
| 生成數量上限與稀有變異 | 尚未完成 | 目前尚未接入設計文件中的全域上限、稀有度與變異規則。 |

## 2. 系統範圍

- Creature catalog 與巢穴生成。
- Creature 回合計算。
- 防禦設施與 Creature 的互動。
- Creature 對玩家、資源點與防禦建築的攻擊。
- Creature action snapshot 與逐隻動畫。
- Creature popup log 過濾。
- 多玩家合作模式下的目標選擇。

## 3. 設計原則

- **資料驅動**：Creature 行為分類與目標優先級由 catalog/rules 定義。
- **計算與呈現分離**：行為計算產生結果，動畫模組負責逐隻呈現。
- **逐隻結算**：前一隻 Creature 完成行動後，才切換下一隻 `activeCreatureId`。
- **合作一致**：所有玩家均屬於合作陣營，Creature 不以玩家互相對抗為目標。
- **可測試**：目標選擇、移動、攻擊與動畫快照需可獨立測試。

## 4. 資料模型

### 4.1 CreatureState

目前 `CreatureState` 延伸 `PlayerState`，後續新增欄位：

```ts
export type CreatureBehaviorType =
  | 'scavenger'
  | 'hunter'
  | 'sieger'
  | 'guardian'
  | 'wanderer'

/** Creature 行為類型與功法流派分離；行為決定目標，流派決定戰鬥風格。 */
export type CreatureSchoolMapping = Record<CreatureBehaviorType, MartialSchoolId>

export type CreatureState = PlayerState & {
  behaviorType?: CreatureBehaviorType
  schoolId?: MartialSchoolId
  aggroRange?: number
  homePosition?: Position
  homeNestId?: string
}
```

### 4.4 行為類型與功法流派對應

每種 Creature 行為類型對應一個功法流派。`behaviorType` 與 `schoolId` 必須分開保存：

- `behaviorType`：決定目標優先級、警戒範圍與移動方式。
- `schoolId`：決定 Creature 使用的內功、外功與戰鬥風格。
- `innerSkillId`：決定目前裝備的內功。
- `equippedExternalSkillIds`：決定可使用的外功。

建議對應如下：

| Creature 行為 | 功法流派 | 戰鬥定位 |
|---|---|---|
| `scavenger` 掠奪型 | 寒水流 `frost-water` | 持久作戰、破壞資源 |
| `hunter` 獵殺型 | 追風流 `swift-wind` | 高機動、追擊玩家 |
| `sieger` 攻城型 | 厚土流 `earth-mountain` | 高耐久、攻擊據點 |
| `guardian` 守巢型 | 金剛流 `golden-body` | 近戰壓制、防守巢穴 |
| `wanderer` 遊蕩型 | 赤炎流 `scarlet-flame` | 高爆發、隨機突襲 |

太虛流 `void-spirit` 保留給玩家、特殊 Boss 或稀有 Creature，不作為一般 Creature 行為類型的預設流派。

Creature 顯示 Icon 目前依 `schoolId` 映射：寒水流 🦎、追風流 🦅、厚土流 🐂、金剛流 🦏、赤炎流 🦊、太虛流 🐉。

### 4.4.1 流派五維屬性分配

Creature 的五維屬性不再使用所有類型共用的固定配置，而是依照所屬功法流派建立不同的屬性傾向。屬性傾向會影響：

- 內功與外功傷害公式。
- 玩家與 Creature 的攻擊威脅。
- Creature 的生存能力。
- Creature 的行動與巡邏表現。

| 功法流派 | 臂力 | 根骨 | 身法 | 內息 | 悟性 | 設計定位 |
|---|---:|---:|---:|---:|---:|---|
| 寒水流 `frost-water` | 中 | 高 | 低 | 高 | 中 | 持久作戰、耐久與穩定輸出 |
| 追風流 `swift-wind` | 中 | 低 | 高 | 中 | 高 | 高機動、追擊與靈活行動 |
| 厚土流 `earth-mountain` | 中 | 很高 | 低 | 高 | 低 | 高生命、高耐久、攻城 |
| 金剛流 `golden-body` | 很高 | 高 | 低 | 中 | 低 | 近戰壓制與正面防守 |
| 赤炎流 `scarlet-flame` | 很高 | 低 | 中 | 很高 | 中 | 高爆發傷害與突襲 |
| 太虛流 `void-spirit` | 均衡 | 均衡 | 均衡 | 均衡 | 均衡 | 玩家、Boss 或特殊 Creature |

建議使用基礎值加流派修正，而不是在每個 Creature 生成點手寫五維數值：

```ts
type CreatureAttributeProfile = {
  armStrength: number
  constitution: number
  agility: number
  innerEnergy: number
  insight: number
}

const CREATURE_SCHOOL_ATTRIBUTE_MODIFIERS = {
  'frost-water': { armStrength: 0, constitution: 2, agility: -1, innerEnergy: 2, insight: 0 },
  'swift-wind': { armStrength: 0, constitution: -1, agility: 2, innerEnergy: 0, insight: 2 },
  'earth-mountain': { armStrength: 0, constitution: 3, agility: -2, innerEnergy: 2, insight: -1 },
  'golden-body': { armStrength: 2, constitution: 2, agility: -2, innerEnergy: 0, insight: -1 },
  'scarlet-flame': { armStrength: 2, constitution: -1, agility: 0, innerEnergy: 3, insight: 0 },
  'void-spirit': { armStrength: 0, constitution: 0, agility: 0, innerEnergy: 0, insight: 0 },
} satisfies Record<MartialSchoolId, CreatureAttributeProfile>
```

生成公式：

```text
最終屬性 = 基礎屬性 + 流派修正 + (Creature 等級 - 1) × 等級成長值
```

所有結果至少為 1；其中 Creature 身法最低為 2，避免低身法 Creature 無法正常移動。流派修正應由 catalog/rules 統一計算，巢穴生成與初始 Creature 生成不得各自維護一份公式。

```ts
export const CREATURE_SCHOOL_BY_BEHAVIOR: CreatureSchoolMapping = {
  scavenger: 'frost-water',
  hunter: 'swift-wind',
  sieger: 'earth-mountain',
  guardian: 'golden-body',
  wanderer: 'scarlet-flame',
}
```

### 4.5 Creature 功法等級

- Creature 等級與使用的功法等級同步。
- 功法等級計算：`Math.min(creatureLevel, 6)`。
- Creature 不需要經過玩家式的學習流程，也不受玩家悟性容量限制。
- 生成 Creature 時，依 `schoolId` 與功法等級選擇對應內功與外功。

### 4.2 欄位規則

| 欄位 | 必填 | 說明 |
|---|---:|---|
| `behaviorType` | 否 | 未指定時預設為 `scavenger` |
| `aggroRange` | 否 | 未指定時使用該行為分類的預設值 |
| `homePosition` | 否 | 守巢型 Creature 的活動中心 |
| `homeNestId` | 否 | 來源巢穴 ID，用於巢穴行為與生成追蹤 |

守巢型的警戒與回防常數：

```ts
export const GUARDIAN_ALERT_RANGE = 5
export const GUARDIAN_LEASH_RANGE = 8
```

### 4.3 CreatureDefinition（尚未獨立建檔）

目前尚未建立獨立 `creatureCatalog.ts`；現階段由 `creatureBehaviorRules.ts` 與初始／巢穴生成流程提供資料。未來若增加物種、稀有度或變異，再抽離為 catalog：

```ts
export type CreatureDefinition = {
  type: string
  name: string
  behaviorType: CreatureBehaviorType
  baseAttributes: PlayerAttributes
  maxStamina: number
  aggroRange: number
}
```

新增 Creature 類型時只需新增 definition 與生成來源，不應複製 `moveCreatures`。

## 5. 行為分類

### 5.1 掠奪型 `scavenger`

- 目標優先級：資源點 → 道具點 → 玩家 → 防禦建築。
- 主要目的：破壞玩家經濟與補給來源。
- 沒有可用目標時：使用完整體力巡邏。

### 5.2 獵殺型 `hunter`

- 目標優先級：玩家 → 資源點。
- 主要目的：追蹤並攻擊最近的存活玩家。
- 玩家不在警戒範圍時：使用完整體力巡邏。

### 5.3 遊蕩型 `wanderer`

- 目標優先級：附近玩家 → 附近資源點 → 巡邏。
- 主要目的：保持不固定的地圖壓力。
- 不應長距離鎖定單一目標。

### 5.4 攻城型 `sieger`（核心目標規則已完成）

- 目標優先級：據點 → 防禦建築 → 資源點 → 玩家。
- 主要目的：破壞據點防線。
- 被防禦建築阻擋時，優先攻擊阻擋設施。

### 5.5 守巢型 `guardian`（部分完成）

- 目標優先級：警戒範圍內玩家 → 防禦建築 → 資源點。
- 主要目的：守護來源巢穴。
- 每隻守巢型 Creature 必須綁定 `homeNestId` 與 `homePosition`。
- 自動監視所綁定的巢穴，不使用全地圖最近巢穴替代。
- 玩家進入巢穴周圍 5 格內時，守巢型進入警戒並追蹤最近的存活玩家。（待接入）
- 守巢型離巢超過 8 格時，放棄追擊並返回 `homePosition`。（待接入）
- 沒有入侵玩家時，在巢穴附近使用完整體力巡邏。
- 巢穴被摧毀後進入失巢狀態，不立即消失；第一版可轉為遊蕩型或留在原巢穴位置巡邏。

守巢型行為流程：

```text
確認 homeNestId / homePosition
├─ 巢穴仍存在
│  ├─ 警戒範圍 5 格內有玩家 → 追蹤最近玩家
│  ├─ 追擊距離超過 8 格 → 放棄追擊，返回 homePosition
│  └─ 沒有入侵玩家 → 巢穴附近巡邏
└─ 巢穴已摧毀 → 進入失巢狀態
```

多人同時進入警戒範圍時，依序選擇距離巢穴最近、距離 Creature 最近的玩家；仍相同時依玩家 ID 排序。

## 6. 目標選擇規則

### 6.1 統一接口

目前已實作的 `selectCreatureTarget` 支援玩家、資源點、據點與防禦設施；道具點、巢穴與完整守巢警戒規則仍待接入。

新增／規劃：

```ts
export type CreatureTargetType =
  | 'player'
  | 'resource'
  | 'item'
  | 'base'
  | 'defense'
  | 'nest'

export type CreatureTarget = {
  type: CreatureTargetType
  id: string
  position: Position
  distance: number
}

export function selectCreatureTarget(
  state: GameState,
  creature: CreatureState,
): CreatureTarget | null
```

### 6.2 選擇順序

1. 取得 Creature 的 `behaviorType`。
2. 取得該分類的目標優先級。
3. 過濾不可攻擊、死亡、超出警戒範圍的目標。
4. 同一優先級內選擇曼哈頓距離最近者。
5. 距離相同時依 ID 排序，確保結果可重現。
6. 找不到目標時進入巡邏。

### 6.3 多玩家合作規則

- 玩家是同一合作陣營。
- Creature 可選擇最近的存活玩家。
- 不應因玩家 ID 而改變攻擊陣營。
- 未來可依玩家威脅值選擇目標，但不改變合作關係。

## 7. 移動規則

### 7.1 追蹤移動

- 每次地圖位移只跨越一個相鄰格。
- 單隻 Creature 可以在同一回合連續移動多格，直到體力不足、到達目標附近或沒有合法位置。
- 每跨越一格，就扣除該格地形所需的體力。
- 使用加權尋路；目前可先使用貪婪距離，之後升級 A*。
- 目標為資源點或玩家時，移動至相鄰位置停止。
- 禁止進入：牆、據點、玩家、資源點、道具點、事件點、防禦建築與其他 Creature 佔用格。

### 7.2 巡邏移動

- 沒有目標時，Creature 會連續巡邏多格，直到剩餘體力不足或沒有合法位置。
- 每次跨格前，從合法的相鄰格中隨機選擇下一格。
- 建議避免立即返回上一格，降低原地來回。
- 巡邏完成後會產生一個 Creature action snapshot，但純移動不顯示 popup。

### 7.3 體力

- Creature 回合開始時使用 `maxStamina` 作為本回合可用體力。
- 每回合結束後 Creature 行動結果固定保存。
- 地形成本使用 `getTerrainStaminaCost`。

## 8. 攻擊與互動規則

### 8.1 防禦設施先手

- Creature 回合開始時，箭塔先攻擊射程內最近的存活 Creature。
- 被箭塔擊敗的 Creature 不產生後續 action step。

### 8.2 Creature 行動後互動優先級

1. 相鄰資源點：造成資源點傷害。
2. 否則相鄰玩家：造成玩家傷害並消耗裝備耐久。
3. 否則若追蹤路徑被防禦建築阻擋：攻擊相鄰防禦建築。
4. 否則只記錄移動結果。

### 8.3 傷害結果

- 玩家生命不得低於 0。
- 裝備耐久不得低於 0。
- 資源點生命歸零時移除資源點。
- 防禦建築生命歸零時移除防禦建築。
- Creature 生命歸零時移除 Creature。

### 8.4 Creature 功法使用（尚未完成）

- Creature 與玩家共用功法 catalog、查找函式與傷害公式。
- Creature 不使用玩家功法設定 UI，也不需要購買或學習功法。
- Creature 相鄰玩家時，依 AI 條件優先使用已配置外功；內力不足時改用普通攻擊。（待接入）
- 每隻 Creature 每回合最多使用一次外功。（待接入）
- 外功成功使用時產生獨立 action log；純移動仍不顯示 popup。（待接入）

## 9. 回合與動畫流程

### 9.1 計算階段

`creatureActions.ts` 負責：

- 箭塔先手傷害。
- 依 Creature 順序計算目標、移動與攻擊。
- 產生 `CreatureTurnResult`。
- 每隻 Creature 產生一個 `CreatureTurnStep`。

### 9.2 呈現階段

`creatureAnimation.ts` 負責：

1. 套用第 1 隻 Creature 的 step。
2. 設定 `activeCreatureId`。
3. 顯示攻擊/摧毀類 popup。
4. 等待動畫間隔。
5. 套用下一隻 Creature 的 step。
6. 所有 Creature 完成後恢復玩家並結束 Creature turn。

目前動畫間隔：`500ms`。

### 9.3 Popup 規則

顯示：

- 攻擊玩家。
- 攻擊資源點。
- 攻擊防禦建築。
- 摧毀資源點。
- 摧毀防禦建築。
- 箭塔攻擊 Creature。

不顯示：

- 單純移動。
- 單純巡邏。
- 沒有行動結果的 Creature。

## 10. Creature 生成規則

### 10.1 初始生成

- 初始數量由 `GameSettings.creatureCount` 決定。
- 生成位置避開據點、玩家、資源點、道具點、事件點與巢穴。
- 初始 Creature 可指定 `behaviorType`。

### 10.2 巢穴生成

- 巢穴依 `spawnInterval` 判斷是否生成。
- 生成位置需位於巢穴附近合法格。
- 新生成 Creature 繼承巢穴設定的 Creature 類型。
- `spawnLevel` 提升生成 Creature 屬性。

### 10.3 生成設計總則

Creature 生成分為兩個來源：

```text
GameSettings.creatureCount → 控制遊戲開始時的初始 Creature 數量
CreatureNestState → 控制遊戲進行中的持續生成
```

- 初始 Creature 與巢穴生成的 Creature 都必須遵守互動點與佔位規則。
- 初始 Creature 可依地圖 seed 分配不同 `behaviorType` 與 `schoolId`。
- 每個巢穴應固定綁定一種 `behaviorType` 與對應功法流派。
- 巢穴生成的 Creature 應繼承巢穴的行為類型與流派。

### 10.4 巢穴生成間隔

- 使用 `spawnInterval` 與 `lastSpawnRound` 判斷生成時機。
- 當 `round - lastSpawnRound < spawnInterval` 時，本回合不生成。
- 每個巢穴每次最多生成 1 隻 Creature。
- 成功生成後才更新 `lastSpawnRound` 與 `spawnLevel`。
- 如果沒有合法生成位置，不更新 `lastSpawnRound`，下一回合繼續嘗試。

### 10.5 生成數量上限（尚未接入）

為避免巢穴與回合數增加後 Creature 數量失控，設計上應設定全域上限；目前程式尚未接入：

```text
maxCreatureCount = min(60, initialCreatureCount + activeNestCount × 4)
```

- 目前 Creature 數量達到上限時，所有巢穴暫停生成。
- Creature 被擊敗或移除後，下一次巢穴回合可恢復生成。
- 上限可以先由公式計算，未來再開放為 `GameSettings.maxCreatureCount`。

### 10.6 生成位置

- 優先搜尋巢穴周圍曼哈頓距離 `1～2` 格。
- 必要時可擴大至距離 `3` 格或同一區域內的合法格。
- 不得與以下物件重疊：
  - 牆
  - 玩家
  - 據點
  - 資源點
  - 道具點
  - 探索事件
  - 防禦建築
  - 其他 Creature
  - 其他巢穴
- 不建議直接在全地圖隨機生成，以保留巢穴的戰略意義。

### 10.7 巢穴等級與 Creature 等級

- 生成 Creature 等級等於巢穴當前 `spawnLevel`。
- `spawnLevel` 上限為 Lv.6。
- 每次成功生成後 `spawnLevel + 1`，但不得超過 Lv.6。
- Creature 屬性使用流派基礎值加等級成長：

$$
	ext{最終屬性}
=
	ext{流派基礎屬性}
+
(\text{spawnLevel}-1)\times\text{等級成長值}
$$

- 所有最終屬性最低為 `1`。
- 功法等級同步為 `min(creatureLevel, 6)`。

### 10.8 巢穴摧毀

- 巢穴生命歸零後立即從 `creatureNests` 移除。
- 被摧毀的巢穴不再生成新 Creature。
- 已經生成的 Creature 不會因此自動消失，會繼續完成後續行動。
- 第一版不改變已生成 Creature 的行為；後續可讓守巢型 Creature 轉為遊蕩型。

## 11. 失敗與例外處理

| 情境 | 系統反應 |
|---|---|
| 沒有合法移動格 | Creature 留在原地並標記回合完成 |
| 目標已死亡 | 重新選擇下一個合法目標 |
| 目標在計算期間被移除 | 忽略該目標並繼續下一隻 |
| 箭塔擊敗 Creature | 不建立該 Creature 的 action step |
| 沒有任何 Creature | 直接結束 Creature turn |
| 動畫期間無法操作玩家 | `creatureTurnInProgress = true` |

## 12. 建議工程檔案

```text
src/game/catalogs/creatureCatalog.ts
src/game/rules/creatureBehaviorRules.ts
src/game/actions/creatureActions.ts
src/game/creatureAnimation.ts
src/game/creatureBehaviorRules.test.ts
src/game/creatureNest.test.ts
src/game/creatureAnimation.test.ts
```

職責：

- `creatureCatalog.ts`：怪物資料與分類。
- `creatureBehaviorRules.ts`：目標優先級與行為選擇。
- `creatureActions.ts`：狀態計算與 action snapshot。
- `creatureAnimation.ts`：逐隻視覺呈現。

## 13. 驗收標準

### 資料

- [x] 初始與巢穴生成的 Creature 都有明確 `behaviorType`。
- [x] 初始與巢穴生成的 Creature 都有明確 `schoolId`，且符合行為類型對應表。
- [x] 舊資料沒有 `behaviorType` 時預設為 `scavenger`。
- [x] 舊資料沒有 `schoolId` 時依 `behaviorType` 補上對應流派。
- [x] 巢穴能指定生成的 Creature 類型。
- [x] Creature 等級能對應 Lv.1～Lv.6 功法。
- [x] Creature 流派能映射至不同 Icon。

### 目標

- [x] 掠奪型優先資源點。
- [x] 獵殺型優先玩家。
- [x] 攻城型優先據點。
- [ ] 守巢型只在警戒範圍內追蹤玩家。（尚未完成警戒與回防）
- [x] 距離相同時結果可重現。

### 移動

- [x] Creature 會使用可用體力移動。
- [x] 不能穿過禁止格。
- [x] 沒有目標時不會只移動一格後停止。
- [x] Creature 被阻擋時能正確攻擊防禦建築。

### 呈現

- [x] Creature 逐隻切換 `activeCreatureId`。
- [x] 純移動不顯示 popup。
- [x] 攻擊與摧毀行動顯示 popup。
- [x] Creature turn 期間玩家不能執行指令。

### 測試

- [x] 目標優先級測試。
- [x] 行為類型、功法流派與 Icon 映射測試。
- [x] Creature 功法等級選擇測試。
- [ ] Creature 外功使用與內力不足回退測試。
- [x] 多玩家目標測試。
- [x] 巢穴生成測試。
- [x] 箭塔先手測試。
- [x] 巡邏完整體力測試。
- [x] action snapshot 順序測試。
- [x] 動畫間隔與 popup 過濾測試。

## 14. 未來擴充

- 守巢型警戒範圍、Leash 回防與失巢狀態。
- Creature 外功 AI、內力消耗與普通攻擊回退。
- 獨立 `creatureCatalog.ts`，集中管理物種、基礎屬性、稀有度與生成資料。
- Creature 全域生成數量上限。
- A* 加權尋路。
- 威脅值與仇恨系統。
- Creature 技能與特殊狀態。
- Creature 群體協作。
- 守巢區域與返回巢穴。
- 不同 Creature 的攻擊目標權重。
- Creature 生成稀有度與變異。
- Creature 行為與功法流派的特殊技能組合。
- Boss 使用太虛流或多流派混合功法。
