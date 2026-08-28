import { Button, Card, Descriptions, Divider, Space, Typography, message } from 'antd'
import { useMemo, useState } from 'react'
import type { GameSettings } from '../game/types'
import { getChallengeState, recordChallengeVictory, resetChallengeState } from '../game/challengeState'
import { generateChallengeMapConfig, getChallengeEnemyCount } from '../game/challengeMapGenerator'
import { getCharacters, type PersistentCharacter } from '../game/characterRoster'

type ChallengeTabProps = {
  /** 以換算後的地圖設置與所選角色開始挑戰。 */
  onStartChallenge: (settings: GameSettings, character: PersistentCharacter | undefined) => void
}

/** 挑戰關卡 Tab：顯示闖關等級與地圖設置換算結果，選角色後開始挑戰。 */
function ChallengeTab({ onStartChallenge }: ChallengeTabProps) {
  const [state, setState] = useState(() => getChallengeState())
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | undefined>(undefined)
  const rosterCharacters = useMemo(() => getCharacters(), [])

  const config = useMemo(() => generateChallengeMapConfig(state.level), [state.level])

  const handleStart = () => {
    const character = selectedCharacterId
      ? rosterCharacters.find((c) => c.id === selectedCharacterId)
      : undefined
    onStartChallenge(config, character)
  }

  const handleVictory = () => {
    setState(recordChallengeVictory())
    message.success('已記錄通關，闖關等級 +1！')
  }

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card size="small">
        <Typography.Title level={4} style={{ marginTop: 0 }}>⚔️ 挑戰關卡</Typography.Title>
        <Descriptions size="small" column={3}>
          <Descriptions.Item label="當前闖關等級">Lv.{state.level}</Descriptions.Item>
          <Descriptions.Item label="歷史最高">Lv.{state.highestLevel}</Descriptions.Item>
          <Descriptions.Item label="總通關次數">{state.totalClears}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Divider style={{ margin: 0 }}>選擇挑戰角色</Divider>
      <select
        value={selectedCharacterId ?? ''}
        onChange={(e) => setSelectedCharacterId(e.target.value || undefined)}
        style={{ padding: '6px 10px', borderRadius: 6 }}
      >
        <option value="">預設角色（五維全 8）</option>
        {rosterCharacters.map((character) => (
          <option key={character.id} value={character.id}>
            {character.name}{character.title ? `（${character.title}）` : ''}
          </option>
        ))}
      </select>

      <Divider style={{ margin: 0 }}>關卡資訊（依地圖設置換算）</Divider>
      <Descriptions size="small" column={2} bordered>
        <Descriptions.Item label="地圖尺寸">{config.rows}×{config.columns}</Descriptions.Item>
        <Descriptions.Item label="基地數">{config.baseCount}</Descriptions.Item>
        <Descriptions.Item label="巢穴數">{config.nestCount}</Descriptions.Item>
        <Descriptions.Item label="初始遊蕩怪">{config.creatureCount}</Descriptions.Item>
        <Descriptions.Item label="資源點">{config.resourcePointCount}</Descriptions.Item>
        <Descriptions.Item label="道具點">{config.itemPointCount}</Descriptions.Item>
        <Descriptions.Item label="廢墟">{config.ruinCount}</Descriptions.Item>
        <Descriptions.Item label="門派據點">{config.sectGateCount}</Descriptions.Item>
        <Descriptions.Item label="怪物數量">{getChallengeEnemyCount(state.level)}</Descriptions.Item>
        <Descriptions.Item label="地形權重">隨機（值域 10~80）</Descriptions.Item>
        <Descriptions.Item label="探索事件">{config.explorationEventCount}</Descriptions.Item>
        <Descriptions.Item label="觸發機率">{((config.explorationTriggerChance ?? 0.05) * 100).toFixed(0)}%</Descriptions.Item>
        <Descriptions.Item label="巢穴回血">{((config.nestHealthRegenPercent ?? 0.01) * 100).toFixed(1)}% / 回合</Descriptions.Item>
      </Descriptions>

      <Space wrap>
        <Button type="primary" size="large" onClick={handleStart}>
          開始挑戰
        </Button>
        {/* 除錯用：模擬通關（暫不顯示，待正式通關結算接入後移除註解） */}
        {false && (
          <Button size="large" onClick={handleVictory}>
            ✅ 模擬通關（等級 +1）
          </Button>
        )}
        {/* 除錯用：重置挑戰狀態（暫不顯示） */}
        {false && (
          <Button
            size="large"
            danger
            onClick={() => { setState(resetChallengeState()); message.info('已重置挑戰狀態。') }}
          >
            🗑️ 重置挑戰狀態
          </Button>
        )}
      </Space>
    </Space>
  )
}

export default ChallengeTab
