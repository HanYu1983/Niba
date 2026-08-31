/** 地圖座標與幾何運算。 */

export type Position = {
  row: number
  column: number
}

/** 回傳指定位置上下左右四格座標。 */
export function getAdjacentPositions(position: Position): Position[] {
  return [
    { row: position.row - 1, column: position.column },
    { row: position.row + 1, column: position.column },
    { row: position.row, column: position.column - 1 },
    { row: position.row, column: position.column + 1 },
  ]
}

export function isSamePosition(first: Position, second: Position): boolean {
  return first.row === second.row && first.column === second.column
}

/** 判斷 target 是否在 origin 的 range 格曼哈頓距離內（range = 1 等同相鄰；距離 0 回傳 false）。 */
export function isWithinRange(origin: Position, target: Position, range: number): boolean {
  const distance = Math.abs(origin.row - target.row) + Math.abs(origin.column - target.column)
  return distance <= range && distance > 0
}

export function isAdjacent(first: Position, second: Position): boolean {
  return isWithinRange(first, second, 1)
}

/** 判斷位置是否在目標自身格或周圍一格內。 */
export function isSameOrAdjacent(first: Position, second: Position): boolean {
  return isSamePosition(first, second) || isAdjacent(first, second)
}