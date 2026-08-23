import { describe, expect, it } from 'vitest'
import { tokenize } from './highlightTokenizer'

describe('HighlightText tokenize', () => {
  it('純文字不含名詞時回傳單一 text 片段', () => {
    const parts = tokenize('沒有殊名詞的一段普通文字。')
    expect(parts).toEqual([{ type: 'text', value: '沒有殊名詞的一段普通文字。' }])
  })

  it('匹配道具名並標記成 term', () => {
    const parts = tokenize('購買了療傷藥與聚氣丹。')
    const termValues = parts.filter((part) => part.type === 'term').map((part) => part.value)
    expect(termValues).toContain('療傷藥')
    expect(termValues).toContain('聚氣丹')
    for (const part of parts) {
      if (part.type === 'term') expect(part.category).toBe('item')
    }
  })

  it('保留非名詞文字', () => {
    const parts = tokenize('獲得 20 金錢與療傷藥。')
    const textValues = parts.filter((part) => part.type === 'text').map((part) => part.value)
    expect(textValues.join('')).toBe('獲得 20 金錢與。')
  })

  it('最長名稱優先，避免短名稱誤切', () => {
    const parts = tokenize('貿易市場與據點。')
    const termValues = parts.filter((part) => part.type === 'term').map((part) => part.value)
    expect(termValues).toContain('貿易市場')
    expect(termValues).toContain('據點')
    // 貿易市場不應被拆成「貿易」＋「市場」。
    expect(termValues.some((name) => name === '貿易' || name === '市場')).toBe(false)
  })
})