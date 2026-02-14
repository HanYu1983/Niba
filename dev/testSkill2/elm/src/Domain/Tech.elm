module Domain.Tech exposing (Tech, defaultTech, researchCostForNextNode, thermalLoadFromTech, efficiencyNodes, skillNodes, eventCardForEfficiencyNode, eventCardForSkillNode)

{-| 科技樹狀態與熱負載，對應 Tech_Tree.md
-}



type alias Tech =
    { efficiencyPercent : Int
    , skillPercent : Int
    }


defaultTech : Tech
defaultTech =
    { efficiencyPercent = 0
    , skillPercent = 0
    }


{-| 研發成本（Numerical_Design §7.1）：0→25% 30 RP、25→50% 45、50→75% 65、75→100% 90。
-}
researchCostForNextNode : Int -> Int
researchCostForNextNode currentPercent =
    if currentPercent >= 100 then
        999
    else
        case currentPercent // 25 of
            0 ->
                30
            1 ->
                45
            2 ->
                65
            _ ->
                90


{-| 熱負載公式: (Efficiency_Lv * 1.2) + (Skill_Lv * 1.2)，取整（§7.2）
-}
thermalLoadFromTech : Tech -> Int
thermalLoadFromTech t =
    round (toFloat (t.efficiencyPercent + t.skillPercent) * 1.2)
        |> clamp 0 999


efficiencyNodes : List Int
efficiencyNodes =
    [ 25, 50, 75, 100 ]


skillNodes : List Int
skillNodes =
    [ 25, 50, 75, 100 ]


{-| 效率線達到節點時注入的事件卡 UID（對應 Initial_Card_Pool E-001、E-003）
-}
eventCardForEfficiencyNode : Int -> Maybe String
eventCardForEfficiencyNode percent =
    case percent of
        25 ->
            Just "E-001"

        50 ->
            Just "E-003"

        _ ->
            Nothing


{-| 技能線達到節點時注入的事件卡 UID（E-002、E-004）
-}
eventCardForSkillNode : Int -> Maybe String
eventCardForSkillNode percent =
    case percent of
        25 ->
            Just "E-002"

        50 ->
            Just "E-004"

        _ ->
            Nothing
