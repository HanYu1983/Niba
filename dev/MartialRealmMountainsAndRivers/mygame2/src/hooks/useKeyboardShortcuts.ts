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
  onMove: (rowDelta: number, columnDelta: number) => void
  onBeginAttackTargeting: () => void
  onOpenInventory: () => void
  onOpenEquipment: () => void
  onOpenSkills: () => void
  onUseExternalSkill: (skillId: string) => void
  onBuildRoad: () => void
  onEndTurn: () => void
}

function useKeyboardShortcuts({
  activePlayer,
  creatureTurnInProgress,
  blockingModal,
  modalOpen,
  movementUsed,
  externalSkills,
  onMove,
  onBeginAttackTargeting,
  onOpenInventory,
  onOpenEquipment,
  onOpenSkills,
  onUseExternalSkill,
  onBuildRoad,
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

      // WASD：移動上／左／下／右一格。
      const moveDirections: Record<string, [number, number]> = {
        w: [-1, 0],
        a: [0, -1],
        s: [1, 0],
        d: [0, 1],
      }
      if (key in moveDirections) {
        if (activePlayer.stamina > 0) {
          event.preventDefault()
          const [rowDelta, columnDelta] = moveDirections[key]
          onMove(rowDelta, columnDelta)
        }
      }

      if (key === 'b') {
        event.preventDefault()
        onOpenInventory()
      }

      // 普通攻擊：進入攻擊目標選取模式。
      if (key === 'q') {
        event.preventDefault()
        onBeginAttackTargeting()
      }

      if (key === 'e') {
        event.preventDefault()
        onOpenEquipment()
      }

      if (key === 'x') {
        event.preventDefault()
        onOpenSkills()
      }

      // 修路：將所在格改為道路。
      if (key === 'r') {
        if (activePlayer.stamina >= 2) {
          event.preventDefault()
          onBuildRoad()
        }
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
    onMove,
    onOpenInventory,
    onOpenEquipment,
    onOpenSkills,
    onUseExternalSkill,
    onBuildRoad,
  ])
}

export default useKeyboardShortcuts