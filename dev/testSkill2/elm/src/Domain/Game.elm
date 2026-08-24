module Domain.Game exposing (Phase(..), phaseLabel)

{-| 遊戲階段，供 Main 與 View 共用。對應 Core_Mechanics 四階段。
-}


type Phase
    = Scan
    | Command
    | Purge
    | Cooldown


phaseLabel : Phase -> String
phaseLabel p =
    case p of
        Scan ->
            "掃描"

        Command ->
            "指令"

        Purge ->
            "晚間清除"

        Cooldown ->
            "冷卻結算"
