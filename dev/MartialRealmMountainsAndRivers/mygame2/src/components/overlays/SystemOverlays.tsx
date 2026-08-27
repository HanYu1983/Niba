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
  /** 「重新開始」時回到地圖設置頁面（預設僅重設目前局）。 */
  onRestartToMap?: () => void
}

/**
 * 系統層 overlay 群組：
 * - 遊戲結束
 * - 行動結果彈窗
 * - 劇情對話彈窗
 */
function SystemOverlays({ gameState, onRestartToMap }: SystemOverlaysProps) {
  const dialogue = gameState.blockingModal?.type === 'story-dialogue'
    ? gameState.blockingModal
    : null
  // 勝利/失敗對話播畢前，先不顯示 GameOverModal（避免與對話彈窗同時出現）。
  const dialogueQueueEmpty = !gameState.campaignState || gameState.campaignState.dialogueQueue.length === 0
  const gameEnded = Boolean(gameState.gameOver || gameState.gameWon) && dialogueQueueEmpty
  // 本局結算獲得的武學殘卷（局末回寫後計算，供結算畫面醒目顯示）。
  // 'skipped' 表示此局已領取過（runId 已登記），顯示提示而非 0 卷。
  const [scrollReward, setScrollReward] = useState<number | 'skipped' | null>(null)
  // 僅在 GameOverModal 實際顯示時記錄一次通關狀態（避免重複觸發）。
  const recordedRef = useRef(false)
  useEffect(() => {
    if (gameEnded) {
      if (!recordedRef.current) {
        recordedRef.current = true
        gameStore.recordCurrentScenarioClearance(Boolean(gameState.gameWon))
        // 局末回寫：將本局表現結算為卷並併入名册角色的功法庫（若選用了名册角色）。
        const humanPlayer = gameState.players.find((player) => !player.isAI)
        const learnedSkillIds = humanPlayer
          ? [...(humanPlayer.innerSkillIds ?? []), ...(humanPlayer.externalSkillIds ?? [])]
          : []
        const activeCharacterId = gameStore.getActiveCharacterId()
        const beforeCount = activeCharacterId
          ? (getCharacter(activeCharacterId)?.unlockedSkillIds ?? []).length
          : 0
        const settled = gameStore.settleActiveCharacterRewards(
          gameState.runStats ?? createEmptyRunStats(),
          Boolean(gameState.gameWon),
          learnedSkillIds,
        )
        if (settled === null && activeCharacterId) {
          // 已選角色但未結算：此局已領取過（runId 已登記或 session 旗標）。
          setScrollReward('skipped')
        } else {
          // 計算本局「新增功法」帶來的卷獎勵與總獲得量，供結算畫面顯示。
          const afterCount = activeCharacterId
            ? (getCharacter(activeCharacterId)?.unlockedSkillIds ?? []).length
            : 0
          const newSkillCount = Math.max(0, afterCount - beforeCount)
          const reward = settled
            ? computeScrollReward(gameState.runStats ?? createEmptyRunStats(), Boolean(gameState.gameWon), newSkillCount)
            : 0
          setScrollReward(reward)
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
      recordedRef.current = false
      setScrollReward(null)
    }
  }, [gameEnded, gameState.gameWon])
  return (
    <>
      <GameOverModal
        open={gameEnded}
        won={Boolean(gameState.gameWon)}
        reason={gameState.gameOverReason}
        record={computeBattleRecord(gameState)}
        scrollReward={scrollReward}
        onRestart={() => {
          if (onRestartToMap) {
            gameStore.restartGame()
            onRestartToMap()
          } else {
            gameStore.restartGame()
          }
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
