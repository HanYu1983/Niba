module Main exposing (main)

import Browser
import Debug
import AI exposing (AIDecision(..), decide)
import Board exposing (CellContent(..), Position, Side(..), aiCastlePos, cellAt, playerCastlePos, positionEquals)
import Game exposing (GameResult(..), GameState, applyAIMove, applyPlayerMove, checkVictory, decrementProtection, expectedCastleHpLogLines, init)
import Html exposing (Html, button, div, text)
import Html.Attributes
import Html.Keyed
import Html.Events exposing (onClick)
import Items exposing (Item(..), applyBomb, applyLaser, applyShield, bombAffectedCells, canUseBomb, canUseLaser, canUseShield, laserLine)
import Rules exposing (horseLegalMoves)
import Debug.GameTests
import Process
import Task
import Ui.BoardView as BoardView
import Ui.Result as ResultView
import Ui.Toolbar as ToolbarView


type alias Model =
    { gameState : GameState
    , selectedPiece : Maybe Position
    , legalMoves : List Position
    , itemMode : Maybe Item
    , laserPending : Maybe Position
    , previewCells : List Position
    , errorMessage : Maybe String
    , testErrors : List String
    , aiActionLog : List String
    , itemPendingApply : Maybe PendingItem
    , aiItemPendingApply : Maybe PendingItem
    }


type PendingItem
    = BombAt Position
    | ShieldAt Position
    | LaserAt Bool Int Position


type Msg
    = CellClicked Position
    | UseItem Item
    | CancelItem
    | LaserRow
    | LaserCol
    | Restart
    | MainMenu
    | RunTests
    | RunAITurn
    | ApplyPendingItem
    | ApplyAIPendingItem


initialModel : Model
initialModel =
    { gameState = init
    , selectedPiece = Nothing
    , legalMoves = []
    , itemMode = Nothing
    , laserPending = Nothing
    , previewCells = []
    , errorMessage = Nothing
    , testErrors = []
    , aiActionLog = []
    , itemPendingApply = Nothing
    , aiItemPendingApply = Nothing
    }

maxLogLines : Int
maxLogLines =
    80

posStr : Position -> String
posStr p =
    "(" ++ String.fromInt p.row ++ "," ++ String.fromInt p.col ++ ")"

addLog : String -> Model -> Model
addLog line model =
    { model | aiActionLog = (line :: model.aiActionLog) |> List.take maxLogLines }


castleHpLog : GameState -> GameState -> Model -> Model
castleHpLog before after model =
    List.foldl addLog model (expectedCastleHpLogLines before after)


shieldConsumedLog : GameState -> GameState -> Model -> Model
shieldConsumedLog before after model =
    let
        consumed = List.filter (\p -> not (List.any (positionEquals p) after.shieldedCells)) before.shieldedCells
    in
    List.foldl (\p m -> addLog ("護盾抵消 於 " ++ posStr p ++ "，攻擊無效") m) model consumed


scoreChangeLog : GameState -> GameState -> Model -> Model
scoreChangeLog before after model =
    let
        m =
            if after.playerScore > before.playerScore then
                addLog ("玩家得 1 分 | 分數 " ++ String.fromInt before.playerScore ++ "→" ++ String.fromInt after.playerScore) model
            else
                model
        m2 =
            if after.aiScore > before.aiScore then
                addLog ("AI 得 1 分 | 分數 " ++ String.fromInt before.aiScore ++ "→" ++ String.fromInt after.aiScore) m
            else
                m
    in
    m2


getProtected : Model -> List Position
getProtected model =
    Game.protectedPositions model.gameState


getShielded : Model -> List Position
getShielded model =
    Game.shieldedPositions model.gameState


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        RunTests ->
            ( { model | testErrors = Debug.GameTests.runTests }, Cmd.none )

        RunAITurn ->
            if model.gameState.currentSide == AI && model.aiItemPendingApply == Nothing then
                let
                    m1 = addLog "[RunAITurn] currentSide=AI → 開始執行" model
                    ( newModel, cmd ) = runAIStep m1
                in
                ( newModel, cmd )
            else
                ( addLog ("[RunAITurn] 收到時 currentSide=" ++ sideLabel model.gameState.currentSide ++ " → 跳過不執行") model, Cmd.none )

        ApplyPendingItem ->
            case model.itemPendingApply of
                Just (BombAt pos) ->
                    case applyBomb model.gameState Player pos of
                        Ok s ->
                            let
                                scoreLog = " | 分數 玩家 " ++ String.fromInt model.gameState.playerScore ++ "→" ++ String.fromInt s.playerScore
                                m0 = addLog ("[回合 " ++ String.fromInt model.gameState.turn ++ "] 玩家使用 炸彈 於 " ++ posStr pos ++ " → 完成" ++ scoreLog) model
                                m1 = castleHpLog model.gameState s m0
                                m2 = shieldConsumedLog model.gameState s m1
                            in
                            ( { m2 | gameState = recordPlayerBomb s, itemMode = Nothing, previewCells = [], itemPendingApply = Nothing, errorMessage = Nothing }, Cmd.none )
                        Err e ->
                            ( addLog ("玩家使用 炸彈 → Err: " ++ e) { model | itemPendingApply = Nothing, errorMessage = Just e }, Cmd.none )
                Just (ShieldAt pos) ->
                    case applyShield model.gameState Player pos of
                        Ok s ->
                            let
                                scoreLog = " | 分數 玩家 " ++ String.fromInt model.gameState.playerScore ++ "→" ++ String.fromInt s.playerScore
                                m0 = addLog ("[回合 " ++ String.fromInt model.gameState.turn ++ "] 玩家使用 護盾 於 " ++ posStr pos ++ " → 完成" ++ scoreLog) model
                            in
                            ( { m0 | gameState = recordPlayerShield s, itemMode = Nothing, previewCells = [], itemPendingApply = Nothing, errorMessage = Nothing }, Cmd.none )
                        Err e ->
                            ( addLog ("玩家使用 護盾 → Err: " ++ e) { model | itemPendingApply = Nothing, errorMessage = Just e }, Cmd.none )
                Just (LaserAt isRow index pos) ->
                    case applyLaser model.gameState Player isRow index of
                        Ok s ->
                            let
                                axis = if isRow then "行" else "列"
                                scoreLog = " | 分數 玩家 " ++ String.fromInt model.gameState.playerScore ++ "→" ++ String.fromInt s.playerScore
                                m0 = addLog ("[回合 " ++ String.fromInt model.gameState.turn ++ "] 玩家使用 雷射 " ++ axis ++ " " ++ String.fromInt index ++ " → 完成" ++ scoreLog) model
                                m1 = castleHpLog model.gameState s m0
                                m2 = shieldConsumedLog model.gameState s m1
                            in
                            ( { m2 | gameState = recordPlayerLaser s, itemMode = Nothing, laserPending = Nothing, previewCells = [], itemPendingApply = Nothing, errorMessage = Nothing }, Cmd.none )
                        Err e ->
                            ( addLog ("玩家使用 雷射 → Err: " ++ e) { model | itemPendingApply = Nothing, laserPending = Nothing, errorMessage = Just e }, Cmd.none )
                Nothing ->
                    ( model, Cmd.none )

        ApplyAIPendingItem ->
            case model.aiItemPendingApply of
                Just (BombAt pos) ->
                    case applyBomb model.gameState AI pos of
                        Ok s ->
                            let
                                next = { s | aiBombUse = s.aiBombUse + 1 }
                                scoreLog = " | 分數 玩家 " ++ String.fromInt model.gameState.playerScore ++ " AI " ++ String.fromInt model.gameState.aiScore ++ "→" ++ String.fromInt next.aiScore
                                m0 = addLog ("[回合 " ++ String.fromInt model.gameState.turn ++ "] AI 使用 炸彈 於 " ++ posStr pos ++ " → 完成（本回合繼續，AI 將移動棋子）" ++ scoreLog) model
                                m1 = castleHpLog model.gameState next m0
                                m2 = shieldConsumedLog model.gameState next m1
                            in
                            ( { m2 | gameState = next, aiItemPendingApply = Nothing }
                            , Task.perform (\_ -> RunAITurn) (Process.sleep 350)
                            )
                        Err e ->
                            ( addLog ("[回合 " ++ String.fromInt model.gameState.turn ++ "] AI 使用 炸彈 → Err: " ++ e) { model | aiItemPendingApply = Nothing }, Cmd.none )
                Just (ShieldAt pos) ->
                    case applyShield model.gameState AI pos of
                        Ok s ->
                            let
                                next = { s | aiShieldUse = s.aiShieldUse + 1 }
                                scoreLog = " | 分數 玩家 " ++ String.fromInt model.gameState.playerScore ++ " AI " ++ String.fromInt model.gameState.aiScore ++ "→" ++ String.fromInt next.aiScore
                                m = addLog ("[回合 " ++ String.fromInt model.gameState.turn ++ "] AI 使用 護盾 於 " ++ posStr pos ++ " → 完成（本回合繼續，AI 將移動棋子）" ++ scoreLog) model
                            in
                            ( { m | gameState = next, aiItemPendingApply = Nothing }
                            , Task.perform (\_ -> RunAITurn) (Process.sleep 350)
                            )
                        Err e ->
                            ( addLog ("[回合 " ++ String.fromInt model.gameState.turn ++ "] AI 使用 護盾 → Err: " ++ e) { model | aiItemPendingApply = Nothing }, Cmd.none )
                Just (LaserAt isRow index displayPos) ->
                    case applyLaser model.gameState AI isRow index of
                        Ok s ->
                            let
                                next = { s | aiLaserUse = s.aiLaserUse + 1 }
                                axis = if isRow then "行" else "列"
                                scoreLog = " | 分數 玩家 " ++ String.fromInt model.gameState.playerScore ++ " AI " ++ String.fromInt model.gameState.aiScore ++ "→" ++ String.fromInt next.aiScore
                                m0 = addLog ("[回合 " ++ String.fromInt model.gameState.turn ++ "] AI 使用 雷射 " ++ axis ++ " " ++ String.fromInt index ++ " → 完成（本回合繼續，AI 將移動棋子）" ++ scoreLog) model
                                m1 = castleHpLog model.gameState next m0
                                m2 = shieldConsumedLog model.gameState next m1
                            in
                            ( { m2 | gameState = next, aiItemPendingApply = Nothing }
                            , Task.perform (\_ -> RunAITurn) (Process.sleep 350)
                            )
                        Err e ->
                            ( addLog ("[回合 " ++ String.fromInt model.gameState.turn ++ "] AI 使用 雷射 → Err: " ++ e) { model | aiItemPendingApply = Nothing }, Cmd.none )
                Nothing ->
                    ( model, Cmd.none )

        _ ->
            case checkVictory model.gameState of
                Ongoing ->
                    updateOngoing msg model

                result ->
                    case msg of
                        Restart ->
                            ( { initialModel | gameState = init }, Cmd.none )

                        MainMenu ->
                            ( initialModel, Cmd.none )

                        _ ->
                            ( model, Cmd.none )


updateOngoing : Msg -> Model -> ( Model, Cmd Msg )
updateOngoing msg model =
    case msg of
        RunTests ->
            ( model, Cmd.none )

        RunAITurn ->
            ( model, Cmd.none )

        ApplyPendingItem ->
            ( model, Cmd.none )

        ApplyAIPendingItem ->
            ( model, Cmd.none )

        Restart ->
            ( { initialModel | gameState = init }, Cmd.none )

        MainMenu ->
            ( initialModel, Cmd.none )

        CancelItem ->
            ( { model | itemMode = Nothing, laserPending = Nothing, previewCells = [], errorMessage = Nothing }, Cmd.none )

        UseItem item ->
            ( { model | itemMode = Just item, laserPending = Nothing, previewCells = [], errorMessage = Nothing }, Cmd.none )

        LaserRow ->
            case model.laserPending of
                Just pos ->
                    case applyLaser model.gameState Player True pos.row of
                        Ok _ ->
                            ( { model | itemPendingApply = Just (LaserAt True pos.row pos), laserPending = Nothing, previewCells = [], errorMessage = Nothing }
                            , Task.perform (\_ -> ApplyPendingItem) (Process.sleep 350)
                            )
                        Err e ->
                            ( { model | errorMessage = Just e }, Cmd.none )
                Nothing ->
                    ( model, Cmd.none )

        LaserCol ->
            case model.laserPending of
                Just pos ->
                    case applyLaser model.gameState Player False pos.col of
                        Ok _ ->
                            ( { model | itemPendingApply = Just (LaserAt False pos.col pos), laserPending = Nothing, previewCells = [], errorMessage = Nothing }
                            , Task.perform (\_ -> ApplyPendingItem) (Process.sleep 350)
                            )
                        Err e ->
                            ( { model | errorMessage = Just e }, Cmd.none )
                Nothing ->
                    ( model, Cmd.none )

        CellClicked pos ->
            if model.itemPendingApply /= Nothing || model.aiItemPendingApply /= Nothing then
                ( model, Cmd.none )
            else
            let
                _ = Debug.log "[CellClicked] pos" ( pos.row, pos.col )
                _ = Debug.log "[CellClicked] currentSide" model.gameState.currentSide
                _ = Debug.log "[CellClicked] selectedPiece" model.selectedPiece
                _ = Debug.log "[CellClicked] legalMoves count" (List.length model.legalMoves)
            in
            case model.itemMode of
                Just Bomb ->
                    case applyBomb model.gameState Player pos of
                        Ok _ ->
                            ( { model | itemPendingApply = Just (BombAt pos), previewCells = [], errorMessage = Nothing }
                            , Task.perform (\_ -> ApplyPendingItem) (Process.sleep 350)
                            )
                        Err e ->
                            ( { model | errorMessage = Just e }, Cmd.none )

                Just Shield ->
                    case applyShield model.gameState Player pos of
                        Ok _ ->
                            ( { model | itemPendingApply = Just (ShieldAt pos), previewCells = [], errorMessage = Nothing }
                            , Task.perform (\_ -> ApplyPendingItem) (Process.sleep 350)
                            )
                        Err e ->
                            ( { model | errorMessage = Just e }, Cmd.none )

                Just Laser ->
                    ( { model | laserPending = Just pos, previewCells = [], errorMessage = Nothing }, Cmd.none )

                Nothing ->
                    if model.gameState.currentSide == AI then
                        ( model, Cmd.none )
                    else
                        let
                            prot = getProtected model
                            sh = getShielded model
                            content = cellAt model.gameState.board pos
                            inLegalMoves = List.any (positionEquals pos) model.legalMoves
                        in
                        if model.selectedPiece /= Nothing && inLegalMoves then
                            case model.selectedPiece of
                                Just from ->
                                    let
                                        _ = Debug.log "[apply] from" ( from.row, from.col )
                                        _ = Debug.log "[apply] to" ( pos.row, pos.col )
                                        _ = Debug.log "[apply] inLegalMoves" inLegalMoves
                                    in
                                    case applyPlayerMove model.gameState from pos of
                                        Ok newState ->
                                            let
                                                _ = Debug.log "[apply] Ok newState.playerPieces" (List.map (\p -> ( p.row, p.col )) newState.board.playerPieces)
                                                _ = Debug.log "[apply] Ok newState.currentSide" newState.currentSide
                                                m0 = addLog ("[回合 " ++ String.fromInt model.gameState.turn ++ "] 玩家放置 馬 " ++ posStr from ++ "→" ++ posStr pos ++ " → 完成") model
                                                base = { m0 | gameState = newState, selectedPiece = Nothing, legalMoves = [], errorMessage = Nothing }
                                                m1 = castleHpLog model.gameState newState base
                                                m2 = scoreChangeLog model.gameState newState m1
                                                m3 = shieldConsumedLog model.gameState newState m2
                                                attackedEnemyTarget = positionEquals pos aiCastlePos || cellAt model.gameState.board pos == Piece AI || cellAt model.gameState.board pos == Castle AI
                                                noDamage = newState.playerScore == model.gameState.playerScore && newState.aiCastleHp == model.gameState.aiCastleHp
                                                noShieldConsumed = List.length newState.shieldedCells == List.length model.gameState.shieldedCells
                                                modelAfterPlayer = if attackedEnemyTarget && noDamage && noShieldConsumed then addLog "保護中，攻擊無效" m3 else m3
                                            in
                                            ( modelAfterPlayer
                                            , Task.perform (\_ -> RunAITurn) (Process.sleep 300)
                                            )

                                        Err e ->
                                            let
                                                _ = Debug.log "[apply] Err" e
                                                m = addLog ("玩家放置 馬 " ++ posStr from ++ "→" ++ posStr pos ++ " → Err: " ++ e) model
                                            in
                                            ( { m | errorMessage = Just e }, Cmd.none )

                                Nothing ->
                                    ( model, Cmd.none )
                        else
                            case content of
                                Piece Player ->
                                    ( { model
                                        | selectedPiece = Just pos
                                        , legalMoves = horseLegalMoves model.gameState.board pos prot sh
                                        , errorMessage = Nothing
                                      }
                                    , Cmd.none
                                    )

                                Castle Player ->
                                    ( { model
                                        | selectedPiece = Just pos
                                        , legalMoves = horseLegalMoves model.gameState.board pos prot sh
                                        , errorMessage = Nothing
                                      }
                                    , Cmd.none
                                    )

                                _ ->
                                    ( { model | selectedPiece = Nothing, legalMoves = [], errorMessage = Nothing }, Cmd.none )


recordPlayerBomb : GameState -> GameState
recordPlayerBomb s =
    { s | playerBombUse = s.playerBombUse + 1 }


recordPlayerLaser : GameState -> GameState
recordPlayerLaser s =
    { s | playerLaserUse = s.playerLaserUse + 1 }


recordPlayerShield : GameState -> GameState
recordPlayerShield s =
    { s | playerShieldUse = s.playerShieldUse + 1 }


runAITurn : ( Model, Cmd Msg ) -> ( Model, Cmd Msg )
runAITurn ( model, cmd ) =
    let
        _ = Debug.log "[runAITurn] input model.currentSide" model.gameState.currentSide
        _ = Debug.log "[runAITurn] input model.playerPieces" (List.map (\p -> ( p.row, p.col )) model.gameState.board.playerPieces)
    in
    if model.gameState.currentSide /= AI then
        let
            _ = Debug.log "[runAITurn] skip (not AI turn)" ()
        in
        ( model, cmd )
    else
        let
            ( newModel, _ ) = runAIStep model
            _ = Debug.log "[runAITurn] output newModel.playerPieces" (List.map (\p -> ( p.row, p.col )) newModel.gameState.board.playerPieces)
            _ = Debug.log "[runAITurn] output newModel.currentSide" newModel.gameState.currentSide
        in
        ( newModel, cmd )


runAIStep : Model -> ( Model, Cmd Msg )
runAIStep model =
    case checkVictory model.gameState of
        Ongoing ->
            case decide model.gameState of
                PlacePiece from to ->
                    let
                        turnN = model.gameState.turn
                        actionLine = "[回合 " ++ String.fromInt turnN ++ "] AI 放置 炮 " ++ posStr from ++ "→" ++ posStr to
                    in
                    case applyAIMove model.gameState from to of
                        Ok newState ->
                            let
                                m0 = addLog (actionLine ++ " → 完成，回合結束") model
                                m1 = castleHpLog model.gameState newState m0
                                m2 = scoreChangeLog model.gameState newState m1
                                m3 = shieldConsumedLog model.gameState newState m2
                                attackedPlayerTarget = positionEquals to playerCastlePos || cellAt model.gameState.board to == Piece Player || cellAt model.gameState.board to == Castle Player
                                noDamage = newState.playerCastleHp == model.gameState.playerCastleHp && newState.aiScore == model.gameState.aiScore
                                noShieldConsumed = List.length newState.shieldedCells == List.length model.gameState.shieldedCells
                                m4 = if attackedPlayerTarget && noDamage && noShieldConsumed then addLog "保護中，攻擊無效" m3 else m3
                            in
                            ( { m4 | gameState = newState }, Cmd.none )

                        Err e ->
                            ( addLog (actionLine ++ " → Err: " ++ e) model, Cmd.none )

                UseBomb center ->
                    case applyBomb model.gameState AI center of
                        Ok _ ->
                            ( addLog ("[回合 " ++ String.fromInt model.gameState.turn ++ "] AI 使用 炸彈 於 " ++ posStr center ++ "（顯示後套用）") { model | aiItemPendingApply = Just (BombAt center) }
                            , Task.perform (\_ -> ApplyAIPendingItem) (Process.sleep 350)
                            )
                        Err e ->
                            ( addLog ("[回合 " ++ String.fromInt model.gameState.turn ++ "] AI 使用 炸彈 → Err: " ++ e) model, Cmd.none )

                UseLaser isRow index ->
                    let
                        displayPos = if isRow then { row = index, col = 0 } else { row = 0, col = index }
                    in
                    case applyLaser model.gameState AI isRow index of
                        Ok _ ->
                            ( addLog ("[回合 " ++ String.fromInt model.gameState.turn ++ "] AI 使用 雷射（顯示後套用）") { model | aiItemPendingApply = Just (LaserAt isRow index displayPos) }
                            , Task.perform (\_ -> ApplyAIPendingItem) (Process.sleep 350)
                            )
                        Err e ->
                            ( addLog ("[回合 " ++ String.fromInt model.gameState.turn ++ "] AI 使用 雷射 → Err: " ++ e) model, Cmd.none )

                UseShield pos ->
                    case applyShield model.gameState AI pos of
                        Ok _ ->
                            ( addLog ("[回合 " ++ String.fromInt model.gameState.turn ++ "] AI 使用 護盾 於 " ++ posStr pos ++ "（顯示後套用）") { model | aiItemPendingApply = Just (ShieldAt pos) }
                            , Task.perform (\_ -> ApplyAIPendingItem) (Process.sleep 350)
                            )
                        Err e ->
                            ( addLog ("[回合 " ++ String.fromInt model.gameState.turn ++ "] AI 使用 護盾 → Err: " ++ e) model, Cmd.none )

        _ ->
            ( model, Cmd.none )


sideLabel : Side -> String
sideLabel side =
    case side of
        Player ->
            "Player"

        AI ->
            "AI"


{-| 用會隨棋盤變化的 key 包住棋盤，確保 board / selected / legalMoves 變更時畫面會重繪。
   通過測試但畫面沒更新時，多半是虛擬 DOM 未正確 diff，用 key 強制替換節點。
-}
boardKey : Model -> String
boardKey model =
    let
        b = model.gameState.board
    in
    "board-"
        ++ String.fromInt (List.length b.playerPieces)
        ++ "-"
        ++ String.fromInt (List.length b.aiPieces)
        ++ "-"
        ++ String.fromInt model.gameState.turn
        ++ (case model.selectedPiece of
                Nothing -> "-"
                Just p -> "-" ++ String.fromInt p.row ++ "," ++ String.fromInt p.col
           )


protectedWithTurns : Model -> List ( Position, Int )
protectedWithTurns model =
    model.gameState.protectedCells
        |> List.filter (\c -> c.remainingTurns > 0)
        |> List.map (\c -> ( c.position, c.remainingTurns ))


boardWithKey : Model -> Html Msg
boardWithKey model =
    Html.Keyed.node "div"
        []
        [ ( boardKey model
          , BoardView.view model.gameState.board model.selectedPiece model.legalMoves (previewForItem model) (protectedWithTurns model) (getShielded model) (itemPreviewLabel model) (pendingApplyCell model) (model.itemMode /= Nothing) CellClicked
          )
        ]


previewForItem : Model -> List Position
previewForItem model =
    case model.itemMode of
        Just Bomb ->
            model.previewCells

        Just Laser ->
            model.previewCells

        _ ->
            []


itemPreviewLabel : Model -> Maybe String
itemPreviewLabel model =
    case model.itemMode of
        Just Bomb ->
            Just "炸"

        Just Laser ->
            Just "雷"

        Just Shield ->
            Just "盾"

        Nothing ->
            Nothing


pendingApplyCell : Model -> Maybe ( Position, String )
pendingApplyCell model =
    case model.itemPendingApply of
        Just x ->
            pendingCellFrom x
        Nothing ->
            case model.aiItemPendingApply of
                Just x ->
                    pendingCellFrom x
                Nothing ->
                    Nothing


pendingCellFrom : PendingItem -> Maybe ( Position, String )
pendingCellFrom pending =
    case pending of
        BombAt p ->
            Just ( p, "炸" )
        ShieldAt p ->
            Just ( p, "盾" )
        LaserAt _ _ p ->
            Just ( p, "雷" )


itemModeHint : Maybe Item -> Html msg
itemModeHint maybeItem =
    case maybeItem of
        Nothing ->
            Html.text ""

        Just Bomb ->
            div
                [ Html.Attributes.style "margin" "4px 8px"
                , Html.Attributes.style "padding" "6px 10px"
                , Html.Attributes.style "background" "#fff3e0"
                , Html.Attributes.style "border" "1px solid #ff9800"
                , Html.Attributes.style "border-radius" "4px"
                , Html.Attributes.style "color" "#e65100"
                ]
                [ Html.text "【使用中】炸彈 — 點選敵方棋子或主堡作為中心" ]

        Just Laser ->
            div
                [ Html.Attributes.style "margin" "4px 8px"
                , Html.Attributes.style "padding" "6px 10px"
                , Html.Attributes.style "background" "#e3f2fd"
                , Html.Attributes.style "border" "1px solid #2196f3"
                , Html.Attributes.style "border-radius" "4px"
                , Html.Attributes.style "color" "#1565c0"
                ]
                [ Html.text "【使用中】雷射 — 點選一格後選擇「破壞此行」或「破壞此列」" ]

        Just Shield ->
            div
                [ Html.Attributes.style "margin" "4px 8px"
                , Html.Attributes.style "padding" "6px 10px"
                , Html.Attributes.style "background" "#e8f5e9"
                , Html.Attributes.style "border" "1px solid #4caf50"
                , Html.Attributes.style "border-radius" "4px"
                , Html.Attributes.style "color" "#2e7d32"
                ]
                [ Html.text "【使用中】護盾 — 點選己方棋子或主堡加上保護" ]


aiLogPanel : List String -> Html msg
aiLogPanel lines =
    div
        [ Html.Attributes.style "margin" "8px"
        , Html.Attributes.style "padding" "8px"
        , Html.Attributes.style "background" "#1e1e1e"
        , Html.Attributes.style "color" "#d4d4d4"
        , Html.Attributes.style "font-family" "Consolas, monospace"
        , Html.Attributes.style "font-size" "12px"
        , Html.Attributes.style "max-height" "180px"
        , Html.Attributes.style "overflow-y" "auto"
        , Html.Attributes.style "border" "1px solid #444"
        , Html.Attributes.style "white-space" "pre-wrap"
        , Html.Attributes.style "word-break" "break-all"
        ]
        [ div [ Html.Attributes.style "margin-bottom" "4px" ] [ text "AI 動作日誌（可複製貼上）：" ]
        , if List.isEmpty lines then
            text "（尚無紀錄）"
          else
            div [] (List.map (\s -> div [] [ text s ]) lines)
        ]


view : Model -> Html Msg
view model =
    let
        result = checkVictory model.gameState
        _ = Debug.log "[view] board.playerPieces" (List.map (\p -> ( p.row, p.col )) model.gameState.board.playerPieces)
    in
    div []
        [ if List.isEmpty model.testErrors then
            text ""

          else
            div
                [ Html.Attributes.style "padding" "12px"
                , Html.Attributes.style "margin" "8px"
                , Html.Attributes.style "background" "#ffebee"
                , Html.Attributes.style "color" "#c62828"
                , Html.Attributes.style "border" "1px solid #c62828"
                ]
                ([ text "測試有誤：" ] ++ List.map (\e -> div [] [ text e ]) model.testErrors)
        , ToolbarView.view
            model.gameState.playerScore
            model.gameState.aiScore
            model.gameState.playerCastleHp
            model.gameState.aiCastleHp
            model.gameState.turn
            (model.gameState.currentSide == Player)
            model.itemMode
            UseItem
            CancelItem
        , itemModeHint model.itemMode
        , aiLogPanel model.aiActionLog
        , case model.errorMessage of
            Just e ->
                div [] [ text e ]

            Nothing ->
                text ""
        , case model.laserPending of
            Just _ ->
                div []
                    [ boardWithKey model
                    , div [] [ text "選擇: " ]
                    , button [ onClick LaserRow ] [ text "破壞此列" ]
                    , button [ onClick LaserCol ] [ text "破壞此行" ]
                    ]

            Nothing ->
                boardWithKey model
        , case result of
            Ongoing ->
                text ""

            _ ->
                ResultView.view result
                    (if model.gameState.turn > Game.maxTurns then "回合上限" else "主堡被佔領")
                    model.gameState.playerScore
                    model.gameState.aiScore
                    model.gameState.playerCastleHp
                    model.gameState.aiCastleHp
                    model.gameState.turn
                    model.gameState.playerCaptures
                    model.gameState.aiCaptures
                    model.gameState.playerBombUse
                    model.gameState.playerLaserUse
                    model.gameState.playerShieldUse
                    model.gameState.aiBombUse
                    model.gameState.aiLaserUse
                    model.gameState.aiShieldUse
                    Restart
                    MainMenu
        ]


main : Program () Model Msg
main =
    Browser.element
        { init = \_ -> ( initialModel, Task.perform (\_ -> RunTests) (Task.succeed ()) )
        , view = view
        , update = update
        , subscriptions = \_ -> Sub.none
        }
