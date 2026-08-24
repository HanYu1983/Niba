import { useCallback, useState } from 'react'
import type { TerrainType } from '../../game/types'
import type { BrushTool, ScenarioEntityKind } from '../editorTypes'

/**
 * 管理當前筆刷工具與選取中的實體。
 */
export function useEditorSelection() {
  const [brush, setBrush] = useState<BrushTool>({ kind: 'terrain', terrain: 'plain', size: 1 })
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null)
  // 記住進入「選取/橡皮擦」前的筆刷，toggle 關閉時恢復。
  const [lastBrush, setLastBrush] = useState<BrushTool>({ kind: 'terrain', terrain: 'plain', size: 1 })

  const selectTerrainBrush = useCallback((terrain: TerrainType) => {
    setBrush({ kind: 'terrain', terrain, size: 1 })
    setSelectedEntityId(null)
  }, [])

  const setBrushSize = useCallback((size: 1 | 2 | 3) => {
    setBrush((prev) => (prev.kind === 'terrain' ? { ...prev, size } : prev))
  }, [])

  const selectEntityBrush = useCallback((entityKind: ScenarioEntityKind) => {
    setBrush({ kind: 'entity', entityKind })
    setSelectedEntityId(null)
  }, [])

  const selectEraser = useCallback(() => {
    setBrush({ kind: 'eraser' })
    setSelectedEntityId(null)
  }, [])

  const selectSelectTool = useCallback(() => {
    setBrush({ kind: 'select' })
  }, [])

  /** 切換選取工具：若目前已是選取則恢復最後筆刷，否則記住目前筆刷並切到選取。 */
  const toggleSelectTool = useCallback(() => {
    setBrush((prev) => {
      if (prev.kind === 'select') {
        return lastBrush
      }
      setLastBrush(prev)
      return { kind: 'select' }
    })
  }, [lastBrush])

  /** 切換橡皮擦：若目前已是橡皮擦則恢復最後筆刷，否則記住目前筆刷並切到橡皮擦。 */
  const toggleEraser = useCallback(() => {
    setBrush((prev) => {
      if (prev.kind === 'eraser') {
        return lastBrush
      }
      setLastBrush(prev)
      return { kind: 'eraser' }
    })
    setSelectedEntityId(null)
  }, [lastBrush])

  return {
    brush,
    selectedEntityId,
    setSelectedEntityId,
    selectTerrainBrush,
    setBrushSize,
    selectEntityBrush,
    selectEraser,
    selectSelectTool,
    toggleSelectTool,
    toggleEraser,
  }
}
