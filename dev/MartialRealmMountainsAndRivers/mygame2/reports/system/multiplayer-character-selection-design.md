# 多人對局名冊角色選擇設計（Multiplayer Character Selection Design）

> ## ✅ 製作狀態：方向已定（Direction Locked）／準備實作
>
> 本文件定義「多人（多個人類玩家）對局時，每個玩家各自選用名冊角色」的設計。
> 現行系統僅支援**單一名冊角色**（`GameState.activeCharacterId`），本設計將其擴充為
> **每個人類玩家各自對應一個名冊角色**（`GameState.activeCharacterIds` 陣列），
> 並讓局末殘卷回寫到各自對應的角色。

## 1. 文件目的

- 定義多人對局時，每個玩家如何選用名冊角色。
- 規格化資料結構、世界生成、殘卷結算與 UI 的擴充方式。
- 與既有系統對齊：`PersistentCharacter`、`createInitialPlayers`、`settleActiveCharacterRewards`、`GameStartScreen`。

## 2. 現況與問題

| 面向 | 現況 | 問題 |
|---|---|---|
| 角色選擇 | `GameStartScreen` 只有**一個**「使用角色」下拉選單 | 多人時無法為每個玩家選不同角色 |
| 世界生成 | `createInitialPlayers` 只對 `index === 0` 的人類玩家套用名冊角色 | 第 2、3、4 位人類玩家拿到預設角色 |
| 殘卷結算 | `GameState.activeCharacterId` 只記錄一個角色 id | 局末殘卷只回寫到一個角色 |
| 存檔 | `activeCharacterId` 隨 `GameState` 序列化 | 無法還原多個角色的對應關係 |

## 3. 設計支柱

- **一對一對應**：每個人類玩家（依 `playerCount`）對應一個名冊角色；未選用者為 `null`（預設角色）。
- **向下相容**：單人對局行為不變；舊存檔（`activeCharacterId` 單一欄位）仍可讀取。
- **殘卷各自回寫**：局末時，每個有對應名冊角色的人類玩家，其殘卷回寫到各自角色。

## 4. 核心資料結構

### 4.1 `GameState` 擴充

將單一 `activeCharacterId` 改為陣列，依人類玩家順序對應：

```ts
// types.ts — GameState
/** 本局各人類玩家選用的名册角色 id（依人類玩家順序；未選用為 null）。隨存檔序列化。 */
activeCharacterIds?: (string | null)[]
```

> **向下相容**：保留舊 `activeCharacterId?: string | null` 欄位作為讀取舊存檔的回退來源。
> 新存檔一律寫入 `activeCharacterIds`；讀檔時若無 `activeCharacterIds` 則由 `activeCharacterId` 轉換。

### 4.2 角色選擇參數

`startGame` 與 `createGameState` 的 `selectedCharacter` 改為陣列：

```ts
// gameStore.ts — startGame 簽名
startGame: (
  settings: GameSettings,
  selectedCharacters?: {
    id?: string
    attributeBonuses: PlayerAttributes
    name?: string
    portrait?: string
    title?: string
    initialInternalSkillId?: string
    initialExternalSkillIds?: string[]
    talentIds?: string[]
  }[],
)
```

> 陣列長度對應人類玩家數量；不足者以 `null`（預設角色）補足，多餘者忽略。

## 5. 世界生成

### 5.1 `createInitialPlayers` 擴充

`worldGeneration.ts` 的 `createInitialPlayers` 由「單一角色參數」改為「角色陣列」，
依 `index` 對應到對應的角色：

```ts
export function createInitialPlayers(
  playerPositions: Position[],
  seed = 20260803,
  humanPlayerCount = playerPositions.length,
  selectedCharacters?: Array<{
    attributeBonuses: PlayerAttributes
    name?: string
    portrait?: string
    title?: string
    initialInternalSkillId?: string
    initialExternalSkillIds?: string[]
    talentIds?: string[]
  } | null>,
): PlayerState[]
```

- `index < humanPlayerCount`（人類玩家）：取 `selectedCharacters?.[index]`，套用其五維、功法、天賦、外觀；`null` 或缺漏則用預設角色。
- `index >= humanPlayerCount`（AI 玩家）：維持預設生成，不套用名冊角色。

### 5.2 `worldSetup.ts` 的 `createGameState`

`createGameState` 的第二參數改為角色陣列，並把對應的 id 陣列寫入 `GameState.activeCharacterIds`：

```ts
export function createGameState(
  settings: GameSettings = DEFAULT_GAME_SETTINGS,
  selectedCharacters?: Array<{ id?: string; ... } | null>,
): GameState {
  // ...
  const players = createInitialPlayers(playerPositions, seed, humanPlayerCount, selectedCharacters)
  // ...
  return {
    // ...
    activeCharacterIds: Array.from({ length: humanPlayerCount }, (_, i) => selectedCharacters?.[i]?.id ?? null),
  }
}
```

## 6. 殘卷結算

### 6.1 `gameStore` 多角色結算

`settleActiveCharacterRewards` 由「單一角色」改為「依人類玩家逐一結算」：

```ts
settleActiveCharacterRewards: (
  stats: RunStats,
  won: boolean,
  learnedSkillIdsByPlayer: string[][],  // 依人類玩家順序
): (PersistentCharacter | undefined)[] | null
```

- 對每個有對應名冊角色的人類玩家，呼叫 `applyEndGameRewards` 回寫殘卷。
- 回傳各角色的結算結果陣列；若該局已結算（`rewardSettled` 或 `runId` 已登記）回傳 `null`。
- 冪等邏輯（`rewardSettled`、`runId` 登記）維持不變，以「局」為單位鎖定。

### 6.2 `SystemOverlays` 結算顯示

`SystemOverlays` 依人類玩家逐一取得其名冊角色，計算各角色的殘卷獎勵並顯示：

- 每個有對應角色的玩家，顯示「獲得武學殘卷 ×N」。
- 已結算的局顯示「此局已領取過武學殘卷獎勵」。

## 7. UI：`GameStartScreen` 多角色選擇

### 7.1 依人類玩家數量動態產生下拉選單

「使用角色」區塊改為依 `settings.playerCount` 動態產生 N 個下拉選單：

```tsx
{Array.from({ length: settings.playerCount }, (_, i) => (
  <label key={i}>
    玩家 {i + 1} 角色
    <Select
      placeholder="預設角色（五維全 8）"
      allowClear
      value={selectedCharacterIds[i]}
      onChange={(id) => handleSelectCharacterForPlayer(i, id)}
      options={rosterCharacters.map((c) => ({ label: c.name, value: c.id }))}
    />
  </label>
))}
```

- `selectedCharacterIds: (string | undefined)[]` 依玩家順序儲存。
- 每個下拉可獨立選擇不同名冊角色，或留空（預設角色）。
- 沿用 `localStorage` 記住上次選擇（可選，多人時存陣列）。

### 7.2 `App.tsx` 的 `startGame`

`startGame` 接收角色陣列並傳入 `gameStore.startGame`：

```ts
const startGame = (settings: GameSettings, selectedCharacters?: (PersistentCharacter | undefined)[]) => {
  gameStore.startGame(settings, selectedCharacters)
  setScreen('game')
}
```

## 8. 存檔相容

- **新存檔**：寫入 `GameState.activeCharacterIds`（陣列）。
- **舊存檔**：只有 `activeCharacterId`（單一），讀檔時轉換為 `[activeCharacterId]`。
- `gameSave.ts` 的 payload `activeCharacterId` 欄位保留作向下相容，但新存檔以 `GameState.activeCharacterIds` 為準。

## 9. 影響檔案

| 檔案 | 變更 |
|---|---|
| `src/game/types.ts` | `GameState` 新增 `activeCharacterIds`；保留 `activeCharacterId` 相容 |
| `src/game/worldGeneration.ts` | `createInitialPlayers` 改為角色陣列 |
| `src/game/worldSetup.ts` | `createGameState` 接收角色陣列並寫入 `activeCharacterIds` |
| `src/game/gameStore.ts` | `startGame`／`settleActiveCharacterRewards` 多角色；載入／重開同步陣列 |
| `src/game/gameSave.ts` | 存檔相容（`activeCharacterIds` 為主，`activeCharacterId` 回退） |
| `src/components/GameStartScreen.tsx` | 依 `playerCount` 動態產生多個角色下拉 |
| `src/components/overlays/SystemOverlays.tsx` | 依人類玩家逐一結算並顯示殘卷 |
| `src/App.tsx` | `startGame` 接收角色陣列 |
| 測試 | `gameStore.test.ts`、`worldGeneration` 相關測試 |

## 10. 驗證

- 單人對局：行為與現行一致（選一個角色，殘卷回寫該角色）。
- 雙人對局：玩家 1、玩家 2 各自選不同角色，開局各自套用五維／功法／天賦，局末殘卷各自回寫。
- 舊存檔：僅有 `activeCharacterId` 的存檔可正常讀取並還原。
- 完整測試套件通過。
