module Domain.Defense exposing (DefenseModule(..), defaultSlots, initialEquipped, slotCount, moduleAttribute)

{-| 防禦模組與槽位，對應 Combat_Module.md、Current_World_State.md
-}

import Domain.Card exposing (EmotionalAttribute(..))


type DefenseModule
    = StaticWall
    | LogicGatling
    | EmpathyJammer
    | HeatSink


defaultSlots : Int
defaultSlots =
    3


{-| 初始已解鎖 1 格，裝備白音牆
-}
initialEquipped : List DefenseModule
initialEquipped =
    [ StaticWall ]


slotCount : Int
slotCount =
    3


moduleAttribute : DefenseModule -> EmotionalAttribute
moduleAttribute m =
    case m of
        StaticWall ->
            LogicBlue

        LogicGatling ->
            LogicBlue

        EmpathyJammer ->
            OrganicGreen

        HeatSink ->
            ThermalRed
