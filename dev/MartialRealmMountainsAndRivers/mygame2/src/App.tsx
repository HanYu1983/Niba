import { Button, Flex, Layout, Typography, message } from 'antd'
import { useEffect, useRef, useState } from 'react'
import MapGrid from './components/MapGrid'
import PlayerPanel from './components/PlayerPanel'
import BasePanel from './components/BasePanel'
import { gameStore, useGameState } from './game/gameStore'
import { getActiveGlobalBuffs } from './game/rules/globalBuffRules'
import { resolveTargetingSpec } from './game/rules/targetingRules'
import { ACTION_STAMINA_COSTS } from './game/rules/actionCostRules'
import './App.css'
import PlayerCommandPanel from './components/PlayerCommandPanel'
import GameOverlays from './components/GameOverlays'
import GameStatusCard from './components/GameStatusCard'
import FiveElementsChart from './components/FiveElementsChart'
import QuestTrackerPanel from './components/QuestTrackerPanel'
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts'
import useModalState from './hooks/useModalState'
import GameStartScreen from './components/GameStartScreen'
import type { PersistentCharacter } from './game/characterRoster'
import { ensureOfficialCharacters } from './game/characterRoster'
import SkillTestPage from './components/SkillTestPage'
import EditorApp from './editor/EditorApp'
import { allExternalSkillCatalog } from './game/catalogs/martialHallSkillCatalog'
import type { GameSettings } from './game/types'
import { formatItemPointPickupResult } from './game/actionResultFormatters'
import GameSaveModal from './components/GameSaveModal'
import SystemCommandModal from './components/SystemCommandModal'
import StrategicCommandModal from './components/StrategicCommandModal'
import { createEmptyScenario, type ScenarioDefinition } from './editor/editorTypes'
import { trackPageView, trackEvent } from './lib/analytics'
import { createAiTurnScheduler } from './game/ai/aiTurnScheduler'
import ActionLogPanel from './components/ActionLogPanel'

function App() {
  const gameState = useGameState()
  const [screen, setScreen] = useState<'start' | 'game'>('start')
  // 啟動時確保官方角色已預建於名册（冪等：缺漏才補，現有進度保留）。
  // 必須在任何讀取 getCharacters() 之前完成，避免俠客名冊漏列凌淵。
  useEffect(() => {
    ensureOfficialCharacters()
  }, [])
  const [skillTestPageOpen, setSkillTestPageOpen] = useState(false)
  const [editorOpen, setEditorOpen] = useState(false)
  const [playtestMode, setPlaytestMode] = useState(false)
  const [editorScenario, setEditorScenario] = useState<ScenarioDefinition>(() => createEmptyScenario(15, 15))
  const [saveModalOpen, setSaveModalOpen] = useState(false)
  const [systemCommandModalOpen, setSystemCommandModalOpen] = useState(false)
  // 局末結算彈窗是否已被玩家關閉（關閉後可由指令欄按鈕重新開啟）。
  const [gameOverModalDismissed, setGameOverModalDismissed] = useState(false)
  const [strategicCommandModalOpen, setStrategicCommandModalOpen] = useState(false)
  const [actionLogOpen, setActionLogOpen] = useState(false)
  const [saveSlots, setSaveSlots] = useState(() => gameStore.getSaveSlots())
  const {
    selectedBaseId,
    setSelectedBaseId,
    setBuildingBaseId,
    defenseBase,
    setDefenseBaseId,
    setCollectionResourcePointId,
    setSelectedCreatureId,
    setMissionBaseId,
    setDetailsBaseId,
    setDetailsCreatureNestId,
    setDetailsResourcePointId,
    setInventoryPlayerId,
    setEquipmentPlayerId,
    setDetailsItemPointId,
    setDetailsExplorationEventId,
    setDetailsRuinId,
    setDetailsDefenseStructureId,
    setDetailsSectGateId,
    skillPlayerId,
    setSkillPlayerId,
    selectedCreature,
    buildingBase,
    collectionResourcePoint,
    collectionBase,
    missionBase,
    detailsBase,
    detailsCreatureNest,
    detailsResourcePoint,
    detailsResourcePointBase,
    inventoryPlayer,
    equipmentPlayer,
    detailsItemPoint,
    detailsExplorationEvent,
    detailsRuin,
    detailsDefenseStructure,
    detailsDefenseStructureBase,
    detailsSectGate,
    policySwitchBase,
    setPolicySwitchBaseId,
    warehouseBase,
    setWarehouseBaseId,
    transportBase,
    setTransportBaseId,
    regionalManagementBase,
    setRegionalManagementBaseId,
    shopBase,
    setShopBaseId,
    martialHallBase,
    setMartialHallBaseId,
  } = useModalState(gameState)
  const movementEnabled = gameState.operation.type === 'moving'
  const externalSkillTargetingId = gameState.operation.type === 'targeting-external-skill'
    ? gameState.operation.skillId
    : null
  const attackTargeting = gameState.operation.type === 'targeting-attack'
  const firstAidTargeting = gameState.operation.type === 'targeting-first-aid'
  const itemTargeting = gameState.operation.type === 'targeting-item'
  // 目標選取規格（新框架）：依 operation 計算形狀×模式，供 MapGrid 高亮。
  const targetingSpec = resolveTargetingSpec(gameState.operation, externalSkillTargetingId ?? undefined)
  const defenseBuildMode = gameState.operation.type === 'building-defense'
    ? (() => {
      const operation = gameState.operation
      return {
        basePosition: gameState.bases.find((base) => base.id === operation.baseId)?.position ?? { row: -1, column: -1 },
        structureType: operation.structureType,
        selectedPosition: operation.position,
      }
    })()
    : undefined
  const activePlayer = gameState.players.find((player) => player.id === gameState.activePlayerId) ?? null
  const movementUsed = !activePlayer || activePlayer.stamina <= 0
  const activeInventoryCount = activePlayer?.inventory.reduce(
    (total, entry) => total + entry.quantity,
    0,
  ) ?? 0
  const previousActivePlayerIdRef = useRef(gameState.activePlayerId)
  // Player AI 回合排程器：防守／支援共用框架（重構文件 §11／§12 Phase 3）。
  // React 只負責啟動與停止；計時、防重入與 stale 取消都在 scheduler 內。
  const aiTurnSchedulerRef = useRef(
    createAiTurnScheduler({
      getState: () => gameStore.getState(),
      runDefenseStep: (actorId) => gameStore.runAiDefenseStep(actorId),
      runSupportStep: (actorId) => gameStore.runAiSupportStep(actorId),
      runConstructionStep: (actorId) => gameStore.runAiConstructionStep(actorId),
      runFuzzyStep: (actorId) => gameStore.runFuzzyStep(actorId),
      runDecisionTreeStep: (actorId) => gameStore.runDecisionTreeStep(actorId),
      runGraphSearchStep: (actorId) => gameStore.runGraphSearchStep(actorId),
      endTurn: (actorId) => gameStore.endPlayerTurn(actorId),
      onStepFailed: (_actorId, reason) => { message.warning({ content: reason, duration: 10 }) },
    }),
  )
  const modalOpen = Boolean(
    gameState.blockingModal ||
    gameState.gameOver ||
    gameState.gameWon ||
    saveModalOpen ||
    systemCommandModalOpen ||
    strategicCommandModalOpen ||
    selectedCreature ||
    buildingBase ||
    defenseBase ||
    collectionResourcePoint ||
    missionBase ||
    detailsBase ||
    detailsCreatureNest ||
    detailsResourcePoint ||
    inventoryPlayer ||
    equipmentPlayer ||
    detailsItemPoint ||
    detailsExplorationEvent ||
    gameState.pendingExplorationEvent ||
    detailsRuin ||
    detailsDefenseStructure ||
    skillPlayerId ||
    policySwitchBase ||
    warehouseBase ||
    transportBase ||
    regionalManagementBase ||
    shopBase ||
    martialHallBase
  )

  useEffect(() => {
    if (previousActivePlayerIdRef.current !== gameState.activePlayerId) {
      gameStore.setOperation({ type: 'idle' })
      previousActivePlayerIdRef.current = gameState.activePlayerId
    }
  }, [gameState.activePlayerId])

  useEffect(() => {
    if (!activePlayer || gameState.creatureTurnInProgress || gameState.blockingModal) return
    const samePosition = (first: { row: number; column: number }, second: { row: number; column: number }) => first.row === second.row && first.column === second.column
    const itemPoint = gameState.itemPoints.find((point) => samePosition(point.position, activePlayer.position))
    if (itemPoint) {
      const result = gameStore.collectItemPoint(activePlayer.id, itemPoint.id)
      if (result.ok) {
        const terrain = gameState.map.cells.find((cell) => cell.row === itemPoint.position.row && cell.column === itemPoint.position.column)?.terrain
        gameStore.showActionResult(formatItemPointPickupResult(result.data, terrain))
      }
      return
    }
    const event = gameState.explorationEvents?.find((candidate) => candidate.status === 'available' && samePosition(candidate.position, activePlayer.position))
    if (event) setDetailsExplorationEventId(event.id)
  }, [activePlayer, gameState.itemPoints, gameState.explorationEvents, gameState.creatureTurnInProgress, gameState.blockingModal, setDetailsExplorationEventId])

  useEffect(() => {
    const scheduler = aiTurnSchedulerRef.current
    if (
      !activePlayer?.isAI ||
      gameState.creatureTurnInProgress ||
      gameState.blockingModal ||
      gameState.gameOver ||
      strategicCommandModalOpen ||
      saveModalOpen ||
      systemCommandModalOpen
    ) {
      scheduler.cancel()
      return
    }
    const activeAiOrder = gameState.aiOrders?.find(
      (order) => order.aiPlayerId === activePlayer.id && order.status === 'active',
    )
    if (activeAiOrder) {
      // 戰術命令優先：有 active 訂單即要求排程（非法類型由 scheduler 的 runStep switch 斷言攔截）。
      scheduler.requestStep(activePlayer.id, activeAiOrder.type)
      return () => scheduler.cancel()
    }
    const constructionPlan = gameState.aiConstructionPlans?.find((plan) => plan.aiPlayerId === activePlayer.id)
    if (!constructionPlan) {
      scheduler.cancel()
      return
    }

    scheduler.requestStep(activePlayer.id, 'construction')
    return () => scheduler.cancel()
  }, [activePlayer, gameState.aiOrders, gameState.aiConstructionPlans, gameState.creatureTurnInProgress, gameState.blockingModal, gameState.gameOver, strategicCommandModalOpen, saveModalOpen, systemCommandModalOpen])

  useKeyboardShortcuts({
    activePlayer,
    blockingModal: Boolean(gameState.blockingModal),
    modalOpen,
    creatureTurnInProgress: gameState.creatureTurnInProgress,
    movementUsed,
    externalSkills: allExternalSkillCatalog,
    onMove: (rowDelta, columnDelta) => {
      if (gameState.activePlayerId) {
        gameStore.movePlayer(gameState.activePlayerId, rowDelta, columnDelta)
        // 維持移動模式：讓 MapGrid 持續計算並更新移動高亮範圍。
        gameStore.setOperation({ type: 'moving', movementUsed: false })
      }
    },
    onBeginAttackTargeting: () => {
      setSelectedCreatureId(null)
      gameStore.beginAttackTargeting()
    },
    onOpenInventory: () => setInventoryPlayerId(gameState.activePlayerId),
    onOpenEquipment: () => setEquipmentPlayerId(gameState.activePlayerId),
    onOpenSkills: () => setSkillPlayerId(gameState.activePlayerId),
    onUseExternalSkill: (skillId) => {
      gameStore.setOperation({ type: 'idle' })
      gameStore.clearExternalSkillPreview()
      setSelectedCreatureId(null)
      gameStore.beginExternalSkillTargeting(skillId)
    },
    onBuildRoad: () => {
      const result = gameStore.buildRoad(gameState.activePlayerId)
      if (result.ok) {
        gameStore.setOperation({ type: 'idle' })
      } else {
        gameStore.showActionResult({ title: '修路失敗', message: result.reason, rewards: [] })
      }
    },
    onEndTurn: () => {
      if (gameState.creatureTurnInProgress) {
        return
      }
      gameStore.setOperation({ type: 'idle' })
      gameStore.endPlayerTurn(gameState.activePlayerId)
    },
  })

  const startGame = (settings: GameSettings, selectedCharacters?: (PersistentCharacter | undefined)[]) => {
    gameStore.startGame(settings, selectedCharacters?.map((c) => c ?? null))
    setScreen('game')
    trackEvent('Gameplay', 'game_start', 'quick_start')
  }

  const startChallengeGame = (settings: GameSettings, selectedCharacters?: (PersistentCharacter | undefined)[]) => {
    gameStore.startChallengeGame(settings, selectedCharacters?.map((c) => c ?? null))
    setScreen('game')
    trackEvent('Gameplay', 'game_start', 'challenge')
  }

  // 頁面瀏覽追蹤：切換 screen 時記錄。
  useEffect(() => {
    trackPageView(screen === 'start' ? '/start' : '/game')
  }, [screen])

  const refreshSaveSlots = () => setSaveSlots(gameStore.getSaveSlots())

  if (screen === 'start') {
    if (editorOpen) {
      return <EditorApp
        scenario={editorScenario}
        onScenarioChange={setEditorScenario}
        onBack={() => setEditorOpen(false)}
        onPlaytest={() => {
          setEditorOpen(false)
          setPlaytestMode(true)
          setScreen('game')
          trackEvent('Gameplay', 'game_start', 'playtest')
        }}
      />
    }

    if (skillTestPageOpen) {
      return <SkillTestPage onBack={() => setSkillTestPageOpen(false)} />
    }

    return (
      <Layout className="app-shell">
        <Layout.Content className="app-content">
          <GameStartScreen
            onStart={startGame}
            onStartChallenge={startChallengeGame}
            onOpenSkillTest={() => setSkillTestPageOpen(true)}
            onOpenEditor={() => setEditorOpen(true)}
            onLoadSave={(slot) => {
              const result = gameStore.loadGameFromSlot(slot)
              if (result.ok) {
                setScreen('game')
                trackEvent('Gameplay', 'game_start', 'load_save')
              } else {
                window.alert(result.reason ?? '讀取存檔失敗。')
              }
            }}
            onStartScenario={(scenario) => {
              const result = gameStore.loadScenario(scenario)
              if (result.ok) {
                setScreen('game')
                trackEvent('Gameplay', 'game_start', 'scenario')
              } else {
                window.alert(result.reason ?? '關卡載入失敗。')
              }
            }}
            onDebug={() => {
              gameStore.loadDebugMap()
              setScreen('game')
              trackEvent('Gameplay', 'game_start', 'debug')
            }}
          />
        </Layout.Content>
      </Layout>
    )
  }

  return (
    <Layout className="app-shell">
      <Layout.Content className="app-content">
        <section className="app-intro">
          <div className="ad-placeholder" aria-label="廣告預留區域">
            <Typography.Text>廣告預留區域</Typography.Text>
            <Typography.Text type="secondary">此區域將來可放置廣告內容。</Typography.Text>
          </div>
        </section>

        <SystemCommandModal
          open={systemCommandModalOpen}
          onClose={() => setSystemCommandModalOpen(false)}
          onBackToMapSettings={() => {
            setSystemCommandModalOpen(false)
            setScreen('start')
          }}
          onOpenGameIntroduction={() => {
            window.open('./game-intro.html', '_blank', 'noopener,noreferrer')
          }}
          onOpenStrategicCommand={() => {
            setSystemCommandModalOpen(false)
            setStrategicCommandModalOpen(true)
          }}
          onOpenSave={() => {
            refreshSaveSlots()
            setSystemCommandModalOpen(false)
            setSaveModalOpen(true)
          }}
        />

        <StrategicCommandModal
          open={strategicCommandModalOpen}
          aiPlayers={gameState.players.filter((player) => player.isAI === true)}
          players={gameState.players}
          bases={gameState.bases}
          orders={gameState.aiOrders ?? []}
          constructionPlans={gameState.aiConstructionPlans ?? []}
          onClose={() => setStrategicCommandModalOpen(false)}
          onSaveOrder={(order) => gameStore.setAiOrder(order)}
          onDeleteOrder={(aiPlayerId, orderId) => gameStore.removeAiOrder(aiPlayerId, orderId)}
          onSaveConstructionPlan={(plan) => gameStore.setAiConstructionPlan(plan)}
        />

        <GameSaveModal
          open={saveModalOpen}
          slots={saveSlots}
          onClose={() => setSaveModalOpen(false)}
          onSave={(slot) => {
            const result = gameStore.saveGameToSlot(slot)
            if (!result.ok) window.alert(result.reason)
            refreshSaveSlots()
          }}
          onLoad={(slot) => {
            const result = gameStore.loadGameFromSlot(slot)
            if (!result.ok) window.alert(result.reason)
            else setSaveModalOpen(false)
          }}
          onDelete={(slot) => {
            gameStore.deleteGameFromSlot(slot)
            refreshSaveSlots()
          }}
        />

        <Flex gap={16} align="start" style={{ marginBottom: 16 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <GameStatusCard gameState={gameState} />
          </div>
          <Button onClick={() => setActionLogOpen(true)}>📜 行動日誌</Button>
        </Flex>

        <ActionLogPanel
          open={actionLogOpen}
          events={gameState.actionEvents ?? []}
          onClose={() => setActionLogOpen(false)}
        />

        {playtestMode && (
          <div style={{ position: 'fixed', top: 8, right: 8, zIndex: 1000 }}>
            <Button
              type="primary"
              danger
              onClick={() => {
                setPlaytestMode(false)
                setScreen('start')
                setEditorOpen(true)
              }}
            >
              ⏹️ 結束試玩
            </Button>
          </div>
        )}

        <Flex className="game-layout" gap={24} align="start">
          <aside className="game-layout__bases">
            <QuestTrackerPanel gameState={gameState} />
            <BasePanel
              bases={gameState.bases}
              globalBuffs={getActiveGlobalBuffs(gameState)}
              selectedBaseId={selectedBaseId}
              onBaseSelect={setSelectedBaseId}
              onBaseDetails={setDetailsBaseId}
            />
          </aside>
          <Flex vertical gap={16} className="game-layout__map-command">
            <PlayerCommandPanel
              player={activePlayer}
              externalSkills={allExternalSkillCatalog}
              inventoryCount={activeInventoryCount}
              creatureTurnInProgress={gameState.creatureTurnInProgress}
              onOpenInventory={() => setInventoryPlayerId(gameState.activePlayerId)}
              onOpenEquipment={() => setEquipmentPlayerId(gameState.activePlayerId)}
              onOpenSkills={() => setSkillPlayerId(gameState.activePlayerId)}
              onAttack={() => {
                setSelectedCreatureId(null)
                gameStore.beginAttackTargeting()
              }}
              onUseExternalSkill={(skillId) => {
                gameStore.setOperation({ type: 'idle' })
                gameStore.clearExternalSkillPreview()
                setSelectedCreatureId(null)
                gameStore.beginExternalSkillTargeting(skillId)
              }}
              onBuildRoad={() => {
                const result = gameStore.buildRoad(gameState.activePlayerId)
                if (result.ok) {
                  gameStore.setOperation({ type: 'idle' })
                } else {
                  gameStore.showActionResult({ title: '修路失敗', message: result.reason, rewards: [] })
                }
              }}
              onFirstAid={() => {
                setSelectedCreatureId(null)
                gameStore.setOperation({ type: 'idle' })
                gameStore.beginFirstAidTargeting()
              }}
              onOpenOptions={() => setSystemCommandModalOpen(true)}
              gameOverEnded={Boolean(gameState.gameOver || gameState.gameWon)}
              onOpenGameOverModal={() => setGameOverModalDismissed(false)}
              onEndTurn={() => {
                if (gameState.creatureTurnInProgress) {
                  return
                }
                gameStore.setOperation({ type: 'idle' })
                gameStore.endPlayerTurn(gameState.activePlayerId)
              }}
            />
            <MapGrid
                map={gameState.map}
                bases={gameState.bases}
                creatureNests={gameState.creatureNests}
              resourcePoints={gameState.resourcePoints}
              defenseStructures={gameState.defenseStructures}
              explorationEvents={gameState.explorationEvents}
              ruins={gameState.ruins}
              traps={gameState.traps}
              sectGates={gameState.sectGates}
              revealedCreatureCellIds={gameState.revealedCreatureCellIds}
              revealedCreatureUntilRound={gameState.revealedCreatureUntilRound}
              visibility={gameState.visibility}
              visibilityPlayerId={gameState.activePlayerId}
              onExplorationEventDetails={setDetailsExplorationEventId}
              onRuinDetails={setDetailsRuinId}
              onSectGateDetails={setDetailsSectGateId}
              defenseBuildMode={defenseBuildMode}
              onDefensePositionSelect={(position) => {
                if (gameState.operation.type === 'building-defense') {
                  gameStore.setOperation({ ...gameState.operation, position })
                  setDefenseBaseId(gameState.operation.baseId)
                }
              }}
              itemPoints={gameState.itemPoints}
              selectedBaseId={selectedBaseId}
              onClearSelectedBase={() => setSelectedBaseId(null)}
              onBaseSelect={setSelectedBaseId}
              onBaseDetails={setDetailsBaseId}
              onCreatureNestDetails={setDetailsCreatureNestId}
              onCreatureNestSelect={(nestId) => {
                if (attackTargeting) {
                  gameStore.previewAttackTarget(gameState.activePlayerId, 'nest', nestId)
                } else if (externalSkillTargetingId) {
                  gameStore.previewExternalDamageTarget(gameState.activePlayerId, 'nest', nestId, externalSkillTargetingId)
                } else if (itemTargeting) {
                  gameStore.previewItemBurst('nest', nestId)
                }
              }}
              onPlayerTarget={(playerId) => {
                if (firstAidTargeting) {
                  const result = gameStore.executeFirstAid(playerId)
                  if (result.ok) {
                    gameStore.setOperation({ type: 'idle' })
                    const target = gameState.players.find((player) => player.id === playerId)
                    gameStore.showActionResult({
                      title: '急救成功',
                      message: `已復活 ${target?.name ?? '玩家'}，血量恢復至 5。`,
                      rewards: [`體力 -${ACTION_STAMINA_COSTS.firstAid}`],
                    })
                  } else {
                    gameStore.showActionResult({ title: '急救失敗', message: result.reason, rewards: [] })
                  }
                }
              }}
              onResourcePointDetails={setDetailsResourcePointId}
              onItemPointDetails={setDetailsItemPointId}
              onDefenseStructureDetails={setDetailsDefenseStructureId}
              players={gameState.players}
              creatures={gameState.creatures}
              activePlayerId={gameState.activePlayerId}
              movementEnabled={movementEnabled}
              creatureTurnInProgress={gameState.creatureTurnInProgress}
              gameOver={Boolean(gameState.gameOver || gameState.gameWon)}
              blockingModal={Boolean(gameState.blockingModal)}
              activeCreatureId={gameState.activeCreatureId}
              onPlayerMoved={() => gameStore.setOperation({ type: 'moving', movementUsed: false })}
              onMovePlayerTo={(playerId, row, column) => gameStore.movePlayerTo(playerId, row, column)}
              onCreatureSelect={(creatureId) => {
                if (attackTargeting) {
                  gameStore.previewAttack(gameState.activePlayerId, creatureId)
                  return
                }
                if (externalSkillTargetingId) {
                  gameStore.previewExternalDamage(gameState.activePlayerId, creatureId, externalSkillTargetingId)
                  return
                }
                if (itemTargeting) {
                  gameStore.previewItemBurst('creature', creatureId)
                  return
                }
                setSelectedCreatureId(creatureId)
              }}
              externalSkillTargeting={externalSkillTargetingId !== null}
              attackTargeting={attackTargeting}
              firstAidTargeting={firstAidTargeting}
              itemTargeting={itemTargeting}
              targetingSpec={targetingSpec}
              creatureShake={gameState.creatureShake}
            />

            <FiveElementsChart />

          </Flex>
          <aside className="game-layout__players">
            {gameState.players.map((player) => (
              <PlayerPanel
                key={player.id}
                player={player}
                isActive={player.id === gameState.activePlayerId}
                onAllocateAttributePoint={(attribute) => gameStore.allocateAttributePoint(player.id, attribute)}
                gameState={gameState}
              />
            ))}
          </aside>
        </Flex>
        <GameOverlays
          gameState={gameState}
          onRestartToMap={() => {
            setPlaytestMode(false)
            setScreen('start')
          }}
          gameOverModalDismissed={gameOverModalDismissed}
          onDismissGameOverModal={() => setGameOverModalDismissed(true)}
          activePlayer={activePlayer}
          selectedCreature={selectedCreature}
          buildingBase={buildingBase}
          defenseBase={defenseBase}
          collectionResourcePoint={collectionResourcePoint}
          collectionBase={collectionBase}
          missionBase={missionBase}
          detailsBase={detailsBase}
          detailsCreatureNest={detailsCreatureNest}
          detailsResourcePoint={detailsResourcePoint}
          detailsResourcePointBase={detailsResourcePointBase}
          inventoryPlayer={inventoryPlayer}
          equipmentPlayer={equipmentPlayer}
          detailsItemPoint={detailsItemPoint}
          detailsExplorationEvent={detailsExplorationEvent}
          detailsRuin={detailsRuin}
          detailsDefenseStructure={detailsDefenseStructure}
          detailsDefenseStructureBase={detailsDefenseStructureBase}
          detailsSectGate={detailsSectGate}
          skillPlayerId={skillPlayerId}
          policySwitchBase={policySwitchBase}
          warehouseBase={warehouseBase}
          transportBase={transportBase}
          regionalManagementBase={regionalManagementBase}
          shopBase={shopBase}
          martialHallBase={martialHallBase}
          onCloseBuilding={() => setBuildingBaseId(null)}
          onCloseCollection={() => setCollectionResourcePointId(null)}
          onCloseMission={() => setMissionBaseId(null)}
          onCloseDetails={() => setDetailsBaseId(null)}
          onCloseCreatureNestDetails={() => setDetailsCreatureNestId(null)}
          onAttackNest={(nestId) => gameStore.previewAttackTarget(gameState.activePlayerId, 'nest', nestId)}
          onCloseResourcePointDetails={() => setDetailsResourcePointId(null)}
          onCloseInventory={() => setInventoryPlayerId(null)}
          onCloseEquipment={() => setEquipmentPlayerId(null)}
          onCloseItemPointDetails={() => setDetailsItemPointId(null)}
          onCloseExplorationEvent={() => setDetailsExplorationEventId(null)}
          onCloseRuin={() => setDetailsRuinId(null)}
          onCloseDefenseStructureDetails={() => setDetailsDefenseStructureId(null)}
          onCloseSectGate={() => setDetailsSectGateId(null)}
          onCloseSkill={() => setSkillPlayerId(null)}
          onCloseCreaturePanel={() => {
            setSelectedCreatureId(null)
          }}
          onClosePolicySwitch={() => setPolicySwitchBaseId(null)}
          onCloseWarehouse={() => setWarehouseBaseId(null)}
          onCloseTransport={() => setTransportBaseId(null)}
          onCloseRegionalManagement={() => setRegionalManagementBaseId(null)}
          onCloseShop={() => setShopBaseId(null)}
          onCloseMartialHall={() => setMartialHallBaseId(null)}
          onOpenBuildings={setBuildingBaseId}
          onOpenDefense={(baseId) => {
            setDefenseBaseId(baseId)
            gameStore.setOperation({ type: 'building-defense', baseId, structureType: 'barricade', position: null })
          }}
          onOpenPolicySwitch={setPolicySwitchBaseId}
          onOpenWarehouse={setWarehouseBaseId}
          onOpenTransport={setTransportBaseId}
          onOpenRegionalManagement={setRegionalManagementBaseId}
          onOpenShop={setShopBaseId}
          onOpenMartialHall={setMartialHallBaseId}
          onCloseDefense={() => {
            setDefenseBaseId(null)
            gameStore.setOperation({ type: 'idle' })
          }}
          onBeginDefensePositionSelection={() => {
            setDefenseBaseId(null)
          }}
          onOpenMission={setMissionBaseId}
          onHeal={(baseId) => {
            const result = gameStore.useInfirmary(gameState.activePlayerId, baseId)
            if (result.ok) {
              gameStore.showActionResult({
                title: '就醫結果',
                message: `已在醫療室 Lv.${result.data.infirmaryLevel} 接受治療。`,
                rewards: [
                  `氣血 +${Math.round(result.data.healthRecovery)}`,
                  `內力 +${Math.round(result.data.innerPowerRecovery)}`,
                  '目前玩家回合結束',
                ],
              })
            } else {
              gameStore.showActionResult({ title: '就醫失敗', message: result.reason, rewards: [] })
            }
          }}
          onRepair={(baseId) => {
            gameStore.previewRepair(gameState.activePlayerId, baseId)
          }}
          onOpenCollection={(resourcePointId) => {
            setDetailsResourcePointId(null)
            setCollectionResourcePointId(resourcePointId)
          }}
          onRepairResourcePoint={(resourcePointId) => {
            const result = gameStore.repairResourcePoint(gameState.activePlayerId, resourcePointId)
            if (result.ok) {
              gameStore.showActionResult({ title: '修復資源點', message: '資源點已恢復運作。', rewards: ['資源點氣血恢復至最大值', '體力 -10'] })
            } else {
              gameStore.showActionResult({ title: '修復資源點失敗', message: result.reason, rewards: [] })
            }
          }}
        />
      </Layout.Content>
    </Layout>
  )
}

export default App
