type LevelBadgeProps = {
  level: number
  /** 徽章標籤文字，預設「等級」。 */
  label?: string
  /** 徽章色系；官階使用金色，角色等級使用紫色。 */
  tone?: 'level' | 'rank'
}

/**
 * 等級徽章（L3 封裝元件）。
 * 統一「等級」徽章的呈現，禁止在畫面層自行拼湊。
 */
function LevelBadge({ level, label = '等級', tone = 'level' }: LevelBadgeProps) {
  return (
    <div className={`level-badge level-badge--${tone}`} aria-label={`${label} ${level}`}>
      <span className="level-badge__label">{label}</span>
      <strong>Lv.{level}</strong>
    </div>
  )
}

export default LevelBadge
