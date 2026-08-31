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
])
