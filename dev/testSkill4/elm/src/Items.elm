module Items exposing
    ( Item(..)
    , applyBomb
    , applyLaser
    , applyShield
    , bombAffectedCells
    , canUseBomb
    , canUseLaser
    , canUseShield
    , cost
    , laserLine
    )

import Board exposing (BoardState, CellContent(..), Position, Side(..), aiCastlePos, boardSize, cellAt, inBounds, playerCastlePos, positionEquals)
import Game exposing (GameState, protectedPositions, shieldedPositions)


type Item
    = Bomb
    | Laser
    | Shield


type alias BombResult =
    { board : BoardState
    , playerHp : Int
    , aiHp : Int
    , shielded : List Position
    }


cost : Item -> Int
cost item =
    case item of
        Bomb ->
            3

        Laser ->
            4

        Shield ->
            2


bombAffectedCells : Position -> List Position
bombAffectedCells center =
    [ center
    , { row = center.row - 1, col = center.col }
    , { row = center.row + 1, col = center.col }
    , { row = center.row, col = center.col - 1 }
    , { row = center.row, col = center.col + 1 }
    ]
        |> List.filter inBounds


canUseBomb : GameState -> Side -> Position -> Bool
canUseBomb state side center =
    let
        scoreOk =
            case side of
                Player ->
                    state.playerScore >= cost Bomb

                AI ->
                    state.aiScore >= cost Bomb

        cell = cellAt state.board center
        isEnemyPieceOrCastle =
            case side of
                Player ->
                    cell == Piece AI || cell == Castle AI

                AI ->
                    cell == Piece Player || cell == Castle Player
    in
    scoreOk && isEnemyPieceOrCastle


applyBomb : GameState -> Side -> Position -> Result String GameState
applyBomb state side center =
    if not (canUseBomb state side center) then
        Err "炸彈目標不合法"

    else
        let
            affected = bombAffectedCells center
            res = applyBombToCells state center affected
            ( newPlayerScore, newAiScore ) =
                case side of
                    Player -> ( state.playerScore - cost Bomb, state.aiScore )
                    AI -> ( state.playerScore, state.aiScore - cost Bomb )
        in
        Ok
            { state
                | board = res.board
                , playerCastleHp = res.playerHp
                , aiCastleHp = res.aiHp
                , playerScore = newPlayerScore
                , aiScore = newAiScore
                , shieldedCells = res.shielded
            }


applyBombToCells : GameState -> Position -> List Position -> BombResult
applyBombToCells state center cells =
    let
        prot = protectedPositions state
        sh = shieldedPositions state
        isProtected p = List.any (positionEquals p) prot
        hasShield p = List.any (positionEquals p) sh
        step pos acc =
            if isProtected pos then
                acc
            else if hasShield pos then
                { acc | shielded = List.filter (positionEquals pos >> not) acc.shielded }
            else if positionEquals pos playerCastlePos then
                { acc | playerHp = acc.playerHp - 3 }
            else if positionEquals pos aiCastlePos then
                { acc | aiHp = acc.aiHp - 3 }
            else
                let
                    b = acc.board
                    nb = { b | playerPieces = List.filter (positionEquals pos >> not) b.playerPieces, aiPieces = List.filter (positionEquals pos >> not) b.aiPieces }
                in
                { acc | board = nb }
    in
    List.foldl step
        { board = state.board
        , playerHp = state.playerCastleHp
        , aiHp = state.aiCastleHp
        , shielded = state.shieldedCells
        }
        cells


laserLine : Bool -> Int -> List Position
laserLine isRow index =
    if isRow then
        List.range 0 (boardSize - 1) |> List.map (\c -> { row = index, col = c })
    else
        List.range 0 (boardSize - 1) |> List.map (\r -> { row = r, col = index })


canUseLaser : GameState -> Side -> Bool -> Int -> Bool
canUseLaser state side isRow index =
    let
        scoreOk =
            case side of
                Player -> state.playerScore >= cost Laser
                AI -> state.aiScore >= cost Laser
    in
    scoreOk


applyLaser : GameState -> Side -> Bool -> Int -> Result String GameState
applyLaser state side isRow index =
    let
        line = laserLine isRow index
    in
    case side of
        Player ->
            if state.playerScore < cost Laser then
                Err "分數不足"
            else
                Ok (applyLaserToLine state line (state.playerScore - cost Laser) state.aiScore)

        AI ->
            if state.aiScore < cost Laser then
                Err "分數不足"
            else
                Ok (applyLaserToLine state line state.playerScore (state.aiScore - cost Laser))


applyLaserToLine : GameState -> List Position -> Int -> Int -> GameState
applyLaserToLine state line newPlayerScore newAiScore =
    let
        prot = protectedPositions state
        sh = shieldedPositions state
        isProtected p = List.any (positionEquals p) prot
        hasShield p = List.any (positionEquals p) sh
        step pos acc =
            if isProtected pos then
                acc
            else if hasShield pos then
                { acc | shielded = List.filter (positionEquals pos >> not) acc.shielded }
            else if positionEquals pos playerCastlePos then
                { acc | playerHp = acc.playerHp - 3 }
            else if positionEquals pos aiCastlePos then
                { acc | aiHp = acc.aiHp - 3 }
            else
                let
                    b = acc.board
                    nb = { b | playerPieces = List.filter (positionEquals pos >> not) b.playerPieces, aiPieces = List.filter (positionEquals pos >> not) b.aiPieces }
                in
                { acc | board = nb }
        initial =
            { board = state.board
            , playerHp = state.playerCastleHp
            , aiHp = state.aiCastleHp
            , shielded = state.shieldedCells
            }
        res = List.foldl step initial line
    in
    { state
        | board = res.board
        , playerCastleHp = res.playerHp
        , aiCastleHp = res.aiHp
        , playerScore = newPlayerScore
        , aiScore = newAiScore
        , shieldedCells = res.shielded
    }


canUseShield : GameState -> Side -> Position -> Bool
canUseShield state side pos =
    let
        scoreOk =
            case side of
                Player -> state.playerScore >= cost Shield
                AI -> state.aiScore >= cost Shield
        cell = cellAt state.board pos
        isOwnPieceOrCastle =
            case side of
                Player -> cell == Piece Player || cell == Castle Player
                AI -> cell == Piece AI || cell == Castle AI
        alreadyShielded = List.any (positionEquals pos) state.shieldedCells
    in
    scoreOk && isOwnPieceOrCastle && not alreadyShielded


applyShield : GameState -> Side -> Position -> Result String GameState
applyShield state side pos =
    if not (canUseShield state side pos) then
        Err "護盾目標不合法"

    else
        let
            newShielded = state.shieldedCells ++ [ pos ]
            ( newPlayerScore, newAiScore ) =
                case side of
                    Player -> ( state.playerScore - cost Shield, state.aiScore )
                    AI -> ( state.playerScore, state.aiScore - cost Shield )
        in
        Ok
            { state
                | shieldedCells = newShielded
                , playerScore = newPlayerScore
                , aiScore = newAiScore
            }
