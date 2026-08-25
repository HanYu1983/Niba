/**
 * 模糊邏輯隸屬函數（Fuzzy Membership Functions）。
 *
 * 梯形隸屬函數：trapezoid(x, a, b, c, d)
 *   x <= a:      0
 *   a < x <= b:  (x - a) / (b - a)
 *   b < x <= c:  1
 *   c < x <= d:  (d - x) / (d - c)
 *   x > d:       0
 */
export function trapezoid(x: number, a: number, b: number, c: number, d: number): number {
  if (x <= a) return 0
  if (x <= b) return (b === a) ? 1 : (x - a) / (b - a)
  if (x <= c) return 1
  if (x <= d) return (d === c) ? 0 : (d - x) / (d - c)
  return 0
}

/** AND 取最小值 */
export function fuzzyAnd(...values: number[]): number {
  return Math.min(...values)
}

/** OR 取最大值 */
export function fuzzyOr(...values: number[]): number {
  return Math.max(...values)
}
