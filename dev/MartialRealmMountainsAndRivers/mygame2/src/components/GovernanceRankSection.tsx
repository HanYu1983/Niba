import { Flex, Tag, Typography } from 'antd'
import type { PlayerState } from '../game/types'
import {
  getGovernanceRankName,
  getGovernanceRankNumber,
  getNextGovernanceRequirement,
} from '../game/rules/governanceRules'
import StatBar from './StatBar'
import StatLabel from './StatLabel'

type GovernanceRankSectionProps = {
  player: PlayerState
}

/**
 * 官階（治理成長）區塊：徽章 + 官階名稱 + 階級標籤 + 聲望進度 + 下一階提示。
 * 依 UI Style Guide 三層規則，本元件屬 L3 資料顯示 UI，一律使用封裝元件，畫面層零 CSS。
 */
function GovernanceRankSection({ player }: GovernanceRankSectionProps) {
  const governanceRank = getGovernanceRankNumber(player.prestige)
  const governanceRankName = getGovernanceRankName(player.prestige)
  const nextRequirement = getNextGovernanceRequirement(governanceRank)
  const nextRankName = nextRequirement !== null ? getGovernanceRankName(nextRequirement) : null

  return (
    <Flex vertical gap={12}>
      <Flex align="center" gap={8}>
        <span role="img" aria-label="官階徽章">🏅</span>
        <Flex vertical gap={0}>
          <StatLabel>官階</StatLabel>
          <Typography.Text strong>{governanceRankName}</Typography.Text>
        </Flex>
        <Tag color="gold">第 {governanceRank} 階</Tag>
      </Flex>

      <StatBar
        label="聲望"
        current={player.prestige}
        max={nextRequirement ?? player.prestige}
        strokeColor={{ from: '#f0b429', to: '#d97706' }}
      />

      <Typography.Text type="secondary">
        {nextRankName
          ? `下一階「${nextRankName}」：還差 ${Math.max(0, (nextRequirement ?? 0) - player.prestige)} 聲望`
          : '已達最高官階'}
      </Typography.Text>
    </Flex>
  )
}

export default GovernanceRankSection