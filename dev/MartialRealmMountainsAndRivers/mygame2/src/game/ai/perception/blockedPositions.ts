/**
 * 感知層阻擋與路徑成本的統一出口。
 *
 * 玩家移動、AI 決策已共用 rules/movementRules 的實作（單一事實來源），
 * 此檔是 AI 層的固定進入點：之後 Actor Adapter（ref.kind 分岔）若需
 * 依物種調整阻擋規則（如 Creature 忽略某些佔位），改寫此處即可。
 */
export { buildMovementCostMap, getBlockedPositions, getMovementCostTo } from '../../rules/movementRules'
