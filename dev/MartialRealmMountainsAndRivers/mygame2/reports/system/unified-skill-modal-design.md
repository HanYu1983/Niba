# 功法裝備 Modal 重構設計文件（Unified Skill Equip Modal Design）

本文件規劃將現有的「分頁式內功/外功設定」重構為**同畫面 Grid 卡片式功法面板**，讓玩家在構築時能一目了然地同時調整內功與外功，並清楚掌握相生連攜、天地共鳴等互動狀態。

---

## 一、設計目標與原則

### 1.1 設計目標
- **一眼掌握全局**：所有已學會的功法在同一畫面以 Grid 排列，無需切換 Tab。
- **即時感知互動**：相生連攜、天地共鳴、五行相剋等關係在卡片上直接可見。
- **快速切換操作**：點擊卡片即可切換內功或開啟/關閉外功，減少按鈕操作。
- **低學習成本**：保留既有資訊結構（傷害值、公式、消耗），僅改變呈現方式。

### 1.2 設計哲學：Grid + 高亮 + Tooltip

| 維度 | 說明 |
| :--- | :--- |
| **佈局** | 內功區（上方橫列）+ 外功區（下方 Grid） |
| **卡片** | 小尺寸 compact 卡片，顯示核心資訊（名稱、元素、等級、關鍵數值） |
| **高亮** | 已裝備的功法卡片以金色邊框 + 背景色區分 |
| **Tooltip** | 詳細說明（公式、描述、Buff 效果）以 hover tooltip 展開 |
| **互動標記** | 相生連攜以 💚 標籤標示；共鳴以 🌍 標籤標示 |

---

## 二、版面佈局設計

### 2.1 整體結構

```
┌─────────────────────────────────────────────────────┐
│  功法設定                              [關閉]       │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ─── 內功（選擇一個） ───                           │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐              │
│  │ ☯吐納│ │ ☯金剛│ │ ☯厚土│ │ ☯寒水│ ...          │
│  └──────┘ └──────┘ └──────┘ └──────┘              │
│                                                     │
│  ─── 外功（可多個開啟） ───                         │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐              │
│  │ ⚡破空│ │ ⚡追風│ │ ⚡炎火│ │ ⚡裂地│ ...          │
│  └──────┘ └──────┘ └──────┘ └──────┘              │
│                                                     │
├─────────────────────────────────────────────────────┤
│  悟性容量：45 / 60（內功 10 + 外功 35）             │
│  切換內功消耗 1% 內力 ｜ 開啟外功消耗 1% 內力        │
└─────────────────────────────────────────────────────┘
```

### 2.2 區塊劃分

| 區塊 | 內容 | 佈局 |
| :--- | :--- | :--- |
| **頂部資訊列** | 悟性容量、切換消耗說明 | Flex row |
| **內功區** | 所有已學會的內功卡片 | Horizontal scroll / wrap grid |
| **外功區** | 所有已學會的外功卡片 | Responsive grid（auto-fill minmax(180px, 1fr)） |
| **底部資訊列** | 當前裝備摘要（內功名 + 外功列表） | Flex row |

### 2.3 響應式斷點

| 螢幕寬度 | 外功 Grid 列數 |
| :--- | :--- |
| < 600px | 1 列 |
| 600–900px | 2 列 |
| > 900px | 3–4 列（依 Modal 寬度自動填滿） |

---

## 三、卡片設計規格

### 3.1 內功卡片（Compact Inner Card）

```
┌──────────────────────────────────┐
│ ☯ 厚土納元            [已裝備]   │ ← 名稱 + 狀態 Tag
│ 土                               │ ← 元素 Tag
│ Lv.3 · 傷害 42                   │ ← 等級 + 傷害值（highlight）
│ 🌍 天地共鳴                      │ ← 共鳴標記（如有）
│                                  │
│ （點擊卡片切換）                  │ ← 整張卡片可點擊
└──────────────────────────────────┘
```

| 欄位 | 內容 | 條件 |
| :--- | :--- | :--- |
| **圖示** | `☯` | 固定 |
| **名稱** | 功法名稱 | 固定 |
| **狀態 Tag** | 「已裝備」或空白 | 僅裝備時顯示 |
| **元素 Tag** | 五行屬性色標 | 固定 |
| **等級 + 傷害** | `Lv.N · 傷害 X` | 固定 |
| **共鳴標記** | `🌍 天地共鳴` | 僅當內功元素與玩家站立地形親和時顯示 |
| **操作方式** | **整張卡片可點擊**，未裝備時切換、已裝備時無動作 | 固定 |

### 3.2 外功卡片（Compact External Card）

```
┌──────────────────────────────────┐
│ ⚡ 追風腿           [已開啟]      │ ← 名稱 + 狀態 Tag
│ 木                               │ ← 元素 Tag
│ Lv.2 · 內力 -4                   │ ← 等級 + 消耗
│ 💚 相生連攜  🌍 天地共鳴         │ ← 互動標記 |
│ 🔥 三重共振：克 {敵人門派}       │ ← 共振標記（含敵人屬性）
│                                  │
│ （點擊卡片切換）                  │ ← 整張卡片可點擊
└──────────────────────────────────┘
```

| 欄位 | 內容 | 條件 |
| :--- | :--- | :--- |
| **圖示** | `⚡` | 固定 |
| **名稱** | 功法名稱 | 固定 |
| **狀態 Tag** | 「已開啟」或空白 | 僅開啟時顯示 |
| **元素 Tag** | 五行屬性色標 | 固定 |
| **等級 + 消耗** | `Lv.N · 內力 -X` | 固定 |
| **連攜標記** | `💚 相生連攜` | 僅當內功生此外功時顯示 |
| **共鳴標記** | `🌍 天地共鳴` | 僅當此外功元素與玩家站立地形親和時顯示 |
| **共振標記** | `🔥 三重共振：克{敵人}` | 僅當滿足三重共振時顯示，並附註克制目標門派 |
| **操作方式** | **整張卡片可點擊**，未裝備時開啟、已裝備時關閉 | 固定 |

#### 連攜提示視覺處理

即使外功**未裝備**，只要被當前內功所生，仍需提供視覺提示讓玩家知道「換這個內功會強化它」。採用雙層提示：

| 層次 | 效果 | 說明 |
| :--- | :--- | :--- |
| **邊框光暈** | 淡綠光暈（box-shadow: 0 0 6px rgba(34,197,94,0.35)） | 一眼看到哪些外功可被強化 |
| **💚 小 icon** | 卡片左上角顯示綠色圓點 + 💚 | hover 時 tooltip 顯示詳細連攜資訊 |
| **背景漸層** | 極淡的綠色底（rgba(34,197,94,0.04)） | 輔助識別，不搶眼 |

```
┌──────────────────────────────────┐
│ 💚 追風腿                        │ ← 連攜 icon（未裝備也顯示）
│ 木                               │ ← 元素 Tag
│ Lv.2 · 內力 -4                   │ ← 等級 + 消耗
│                                  │ ← 無互動標記（因未裝備）
│                                  │
│ （點擊卡片開啟）                  │ ← 整張卡片可點擊
└──────────────────────────────────┘
   ↑ 淡綠光暈邊框 + 極淡綠底
```

> **設計原則**：連攜提示僅在「外功未裝備」時顯示。若已裝備且已有 💚 標籤，則不再重複顯示 icon，避免資訊過載。

### 3.3 未學會功法處理

未學會的功法不顯示在 Grid 中，但可在 Modal 底部提供「武館可學」連結區域，列出尚未學會但可透過武館學習的功法。

---

## 四、互動標記系統

### 4.1 標記類型與顏色

| 標記 | Icon | 顏色 | 觸發條件 |
| :--- | :--- | :--- | :--- |
| **相生連攜** | 💚 | 綠色 Tag | 內功元素生外功元素 |
| **天地共鳴** | 🌍 | 藍色 Tag | 外功元素與玩家站立地形親和 |
| **三重共振條件** | 🔥 | 紅色 Tag | 連攜＋共鳴＋相剋三條件同時滿足 |
| **五行相剋** | ⚔️ | 橙色 Tag（hover tooltip） | 外功克制目標門派（需選定目標後顯示） |

### 4.2 標記顯示邏輯

```
for each 外功 card:
  synergy = isElementGenerating(innerElement, outerElement)
  resonance = isTerrainResonant(outerElement, playerTerrain)
  triple = synergy && resonance && isTripleResonance(...)

  if synergy: show 💚 tag
  if resonance: show 🌍 tag
  if triple: show 🔥 tag (override, highest priority)
```

### 4.3 Tooltip 詳細資訊

Hover 卡片時展開 Tooltip，顯示完整資訊：

```
厚土納元（Lv.3）
━━━━━━━━━━━━━━━
強化根骨與內息，擅長防守反擊與重擊。
公式：根骨 × 0.6 + 內息 × 0.4（最低 1）

傷害值：42
悟性需求：5（目前 30）

🌍 天地共鳴：厚土流在山嶽地形傷害 +25%、內力 -1
```

外功 Tooltip 範例：

```
追風腿（Lv.2）
━━━━━━━━━━━━━━━
以身法帶動腿勁，對相鄰單一敵人造成傷害。
公式：身法 × 0.6 + 悟性 × 0.4（最低 1）

內力消耗：4
悟性容量：2

💚 相生連攜：寒水養氣 → 追風腿（水生木，外功傷害 ×1.25）
🌍 天地共鳴：追風腿在森林地形傷害 +25%、內力 -1
🔥 三重共振：追風腿克厚土妖（木克土），命中震懾一回合
```

---

## 五、高亮與視覺層次

### 5.1 已裝備卡片樣式

| 屬性 | 值 |
| :--- | :--- |
| **邊框** | 2px solid #fbbf24（金色） |
| **背景** | linear-gradient(145deg, rgba(251, 191, 36, 0.08), transparent) |
| **陰影** | 0 0 8px rgba(251, 191, 36, 0.3) |
| **文字** | 正常亮度 |

### 5.2 未裝備卡片樣式

| 屬性 | 值 |
| :--- | :--- |
| **邊框** | 1px solid rgba(128, 128, 128, 0.2) |
| **背景** | 純白 / 深色模式下的中性灰 |
| **陰影** | 無 |
| **文字** | 正常亮度 |

### 5.3 無法裝備卡片樣式

| 屬性 | 值 |
| :--- | :--- |
| **透明度** | 0.4 |
| **游標** | not-allowed |
| **按鈕** | disabled |

適用情境：悟性不足、體力耗盡（turnEnded）、悟性容量不足。

---

## 六、實作規格

### 6.1 檔案變更清單

| 檔案 | 變更內容 |
| :--- | :--- |
| `src/components/SkillModal.tsx` | **重構**：從 Tabs 改為 Grid 佈局，整合內功/外功卡片 |
| `src/components/SkillCard.tsx` | 新增 `compact` 模式的細部調整（如更小的 padding、隱藏 description 改用 tooltip） |
| `src/components/SkillModal.css`（或 inline style） | 新增 Grid 佈局 CSS |
| `src/game/rules/skillRules.ts` | 現有函式已足夠（`isElementGenerating`、`getGenerationSynergyMultiplier`） |
| `src/game/rules/terrainCombatRules.ts` | 現有函式已足夠（`isTerrainResonant`、`isTripleResonance`） |

### 6.2 核心元件結構

```tsx
<SkillModal>
  <TopBar>悟性容量、消耗說明</TopBar>
  
  <Section title="內功">
    <InnerSkillGrid>
      {innerSkills.map(skill => (
        <InnerSkillCard 
          skill={skill} 
          equipped={player.innerSkillId === skill.id}
          synergyCount={countSynergies(skill.element)} // 生成幾個已裝備外功
          onEquip={() => onEquipInnerSkill(skill.id)}
        />
      ))}
    </InnerSkillGrid>
  </Section>

  <Section title="外功">
    <ExternalSkillGrid>
      {externalSkills.map(skill => (
        <ExternalSkillCard
          skill={skill}
          equipped={player.equippedExternalSkillIds.includes(skill.id)}
          synergy={isElementGenerating(innerElement, skill.element)}
          resonance={isTerrainResonant(skill.element, playerTerrain)}
          tripleResonance={checkTripleResonance(...) ? getTargetSchoolName(...) : undefined}
          onToggle={() => onToggleExternalSkill(skill.id)}
        />
      ))}
    </ExternalSkillGrid>
  </Section>

  <BottomBar>裝備摘要</BottomBar>
</SkillModal>
```

### 6.3 Props 擴充

#### InnerSkillCardProps

```typescript
type InnerSkillCardProps = {
  skill: InnerSkill
  equipped: boolean
  /** 此內功是否與玩家站立地形產生天地共鳴。 */
  resonance: boolean
  meetsRequirement: boolean
  canSwitch: boolean
  damageValue: number
  onEquip: () => void
}
```

#### ExternalSkillCardProps

```typescript
type ExternalSkillCardProps = {
  skill: ExternalSkill
  equipped: boolean
  synergy: boolean
  resonance: boolean
  /** 是否滿足三重共振，以及克制哪個門派（如「克厚土妖」）。 */
  tripleResonance?: string // e.g. "克厚土妖" or undefined
  level: number
  innerPowerCost: number
  insightCost: number
  equipped: boolean
  synergy: boolean
  resonance: boolean
  /** 是否滿足三重共振，以及克制哪個門派（如「克厚土妖」）。 */
  tripleResonance?: string // e.g. "克厚土妖" or undefined
  level: number
  innerPowerCost: number
  insightCost: number
  canEquip: boolean
  onToggle: () => void
}
```

### 6.4 新舊 Modal 並置（低風險重構）

> **決策**：不直接改造舊的 `SkillModal.tsx`，而是**新建 `UnifiedSkillModal.tsx`**，並將接線切換過去。原因是舊 Modal 內部是 Tabs 纏繞結構、以按鈕操作，而新 Modal 需要新的互動（點卡片切換、地形共鳴、三重共振）與資料輸入，幾乎等於重寫；新建可隔離風險、保留 fallback。

#### 接線方式

```tsx
// PlayerOverlays.tsx（改接線）
<UnifiedSkillModal
  player={gameState.players.find((player) => player.id === skillPlayerId) ?? null}
  innerSkills={allInnerSkillCatalog}
  externalSkills={allExternalSkillCatalog}
  playerTerrain={/* 從 gameStore 讀取玩家站立地形 */}
  activePlayerId={gameState.activePlayerId}
  creatureTargets={/* 可用於三重共振判定的敵人清單 */}
  onEquipInnerSkill={(skillId) => gameStore.equipInnerSkill(gameState.activePlayerId, skillId)}
  onToggleExternalSkill={(skillId) => gameStore.toggleExternalSkill(gameState.activePlayerId, skillId)}
  onClose={onCloseSkill}
/>
```

#### 檔案變更清單（更新）

| 檔案 | 變更內容 |
| :--- | :--- |
| `src/components/UnifiedSkillModal.tsx` | **新建**：Grid 卡片式功法面板（新介面） |
| `src/components/UnifiedSkillCard.tsx`（或併入） | **新建**：可點擊、含互動標記的功法卡片 |
| `src/components/overlays/PlayerOverlays.tsx` | 將 `SkillModal` 接線改為 `UnifiedSkillModal` |
| `src/components/SkillModal.tsx` | **保留不動**（作為 fallback / 對照） |
| `src/components/SkillCard.tsx` | **保留不動** |
| `reports/system/unified-skill-modal-design.md` | 本文件 |

#### 回滾方式

若新 Modal 出現問題，僅需在 `PlayerOverlays.tsx` 一行改回 `SkillModal` 即可還原，無需動其他檔案。

#### 新增 props：地形與敵人

新 Modal 需額外資料來源，舊 Modal 沒有：

| 資料 | 來源 | 用途 |
| :--- | :--- | :--- |
| `playerTerrain` | `getTerrainAtPosition(map.cells, player.position)` | 內功/外功天地共鳴判定 |
| `activePlayerId` | `gameState.activePlayerId` | 確認操作中的玩家 |
| 敵人清單（可選） | `gameState.creatures` | 三重共振「克{敵人}」提示 |

---

## 七、未來擴充方向

### 7.1 功法配裝預覽

- 儲存多組配裝方案（如「金剛流爆發套」「寒水流持久套」），一鍵切換。
- 比較不同配裝的總傷害期望值。

### 7.2 功法推薦提示

- AI 根據當前地圖地形、敵人門派，推薦最佳內功×外功組合。
- 例：「建議切換厚土內功 → 追風腿在森林共鳴且克厚土妖」。

### 7.3 功法連攜樹狀圖

- 以視覺化樹狀圖展示內功→外功的相生關係網。
- 高亮當前配裝路徑，虛線標示未觸發的潛在連攜。

---

## 八、開發檢查清單

- [ ] 重構 `SkillModal.tsx`：移除 Tabs，改為 Grid 佈局
- [ ] 新增 `InnerSkillGrid` / `ExternalSkillGrid` 子元件
- [ ] 新增 `InnerSkillCard` / `ExternalSkillCard` compact 卡片
- [ ] 實作互動標記系統（💚🌍🔥）
- [ ] 實作 Tooltip 詳細資訊
- [ ] 實作高亮樣式（已裝備 vs 未裝備 vs 不可裝備）
- [ ] 響應式 Grid 佈局（CSS media query）
- [ ] 更新 `SkillCard.tsx` compact 模式支援 tooltip
- [ ] 單元測試：Grid 渲染、標記判定、高亮邏輯
- [ ] 手動驗證：各流派配裝、連攜/共鳴/共振標記正確性
- [ ] 更新 changelog.json
