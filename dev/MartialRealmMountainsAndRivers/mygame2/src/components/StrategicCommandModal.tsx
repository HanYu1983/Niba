import { Modal, Select, Typography } from 'antd'
import { useState } from 'react'
import type { AiPersonalityId, PlayerState } from '../game/types'
import { AI_PERSONALITY_OPTIONS } from '../editor/editorOptions'

type StrategicCommandModalProps = {
  open: boolean
  aiPlayers: PlayerState[]
  onClose: () => void
  onSavePersonality: (playerId: string, personality: AiPersonalityId) => { ok: boolean; reason?: string }
}

function StrategicCommandModal({ open, aiPlayers, onClose, onSavePersonality }: StrategicCommandModalProps) {
  const initialAiId = aiPlayers[0]?.id ?? ''
  const [selectedAiId, setSelectedAiId] = useState(initialAiId)
  const selectedAi = aiPlayers.find((player) => player.id === selectedAiId)

  const changePersonality = (value: AiPersonalityId) => {
    if (!selectedAi) return
    onSavePersonality(selectedAi.id, value)
  }

  return (
    <Modal
      title="AI 戰略指揮"
      open={open}
      onCancel={onClose}
      width={520}
      footer={null}
      destroyOnHidden
    >
      {aiPlayers.length === 0 ? (
        <Typography.Text type="secondary">目前沒有可設定的 AI 玩家。</Typography.Text>
      ) : (
        <div className="strategic-command-modal__personality">
          <label>
            <Typography.Text strong>AI 玩家</Typography.Text>
            <Select
              value={selectedAiId}
              onChange={setSelectedAiId}
              style={{ width: '100%', marginTop: 6 }}
              options={aiPlayers.map((player) => ({ label: `${player.name}（${player.id}）`, value: player.id }))}
            />
          </label>
          <label>
            <Typography.Text strong>AI 個性</Typography.Text>
            <Select
              value={selectedAi?.aiPersonality ?? 'balanced'}
              onChange={changePersonality}
              style={{ width: '100%', marginTop: 6 }}
              options={AI_PERSONALITY_OPTIONS}
            />
          </label>
        </div>
      )}
    </Modal>
  )
}

export default StrategicCommandModal