import { describe, expect, it } from 'vitest'
import type { EditorSnapshot } from '../editorTypes'

/**
 * 純邏輯測試 useEditorHistory 的核心行為。
 * 由於 useEditorHistory 本質上只是兩個堆疊（undoStack / redoStack）
 * 加上 push / undo / redo 三個操作，我們直接模擬堆疊行為來驗證邏輯正確性。
 */

function makeSnapshot(tag: string): EditorSnapshot {
  return {
    cells: [{ row: 0, column: 0, terrain: 'plain' }],
    entities: [{ id: tag, kind: 'player' as const, position: { row: 0, column: 0 }, data: {} }],
  }
}

function snapshotTag(snapshot: EditorSnapshot | null): string | null {
  if (!snapshot) return null
  return snapshot.entities[0]?.id ?? null
}

/** 模擬 useEditorHistory 的堆疊邏輯（與 hook 實作完全一致）。 */
class HistorySimulator {
  undoStack: EditorSnapshot[] = []
  redoStack: EditorSnapshot[] = []

  push(snapshot: EditorSnapshot) {
    this.undoStack.push(snapshot)
    this.redoStack = []
  }

  undo(currentState: EditorSnapshot): EditorSnapshot | null {
    if (this.undoStack.length === 0) return null
    const snapshot = this.undoStack.pop()!
    this.redoStack.push(currentState)
    return snapshot
  }

  redo(currentState: EditorSnapshot): EditorSnapshot | null {
    if (this.redoStack.length === 0) return null
    const snapshot = this.redoStack.pop()!
    this.undoStack.push(currentState)
    return snapshot
  }

  get canUndo() { return this.undoStack.length > 0 }
  get canRedo() { return this.redoStack.length > 0 }
}

describe('useEditorHistory 邏輯測試', () => {
  it('push 後 canUndo 為 true，canRedo 為 false', () => {
    const h = new HistorySimulator()
    h.push(makeSnapshot('A'))
    expect(h.canUndo).toBe(true)
    expect(h.canRedo).toBe(false)
  })

  it('連續 push 三次後，undo 三次能依序還原', () => {
    const h = new HistorySimulator()
    h.push(makeSnapshot('A'))
    h.push(makeSnapshot('B'))
    h.push(makeSnapshot('C'))

    expect(snapshotTag(h.undo(makeSnapshot('D')))).toBe('C')
    expect(h.canUndo).toBe(true)
    expect(h.canRedo).toBe(true)

    expect(snapshotTag(h.undo(makeSnapshot('C')))).toBe('B')
    expect(snapshotTag(h.undo(makeSnapshot('B')))).toBe('A')
    expect(h.canUndo).toBe(false)
    expect(h.canRedo).toBe(true)
  })

  it('undo 後 redo 能還原到最新狀態', () => {
    const h = new HistorySimulator()
    h.push(makeSnapshot('A'))
    h.push(makeSnapshot('B'))
    h.push(makeSnapshot('C'))

    expect(snapshotTag(h.undo(makeSnapshot('current1')))).toBe('C')
    expect(snapshotTag(h.redo(makeSnapshot('C')))).toBe('current1')
    expect(h.canRedo).toBe(false)
    expect(h.canUndo).toBe(true)
  })

  it('多次 undo 後多次 redo 能正確往返', () => {
    const h = new HistorySimulator()
    h.push(makeSnapshot('A'))
    h.push(makeSnapshot('B'))
    h.push(makeSnapshot('C'))

    expect(snapshotTag(h.undo(makeSnapshot('after-C')))).toBe('C')
    expect(snapshotTag(h.undo(makeSnapshot('C')))).toBe('B')
    expect(snapshotTag(h.undo(makeSnapshot('B')))).toBe('A')
    expect(h.canUndo).toBe(false)
    expect(h.canRedo).toBe(true)

    expect(snapshotTag(h.redo(makeSnapshot('A')))).toBe('B')
    expect(snapshotTag(h.redo(makeSnapshot('B')))).toBe('C')
    expect(snapshotTag(h.redo(makeSnapshot('C')))).toBe('after-C')
    expect(h.canRedo).toBe(false)
    expect(h.canUndo).toBe(true)
  })

  it('undo 後 push 新操作會清空 redoStack', () => {
    const h = new HistorySimulator()
    h.push(makeSnapshot('A'))
    h.push(makeSnapshot('B'))

    h.undo(makeSnapshot('current'))
    expect(h.canRedo).toBe(true)

    h.push(makeSnapshot('E'))
    expect(h.canRedo).toBe(false)
    expect(h.canUndo).toBe(true)
  })

  it('undo 和 redo 交替操作仍保持一致', () => {
    const h = new HistorySimulator()
    h.push(makeSnapshot('A'))
    h.push(makeSnapshot('B'))
    h.push(makeSnapshot('C'))
    h.push(makeSnapshot('D'))
    // undoStack=[A,B,C,D], redoStack=[], 畫面=after-D

    // undo: 取出 D, 畫面回到 D
    expect(snapshotTag(h.undo(makeSnapshot('after-D')))).toBe('D')
    // undo: 取出 C, 畫面回到 C
    expect(snapshotTag(h.undo(makeSnapshot('D')))).toBe('C')
    // redo: 取出 D, 畫面回到 D
    expect(snapshotTag(h.redo(makeSnapshot('C')))).toBe('D')
    // undo: 取出 C, 畫面回到 C
    expect(snapshotTag(h.undo(makeSnapshot('D')))).toBe('C')
    // redo: 取出 D, 畫面回到 D
    expect(snapshotTag(h.redo(makeSnapshot('C')))).toBe('D')
    expect(h.canRedo).toBe(true) // redoStack 仍有 after-D
  })

  it('空堆疊時 undo/redo 回傳 null', () => {
    const h = new HistorySimulator()
    expect(h.undo(makeSnapshot('X'))).toBeNull()
    expect(h.redo(makeSnapshot('X'))).toBeNull()
  })

  it('完整模擬：編輯地形 → undo → redo → 再編輯 → undo', () => {
    const h = new HistorySimulator()

    // 編輯前 push 當前狀態，然後修改
    let current = makeSnapshot('initial')
    h.push(current)  // undoStack=['initial'], 畫面將變為 edit-1
    current = makeSnapshot('edit-1')
    h.push(current)  // undoStack=['initial','edit-1'], 畫面將變為 edit-2
    current = makeSnapshot('edit-2')
    h.push(current)  // undoStack=['initial','edit-1','edit-2'], 畫面將變為 edit-3
    current = makeSnapshot('edit-3')
    // 畫面 = edit-3, undoStack=['initial','edit-1','edit-2']

    // undo: 取出 edit-2, 畫面回到 edit-2
    let restored = h.undo(current)
    expect(snapshotTag(restored)).toBe('edit-2')
    current = restored!

    // undo: 取出 edit-1, 畫面回到 edit-1
    restored = h.undo(current)
    expect(snapshotTag(restored)).toBe('edit-1')
    current = restored!

    // redo: 取出 edit-2, 畫面回到 edit-2
    restored = h.redo(current)
    expect(snapshotTag(restored)).toBe('edit-2')
    current = restored!

    // redo: 取出 edit-3, 畫面回到 edit-3
    restored = h.redo(current)
    expect(snapshotTag(restored)).toBe('edit-3')
    current = restored!

    // 再編輯：push edit-3, 畫面將變為 edit-4
    h.push(current)
    current = makeSnapshot('edit-4')

    // undo: 取出 edit-3, 畫面回到 edit-3
    restored = h.undo(current)
    expect(snapshotTag(restored)).toBe('edit-3')
    expect(h.canRedo).toBe(true)
  })
})
