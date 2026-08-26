import { useEffect } from 'react'
import type { PlayerState } from '../game/types'
import type { ExternalSkill } from '../game/catalogs/externalSkillCatalog'
import { getCommandPanelSkills } from '../game/rules/commandPanelSkills'

type UseKeyboardShortcutsParams = {
  activePlayer: PlayerState | null
  creatureTurnInProgress: boolean
  blockingModal: boolean
  modalOpen: boolean
  movementUsed: boolean
  externalSkills: ExternalSkill[]
  onToggleMovement: () => void
  onBeginAttackTargeting: () => void
  onOpenInventory: () => void
  onOpenEquipment: () => void
  onOpenSkills: () => void
  onUseExternalSkill: (skillId: string) => void
  onEndTurn: () => void
}

function useKeyboardShortcuts({
  activePlayer,
  creatureTurnInProgress,
  blockingModal,
  modalOpen,
  movementUsed,
  externalSkills,
  onToggleMovement,
  onBeginAttackTargeting,
  onOpenInventory,
  onOpenEquipment,
  onOpenSkills,
  onUseExternalSkill,
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

      // 數字鍵 1..N：對應公用指令欄中傷害型外功的順序。
      if (/^[1-9]$/.test(key)) {
        const skillIndex = Number(key) - 1
        const commandPanelSkills = getCommandPanelSkills(activePlayer, externalSkills)
        const skill = commandPanelSkills[skillIndex]
        if (skill) {
          const usedThisTurn = activePlayer.externalSkillsUsedThisTurn?.includes(skill.id) ?? false
          const canCast = !usedThisTurn && activePlayer.innerPower >= skill.innerPowerCost
          if (canCast) {
            event.preventDefault()
            onUseExternalSkill(skill.id)
          }
        }
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
    externalSkills,
    onBeginAttackTargeting,
    onEndTurn,
    onOpenInventory,
    onOpenEquipment,
    onOpenSkills,
    onToggleMovement,
    onUseExternalSkill,
  ])
}

export default useKeyboardShortcuts