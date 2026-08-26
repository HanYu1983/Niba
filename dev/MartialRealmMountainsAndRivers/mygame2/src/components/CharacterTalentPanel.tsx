import { Checkbox, Divider, Typography, message } from 'antd'
import { useState } from 'react'
import {
  getCharacter,
  updateCharacter,
  type PersistentCharacter,
} from '../game/characterRoster'
import { getAvailableTalents } from '../game/catalogs/talentCatalog'

type CharacterTalentPanelProps = {
  character: PersistentCharacter
  /** 更新後回呼（供父層刷新列表）。 */
  onChanged?: () => void
}

/**
 * 天賦面板：勾選／取消角色所攜帶的天賦。
 * 天賦為常駐效果，開局隨角色注入對局；此面板以可勾選清單調整 selection。
 */
function CharacterTalentPanel({ character, onChanged }: CharacterTalentPanelProps) {
  const [current, setCurrent] = useState<PersistentCharacter>(character)
  const available = getAvailableTalents()

  const refresh = () => {
    const latest = getCharacter(character.id)
    if (latest) setCurrent(latest)
    onChanged?.()
  }

  const handleChange = (values: (string | number | boolean)[]) => {
    const next = values as string[]
    if (updateCharacter(character.id, { talentIds: next })) {
      message.success('天賦已更新。')
      refresh()
    } else {
      message.error('天賦更新失敗。')
    }
  }

  return (
    <>
      <Typography.Paragraph type="secondary">
        選擇天賦以改變玩法風格。天賦為常駐效果，開局隨角色注入對局，影響整個對局的表現。
      </Typography.Paragraph>
      <Divider>可選天賦</Divider>
      <Checkbox.Group
        value={current.talentIds ?? []}
        options={available.map((talent) => ({
          label: `${talent.name}｜${talent.description}`,
          value: talent.id,
        }))}
        onChange={handleChange}
      />
      {available.length === 0 && (
        <Typography.Text type="secondary">目前沒有可選用的天賦。</Typography.Text>
      )}
    </>
  )
}

export default CharacterTalentPanel