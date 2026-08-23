import { useCallback, useRef, useState } from 'react'
import type { EditorSnapshot } from '../editorTypes'

const MAX_HISTORY = 50

type HistoryState = {
  undoStack: EditorSnapshot[]
  redoStack: EditorSnapshot[]
}

const EMPTY_STATE: HistoryState = { undoStack: [], redoStack: [] }

/**
 * 編輯器 Undo / Redo 歷史管理。
 *
 * 使用 useRef 同步保存堆疊狀態，確保 undo/redo 能立即讀取並回傳結果，
 * 不依賴 setState updater 的執行時機（React 18+ automatic batching
 * 不保證 updater 在 return 前執行）。
 */
export function useEditorHistory() {
  const ref = useRef<HistoryState>(EMPTY_STATE)
  const [, forceRender] = useState(0)

  const push = useCallback((snapshot: EditorSnapshot) => {
    const prev = ref.current
    const next = [...prev.undoStack, snapshot]
    const trimmed = next.length > MAX_HISTORY ? next.slice(next.length - MAX_HISTORY) : next
    ref.current = { undoStack: trimmed, redoStack: [] }
    forceRender((n) => n + 1)
  }, [])

  const undo = useCallback((currentState: EditorSnapshot): EditorSnapshot | null => {
    const prev = ref.current
    if (prev.undoStack.length === 0) return null
    const snapshot = prev.undoStack[prev.undoStack.length - 1]
    ref.current = {
      undoStack: prev.undoStack.slice(0, prev.undoStack.length - 1),
      redoStack: [...prev.redoStack, currentState],
    }
    forceRender((n) => n + 1)
    return snapshot
  }, [])

  const redo = useCallback((currentState: EditorSnapshot): EditorSnapshot | null => {
    const prev = ref.current
    if (prev.redoStack.length === 0) return null
    const snapshot = prev.redoStack[prev.redoStack.length - 1]
    ref.current = {
      undoStack: [...prev.undoStack, currentState],
      redoStack: prev.redoStack.slice(0, prev.redoStack.length - 1),
    }
    forceRender((n) => n + 1)
    return snapshot
  }, [])

  const canUndo = ref.current.undoStack.length > 0
  const canRedo = ref.current.redoStack.length > 0

  return { push, undo, redo, canUndo, canRedo }
}
