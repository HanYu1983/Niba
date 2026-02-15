module Main exposing (main)

import Browser
import Debug
import AI exposing (AIDecision(..), decide)
import Board exposing (CellContent(..), Position, Side(..), cellAt, positionEquals)
import Game exposing (GameResult(..), GameState, applyAIMove, applyPlayerMove, checkVictory, decrementProtection, init)
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
    }


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
            if model.gameState.currentSide == AI then
                let
                    m1 = addLog "[RunAITurn] currentSide=AI → 開始執行" model
                    ( newModel, cmd ) = runAIStep m1
                in
                ( newModel, cmd )
            else
                ( addLog ("[RunAITurn] 收到時 currentSide=" ++ sideLabel model.gameState.currentSide ++ " → 跳過不執行") model, Cmd.none )

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
                        Ok s ->
                            ( { model | gameState = recordPlayerLaser s, itemMode = Nothing, laserPending = Nothing, previewCells = [], errorMessage = Nothing }, Cmd.none )

                        Err e ->
                            ( { model | errorMessage = Just e }, Cmd.none )

                Nothing ->
                    ( model, Cmd.none )

        LaserCol ->
            case model.laserPending of
                Just pos ->
                    case applyLaser model.gameState Player False pos.col of
                        Ok s ->
                            ( { model | gameState = recordPlayerLaser s, itemMode = Nothing, laserPending = Nothing, previewCells = [], errorMessage = Nothing }, Cmd.none )

                        Err e ->
                            ( { model | errorMessage = Just e }, Cmd.none )

                Nothing ->
                    ( model, Cmd.none )

        CellClicked pos ->
            let
                _ = Debug.log "[CellClicked] pos" ( pos.row, pos.col )
                _ = Debug.log "[CellClicked] currentSide" model.gameState.currentSide
                _ = Debug.log "[CellClicked] selectedPiece" model.selectedPiece
                _ = Debug.log "[CellClicked] legalMoves count" (List.length model.legalMoves)
            in
            case model.itemMode of
                Just Bomb ->
                    case applyBomb model.gameState Player pos of
                        Ok s ->
                            ( { model | gameState = recordPlayerBomb s, itemMode = Nothing, previewCells = [], errorMessage = Nothing }, Cmd.none )

                        Err e ->
                            ( { model | errorMessage = Just e }, Cmd.none )

                Just Shield ->
                    case applyShield model.gameState Player pos of
                        Ok s ->
                            ( { model | gameState = recordPlayerShield s, itemMode = Nothing, previewCells = [], errorMessage = Nothing }, Cmd.none )

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
                                                modelAfterPlayer =
                                                    { model
                                                        | gameState = newState
                                                        , selectedPiece = Nothing
                                                        , legalMoves = []
                                                        , errorMessage = Nothing
                                                    }
                                            in
                                            ( modelAfterPlayer
                                            , Task.perform (\_ -> RunAITurn) (Process.sleep 300)
                                            )

                                        Err e ->
                                            let
                                                _ = Debug.log "[apply] Err" e
                                            in
                                            ( { model | errorMessage = Just e }, Cmd.none )

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
                                m = addLog (actionLine ++ " → Ok | currentSide=" ++ sideLabel newState.currentSide) model
                            in
                            ( { m | gameState = newState }, Cmd.none )

                        Err e ->
                            ( addLog (actionLine ++ " → Err: " ++ e) model, Cmd.none )

                UseBomb center ->
                    let
                        turnN = model.gameState.turn
                        actionLine = "[回合 " ++ String.fromInt turnN ++ "] AI 使用 炸彈 於 " ++ posStr center
                    in
                    case applyBomb model.gameState AI center of
                        Ok s ->
                            let
                                next = decrementProtection { s | currentSide = Player, turn = s.turn + 1, aiBombUse = s.aiBombUse + 1 }
                                m = addLog (actionLine ++ " → Ok | currentSide=" ++ sideLabel next.currentSide ++ " turn=" ++ String.fromInt next.turn) model
                            in
                            ( { m | gameState = next }, Cmd.none )

                        Err e ->
                            ( addLog (actionLine ++ " → Err: " ++ e) model, Cmd.none )

                UseLaser isRow index ->
                    let
                        turnN = model.gameState.turn
                        axis = if isRow then "行" else "列"
                        actionLine = "[回合 " ++ String.fromInt turnN ++ "] AI 使用 雷射 " ++ axis ++ " " ++ String.fromInt index
                    in
                    case applyLaser model.gameState AI isRow index of
                        Ok s ->
                            let
                                next = decrementProtection { s | currentSide = Player, turn = s.turn + 1, aiLaserUse = s.aiLaserUse + 1 }
                                m = addLog (actionLine ++ " → Ok | currentSide=" ++ sideLabel next.currentSide ++ " turn=" ++ String.fromInt next.turn) model
                            in
                            ( { m | gameState = next }, Cmd.none )

                        Err e ->
                            ( addLog (actionLine ++ " → Err: " ++ e) model, Cmd.none )

                UseShield pos ->
                    let
                        turnN = model.gameState.turn
                        actionLine = "[回合 " ++ String.fromInt turnN ++ "] AI 使用 護盾 於 " ++ posStr pos
                    in
                    case applyShield model.gameState AI pos of
                        Ok s ->
                            let
                                next = decrementProtection { s | currentSide = Player, turn = s.turn + 1, aiShieldUse = s.aiShieldUse + 1 }
                                m = addLog (actionLine ++ " → Ok | currentSide=" ++ sideLabel next.currentSide ++ " turn=" ++ String.fromInt next.turn) model
                            in
                            ( { m | gameState = next }, Cmd.none )

                        Err e ->
                            ( addLog (actionLine ++ " → Err: " ++ e) model, Cmd.none )

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


boardWithKey : Model -> Html Msg
boardWithKey model =
    Html.Keyed.node "div"
        []
        [ ( boardKey model
          , BoardView.view model.gameState.board model.selectedPiece model.legalMoves (previewForItem model) CellClicked
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
            model.gameState.turn
            (model.gameState.currentSide == Player)
            model.itemMode
            UseItem
            CancelItem
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
                    , button [ onClick LaserRow ] [ text "破壞此行" ]
                    , button [ onClick LaserCol ] [ text "破壞此列" ]
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
