import { Card, Flex, Statistic, Tag, Tooltip, Typography } from 'antd'
import type { GameState } from '../game/types'
import { getActiveGlobalBuffs, getGlobalBuffDisplayEntries } from '../game/rules/globalBuffRules'
import { getAuraDisplayEntries } from '../game/rules/auraRules'

type GameStatusCardProps = {
  gameState: GameState
}

function GameStatusCard({ gameState }: GameStatusCardProps) {
  const activePlayer = gameState.players.find((player) => player.id === gameState.activePlayerId) ?? null
  const totalCreatures = gameState.creatures.length
  const nests = gameState.creatureNests.length
  const bases = gameState.bases.length
  const exploredCells = gameState.visibility?.exploredCellIds.length ?? 0
  const totalCells = gameState.map.cells.length
  const activeBuffs = getActiveGlobalBuffs(gameState)
  const buffEntries = getGlobalBuffDisplayEntries(activeBuffs)
  // 目前行動玩家所在位置的區域靈氣（巢穴灼燒/金煞、防衛營回血）。
  const auraEntries = activePlayer
    ? getAuraDisplayEntries(gameState, activePlayer.position, 'player')
    : []

  return (
    <Card className="game-status-card" variant="borderless" size="small">
      <Flex align="center" wrap gap={24}>
        <div className="game-status-card__title">
          <Typography.Text className="game-status-card__eyebrow">WORLD STATUS</Typography.Text>
          <Typography.Title level={4} style={{ margin: 0 }}>世界狀態</Typography.Title>
        </div>

        <Statistic title="回合數" value={gameState.round} suffix="回合" />
        <Statistic title="玩家數" value={gameState.players.length} />
        <Statistic title="生物數量" value={totalCreatures} />
        <Statistic title="巢穴" value={nests} />
        <Statistic title="據點" value={bases} />
        <Statistic title="地圖探索" value={`${exploredCells} / ${totalCells}`} />

        {activePlayer && (
          <Flex vertical gap={4}>
            <Typography.Text type="secondary">目前行動</Typography.Text>
            <Typography.Text strong style={{ fontSize: 20, color: '#4b3a22' }}>
              {activePlayer.name}
            </Typography.Text>
          </Flex>
        )}

        {buffEntries.length > 0 && (
          <Flex vertical gap={4}>
            <Typography.Text type="secondary">全局靈氣</Typography.Text>
            <Flex wrap gap={4}>
              {buffEntries.map((entry) => {
                const levelLabel = entry.count === 1
                  ? `Lv.${entry.levels[0]}`
                  : entry.levels.map((level) => `Lv.${level}`).join('、')
                return (
                  <Tooltip key={entry.kind} title={`${entry.name}：${entry.description}（共 ${entry.count} 層、${levelLabel}，合計 ${entry.totalPercent}%）`}>
                    <Tag color="purple">{entry.name} {levelLabel}</Tag>
                  </Tooltip>
                )
              })}
            </Flex>
          </Flex>
        )}

        {auraEntries.length > 0 && (
          <Flex vertical gap={4}>
            <Typography.Text type="secondary">當前區域靈氣</Typography.Text>
            <Flex wrap gap={4}>
              {auraEntries.map((entry, index) => {
                const isHarmful = entry.kind === 'damage-over-time'
                return (
                  <Tooltip key={`${entry.sourceId}-${index}`} title={`${entry.sourceName}：${entry.description}`}>
                    <Tag color={isHarmful ? 'red' : 'green'}>
                      {isHarmful ? '🔥' : '💚'} {entry.sourceName}（{entry.description}）
                    </Tag>
                  </Tooltip>
                )
              })}
            </Flex>
          </Flex>
        )}
      </Flex>
    </Card>
  )
}

export default GameStatusCard