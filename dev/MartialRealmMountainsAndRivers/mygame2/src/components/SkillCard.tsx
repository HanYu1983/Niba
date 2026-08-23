import { Flex, Tag, Typography } from 'antd'
import type { CSSProperties, ReactNode } from 'react'
import StatLabel from './StatLabel'
import HighlightText from './HighlightText'
import { getElementName, type MartialElement } from '../game/rules/skillRules'

type SkillCardProps = {
  /** 卡片圖示（emoji）。 */
  icon: ReactNode
  /** 頂部小標籤（如「裝備內功」「外功」）。 */
  label: ReactNode
  /** 功法五行屬性。未指定時視為無屬性。 */
  element?: MartialElement
  /** 技能名稱。 */
  name: ReactNode
  /** 技能描述。 */
  description: ReactNode
  /** 右上角狀態標籤（如「已裝備」）。 */
  status?: ReactNode
  /** 額外資訊列（如功法等級、內力消耗）。 */
  meta?: ReactNode
  /** 主強調數值（如「目前傷害值」）。 */
  highlight?: { label: ReactNode; value: ReactNode }
  /** 漸層主色，預設紫色系（功法）。 */
  tone?: 'violet' | 'gold'
  /** 底部操作區（按鈕等）。 */
  children?: ReactNode
}

/**
 * 功法技能卡（L3 封裝元件）。
 * 統一內功 / 外功卡片的呈現，視覺收斂於元件內部，畫面層零 CSS。
 */
function SkillCard({ icon, label, element = 'none', name, description, status, meta, highlight, tone = 'violet', children }: SkillCardProps) {
  const elementTagColor: Record<MartialElement, string> = {
    none: 'default',
    metal: 'gold',
    wood: 'green',
    water: 'blue',
    fire: 'red',
    earth: 'orange',
  }
  const elementTagStyle: Record<MartialElement, CSSProperties> = {
    none: { backgroundColor: '#f3f4f6', borderColor: '#9ca3af', color: '#374151' },
    metal: { backgroundColor: '#fef3c7', borderColor: '#d97706', color: '#92400e' },
    wood: { backgroundColor: '#dcfce7', borderColor: '#16a34a', color: '#166534' },
    water: { backgroundColor: '#dbeafe', borderColor: '#2563eb', color: '#1e40af' },
    fire: { backgroundColor: '#fee2e2', borderColor: '#dc2626', color: '#991b1b' },
    earth: { backgroundColor: '#ffedd5', borderColor: '#ea580c', color: '#9a3412' },
  }

  return (
    <div className={`skill-card skill-card--${tone}`}>
      <Flex align="center" gap={8}>
        <div className="skill-card__icon">{icon}</div>
        <Flex vertical flex={1} style={{ minWidth: 0 }}>
          <StatLabel>{label}</StatLabel>
          <Typography.Text strong className="skill-card__name">{name}</Typography.Text>
          <Tag
            className="skill-card__element-tag"
            color={elementTagColor[element]}
            style={{ alignSelf: 'flex-start', marginInlineEnd: 0, fontWeight: 700, ...elementTagStyle[element] }}
          >
            {getElementName(element)}
          </Tag>
        </Flex>
        {status && <Tag color={tone === 'gold' ? 'gold' : 'purple'}>{status}</Tag>}
      </Flex>

      <Typography.Text className="skill-card__description">
        {typeof description === 'string' ? <HighlightText>{description}</HighlightText> : description}
      </Typography.Text>

      {highlight && (
        <div className="skill-card__highlight">
          <span>{highlight.label}</span>
          <strong>{highlight.value}</strong>
        </div>
      )}

      {meta && <div className="skill-card__meta">{meta}</div>}

      {children && <div className="skill-card__actions">{children}</div>}
    </div>
  )
}

export default SkillCard
