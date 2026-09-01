import GameOverModal from '../GameOverModal'
import ActionResultModal from '../ActionResultModal'
import StoryDialogueModal from '../StoryDialogueModal'
import { gameStore } from '../../game/gameStore'
import type { GameState } from '../../game/types'
import { computeBattleRecord } from '../../game/battleRecord'
import { createEmptyRunStats } from '../../game/runStats'
import { computeScrollReward } from '../../game/characterRoster'
import { getCharacter } from '../../game/characterRoster'
import { trackGameEnd } from '../../lib/analytics'
import { useEffect, useRef, useState } from 'react'

type SystemOverlaysProps = {
  gameState: GameState
  /** 「本局重啓」時回到地圖設置頁面（預設僅重設目前局）。 */
  onRestartToMap?: () => void
  /** 「回到首頁」時回到遊戲開始畫面。 */
  onGoHome?: () => void
  /** 玩家是否已關閉局末結算彈窗（可由指令欄按鈕重新開啟）。 */
  gameOverModalDismissed?: boolean
  /** 關閉局末結算彈窗（玩家可回到地圖觀察局末狀態）。 */
  onDismissGameOverModal?: () => void
}

/**
 * 系統層 overlay 群組：
 * - 遊戲結束
 * - 行動結果彈窗
 * - 劇情對話彈窗
 */
function SystemOverlays({ gameState, onRestartToMap, onGoHome, gameOverModalDismissed = false, onDismissGameOverModal }: SystemOverlaysProps) {
  const dialogue = gameState.blockingModal?.type === 'story-dialogue'
    ? gameState.blockingModal
    : null
  // 勝利/失敗對話播畢前，先不顯示 GameOverModal（避免與對話彈窗同時出現）。
  const dialogueQueueEmpty = !gameState.campaignState || gameState.campaignState.dialogueQueue.length === 0
  const gameEnded = Boolean(gameState.gameOver || gameState.gameWon) && dialogueQueueEmpty
  // 本局結算獲得的武學殘卷（局末回寫後計算，供結算畫面醒目顯示）。
  // 'skipped' 表示此局已領取過（runId 已登記），顯示提示而非 0 卷。
  const [scrollRewardState, setScrollReward] = useState<number | 'skipped' | null>(null)
  // 非局末渲染一律視為 null（取代 effect 內同步 setScrollReward(null)，避免級聯渲染）。
  const scrollReward = gameEnded ? scrollRewardState : null
  // 僅在 GameOverModal 實際顯示時記錄一次通關狀態（避免重複觸發）。
  const recordedRef = useRef(false)
  useEffect(() => {
    if (gameEnded) {
      if (!recordedRef.current) {
        recordedRef.current = true
        gameStore.recordCurrentScenarioClearance(Boolean(gameState.gameWon))
        // 局末回寫：將本局表現結算為卷並併入名册角色的功法庫（若選用了名册角色）。
        // 依人類玩家順序收集各自的功法清單，供各角色結算。
        const humanPlayers = gameState.players.filter((player) => !player.isAI)
        const learnedSkillIdsByPlayer = humanPlayers.map((player) =>
          [...(player.innerSkillIds ?? []), ...(player.externalSkillIds ?? [])],
        )
        const activeCharacterIds = gameStore.getActiveCharacterIds()
        const beforeCounts = activeCharacterIds.map((id) =>
          id ? (getCharacter(id)?.unlockedSkillIds ?? []).length : 0,
        )
        const settled = gameStore.settleActiveCharacterRewards(
          gameState.runStats ?? createEmptyRunStats(),
          Boolean(gameState.gameWon),
          learnedSkillIdsByPlayer,
        )
        if (settled === null && activeCharacterIds.some(Boolean)) {
          // 已選角色但未結算：此局已領取過（runId 已登記或 session 旗標）。
          queueMicrotask(() => setScrollReward('skipped'))
        } else {
          // 計算各角色本局「新增功法」帶來的卷獎勵，加總供結算畫面顯示。
          const totalReward = activeCharacterIds.reduce((total, id, index) => {
            if (!id) return total
            const afterCount = (getCharacter(id)?.unlockedSkillIds ?? []).length
            const newSkillCount = Math.max(0, afterCount - beforeCounts[index])
            return total + computeScrollReward(gameState.runStats ?? createEmptyRunStats(), Boolean(gameState.gameWon), newSkillCount)
          }, 0)
          queueMicrotask(() => setScrollReward(settled ? totalReward : 0))
        }
        const record = computeBattleRecord(gameState)
        trackGameEnd(record.won, {
          roundsSurvived: record.roundsSurvived,
          playerLevel: record.playerLevel,
          prestige: record.prestige,
          governanceRank: record.governanceRank,
          money: record.money,
          creaturesDefeated: record.stats.creaturesDefeated,
          nestsDestroyed: record.stats.nestsDestroyed,
          buildingsBuilt: record.stats.buildingsBuilt,
          skillsLearned: record.stats.skillsLearned,
          itemsCollected: record.stats.itemsCollected,
          reason: record.reason,
        })
      }
    } else {
      // 非局末：重置記錄旗標（scrollReward 由渲染期間的 gameEnded 派生為 null）。
      recordedRef.current = false
    }
    // 刻意只依賴 gameEnded / gameWon：結算是一次性副作用（recordedRef 防重），
    // 不應隨 gameState 其他欄位（runStats / players）變動而重跑。
  }, [gameEnded, gameState.gameWon])
  return (
    <>
      <GameOverModal
        open={gameEnded && !gameOverModalDismissed}
        won={Boolean(gameState.gameWon)}
        reason={gameState.gameOverReason}
        record={computeBattleRecord(gameState)}
        scrollReward={scrollReward}
        onClose={onDismissGameOverModal}
        onRestart={() => {
          // 本局重啓：以相同設定重新開始本局，停留在遊戲畫面。
          gameStore.restartGame()
        }}
        onGoHome={() => {
          if (onGoHome) onGoHome()
          else if (onRestartToMap) onRestartToMap()
        }}
      />
      <ActionResultModal
        result={gameState.blockingModal?.type === 'action-result' ? gameState.blockingModal.result : null}
        onClose={() => gameStore.confirmBlockingModal()}
      />
      <StoryDialogueModal
        entry={dialogue ? dialogue.entry : null}
        remaining={dialogue ? dialogue.remaining : 0}
        onAdvance={() => gameStore.advanceDialogue()}
        onSkip={() => gameStore.skipDialogue()}
      />
    </>
  )
}

export default SystemOverlays
