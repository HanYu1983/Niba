import { Divider, Tooltip, Typography } from 'antd'
import { FIVE_ELEMENTS, FIVE_ELEMENTS_COUNTERS_CYCLE, type FiveElementMeta } from '../game/rules/fiveElements'

/**
 * 五行構築小抄：在世界狀態卡顯示五行「相生／相剋」圖標，
 * 提示玩家如何構築功法 —— 內功元素「生」外功元素以觸發相生連攜（×1.25），
 * 外功元素「克」目標門派元素以觸發五行相剋（×1.25）。
 */
function FiveElementsChart() {
  return (
    <div className="world-status__five-elements">
      <Divider plain style={{ margin: '6px 0' }} className="world-status__divider">
        <Typography.Text className="world-status__divider-label">⚙️ 五行構築</Typography.Text>
      </Divider>

      {/* 相生環：金→土→水→木→火→金 */}
      <Tooltip title="相生連攜：裝備「內功元素」生「外功元素」時，該外功傷害 ×1.25（金→土→水→木→火→金）">
        <div className="world-status__row world-status__row--generation">
          <span className="world-status__row-title">相生</span>
          {FIVE_ELEMENTS.map((meta, index) => {
            const next = FIVE_ELEMENTS[(index + 1) % FIVE_ELEMENTS.length]
            return (
              <span key={meta.key} className="world-status__gen-link">
                <ElementBadge meta={meta} />
                <span className="world-status__gen-arrow" style={{ color: '#16a34a' }}>
                  生{next.label}
                </span>
              </span>
            )
          })}
        </div>
      </Tooltip>

      {/* 相剋環：金→木→土→水→火→金 */}
      <Tooltip title="五行相剋：外功元素克制目標門派元素，傷害 ×1.25（金克木、木克土、土克水、水克火、火克金）">
        <div className="world-status__row world-status__row--counters">
          <span className="world-status__row-title">相剋</span>
          {FIVE_ELEMENTS_COUNTERS_CYCLE.map((meta, index) => {
            const next = FIVE_ELEMENTS_COUNTERS_CYCLE[(index + 1) % FIVE_ELEMENTS_COUNTERS_CYCLE.length]
            return (
              <span key={meta.key} className="world-status__gen-link">
                <ElementBadge meta={meta} />
                <span className="world-status__gen-arrow" style={{ color: '#dc2626' }}>
                  克{next.label}
                </span>
              </span>
            )
          })}
        </div>
      </Tooltip>

      {/* 構築啟示文字 */}
      <div className="world-status__hint">
        <Typography.Text className="world-status__hint-text">
          構築功法：
          <span className="world-status__hint-strong">內功「生」外功</span>
          <span className="world-status__hint-arrow">→</span>
          相生連攜
          <span className="world-status__hint-sep" />
          <span className="world-status__hint-strong">外功「克」目標</span>
          <span className="world-status__hint-arrow">→</span>
          五行相剋
        </Typography.Text>
      </div>
    </div>
  )
}

/** 單一元素徽章：色圓 + 圖示 + 名稱。 */
function ElementBadge({ meta }: { meta: FiveElementMeta }) {
  return (
    <Tooltip title={meta.label}>
      <span className="world-status__badge" style={{ '--element-color': meta.color } as React.CSSProperties}>
        <span className="world-status__badge-icon">{meta.icon}</span>
        <span className="world-status__badge-label">{meta.label}</span>
      </span>
    </Tooltip>
  )
}

export default FiveElementsChart