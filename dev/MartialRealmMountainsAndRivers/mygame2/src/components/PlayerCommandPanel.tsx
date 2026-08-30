import { Button, Card, Flex, Tag, Tooltip, Typography } from 'antd'
import type { ExternalSkill } from '../game/catalogs/externalSkillCatalog'
import type { PlayerState } from '../game/types'
import { ACTION_STAMINA_COSTS } from '../game/rules/actionCostRules'
import { getSkillInnerPowerCost, getSkillProgression } from '../game/rules/skillRules'
import { getCommandPanelSkills } from '../game/rules/commandPanelSkills'

type PlayerCommandPanelProps = {
  player: PlayerState | null
  externalSkills: ExternalSkill[]
  inventoryCount: number
  movementEnabled: boolean
  creatureTurnInProgress: boolean
  onOpenInventory: () => void
  onOpenEquipment: () => void
  onOpenSkills: () => void
  onAttack: () => void
  onUseExternalSkill: (skillId: string) => void
  onToggleMovement: () => void
  onBuildRoad: () => void
  onFirstAid: () => void
  onEndTurn: () => void
  onOpenOptions: () => void
  /** 遊戲是否已結束（勝利或失敗）；為 true 時顯示局末結算按鈕。 */
  gameOverEnded?: boolean
  /** 重新開啟局末結算彈窗。 */
  onOpenGameOverModal?: () => void
}

function PlayerCommandPanel({
  player,
  externalSkills,
  inventoryCount,
  movementEnabled,
  creatureTurnInProgress,
  onOpenInventory,
  onOpenEquipment,
  onOpenSkills,
  onAttack,
  onUseExternalSkill,
  onToggleMovement,
  onBuildRoad,
  onFirstAid,
  onEndTurn,
  onOpenOptions,
  gameOverEnded = false,
  onOpenGameOverModal,
}: PlayerCommandPanelProps) {
  const canAct = Boolean(player && player.health > 0 && !player.turnEnded && !creatureTurnInProgress)
  const canSpend = (cost: number) => canAct && Boolean(player && player.stamina >= cost)
  const commandPanelSkills = getCommandPanelSkills(player, externalSkills)

  return (
    <Card className="player-command-panel" variant="borderless">
      <Flex align="center" justify="space-between" gap={16} wrap>
        <div className="player-command-panel__identity">
          <Typography.Text strong>{creatureTurnInProgress ? 'Creature 行動中' : `體力 ${Math.floor(player?.stamina ?? 0)} / ${Math.floor(player?.maxStamina ?? 0)}`}</Typography.Text>
          <Typography.Text>{player?.name ?? '無'}</Typography.Text>
          {player && <Tag color={canAct ? 'green' : 'orange'}>{canAct ? '你的回合' : '回合已結束'}</Tag>}
        </div>
        <Flex gap={8} wrap>
          <Tooltip title="快捷鍵 Q">
            <Button danger disabled={!canSpend(ACTION_STAMINA_COSTS.attack)} onClick={onAttack}>
              ⚔️ 攻擊{ACTION_STAMINA_COSTS.attack > 0 ? ` ✦${ACTION_STAMINA_COSTS.attack}` : ''}（Q）
            </Button>
          </Tooltip>
          {commandPanelSkills.map((skill, index) => {
            const usedThisTurn = player?.externalSkillsUsedThisTurn?.includes(skill.id) ?? false
            const skillLevel = getSkillProgression(player!, skill.id).level
            const actualInnerPowerCost = getSkillInnerPowerCost(skill.innerPowerCost, skillLevel)
            const hotkey = index + 1

            return (
              <Tooltip title={usedThisTurn ? '此外功本回合已使用' : `快捷鍵 ${hotkey}｜消耗內力 ${actualInnerPowerCost}｜${skill.description}`} key={skill.id}>
                <Button disabled={!canAct || usedThisTurn || (player?.innerPower ?? 0) < actualInnerPowerCost} onClick={() => onUseExternalSkill(skill.id)}>
                  ⚡ {skill.name}（內力 {actualInnerPowerCost}）（{hotkey}）
                </Button>
              </Tooltip>
            )
          })}
          {/* <Tooltip title="快捷鍵 W">
            <Button
              type={movementEnabled ? 'primary' : 'default'}
              disabled={!canAct || !player || player.stamina <= 0}
              onClick={onToggleMovement}
            >
              🧭 {movementEnabled ? '取消移動' : '移動'} ✦地形（W）
            </Button>
          </Tooltip> */}
          <Tooltip title={`快捷鍵 R｜修路：將所在格改為道路，消耗 ${ACTION_STAMINA_COSTS.buildRoad} 點體力`}>
            <Button disabled={!canSpend(ACTION_STAMINA_COSTS.buildRoad)} onClick={onBuildRoad}>
              🛤️ 修路 ✦{ACTION_STAMINA_COSTS.buildRoad}（R）
            </Button>
          </Tooltip>
          <Tooltip title={`急救：復活周圍一格內倒下的玩家，血量恢復至 5，消耗 ${ACTION_STAMINA_COSTS.firstAid} 點體力`}>
            <Button disabled={!canSpend(ACTION_STAMINA_COSTS.firstAid)} onClick={onFirstAid}>
              ⛑️ 急救 ✦{ACTION_STAMINA_COSTS.firstAid}
            </Button>
          </Tooltip>
          <Tooltip title={`快捷鍵 B｜使用道具消耗 ${ACTION_STAMINA_COSTS.useItem} 點體力`}>
            <Button disabled={!canSpend(ACTION_STAMINA_COSTS.useItem)} onClick={onOpenInventory}>
              🎒 道具· {inventoryCount}{ACTION_STAMINA_COSTS.useItem > 0 ? `（使用 ✦${ACTION_STAMINA_COSTS.useItem}）` : ''}（B）
            </Button>
          </Tooltip>
          <Tooltip title="快捷鍵 E">
            <Button disabled={!canAct} onClick={onOpenEquipment}>🛡️ 裝備（E）</Button>
          </Tooltip>
          <Tooltip title="快捷鍵 X">
            <Button disabled={!canAct} onClick={onOpenSkills}>
              ☯ 功法（X）
            </Button>
          </Tooltip>
          <Tooltip title="快捷鍵 Z">
            <Button type="primary" danger disabled={!player || creatureTurnInProgress} onClick={onEndTurn}>
              結束（Z）
            </Button>
          </Tooltip>
          <Button onClick={onOpenOptions}>選項</Button>
          {gameOverEnded && onOpenGameOverModal && (
            <Tooltip title="重新開啟局末結算彈窗，查看本局戰績">
              <Button type="primary" onClick={onOpenGameOverModal}>
                📊 局末結算
              </Button>
            </Tooltip>
          )}
        </Flex>
      </Flex>
    </Card>
  )
}

export default PlayerCommandPanel
