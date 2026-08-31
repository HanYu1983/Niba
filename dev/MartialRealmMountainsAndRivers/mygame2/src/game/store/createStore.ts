import type { GameState } from '../types'
import { recordMaxLevel } from '../runStats'

export type UpdateGameState = (updater: (state: GameState) => GameState) => void

/** 掃描人類玩家，記錄最高等級與該等級五維快照。 */
function recordHumanMaxLevel(state: GameState): GameState {
  let next = state
  for (const player of state.players) {
    if (player.isAI) continue
    const level = player.level ?? 1
    next = recordMaxLevel(next, level, player.attributes)
  }
  return next
}

export interface GameStoreCore {
  getState: () => GameState
  setState: (next: GameState) => void
  updateGameState: UpdateGameState
  subscribe: (listener: () => void) => () => void
  notify: () => void
}

/**
 * 建立 reactive store 核心：持有權威 GameState、listener 集合與統一的
 * updateGameState pipeline。
 *
 * pipeline 的跨領域橫切（cross-cutting）處理：
 * 1. 統一記錄人類玩家最高等級與該等級五維快照（涵蓋所有升級來源）。
 * 2. 遊戲結束（勝利或失敗）時清除戰爭迷霧：切換為全圖揭示。
 * 3. 統一顯示劇情對話：佇列非空且無阻塞彈窗時自動顯示佇列首項。
 */
export function createGameStoreCore(initialState: GameState): GameStoreCore {
  let gameState = initialState
  const listeners = new Set<() => void>()

  const notify = () => {
    listeners.forEach((listener) => listener())
  }

  const setState = (next: GameState) => {
    gameState = next
    notify()
  }

  const updateGameState: UpdateGameState = (updater) => {
    let nextGameState = updater(gameState)
    if (nextGameState === gameState) return

    // 統一記錄人類玩家的最高等級與該等級五維快照（涵蓋所有升級來源）。
    nextGameState = recordHumanMaxLevel(nextGameState)

    // 遊戲結束（勝利或失敗）時清除戰爭迷霧：切換為全圖揭示，讓玩家可觀察局末狀態。
    if ((nextGameState.gameOver || nextGameState.gameWon) && nextGameState.visibility?.mode !== 'revealed') {
      nextGameState = {
        ...nextGameState,
        visibility: {
          exploredCellIds: nextGameState.map.cells.map((cell) => cell.id),
          mode: 'revealed',
        },
      }
    }

    // 統一顯示劇情對話：佇列非空且目前沒有阻塞彈窗時，自動顯示佇列首項。
    // 這讓任何掛鉤點（如擊殺 Boss 觸發 on-victory）填充佇列後，對話會立即彈出。
    const queue = nextGameState.campaignState?.dialogueQueue
    if (queue && queue.length > 0 && nextGameState.blockingModal === null) {
      nextGameState = {
        ...nextGameState,
        blockingModal: { type: 'story-dialogue', entry: queue[0], remaining: queue.length - 1 },
      }
    }

    gameState = nextGameState
    notify()
  }

  return {
    getState: () => gameState,
    setState,
    updateGameState,
    subscribe: (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    notify,
  }
}