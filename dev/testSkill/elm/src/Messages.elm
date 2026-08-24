module Messages exposing (GameMsg(..))

import Types exposing (MechaFrame, PilotProfile, WeaponProfile, PartProfile, Mission, CounterChoice)


type GameMsg
    = BuyMecha MechaFrame
    | SellMecha MechaFrame
    | BuyPilot PilotProfile
    | SellPilot PilotProfile
    | BuyWeapon WeaponProfile
    | SellWeapon WeaponProfile
    | BuyPart PartProfile
    | SellPart PartProfile
    | SelectMechaForAssembly MechaFrame
    | ClearAssembly
    | EquipWeapon WeaponProfile
    | UnequipWeapon WeaponProfile
    | EquipPart PartProfile
    | UnequipPart PartProfile
    | AssignPilot PilotProfile
    | UnassignPilot
    | AddAssemblyToSquad
    | RemoveFromSquad Int
    | GoToStrategy
    | GoToTestCombat
    | BackToLobby
    | SelectMission Mission
    | ToggleDeployment Int
    | ConfirmDeploy
    | CombatMoveTo Int Int
    | CombatAttack String
    | CombatCounterChoice CounterChoice
    | CombatSnipeConfirm Bool
    | CombatDismissAttackResult
    | CombatShowStatus String
    | CombatCloseStatus
    | CombatEndTurn
    | CombatSwitchWeapon Int
    | CombatRunEnemyTurn
    | CombatBackToStrategy
