module Main exposing (main)

import Browser
import Html
import Combat
import GameData
import Lobby
import Messages exposing (GameMsg(..))
import Types exposing (GameState(..), LobbyModel, StrategyModel, CombatModel, Inventory, BattleSide(..))
import Ui.CombatView
import Ui.LobbyView
import Ui.StrategyView


main : Program () GameState GameMsg
main =
    Browser.sandbox
        { init = initialGameState
        , view = view
        , update = update
        }


initialGameState : GameState
initialGameState =
    LobbyState initialLobby


initialLobby : LobbyModel
initialLobby =
    { balance = 150000
    , shop = GameData.initialShop
    , inventory = emptyInventory
    , assembly = Nothing
    , squad = []
    }


emptyInventory : Inventory
emptyInventory =
    { mechas = []
    , pilots = []
    , weapons = []
    , parts = []
    }


update : GameMsg -> GameState -> GameState
update msg state =
    case state of
        LobbyState lobby ->
            updateFromLobby msg lobby

        StrategyState sm ->
            updateFromStrategy msg sm

        CombatState cm ->
            updateFromCombat msg cm


updateFromLobby : GameMsg -> LobbyModel -> GameState
updateFromLobby msg lobby =
    case msg of
        GoToStrategy ->
            StrategyState
                { lobbySnapshot = lobby
                , missions = GameData.initialMissions
                , selectedMission = Nothing
                , selectedForDeployment = []
                }

        AddAssemblyToSquad ->
            Maybe.withDefault (LobbyState lobby) (Maybe.map LobbyState (Lobby.addAssemblyToSquad lobby))

        RemoveFromSquad index ->
            LobbyState (Lobby.removeFromSquad index lobby)

        GoToTestCombat ->
            CombatState (Combat.initCombat GameData.testMission GameData.testPlayerDeployments lobby)

        _ ->
            LobbyState (updateLobby msg lobby)


updateFromStrategy : GameMsg -> StrategyModel -> GameState
updateFromStrategy msg sm =
    case msg of
        BackToLobby ->
            LobbyState sm.lobbySnapshot

        SelectMission mission ->
            StrategyState { sm | selectedMission = Just mission, selectedForDeployment = [] }

        ToggleDeployment index ->
            StrategyState (toggleDeployment index sm)

        ConfirmDeploy ->
            case sm.selectedMission of
                Nothing ->
                    StrategyState sm
                Just mission ->
                    let
                        deployments =
                            List.filterMap (\i -> sm.lobbySnapshot.squad |> List.drop i |> List.head) sm.selectedForDeployment
                    in
                    CombatState (Combat.initCombat mission deployments sm.lobbySnapshot)

        CombatMoveTo _ _ ->
            StrategyState sm

        CombatAttack _ ->
            StrategyState sm

        CombatEndTurn ->
            StrategyState sm

        CombatRunEnemyTurn ->
            StrategyState sm

        CombatBackToStrategy ->
            StrategyState sm

        _ ->
            StrategyState sm


updateFromCombat : GameMsg -> CombatModel -> GameState
updateFromCombat msg cm =
    case msg of
        CombatBackToStrategy ->
            StrategyState
                { lobbySnapshot = cm.lobbySnapshot
                , missions = GameData.initialMissions
                , selectedMission = Just cm.mission
                , selectedForDeployment = []
                }

        CombatMoveTo nx ny ->
            case Combat.getCurrentUnit cm of
                Nothing ->
                    CombatState cm
                Just u ->
                    case Combat.moveUnit cm u nx ny of
                        Nothing ->
                            CombatState cm
                        Just cm2 ->
                            CombatState (Combat.checkOverwatchAfterMove cm2 u.id)

        CombatAttack targetId ->
            case Combat.getCurrentUnit cm of
                Nothing ->
                    CombatState cm
                Just u ->
                    let
                        targets = Combat.targetsInRange cm u
                        target = List.filter (\t -> t.id == targetId) targets |> List.head
                    in
                    case target of
                        Nothing ->
                            CombatState cm
                        Just t ->
                            let
                                cm2 =
                                    Combat.beginAttack cm u t
                            in
                            if cm2.counterPrompt /= Nothing then
                                CombatState cm2
                            else
                                CombatState (checkResult (Combat.advanceUntilUnitOrResult (cm2 |> Combat.advanceTurn)))

        CombatCounterChoice choice ->
            let
                cm2 =
                    Combat.resolvePendingAttack choice cm
            in
            CombatState (checkResult (Combat.advanceUntilUnitOrResult (cm2 |> Combat.advanceTurn)))

        CombatSnipeConfirm doSnipe ->
            let
                cm2 =
                    Combat.resolveSnipePrompt doSnipe cm
            in
            case Combat.getCurrentUnit cm2 of
                Nothing ->
                    CombatState (checkResult (Combat.advanceUntilUnitOrResult cm2))
                Just u ->
                    if u.side == SideEnemy then
                        CombatState (checkResult (Combat.advanceUntilUnitOrResult (Combat.endTurn cm2 u |> Combat.advanceTurn)))
                    else
                        CombatState (checkResult (Combat.advanceUntilUnitOrResult cm2))

        CombatEndTurn ->
            case Combat.getCurrentUnit cm of
                Nothing ->
                    CombatState cm
                Just u ->
                    CombatState (checkResult (Combat.advanceUntilUnitOrResult (Combat.endTurn cm u |> Combat.advanceTurn)))

        CombatRunEnemyTurn ->
            if cm.snipePrompt /= Nothing then
                CombatState cm
            else
                CombatState (checkResult (Combat.runEnemyTurn cm))

        CombatSwitchWeapon weaponIndex ->
            case Combat.getCurrentUnit cm of
                Nothing ->
                    CombatState cm
                Just u ->
                    CombatState (Maybe.withDefault cm (Combat.switchWeaponTo cm u weaponIndex))

        CombatDismissAttackResult ->
            let
                cm2 =
                    { cm | lastAttackResult = Nothing }
            in
            case cm.counterPromptAfterDismiss of
                Just p ->
                    CombatState { cm2 | counterPromptAfterDismiss = Nothing, counterPrompt = Just p }
                Nothing ->
                    CombatState cm2

        CombatShowStatus id ->
            CombatState { cm | statusUnitId = Just id }

        CombatCloseStatus ->
            CombatState { cm | statusUnitId = Nothing }

        _ ->
            CombatState cm


checkResult : CombatModel -> CombatModel
checkResult cm =
    case Combat.battleResult cm of
        Just r ->
            { cm | result = Just r }
        Nothing ->
            cm


toggleDeployment : Int -> StrategyModel -> StrategyModel
toggleDeployment index sm =
    let
        missionLimit =
            sm.selectedMission |> Maybe.map .deploymentLimit |> Maybe.withDefault 0
        current =
            sm.selectedForDeployment
        isSelected =
            List.member index current
    in
    if isSelected then
        { sm | selectedForDeployment = List.filter ((/=) index) current }
    else if List.length current < missionLimit then
        { sm | selectedForDeployment = current ++ [ index ] }
    else
        sm


updateLobby : GameMsg -> LobbyModel -> LobbyModel
updateLobby msg lobby =
    case msg of
        BuyMecha mecha ->
            Maybe.withDefault lobby (Lobby.tryBuyMecha lobby mecha)

        SellMecha mecha ->
            Lobby.trySellMecha lobby mecha

        BuyPilot pilot ->
            Maybe.withDefault lobby (Lobby.tryBuyPilot lobby pilot)

        SellPilot pilot ->
            Lobby.trySellPilot lobby pilot

        BuyWeapon weapon ->
            Maybe.withDefault lobby (Lobby.tryBuyWeapon lobby weapon)

        SellWeapon weapon ->
            Lobby.trySellWeapon lobby weapon

        BuyPart part ->
            Maybe.withDefault lobby (Lobby.tryBuyPart lobby part)

        SellPart part ->
            Lobby.trySellPart lobby part

        SelectMechaForAssembly mecha ->
            Lobby.selectMechaForAssembly lobby mecha

        ClearAssembly ->
            Lobby.clearAssembly lobby

        EquipWeapon weapon ->
            Maybe.withDefault lobby (Lobby.equipWeapon lobby weapon)

        UnequipWeapon weapon ->
            Maybe.withDefault lobby (Lobby.unequipWeapon lobby weapon)

        EquipPart part ->
            Maybe.withDefault lobby (Lobby.equipPart lobby part)

        UnequipPart part ->
            Maybe.withDefault lobby (Lobby.unequipPart lobby part)

        AssignPilot pilot ->
            Maybe.withDefault lobby (Lobby.assignPilot lobby pilot)

        UnassignPilot ->
            Maybe.withDefault lobby (Lobby.unassignPilot lobby)

        _ ->
            lobby


view : GameState -> Html.Html GameMsg
view state =
    case state of
        LobbyState lobby ->
            Ui.LobbyView.viewLobby lobby

        StrategyState sm ->
            Ui.StrategyView.viewStrategy sm

        CombatState cm ->
            Ui.CombatView.viewCombat cm
