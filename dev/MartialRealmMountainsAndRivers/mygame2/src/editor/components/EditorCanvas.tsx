import { useCallback, useRef, useState } from 'react'
import { Typography } from 'antd'
import { TERRAIN_STYLES } from '../terrainStyles'
import type { Position, TerrainType } from '../../game/types'
import type { BrushTool, ScenarioCell, ScenarioEntityPlacement } from '../editorTypes'

const ENTITY_ICONS: Record<string, string> = {
  player: '🧙',
  base: '🏯',
  creature: '🐺',
  nest: '🕳️',
  ruin: '🏚️',
  resourcePoint: '💎',
  itemPoint: '🎁',
  event: '🧭',
  sectGate: '⛩️',
  defenseStructure: '🛡️',
}

const CELL_SIZE = 32

type EditorCanvasProps = {
  cells: ScenarioCell[]
  rows: number
  columns: number
  entities: ScenarioEntityPlacement[]
  brush: BrushTool
  selectedEntityId: string | null
  onPaintCells: (paints: Array<{ row: number; column: number; terrain: TerrainType }>) => void
  onPlaceEntity: (position: Position) => void
  onEraseEntity: (position: Position) => void
  onMoveEntity: (entityId: string, position: Position) => void
  onSelectEntity: (entityId: string | null) => void
}

function EditorCanvas({
  cells,
  rows,
  columns,
  entities,
  brush,
  selectedEntityId,
  onPaintCells,
  onPlaceEntity,
  onEraseEntity,
  onMoveEntity,
  onSelectEntity,
}: EditorCanvasProps) {
  const [hoverCell, setHoverCell] = useState<{ row: number; column: number } | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const lastPanRef = useRef<{ x: number; y: number } | null>(null)

  const cellMap = new Map<string, ScenarioCell>()
  for (const cell of cells) {
    cellMap.set(`${cell.row}-${cell.column}`, cell)
  }

  const entityMap = new Map<string, ScenarioEntityPlacement>()
  for (const entity of entities) {
    entityMap.set(`${entity.position.row}-${entity.position.column}`, entity)
  }

  const getBrushCells = (centerRow: number, centerColumn: number): Array<{ row: number; column: number }> => {
    if (brush.kind !== 'terrain') return [{ row: centerRow, column: centerColumn }]
    const offset = Math.floor(brush.size / 2)
    const result: Array<{ row: number; column: number }> = []
    for (let dr = 0; dr < brush.size; dr++) {
      for (let dc = 0; dc < brush.size; dc++) {
        const row = centerRow - offset + dr
        const column = centerColumn - offset + dc
        if (row >= 0 && row < rows && column >= 0 && column < columns) {
          result.push({ row, column })
        }
      }
    }
    return result
  }

  const handleCellMouseDown = useCallback((row: number, column: number) => {
    if (brush.kind === 'terrain') {
      setIsDragging(true)
      onPaintCells(getBrushCells(row, column).map((c) => ({ ...c, terrain: brush.terrain })))
    } else if (brush.kind === 'entity') {
      onPlaceEntity({ row, column })
    } else if (brush.kind === 'eraser') {
      onEraseEntity({ row, column })
    } else if (brush.kind === 'select') {
      const entity = entityMap.get(`${row}-${column}`)
      if (entity) {
        // 點擊實體：選取它。
        onSelectEntity(entity.id)
      } else if (selectedEntityId) {
        // 點擊空格：將已選取的實體移動到此處。
        onMoveEntity(selectedEntityId, { row, column })
      } else {
        onSelectEntity(null)
      }
    }
  }, [brush, entityMap, onPaintCells, onPlaceEntity, onEraseEntity, onSelectEntity, onMoveEntity, selectedEntityId])

  const handleCellMouseEnter = useCallback((row: number, column: number) => {
    setHoverCell({ row, column })
    if (isDragging && brush.kind === 'terrain') {
      onPaintCells(getBrushCells(row, column).map((c) => ({ ...c, terrain: brush.terrain })))
    }
  }, [isDragging, brush, onPaintCells])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleWheel = useCallback((event: React.WheelEvent) => {
    event.preventDefault()
    const delta = event.deltaY > 0 ? -0.1 : 0.1
    setZoom((prev) => Math.max(0.5, Math.min(3, prev + delta)))
  }, [])

  const handlePanStart = useCallback((event: React.MouseEvent) => {
    if (event.button === 2 || (event.button === 0 && event.shiftKey)) {
      event.preventDefault()
      lastPanRef.current = { x: event.clientX, y: event.clientY }
    }
  }, [])

  const handlePanMove = useCallback((event: React.MouseEvent) => {
    if (!lastPanRef.current) return
    const dx = event.clientX - lastPanRef.current.x
    const dy = event.clientY - lastPanRef.current.y
    setPan((prev) => ({ x: prev.x + dx, y: prev.y + dy }))
    lastPanRef.current = { x: event.clientX, y: event.clientY }
  }, [])

  const handlePanEnd = useCallback(() => {
    lastPanRef.current = null
  }, [])

  const previewCells = hoverCell ? getBrushCells(hoverCell.row, hoverCell.column) : []
  const previewSet = new Set(previewCells.map((c) => `${c.row}-${c.column}`))

  return (
    <div
      ref={containerRef}
      style={{
        flex: 1,
        overflow: 'hidden',
        position: 'relative',
        cursor: brush.kind === 'select' ? 'pointer' : brush.kind === 'terrain' ? 'crosshair' : 'copy',
        background: '#e8e8e8',
      }}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => { handleMouseUp(); handlePanEnd(); setHoverCell(null) }}
      onWheel={handleWheel}
      onMouseDown={handlePanStart}
      onMouseMove={handlePanMove}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: `translate(calc(-50% + ${pan.x}px), calc(-50% + ${pan.y}px)) scale(${zoom})`,
          transformOrigin: 'center center',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, ${CELL_SIZE}px)`,
            gridTemplateRows: `repeat(${rows}, ${CELL_SIZE}px)`,
            gap: 0,
            userSelect: 'none',
          }}
        >
          {Array.from({ length: rows * columns }, (_, index) => {
            const row = Math.floor(index / columns)
            const column = index % columns
            const cell = cellMap.get(`${row}-${column}`)
            const terrain = cell?.terrain ?? 'plain'
            const entity = entityMap.get(`${row}-${column}`)
            const isSelected = entity && entity.id === selectedEntityId
            const isPreview = previewSet.has(`${row}-${column}`)

            return (
              <div
                key={`${row}-${column}`}
                onMouseDown={() => handleCellMouseDown(row, column)}
                onMouseEnter={() => handleCellMouseEnter(row, column)}
                style={{
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  background: isPreview ? `${TERRAIN_STYLES[terrain].color}80` : TERRAIN_STYLES[terrain].color,
                  border: isSelected
                    ? '2px solid #ffd700'
                    : '1px solid rgba(0, 0, 0, 0.1)',
                  boxSizing: 'border-box',
                  position: 'relative',
                }}
                title={`(${row}, ${column}) ${TERRAIN_STYLES[terrain].label}`}
              >
                <span style={{ position: 'absolute', top: 0, left: 0, fontSize: 7, color: 'rgba(0,0,0,0.4)' }}>
                  {row},{column}
                </span>
                {entity && (
                  <span style={{ position: 'absolute', fontSize: 16 }}>
                    {ENTITY_ICONS[entity.kind] ?? '❓'}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* 底部狀態列 */}
      <div style={{ position: 'absolute', bottom: 8, left: 8, color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          {rows}×{columns} | 縮放 {Math.round(zoom * 100)}% | {hoverCell ? `(${hoverCell.row}, ${hoverCell.column})` : '—'}
        </Typography.Text>
      </div>
    </div>
  )
}

export default EditorCanvas
