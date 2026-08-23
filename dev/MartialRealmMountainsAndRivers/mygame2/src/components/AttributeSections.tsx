import { Button, Tooltip, Typography } from 'antd'
import type { PlayerAttributes, UpgradeableAttribute } from '../game/types'
import { ATTRIBUTE_NAMES } from '../game/types'
import StatLabel from './StatLabel'

/** 每個屬性的效果說明（增加點數會影響的數值）。 */
const ATTRIBUTE_DESCRIPTIONS: Record<UpgradeableAttribute, string> = {
  armStrength: '臂力：提升普通攻擊傷害與暴擊率（每 1 點 +2% 暴擊率），並小幅提升最大體力。',
  constitution: '根骨：提升最大生命（每 1 點 +3 氣血），並提升減傷率（每 1 點 +2% 機率使傷害減半）。',
  agility: '身法：提升回避率（每 1 點 +1% 閃避），並小幅提升最大體力。',
  innerEnergy: '內息：提升最大內力（每 1 點 +3 內力）。',
  insight: '悟性：提升運功數值上限，可裝備更多外功／內功。',
}

type AttributeSectionsProps = {
  attributes: PlayerAttributes
  availableAttributePoints?: number
  onAllocateAttributePoint?: (attribute: UpgradeableAttribute) => void
  className?: string
}

/**
 * 屬性區塊（L3 資料顯示 UI）。
 * 資料顯示（屬性名稱、數值）使用封裝元件，佈局結構保留於元件內部。
 */
function AttributeSections({
  attributes,
  availableAttributePoints = 0,
  onAllocateAttributePoint,
  className = '',
}: AttributeSectionsProps) {
  return (
    <div className={`attribute-sections ${className}`.trim()}>
      <div className="attribute-sections__group">
        <div className="attribute-sections__heading">
          <Typography.Text strong>基本屬性</Typography.Text>
          <Typography.Text type="secondary">角色能力</Typography.Text>
        </div>
        <div className="attribute-sections__grid">
          {(Object.keys(ATTRIBUTE_NAMES) as UpgradeableAttribute[]).map((attribute) => (
            <div className={`attribute-sections__item attribute-sections__item--${attribute}`} key={attribute}>
              <Tooltip title={ATTRIBUTE_DESCRIPTIONS[attribute]}>
                <StatLabel>{ATTRIBUTE_NAMES[attribute]}</StatLabel>
              </Tooltip>
              <strong>{attributes[attribute]}</strong>
              {onAllocateAttributePoint && (
                <Button
                  className="attribute-sections__add-button"
                  size="small"
                  type="text"
                  disabled={availableAttributePoints <= 0}
                  aria-label={`提升${ATTRIBUTE_NAMES[attribute]}`}
                  onClick={() => onAllocateAttributePoint(attribute)}
                >
                  +
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AttributeSections
