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
 *
 * canUndo / canRedo 以 state 鏡像堆疊長度（渲染期間不可讀 ref），
 * 由 push/undo/redo 在更新 ref 後一併同步。
 */
export function useEditorHistory() {
  const ref = useRef<HistoryState>(EMPTY_STATE)
  const [, forceRender] = useState(0)
  const [stackSizes, setStackSizes] = useState({ undo: 0, redo: 0 })

  const syncSizes = () => {
    setStackSizes({ undo: ref.current.undoStack.length, redo: ref.current.redoStack.length })
  }

  const push = useCallback((snapshot: EditorSnapshot) => {
    const prev = ref.current
    const next = [...prev.undoStack, snapshot]
    const trimmed = next.length > MAX_HISTORY ? next.slice(next.length - MAX_HISTORY) : next
    ref.current = { undoStack: trimmed, redoStack: [] }
    forceRender((n) => n + 1)
    setStackSizes({ undo: trimmed.length, redo: 0 })
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
    syncSizes()
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
    syncSizes()
    return snapshot
  }, [])

  const canUndo = stackSizes.undo > 0
  const canRedo = stackSizes.redo > 0

  return { push, undo, redo, canUndo, canRedo }
}
