import { useEffect } from 'react'
import type { MouseEvent } from 'react'
import { gameStore } from '../game/gameStore'

type PlayerProps = {
  id: string
  name?: string
  controllable?: boolean
  appearance?: 'player' | 'creature'
  icon?: string
  stamina?: number
  maxStamina?: number
  health?: number
  maxHealth?: number
  className?: string
  onClick?: (event: MouseEvent<HTMLDivElement>) => void
}

function Player({
  id,
  name = '玩家',
  controllable = true,
  appearance = 'player',
  icon,
  stamina,
  maxStamina,
  health,
  maxHealth,
  className,
  onClick,
}: PlayerProps) {
  useEffect(() => {
    if (!controllable) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const directions: Record<string, [number, number]> = {
        ArrowUp: [-1, 0],
        ArrowDown: [1, 0],
        ArrowLeft: [0, -1],
        ArrowRight: [0, 1],
      }
      const direction = directions[event.key]

      if (!direction) {
        return
      }

      event.preventDefault()
      gameStore.movePlayer(id, ...direction)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [controllable, id])

  return (
    <div
      className={`player player--${appearance}${className ? ` ${className}` : ''}`}
      title={name}
      aria-label={name}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(event) => {
        if (onClick && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault()
          onClick(event as unknown as MouseEvent<HTMLDivElement>)
        }
      }}
    >
      <span className="player__icon">{icon ?? (appearance === 'creature' ? '🐺' : '🧙')}</span>
      {stamina !== undefined && maxStamina !== undefined && (
        <span className="player__stamina" aria-label={`體力 ${Math.floor(stamina)} / ${Math.floor(maxStamina)}`}>
          ⚡{Math.floor(stamina)}/{Math.floor(maxStamina)}
        </span>
      )}
      {appearance === 'creature' && health !== undefined && maxHealth !== undefined && (
        <span className="player__health" aria-label={`血量 ${Math.round(health)} / ${Math.round(maxHealth)}`}>
          ♥{Math.round(health)}/{Math.round(maxHealth)}
        </span>
      )}
      <span className="player__marker" />
    </div>
  )
}

export default Player
