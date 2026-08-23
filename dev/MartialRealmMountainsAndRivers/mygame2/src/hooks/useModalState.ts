import { useState } from 'react'
import type { GameState, CreatureState } from '../game/types'

function useModalState(gameState: GameState) {
  const [selectedBaseId, setSelectedBaseId] = useState<string | null>(null)
  const [buildingBaseId, setBuildingBaseId] = useState<string | null>(null)
  const [defenseBaseId, setDefenseBaseId] = useState<string | null>(null)
  const [collectionResourcePointId, setCollectionResourcePointId] = useState<string | null>(null)
  const [selectedCreatureId, setSelectedCreatureId] = useState<string | null>(null)
  const [missionBaseId, setMissionBaseId] = useState<string | null>(null)
  const [detailsBaseId, setDetailsBaseId] = useState<string | null>(null)
  const [detailsCreatureNestId, setDetailsCreatureNestId] = useState<string | null>(null)
  const [detailsResourcePointId, setDetailsResourcePointId] = useState<string | null>(null)
  const [inventoryPlayerId, setInventoryPlayerId] = useState<string | null>(null)
  const [equipmentPlayerId, setEquipmentPlayerId] = useState<string | null>(null)
  const [detailsItemPointId, setDetailsItemPointId] = useState<string | null>(null)
  const [detailsExplorationEventId, setDetailsExplorationEventId] = useState<string | null>(null)
  const [detailsRuinId, setDetailsRuinId] = useState<string | null>(null)
  const [detailsDefenseStructureId, setDetailsDefenseStructureId] = useState<string | null>(null)
  const [skillPlayerId, setSkillPlayerId] = useState<string | null>(null)
  const [policySwitchBaseId, setPolicySwitchBaseId] = useState<string | null>(null)
  const [warehouseBaseId, setWarehouseBaseId] = useState<string | null>(null)
  const [transportBaseId, setTransportBaseId] = useState<string | null>(null)
  const [smallWaystationTransportId, setSmallWaystationTransportId] = useState<string | null>(null)
  const [regionalManagementBaseId, setRegionalManagementBaseId] = useState<string | null>(null)
  const [shopBaseId, setShopBaseId] = useState<string | null>(null)
  const [martialHallBaseId, setMartialHallBaseId] = useState<string | null>(null)
  const [detailsSectGateId, setDetailsSectGateId] = useState<string | null>(null)

  const selectedCreature: CreatureState | null = gameState.creatures.find(
    (creature) => creature.id === selectedCreatureId,
  ) ?? null
  const buildingBase = gameState.bases.find((base) => base.id === buildingBaseId) ?? null
  const defenseBase = gameState.bases.find((base) => base.id === defenseBaseId) ?? null
  const collectionResourcePoint = gameState.resourcePoints.find(
    (resourcePoint) => resourcePoint.id === collectionResourcePointId,
  ) ?? null
  const collectionBase = gameState.bases.find(
    (base) => base.id === collectionResourcePoint?.ownerBaseId,
  ) ?? null
  const missionBase = gameState.bases.find((base) => base.id === missionBaseId) ?? null
  const detailsBase = gameState.bases.find((base) => base.id === detailsBaseId) ?? null
  const detailsCreatureNest = gameState.creatureNests.find(
    (nest) => nest.id === detailsCreatureNestId,
  ) ?? null
  const detailsResourcePoint = gameState.resourcePoints.find(
    (resourcePoint) => resourcePoint.id === detailsResourcePointId,
  ) ?? null
  const detailsResourcePointBase = gameState.bases.find(
    (base) => base.id === detailsResourcePoint?.ownerBaseId,
  ) ?? null
  const inventoryPlayer = gameState.players.find((player) => player.id === inventoryPlayerId) ?? null
  const equipmentPlayer = gameState.players.find((player) => player.id === equipmentPlayerId) ?? null
  const detailsItemPoint = gameState.itemPoints.find((point) => point.id === detailsItemPointId) ?? null
  const detailsExplorationEvent = gameState.explorationEvents?.find((event) => event.id === detailsExplorationEventId) ?? null
  const detailsRuin = gameState.ruins?.find((ruin) => ruin.id === detailsRuinId) ?? null
  const detailsDefenseStructure = gameState.defenseStructures?.find(
    (structure) => structure.id === detailsDefenseStructureId,
  ) ?? null
  const detailsDefenseStructureBase = gameState.bases.find(
    (base) => base.id === detailsDefenseStructure?.ownerBaseId,
  ) ?? null
  const policySwitchBase = gameState.bases.find((base) => base.id === policySwitchBaseId) ?? null
  const warehouseBase = gameState.bases.find((base) => base.id === warehouseBaseId) ?? null
  const transportBase = gameState.bases.find((base) => base.id === transportBaseId) ?? null
  const smallWaystationTransport = gameState.defenseStructures?.find(
    (structure) => structure.id === smallWaystationTransportId,
  ) ?? null
  const regionalManagementBase = gameState.bases.find((base) => base.id === regionalManagementBaseId) ?? null
  const shopBase = gameState.bases.find((base) => base.id === shopBaseId) ?? null
  const martialHallBase = gameState.bases.find((base) => base.id === martialHallBaseId) ?? null
  const detailsSectGate = gameState.sectGates?.find((gate) => gate.id === detailsSectGateId) ?? null

  return {
    selectedBaseId,
    setSelectedBaseId,
    buildingBaseId,
    setBuildingBaseId,
    defenseBaseId,
    setDefenseBaseId,
    collectionResourcePointId,
    setCollectionResourcePointId,
    selectedCreatureId,
    setSelectedCreatureId,
    missionBaseId,
    setMissionBaseId,
    detailsBaseId,
    setDetailsBaseId,
    detailsCreatureNestId,
    setDetailsCreatureNestId,
    detailsResourcePointId,
    setDetailsResourcePointId,
    inventoryPlayerId,
    setInventoryPlayerId,
    equipmentPlayerId,
    setEquipmentPlayerId,
    detailsItemPointId,
    setDetailsItemPointId,
    detailsExplorationEventId,
    setDetailsExplorationEventId,
    detailsRuinId,
    setDetailsRuinId,
    detailsDefenseStructureId,
    setDetailsDefenseStructureId,
    skillPlayerId,
    setSkillPlayerId,
    selectedCreature,
    buildingBase,
    defenseBase,
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
    policySwitchBase,
    setPolicySwitchBaseId,
    warehouseBase,
    setWarehouseBaseId,
    transportBase,
    setTransportBaseId,
    smallWaystationTransport,
    setSmallWaystationTransportId,
    regionalManagementBase,
    setRegionalManagementBaseId,
    shopBase,
    setShopBaseId,
    martialHallBase,
    setMartialHallBaseId,
    detailsSectGateId,
    setDetailsSectGateId,
    detailsSectGate,
  }
}

export default useModalState
