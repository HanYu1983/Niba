import ReactGA from 'react-ga4'

const MEASUREMENT_ID = 'G-XM7THSR92E'

/**
 * 初始化 Google Analytics 4。
 * 需在應用程式啟動時呼叫一次。
 * 開發環境（Vite dev server）不會發送資料，避免污染正式數據。
 */
export function initAnalytics(): void {
  if (import.meta.env.DEV) {
    console.info('[analytics] 開發環境，跳過 GA4 初始化')
    return
  }
  ReactGA.initialize(MEASUREMENT_ID)
}

/**
 * 記錄頁面瀏覽事件。
 * @param path 頁面路徑，例如 '/home'
 */
export function trackPageView(path: string): void {
  ReactGA.send({ hitType: 'pageview', page: path })
}

/**
 * 記錄自訂事件。
 * @param category 事件類別
 * @param action 事件動作
 * @param label 事件標籤（可選）
 * @param value 事件數值（可選）
 */
export function trackEvent(
  category: string,
  action: string,
  label?: string,
  value?: number,
): void {
  ReactGA.event({
    category,
    action,
    label,
    value,
  })
}

/**
 * 只觸發一次的追蹤（用於防止 useEffect 在 StrictMode 下重複發送）。
 * 內部以 Set 快取已發送過的 key，僅在本次頁面生命週期內有效。
 */
const firedOnce = new Set<string>()

export function trackEventOnce(
  category: string,
  action: string,
  label?: string,
  value?: number,
): void {
  const key = `${category}:${action}:${label ?? ''}`
  if (firedOnce.has(key)) return
  firedOnce.add(key)
  trackEvent(category, action, label, value)
}

/**
 * 追蹤遊戲結局（勝利／失敗），並附上戰績數值。
 */
export function trackGameEnd(won: boolean, params: {
  roundsSurvived: number
  playerLevel: number
  prestige: number
  governanceRank: number
  money: number
  creaturesDefeated: number
  nestsDestroyed: number
  buildingsBuilt: number
  skillsLearned: number
  itemsCollected: number
  reason?: string
}): void {
  trackEventOnce(
    'Gameplay',
    won ? 'game_won' : 'game_lost',
    params.reason,
    params.roundsSurvived,
  )
}