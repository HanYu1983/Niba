import type { ExternalSkill } from '../catalogs/externalSkillCatalog'
import type { PlayerState } from '../types'

/**
 * 取得公用指令欄中顯示的「可施放外功」清單（依裝備順序）。
 * 靈氣型外功（aura）為常駐開關，不顯示在公用指令欄，故排除。
 * 此清單順序即為數字快捷鍵 1..N 的對應順序。
 */
export function getCommandPanelSkills(
  player: PlayerState | null,
  externalSkills: ExternalSkill[],
): ExternalSkill[] {
  if (!player) return []
  return player.equippedExternalSkillIds
    .map((skillId) => externalSkills.find((skill) => skill.id === skillId))
    .filter((skill): skill is ExternalSkill => skill !== undefined && skill.category !== 'aura')
}