import { Tag, Tooltip } from 'antd'
import type { CSSProperties, ReactNode } from 'react'
import { getElementName, type MartialElement } from '../game/rules/skillRules'

export type InteractionFlag = {
  synergy?: boolean
  resonance?: boolean
  tripleResonance?: string
}

type UnifiedSkillCardProps = {
  icon: ReactNode
  /** 作用區分：『內功』或『外功』。 */
  kind: 'inner' | 'external'
  element?: MartialElement
  name: string
  status?: string
  level: number
  primaryValue: number
  primaryLabel: string
  interactions?: InteractionFlag
  /** 天生共鳴（內功卡片用；外功卡片此標記改由 interactions.resonance 判斷）。 */
  resonance?: boolean
  /** 未裝備時仍顯示的連攜提示（外功被內功所生）。 */
  synergyHint?: boolean
  /** 是否已裝備/開啟。 */
  equipped: boolean
  /** 是否可點擊操作。 */
  clickable: boolean
  tooltip?: ReactNode
  onClick?: () => void
}

function UnifiedSkillCard({
  icon,
  element = 'none',
  name,
  status,
  level,
  primaryValue,
  primaryLabel,
  interactions = {},
  resonance,
  synergyHint = false,
  equipped,
  clickable,
  tooltip,
  onClick,
}: UnifiedSkillCardProps) {
  const elementTagStyle: Record<MartialElement, CSSProperties> = {
    none: { backgroundColor: '#f3f4f6', borderColor: '#9ca3af', color: '#374151' },
    metal: { backgroundColor: '#fef3c7', borderColor: '#d97706', color: '#92400e' },
    wood: { backgroundColor: '#dcfce7', borderColor: '#16a34a', color: '#166534' },
    water: { backgroundColor: '#dbeafe', borderColor: '#2563eb', color: '#1e40af' },
    fire: { backgroundColor: '#fee2e2', borderColor: '#dc2626', color: '#991b1b' },
    earth: { backgroundColor: '#ffedd5', borderColor: '#ea580c', color: '#9a3412' },
  }

  const classes = [
    'unified-skill-card',
    equipped ? 'unified-skill-card--equipped' : '',
    !clickable ? 'unified-skill-card--disabled' : '',
    synergyHint && !equipped ? 'unified-skill-card--synergy-hint' : '',
  ].filter(Boolean).join(' ')

  return (
    <Tooltip title={tooltip}>
      <div
        className={classes}
        role={clickable ? 'button' : undefined}
        tabIndex={clickable ? 0 : undefined}
        onClick={clickable ? onClick : undefined}
        onKeyDown={(event) => {
          if (clickable && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault()
            onClick?.()
          }
        }}
      >
        <div className="unified-skill-card__header">
          <span className="unified-skill-card__icon">{icon}</span>
          <span className="unified-skill-card__name" title={name}>{name}</span>
          {status && <span className="unified-skill-card__status">{status}</span>}
        </div>
        <Tag className="unified-skill-card__element" style={elementTagStyle[element]}>
          {getElementName(element)}
        </Tag>
        <div className="unified-skill-card__primary">
          <span>{primaryLabel}</span>
          <strong>{primaryValue}</strong>
          <span> · Lv.{level}</span>
        </div>
        <div className="unified-skill-card__tags">
          {interactions.synergy ? <span className="unified-skill-card__tag tag--synergy">💚 相生連攜</span> : null}
          {(interactions.resonance ?? resonance) ? <span className="unified-skill-card__tag tag--resonance">🌍 天地共鳴</span> : null}
          {interactions.tripleResonance ? <span className="unified-skill-card__tag tag--triple">🔥 三重共振：{interactions.tripleResonance}</span> : null}
        </div>
        {clickable && (
          <div className="unified-skill-card__action">
            {equipped ? '已裝備' : '點擊切換'}
          </div>
        )}
      </div>
    </Tooltip>
  )
}

export default UnifiedSkillCard