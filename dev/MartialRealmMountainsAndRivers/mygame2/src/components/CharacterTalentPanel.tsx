import { Button, Checkbox, Divider, Flex, Space, Typography, message } from 'antd'
import { useEffect, useState } from 'react'
import {
  getCharacter,
  getTalentUnlockCost,
  unlockTalent,
  setCharacterTalent,
  type PersistentCharacter,
} from '../game/characterRoster'
import { getAvailableTalents } from '../game/catalogs/talentCatalog'

type CharacterTalentPanelProps = {
  character: PersistentCharacter
  /** 更新後回呼（供父層刷新列表）。 */
  onChanged?: () => void
}

/**
 * 天賦面板：與功法一致的三態管理。
 * 1) 可解鎖：花卷解鎖（一次性成本，越解鎖越貴）。
 * 2) 已解鎖：可在此開啟／關閉（切換 talentIds，不花卷）。
 * 天賦為常駐效果，開局隨角色注入對局。
 */
function CharacterTalentPanel({ character, onChanged }: CharacterTalentPanelProps) {
  const [current, setCurrent] = useState<PersistentCharacter>(character)
  // 父層 editing 更新（如培養 tab 扣卷後）時同步本面板快照，避免殘卷數顯示不一致。
  useEffect(() => {
    setCurrent(character)
  }, [character])
  const available = getAvailableTalents()
  const unlocked = current.unlockedTalentIds ?? []
  const nextUnlockCost = getTalentUnlockCost(unlocked.length)

  const refresh = () => {
    const latest = getCharacter(character.id)
    if (latest) setCurrent(latest)
    onChanged?.()
  }

  const handleUnlock = (talentId: string) => {
    const result = unlockTalent(character.id, talentId)
    if (result.ok) {
      message.success('已解鎖天賦。')
      refresh()
    } else {
      message.error(result.reason ?? '解鎖失敗。')
    }
  }

  const handleToggle = (talentId: string, checked: boolean) => {
    const result = setCharacterTalent(character.id, talentId, checked)
    if (result.ok) {
      message.success(checked ? '已開啟天賦。' : '已關閉天賦。')
      refresh()
    } else {
      message.error(result.reason ?? '更新失敗。')
    }
  }

  return (
    <>
      <Typography.Paragraph type="secondary">
        天賦需先花費武學殘卷解鎖，解鎖後可自由開啟／關閉（不花卷），開局隨角色注入對局。
      </Typography.Paragraph>
      <Typography.Paragraph type="secondary">
        目前持有 <Typography.Text strong>📜 {current.scrolls}</Typography.Text> 武學殘卷。
      </Typography.Paragraph>
      <Divider>天賦</Divider>
      <Flex gap={12} wrap>
        {available.map((talent) => {
          const isUnlocked = unlocked.includes(talent.id)
          const isEnabled = (current.talentIds ?? []).includes(talent.id)
          const status = isEnabled ? '已開啟' : isUnlocked ? '已解鎖' : '可解鎖'
          return (
            <Space key={talent.id} direction="vertical" style={{ width: 240, padding: 12, border: '1px solid #f0f0f0', borderRadius: 8 }}>
              <Space>
                <Typography.Text strong>{talent.name}</Typography.Text>
                <Typography.Text type="secondary">（{status}）</Typography.Text>
              </Space>
              <Typography.Text type="secondary">{talent.description}</Typography.Text>
              {!isUnlocked ? (
                <Button
                  size="small"
                  disabled={current.scrolls < nextUnlockCost}
                  onClick={() => handleUnlock(talent.id)}
                >
                  解鎖（{nextUnlockCost} 卷）
                </Button>
              ) : (
                <Checkbox
                  checked={isEnabled}
                  onChange={(e) => handleToggle(talent.id, e.target.checked)}
                >
                  開啟此天賦
                </Checkbox>
              )}
            </Space>
          )
        })}
      </Flex>
      {available.length === 0 && (
        <Typography.Text type="secondary">目前沒有可解鎖的天賦。</Typography.Text>
      )}
    </>
  )
}

export default CharacterTalentPanel