import { HIGHLIGHT_TERMS, type HighlightTerm, type TermCategory } from './highlightTerms'

export type HighlightPart =
  | { type: 'text'; value: string }
  | { type: 'term'; value: string; category: TermCategory }

type HighlightTermItem = { name: string; category: TermCategory }

/**
 * 掃描字串中的已知專有名詞（道具/功法/建築等），回傳文字與名詞片段。
 * 使用最長名稱優先匹配，避免短名稱誤切長名稱（例如「貿易市場」不被拆成「貿易」「市場」）。
 * @param extraTerms 額外要高亮的名詞（例如動態生成的生物名、據點名），依名稱長度排序較佳。
 */
export function tokenize(text: string, extraTerms: HighlightTerm[] = []): HighlightPart[] {
  if (typeof text !== 'string' || text.length === 0) return []

  // 合併靜態字典與動態名詞，依名稱長度由長到短排序，確保最長名稱優先。
  const terms = [...extraTerms, ...HIGHLIGHT_TERMS].sort((first, second) => second.name.length - first.name.length)

  const parts: HighlightPart[] = []
  let cursor = 0
  while (cursor < text.length) {
    const remaining = text.slice(cursor)
    let match: { term: HighlightTermItem; index: number } | null = null
    for (const term of terms) {
      const index = remaining.indexOf(term.name)
      if (index === -1) continue
      if (!match || index < match.index || (index === match.index && term.name.length > match.term.name.length)) {
        match = { term, index }
      }
    }
    if (!match) {
      parts.push({ type: 'text', value: remaining })
      break
    }
    if (match.index > 0) {
      parts.push({ type: 'text', value: remaining.slice(0, match.index) })
    }
    parts.push({ type: 'term', value: match.term.name, category: match.term.category })
    cursor += match.index + match.term.name.length
  }
  return parts
}