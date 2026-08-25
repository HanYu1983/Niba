import AttackPreviewModal from '../AttackPreviewModal'
import ExternalSkillPreviewModal from '../ExternalSkillPreviewModal'
import ItemBurstPreviewModal from '../ItemBurstPreviewModal'
import CreatureActionModal from '../CreatureActionModal'
import CreatureCommandPanel from '../CreatureCommandPanel'
import { getTerrainAtPosition } from '../../game/rules/terrainCombatRules'
import { getCreatureIcon } from '../../game/rules/creatureBehaviorRules'
import { gameStore } from '../../game/gameStore'
import {
  formatAttackResult,
  formatExternalSkillResult,
  formatItemBurstResult,
} from '../../game/actionResultFormatters'
import type { GameState, CreatureState } from '../../game/types'

type CombatOverlaysProps = {
  gameState: GameState
  selectedCreature: CreatureState | null
  onCloseCreaturePanel: () => void
}

/**
 * 戰鬥相關 overlay 群組：
 * - 攻擊預覽
 * - 外功預覽
 * - Creature 回合行動紀錄
 * - Creature 指令面板
 */
function CombatOverlays({
  gameState,
  selectedCreature,
  onCloseCreaturePanel,
}: CombatOverlaysProps) {
  // 生物行動訊息中會出現的名詞：生物名、據點名、巢穴名、資源點名、防禦設施名、事件名，皆視為「生物/據點」高亮。
  const creatureActionTerms = [
    ...gameState.creatures.map((c) => ({ name: c.name, category: 'creature' } as const)),
    ...gameState.bases.map((b) => ({ name: b.name, category: 'base' } as const)),
    ...gameState.creatureNests.map((n) => ({ name: n.name, category: 'creature' } as const)),
    ...gameState.resourcePoints.map((r) => ({ name: r.name, category: 'base' } as const)),
    ...(gameState.defenseStructures ?? []).map((s) => ({ name: s.name, category: 'building' } as const)),
    ...(gameState.explorationEvents ?? []).map((e) => ({ name: e.name, category: 'base' } as const)),
    ...gameState.players.map((p) => ({ name: p.name, category: 'base' } as const)),
  ]

  return (
    <>
      <AttackPreviewModal
        preview={gameState.attackPreview}
        onCancel={() => gameStore.clearAttackPreview()}
        onConfirm={() => {
          const result = gameStore.executeAttack()

          if (!result.ok) {
            gameStore.clearAttackPreview()
            gameStore.showActionResult({ title: '攻擊失敗', message: result.reason, rewards: [] })
            return
          }

          gameStore.showActionResult(formatAttackResult(result.data))
        }}
      />
      <ExternalSkillPreviewModal
        preview={gameState.externalSkillPreview}
        onCancel={() => gameStore.clearExternalSkillPreview()}
        onConfirm={() => {
          // 在執行前預先擷取目標生物資料（執行後生物可能已從 state 移除，供震動動畫定位）。
          const previewTarget = gameState.externalSkillPreview
          const targetCreature = previewTarget?.targetType === 'creature'
            ? gameState.creatures.find((creature) => creature.id === previewTarget.targetId)
            : undefined
          const result = gameStore.executeExternalDamagePreview()
          if (result.ok) {
            if (result.data.tripleResonance) {
              // 三重共振：先對被命中的生物位置播放 0.5s 震動動畫，結束後再顯示結果彈窗（串行）。
              gameStore.triggerCreatureShake(
                result.data.targetId,
                result.data.targetPosition ?? targetCreature?.position ?? { row: 0, column: 0 },
                targetCreature ? getCreatureIcon(targetCreature) : '👾',
              )
              window.setTimeout(() => {
                gameStore.showActionResult(formatExternalSkillResult(result.data))
              }, 500)
            } else {
              gameStore.showActionResult(formatExternalSkillResult(result.data))
            }
          } else {
            gameStore.showActionResult({ title: '外功失敗', message: result.reason, rewards: [] })
          }
        }}
      />
      <ItemBurstPreviewModal
        preview={gameState.itemBurstPreview ?? null}
        onCancel={() => gameStore.clearItemBurstPreview()}
        onConfirm={() => {
          const result = gameStore.executeItemBurst()
          if (result.ok) {
            gameStore.clearItemBurstPreview()
            gameStore.showActionResult(formatItemBurstResult(result.data))
          } else {
            gameStore.clearItemBurstPreview()
            gameStore.showActionResult({ title: '道具使用失敗', message: result.reason, rewards: [] })
          }
        }}
      />
      <CreatureActionModal
        open={gameState.creatureActionLogs.length > 0}
        logs={gameState.creatureActionLogs}
        onClose={() => gameStore.clearCreatureActionLogs()}
        extraTerms={creatureActionTerms}
      />
      <CreatureCommandPanel
        creature={selectedCreature}
        terrain={selectedCreature ? getTerrainAtPosition(gameState.map.cells, selectedCreature.position) : undefined}
        open={Boolean(selectedCreature)}
        onClose={onCloseCreaturePanel}
      />
    </>
  )
}

export default CombatOverlays
