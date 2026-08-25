import { Card, Flex, Statistic, Typography } from 'antd'
import type { GameState } from '../game/types'

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
      </Flex>
    </Card>
  )
}

export default GameStatusCard