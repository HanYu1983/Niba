import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    // MapGrid 的 React Compiler 誤報（已知限制，詳見 reports/analysis/code-update-plan-2026-08-31.md）：
    // getReachableCellIds → buildMovementCostMap → getActiveBuffDefinitions 內部使用
    // 模組級 WeakMap 快取（階段 2.3 性能優化）。Compiler 的變異分析無法穿透跨模組的
    // WeakMap.set，因此將依賴 activePlayer 的 useMemo 標記為「may be modified later」，
    // 跳過整個元件的自動 memoization。
    // 權衡：保留 WeakMap 快取（BFS 熱路徑收益明確）；手動 useMemo 已提供快取，
    // 損失的僅是 compiler 對其餘 JSX 的自動快取。故降級為 warn 觀察。
    files: ['src/components/MapGrid.tsx'],
    rules: {
      'react-hooks/preserve-manual-memoization': 'warn',
    },
  },
  // ── 分層邊界保護（報告 §6.2 方向三）─────────────────────────────────────
  // 期望依賴方向：catalogs → types → rules → actions → ai → gameStore → components
  // 歷史教訓：gameStore 從 1519 行膨脹到 2687 行、3 條雙向依賴邊的累積，
  // 都是在無人察覺下發生的。此規則把分層寫成可執行約束，防止回退。
  // 已知豁免（記錄於 reports/analysis/code-update-plan-2026-08-31.md 完成度驗證報告）：
  // - rules/actionCostRules.ts、rules/creatureBehaviorRules.ts → ai/（型別/查表，見下方個別豁免）
  // - gameStore.ts → editor/rules/*（scenarioCompiler/validator，待下沉後移除豁免）
  {
    files: ['src/game/catalogs/**/*.ts'],
    ignores: ['**/*.test.ts'],
    rules: {
      // catalogs 是最底層純資料：不得依賴 rules / actions / ai / gameStore / components。
      // 既有豁免：talentCatalog.ts 以 import type 引用 rules/playerStatsRules（僅型別，無執行期循環）。
      'no-restricted-imports': ['error', {
        patterns: [{
          group: ['../rules/*', '../actions/*', '../ai/*', '../gameStore', './gameStore', '../../game/*'],
          // 僅豁免 type-only import：talentCatalog 以 import type 引用 rules/playerStatsRules，
          // 無執行期循環；執行期 import 仍被禁止。
          allowTypeImports: true,
          message: 'catalogs 為最底層純資料層，不得依賴 rules / actions / ai / gameStore（type-only import 除外）。',
        }],
      }],
    },
  },
  {
    files: ['src/game/rules/**/*.ts'],
    ignores: ['**/*.test.ts'],
    rules: {
      // rules 是純規則層：不得依賴 actions / gameStore / components（防止 rules → actions 反向邊復活）。
      'no-restricted-imports': ['error', {
        patterns: [{
          group: ['../actions/*', '../gameStore', './gameStore', '../../editor/*', '../editor/*'],
          message: 'rules 為純規則層，不得依賴 actions / gameStore / editor。',
        }],
      }],
    },
  },
  {
    files: ['src/game/actions/**/*.ts'],
    ignores: ['**/*.test.ts'],
    rules: {
      // actions 不得反向依賴 gameStore / components（store 應依賴 actions，而非相反）。
      'no-restricted-imports': ['error', {
        patterns: [{
          group: ['../gameStore', './gameStore', '../../components/*', '../components/*'],
          message: 'actions 不得依賴 gameStore / components（依賴方向：gameStore → actions）。',
        }],
      }],
    },
  },
  {
    files: ['src/game/ai/**/*.ts'],
    ignores: ['**/*.test.ts'],
    rules: {
      // ai 不得依賴 gameStore / components（AI 決策經 dependencies 注入，不直接觸碰 store）。
      'no-restricted-imports': ['error', {
        patterns: [{
          group: ['../gameStore', './gameStore', '../../gameStore', '../../components/*', '../components/*'],
          message: 'ai 不得依賴 gameStore / components（store 依賴經 dependencies 注入）。',
        }],
      }],
    },
  },
  {
    files: ['src/game/types/**/*.ts', 'src/game/types.ts'],
    rules: {
      // types 只能 import type：不得引入任何執行期模組（防止 types ↔ catalogs 執行期循環復活）。
      // 既有豁免：types/gameState.ts 以 import type 引用 ai/aiActionEvent（僅型別，無執行期循環）。
      'no-restricted-imports': ['error', {
        patterns: [{
          group: ['../gameStore', './gameStore', '../actions/*', '../ai/**', '../rules/**', '../components/**', '../editor/**'],
          // 僅豁免 type-only import：types/gameState.ts 以 import type 引用 ai/aiActionEvent，
          // 無執行期循環；執行期 import 仍被禁止。
          allowTypeImports: true,
          message: 'types 層不得依賴任何執行期模組（type-only import 除外）。',
        }],
      }],
    },
  },
])
