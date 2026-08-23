import { Fragment } from 'react'
import type { HighlightTerm, TermCategory } from './highlightTerms'
import { tokenize } from './highlightTokenizer'

type HighlightTextProps = {
  children: string
  className?: string
  /** 額外要高亮的名詞（例如動態生成的生物名、據點名），用 `{ name, category }` 表示。 */
  extraTerms?: HighlightTerm[]
}

/** 各類別對應的高亮顏色。 */
const CATEGORY_COLOR: Record<TermCategory, string> = {
  item: '#c2410c', // 道具：橙
  skill: '#7c3aed', // 功法：紫
  building: '#0369a1', // 建築：藍
  base: '#b91c1c', // 據點：紅
  buff: '#0f766e', // 狀態：青綠
  attribute: '#a16207', // 屬性：金
  creature: '#9333ea', // 生物：紫紅
}

/**
 * 通用名詞高亮元件。
 * 掃描字串中的已知專有名詞（道具/功法/建築等），並以 <span> 套上對應顏色。
 * 使用最長名稱優先匹配，避免短名稱誤切長名稱。
 */
function HighlightText({ children, className, extraTerms }: HighlightTextProps) {
  if (typeof children !== 'string' || children.length === 0) {
    return <Fragment>{children}</Fragment>
  }

  const parts = tokenize(children, extraTerms)
  return (
    // 用單一 inline span 包住全部輸出，避免在巢狀 flex 容器中被切成不同 flex item 而產生寬間距。
    <span style={{ display: 'inline' }}>
      {parts.map((part, index) =>
        part.type === 'text'
          ? <Fragment key={index}>{part.value}</Fragment>
          : (
            <span
              key={index}
              className={className}
              style={{ color: CATEGORY_COLOR[part.category], fontWeight: 600, letterSpacing: 'normal' }}
            >
              {part.value}
            </span>
          ),
      )}
    </span>
  )
}

export default HighlightText