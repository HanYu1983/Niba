import { Tag, Tooltip } from 'antd'
import type { ReactNode } from 'react'

/**
 * 共用靈氣/Buff 標籤元件。
 *
 * 統一所有「靈氣」的顯示樣式，涵蓋三種類型：
 * - 玩家自身 Buff（內功/靈氣型外功/道具）
 * - 全局靈氣（貿易市場）
 * - 區域靈氣（巢穴/防衛營）
 *
 * 透過 `tone` 區分正負面，`icon` 統一圖示，`tooltip` 提供詳細說明。
 */

/** 靈氣標籤的色調分類。 */
export type BuffTagTone = 'buff' | 'debuff' | 'global' | 'neutral'

/** 共用靈氣標籤的 props。 */
export type BuffTagProps = {
  /** 顯示名稱。 */
  name: string
  /** 圖示（emoji）。 */
  icon?: string
  /** 色調分類，決定 Tag 顏色。 */
  tone?: BuffTagTone
  /** 次要資訊（如剩餘回合、等級）。 */
  meta?: string
  /** 懸停顯示的詳細說明。 */
  tooltip?: ReactNode
  /** 自訂 key（用於列表渲染）。 */
  key?: string
}

/** 依色調回傳對應的 antd Tag 顏色。 */
function getTagColor(tone: BuffTagTone): string {
  switch (tone) {
    case 'buff': return 'green'
    case 'debuff': return 'red'
    case 'global': return 'purple'
    case 'neutral': return 'blue'
  }
}

function BuffTag({ name, icon, tone = 'neutral', meta, tooltip }: BuffTagProps) {
  const tag = (
    <Tag color={getTagColor(tone)}>
      {icon && <span role="img" aria-label={icon}>{icon} </span>}
      {name}
      {meta && <span style={{ marginInlineStart: 4, opacity: 0.8 }}>{meta}</span>}
    </Tag>
  )
  return tooltip ? <Tooltip title={tooltip}>{tag}</Tooltip> : tag
}

export default BuffTag