import { Button, Descriptions, Divider, Flex, Modal, Typography } from 'antd'
import type { BattleRecord, PlayerBattleRecord } from '../game/battleRecord'
import AttributeSections from './AttributeSections'
import SkillCard from './SkillCard'
import { getSkillDamage } from '../game/rules/skillRules'

type GameOverModalProps = {
  open: boolean
  won?: boolean
  reason?: 'all-players-defeated' | 'any-base-destroyed'
  record?: BattleRecord
  /** 本局結算獲得的武學殘卷（null 表示未選用名册角色；'skipped' 表示此局已領取過）。 */
  scrollReward?: number | 'skipped' | null
  /** 本局重啓（以相同設定重新開始本局）。 */
  onRestart: () => void
  /** 回到遊戲開始畫面。 */
  onGoHome: () => void
  /** 關閉結算彈窗（玩家可回到地圖觀察局末狀態）。 */
  onClose?: () => void
}

/** 單一玩家的結局戰績區塊。 */
function PlayerRecordSection({ player }: { player: PlayerBattleRecord }) {
  return (
    <Flex vertical gap={12}>
      <Typography.Title level={5} style={{ margin: 0 }}>{player.name}</Typography.Title>
      <Descriptions
        column={2}
        size="small"
        bordered
        items={[
          { key: 'level', label: '等級', children: player.level },
          { key: 'prestige', label: '聲望', children: player.prestige },
          { key: 'rank', label: '治理階級', children: player.governanceRank },
          { key: 'money', label: '金錢結餘', children: player.money },
        ]}
      />
      <Flex gap={16} wrap align="flex-start">
        <div style={{ flex: 1, minWidth: 220 }}>
          <Typography.Text strong>局末五維</Typography.Text>
          <AttributeSections attributes={player.attributes} />
        </div>
        <div style={{ flex: 1, minWidth: 220 }}>
          <Typography.Text strong>內功功法</Typography.Text>
          <SkillCard
            icon="☯"
            label="裝備內功"
            element={player.innerSkill.element}
            name={player.innerSkill.name}
            description={player.innerSkill.description}
            status="已裝備"
            highlight={{ label: '目前傷害值', value: getSkillDamage(player.attributes, player.innerSkill, player.innerSkillLevel) }}
            meta={`功法等級 Lv.${player.innerSkillLevel}`}
          />
        </div>
      </Flex>
    </Flex>
  )
}

function GameOverModal({ open, won = false, reason, record, scrollReward, onRestart, onGoHome, onClose }: GameOverModalProps) {
  const anyBaseDestroyed = reason === 'any-base-destroyed'
  const stats = record?.stats
  const players = record?.players ?? []
  return (
    <Modal
      title={won ? '勝利' : '遊戲結束'}
      open={open}
      closable={Boolean(onClose)}
      onCancel={onClose}
      maskClosable={false}
      keyboard={false}
      footer={null}
      destroyOnHidden
    >
      <Flex vertical gap={16}>
        <Typography.Title level={4} style={{ margin: 0 }}>{won ? '所有怪物巢穴已被摧毀' : anyBaseDestroyed ? '據點已被摧毀' : '所有玩家都已死亡'}</Typography.Title>
        <Typography.Paragraph style={{ margin: 0 }}>
          {won ? '玩家成功清除地圖上的所有威脅，本局冒險勝利！' : anyBaseDestroyed ? '有一個據點被摧毀，本局冒險結束。' : '怪物已消滅所有玩家，本局冒險結束。'}
        </Typography.Paragraph>

        {scrollReward === 'skipped' && (
          <Flex justify="center" align="center" style={{ border: '1px solid #666', borderRadius: 12, padding: '12px' }}>
            <Typography.Text type="secondary">此局已領取過武學殘卷獎勵。</Typography.Text>
          </Flex>
        )}

        {typeof scrollReward === 'number' && scrollReward > 0 && (
          <Flex
            justify="center"
            align="center"
            style={{
              border: '2px solid #d4a93a',
              borderRadius: 12,
              background: 'linear-gradient(135deg, #2b2110, #4a3a14)',
              padding: '16px 12px',
            }}
          >
            <Typography.Text style={{ fontSize: 28, fontWeight: 700, color: '#f3d57c' }}>
              📜 獲得武學殘卷 ×{scrollReward}
            </Typography.Text>
          </Flex>
        )}

        {record && (
          <Descriptions
            title="本局戰績"
            column={2}
            size="small"
            bordered
            items={[
              { key: 'rounds', label: '存活回合', children: record.roundsSurvived },
              { key: 'moneySpent', label: '累計消費', children: stats?.moneySpent ?? 0 },
              { key: 'creatures', label: '擊敗怪物', children: stats?.creaturesDefeated ?? 0 },
              { key: 'nests', label: '摧毀巢穴', children: stats?.nestsDestroyed ?? 0 },
              { key: 'maxNormal', label: '最高普攻傷害', children: Number.isFinite(stats?.maxNormalAttackDamage) ? stats?.maxNormalAttackDamage : 0 },
              { key: 'maxExternal', label: '最高外功傷害', children: Number.isFinite(stats?.maxExternalSkillDamage) ? stats?.maxExternalSkillDamage : 0 },
              { key: 'maxRoundDamage', label: '單回合最高傷害', children: Number.isFinite(stats?.maxDamageInSingleRound) ? stats?.maxDamageInSingleRound : 0 },
              { key: 'built', label: '建造建築', children: stats?.buildingsBuilt ?? 0 },
              { key: 'upgraded', label: '升級建築', children: stats?.buildingsUpgraded ?? 0 },
              { key: 'defense', label: '建造防禦設施', children: stats?.defenseStructuresBuilt ?? 0 },
              { key: 'events', label: '解決事件', children: stats?.eventsResolved ?? 0 },
              { key: 'items', label: '收集道具', children: stats?.itemsCollected ?? 0 },
              { key: 'skills', label: '參悟功法', children: stats?.skillsLearned ?? 0 },
              { key: 'maxLevel', label: '最高等級', children: stats?.maxLevelReached ?? 0 },
              { key: 'bases', label: '剩餘據點', children: record.remainingBases },
              { key: 'nestsLeft', label: '剩餘巢穴', children: record.remainingNests },
            ]}
          />
        )}

        {players.length > 0 && (
          <Flex vertical gap={16}>
            <Divider style={{ margin: 0 }}>玩家結算</Divider>
            {players.map((player) => (
              <PlayerRecordSection key={player.id} player={player} />
            ))}
          </Flex>
        )}

        {onClose && (
          <Button block onClick={onClose}>
            關閉（觀察局末狀態）
          </Button>
        )}
        <Flex gap={8}>
          <Button block onClick={onRestart}>
            本局重啓
          </Button>
          <Button type="primary" block onClick={onGoHome}>
            回到首頁
          </Button>
        </Flex>
      </Flex>
    </Modal>
  )
}

export default GameOverModal
