/**
 * 感知層距離的統一出口：委託 rules/mapCellStateRules 的單一實作。
 * 之後若換格子形狀或距離定義，AI 層只需改此處來源。
 */
export { getManhattanDistance as manhattanDistance } from '../../rules/mapCellStateRules'
