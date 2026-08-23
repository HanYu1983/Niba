import { useEffect } from 'react'
import type { PlayerState } from '../game/types'

type UseKeyboardShortcutsParams = {
  activePlayer: PlayerState | null
  creatureTurnInProgress: boolean
  blockingModal: boolean
  modalOpen: boolean
  movementUsed: boolean
  onToggleMovement: () => void
  onBeginAttackTargeting: () => void
  onOpenInventory: () => void
  onOpenEquipment: () => void
  onOpenSkills: () => void
  onEndTurn: () => void
}

function useKeyboardShortcuts({
  activePlayer,
  creatureTurnInProgress,
  blockingModal,
  modalOpen,
  movementUsed,
  onToggleMovement,
  onBeginAttackTargeting,
  onOpenInventory,
  onOpenEquipment,
  onOpenSkills,
  onEndTurn,
}: UseKeyboardShortcutsParams) {
  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.altKey || event.metaKey || event.isComposing) {
        return
      }

      const target = event.target as HTMLElement | null
      if (
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable
      ) {
        return
      }

      if (!activePlayer || creatureTurnInProgress || blockingModal || modalOpen) {
        return
      }

      const key = event.key.toLowerCase()
      if ((activePlayer.health <= 0 || activePlayer.turnEnded) && key !== 'z') {
        return
      }

      if (key === 'w') {
        if (activePlayer.stamina > 0) {
          event.preventDefault()
          onToggleMovement()
        }
      }

      if (key === 'a') {
        event.preventDefault()
        onBeginAttackTargeting()
      }

      if (key === 'b') {
        event.preventDefault()
        onOpenInventory()
      }

      if (key === 'e') {
        event.preventDefault()
        onOpenEquipment()
      }

      if (key === 's') {
        event.preventDefault()
        onOpenSkills()
      }

      if (key === 'x') {
        event.preventDefault()
        onOpenSkills()
      }

      if (key === 'z') {
        event.preventDefault()
        onEndTurn()
      }
    }

    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  }, [
    activePlayer,
    blockingModal,
    modalOpen,
    creatureTurnInProgress,
    movementUsed,
    onBeginAttackTargeting,
    onEndTurn,
    onOpenInventory,
    onOpenEquipment,
    onOpenSkills,
    onToggleMovement,
  ])
}

export default useKeyboardShortcuts