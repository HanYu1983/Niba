module Types exposing (..)

-- =============================================================================
-- Global State Machine (main_entry.md §2)
-- =============================================================================

type GameState
    = LobbyState LobbyModel
    | StrategyState StrategyModel
    | CombatState CombatModel


-- 戰鬥階段：action_menu、combat_logic、systems
type alias CombatModel =
    { mission : Mission
    , gridWidth : Int
    , gridHeight : Int
    , playerUnits : List CombatUnit
    , enemyUnits : List CombatUnit
    , currentSide : BattleSide
    , currentUnitIndex : Int
    , round : Int
    , result : Maybe BattleResult
    , pendingAttack : Maybe PendingAttack
    , counterPrompt : Maybe CounterPrompt
    , snipePrompt : Maybe SnipePrompt
    , lastAttackResult : Maybe AttackResult
    , statusUnitId : Maybe String
    , counterPromptAfterDismiss : Maybe CounterPrompt
    , lobbySnapshot : LobbyModel
    }


type AttackOutcome
    = AttackHit
    | AttackMiss
    | AttackEvade


type alias AttackResult =
    { outcome : AttackOutcome
    , damage : Int
    , isCrit : Bool
    , defenseNote : Maybe String
    , evadeNote : Maybe String
    , attackerName : String
    , defenderName : String
    }


type BattleSide
    = SidePlayer
    | SideEnemy


type BattleResult
    = Victory
    | Defeat


type alias CombatUnit =
    { id : String
    , side : BattleSide
    , assembly : Assembly
    , x : Int
    , y : Int
    , currentHp : Int
    , currentEn : Int
    , currentWeaponIndex : Int
    , actionState : ActionState
    , ammoRemaining : List Int
    , snipeTriggeredRound : Int
    }


type ActionState
    = Active
    | PostMove
    | Finished


type CounterChoice
    = CounterAttack
    | CounterDefend
    | CounterEvade


type alias PendingAttack =
    { attackerId : String
    , defenderId : String
    , damage : Int
    }


type alias CounterPrompt =
    { attackerId : String
    , defenderId : String
    }


type alias SnipePrompt =
    { sniperId : String
    , enemyId : String
    }


type alias LobbyModel =
    { balance : Int
    , shop : Shop
    , inventory : Inventory
    , assembly : Maybe Assembly
    , squad : List Assembly
    }


-- 策略階段：state_flow.md § 3
type alias StrategyModel =
    { lobbySnapshot : LobbyModel
    , missions : List Mission
    , selectedMission : Maybe Mission
    , selectedForDeployment : List Int
    }


-- 任務定義：missions.md
type alias Mission =
    { id : String
    , name : String
    , nameTw : String
    , context : String
    , mapSizeX : Int
    , mapSizeY : Int
    , weatherTag : String
    , deploymentLimit : Int
    , winCondition : String
    , loseCondition : String
    , rewardMoney : Int
    }


type alias Shop =
    { mechas : List MechaFrame
    , pilots : List PilotProfile
    , weapons : List WeaponProfile
    , parts : List PartProfile
    }


type alias Inventory =
    { mechas : List MechaFrame
    , pilots : List PilotProfile
    , weapons : List WeaponProfile
    , parts : List PartProfile
    }


type alias Assembly =
    { mecha : MechaFrame
    , pilot : Maybe PilotProfile
    , weapons : List WeaponProfile
    , parts : List PartProfile
    }


-- =============================================================================
-- Entity Schemas (entities.md)
-- =============================================================================

type alias MechaFrame =
    { id : String
    , name : String
    , nameTw : String
    , size : String
    , description : String
    , price : Int
    , maxHp : Int
    , maxEn : Int
    , enRegen : Int
    , baseMov : Int
    , weightLimit : Int
    , weaponSlots : List WeaponSlotTag
    , partSlots : Int
    , adaptability : Adaptability
    , armorMatrix : ArmorMatrix
    }


type WeaponSlotTag
    = Hand
    | Shoulder
    | Internal


type alias Adaptability =
    { land : Grade
    , mountain : Grade
    , sea : Grade
    , air : Grade
    , space : Grade
    }


type Grade
    = S
    | A
    | B
    | C
    | D
    | E


type alias ArmorMatrix =
    { fire : Int
    , elec : Int
    , beam : Int
    , kin : Int
    , chem : Int
    }


type alias PilotProfile =
    { id : String
    , name : String
    , nameTw : String
    , rank : String
    , description : String
    , price : Int
    , melee : Int
    , ranged : Int
    , reflex : Int
    , technique : Int
    , currentWillpower : Int
    , spiritSkills : List String
    , passiveAbilities : List String
    }


type alias WeaponProfile =
    { id : String
    , name : String
    , nameTw : String
    , weight : Int
    , price : Int
    , slotTag : WeaponSlotTag
    , atkVector : String
    , stance : String
    , rngMin : Int
    , rngMax : Int
    , accuracyMod : Int
    , enCost : Int
    , maxAmmo : Int
    }


type alias PartProfile =
    { id : String
    , name : String
    , nameTw : String
    , weight : Int
    , price : Int
    , passiveDraw : Int
    , hpBonus : Int
    , adaptabilityModifiers : List ( String, Grade )
    }
