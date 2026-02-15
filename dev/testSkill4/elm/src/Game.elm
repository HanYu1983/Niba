module Game exposing
    ( GameState
    , GameResult(..)
    , ProtectedCell
    , applyPlayerMove
    , checkVictory
    , init
    , maxTurns
    , protectedPositions
    , shieldedPositions
    , decrementProtection
    , applyAIMove
    )

import Board exposing (BoardState, Position, Side(..), aiCastlePos, cellAt, initialBoardState, playerCastlePos, positionEquals)
import Rules exposing (cannonLegalMoves, horseLegalMoves)


castleHpDefault : Int
castleHpDefault =
    20


initialScore : Int
initialScore =
    10


maxTurns : Int
maxTurns =
    100


type alias ProtectedCell =
    { position : Position
    , remainingTurns : Int
    }


type alias GameState =
    { board : BoardState
    , playerScore : Int
    , aiScore : Int
    , playerCastleHp : Int
    , aiCastleHp : Int
    , turn : Int
    , currentSide : Side
    , protectedCells : List ProtectedCell
    , shieldedCells : List Position
    , playerCaptures : Int
    , aiCaptures : Int
    , playerBombUse : Int
    , playerLaserUse : Int
    , playerShieldUse : Int
    , aiBombUse : Int
    , aiLaserUse : Int
    , aiShieldUse : Int
    }


type GameResult
    = Ongoing
    | PlayerWins
    | AIWins
    | Draw


init : GameState
init =
    { board = initialBoardState
    , playerScore = initialScore
    , aiScore = initialScore
    , playerCastleHp = castleHpDefault
    , aiCastleHp = castleHpDefault
    , turn = 1
    , currentSide = Player
    , protectedCells = []
    , shieldedCells = []
    , playerCaptures = 0
    , aiCaptures = 0
    , playerBombUse = 0
    , playerLaserUse = 0
    , playerShieldUse = 0
    , aiBombUse = 0
    , aiLaserUse = 0
    , aiShieldUse = 0
    }


protectedPositions : GameState -> List Position
protectedPositions state =
    state.protectedCells
        |> List.filter (\c -> c.remainingTurns > 0)
        |> List.map .position


shieldedPositions : GameState -> List Position
shieldedPositions state =
    state.shieldedCells


checkVictory : GameState -> GameResult
checkVictory state =
    if state.aiCastleHp <= 0 then
        PlayerWins

    else if state.playerCastleHp <= 0 then
        AIWins

    else if state.turn > maxTurns then
        if state.playerScore > state.aiScore then
            PlayerWins
        else if state.aiScore > state.playerScore then
            AIWins
        else
            Draw

    else
        Ongoing


applyPlayerMove : GameState -> Position -> Position -> Result String GameState
applyPlayerMove state from to =
    let
        prot = protectedPositions state
        sh = shieldedPositions state
        legal = horseLegalMoves state.board from prot sh
    in
    if not (List.any (positionEquals to) legal) then
        Err "非法落點"

    else
        case cellAt state.board to of
            Board.Empty ->
                Ok (placePlayerPiece state to [])

            Board.Piece AI ->
                Ok (captureByPlayer state to)

            Board.Castle AI ->
                Ok (attackCastleByPlayer state to)

            _ ->
                Err "非法落點"


placePlayerPiece : GameState -> Position -> List ProtectedCell -> GameState
placePlayerPiece state to newProtection =
    let
        b = state.board
        newBoard =
            { b | playerPieces = b.playerPieces ++ [ to ] }
    in
    { state
        | board = newBoard
        , protectedCells = state.protectedCells ++ newProtection
        , currentSide = AI
    }


captureByPlayer : GameState -> Position -> GameState
captureByPlayer state to =
    let
        b = state.board
        newAiPieces = List.filter (positionEquals to >> not) b.aiPieces
        newBoard =
            { b | aiPieces = newAiPieces, playerPieces = b.playerPieces ++ [ to ] }
        newProtected = state.protectedCells ++ [ { position = to, remainingTurns = 1 } ]
    in
    { state
        | board = newBoard
        , playerScore = state.playerScore + 1
        , playerCaptures = state.playerCaptures + 1
        , protectedCells = newProtected
        , currentSide = AI
    }


attackCastleByPlayer : GameState -> Position -> GameState
attackCastleByPlayer state to =
    let
        b = state.board
        newBoard =
            { b | playerPieces = b.playerPieces ++ [ to ] }
    in
    { state
        | board = newBoard
        , aiCastleHp = state.aiCastleHp - 3
        , playerScore = state.playerScore + 1
        , currentSide = AI
    }


applyAIMove : GameState -> Position -> Position -> Result String GameState
applyAIMove state from to =
    let
        prot = protectedPositions state
        sh = shieldedPositions state
        legal = cannonLegalMoves state.board from prot sh
    in
    if not (List.any (positionEquals to) legal) then
        Err "非法落點"

    else
        case cellAt state.board to of
            Board.Empty ->
                Ok (placeAIPiece state to)

            Board.Piece Board.Player ->
                Ok (captureByAI state to)

            Board.Castle Board.Player ->
                Ok (attackCastleByAI state to)

            _ ->
                Err "非法落點"


placeAIPiece : GameState -> Position -> GameState
placeAIPiece state to =
    let
        b = state.board
        newBoard = { b | aiPieces = b.aiPieces ++ [ to ] }
    in
    { state
        | board = newBoard
        , currentSide = Player
        , turn = state.turn + 1
        , protectedCells = decrementProtectionList state.protectedCells
    }


captureByAI : GameState -> Position -> GameState
captureByAI state to =
    let
        b = state.board
        newPlayerPieces = List.filter (positionEquals to >> not) b.playerPieces
        newBoard =
            { b | playerPieces = newPlayerPieces, aiPieces = b.aiPieces ++ [ to ] }
        newProtected = decrementProtectionList state.protectedCells ++ [ { position = to, remainingTurns = 1 } ]
    in
    { state
        | board = newBoard
        , aiScore = state.aiScore + 1
        , aiCaptures = state.aiCaptures + 1
        , protectedCells = newProtected
        , currentSide = Player
        , turn = state.turn + 1
    }


attackCastleByAI : GameState -> Position -> GameState
attackCastleByAI state to =
    let
        b = state.board
        newBoard = { b | aiPieces = b.aiPieces ++ [ to ] }
        afterMove =
            { state
                | board = newBoard
                , playerCastleHp = state.playerCastleHp - 3
                , aiScore = state.aiScore + 1
                , currentSide = Player
                , turn = state.turn + 1
                , protectedCells = decrementProtectionList state.protectedCells
            }
    in
    afterMove


decrementProtectionList : List ProtectedCell -> List ProtectedCell
decrementProtectionList list =
    list
        |> List.map (\c -> { c | remainingTurns = c.remainingTurns - 1 })
        |> List.filter (\c -> c.remainingTurns > 0)


decrementProtection : GameState -> GameState
decrementProtection state =
    { state | protectedCells = decrementProtectionList state.protectedCells }
