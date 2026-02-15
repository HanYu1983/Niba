module Board exposing
    ( BoardState
    , CellContent(..)
    , Position
    , Side(..)
    , aiCastlePos
    , boardSize
    , cellAt
    , inBounds
    , initialBoardState
    , playerCastlePos
    , positionEquals
    )


boardSize : Int
boardSize =
    10


type alias Position =
    { row : Int, col : Int }


positionEquals : Position -> Position -> Bool
positionEquals a b =
    a.row == b.row && a.col == b.col


type Side
    = Player
    | AI


type CellContent
    = Empty
    | Piece Side
    | Castle Side


playerCastlePos : Position
playerCastlePos =
    { row = 0, col = 0 }


aiCastlePos : Position
aiCastlePos =
    { row = 9, col = 9 }


type alias BoardState =
    { playerPieces : List Position
    , aiPieces : List Position
    , playerCastlePos : Position
    , aiCastlePos : Position
    }


inBounds : Position -> Bool
inBounds pos =
    pos.row >= 0 && pos.row < boardSize && pos.col >= 0 && pos.col < boardSize


cellAt : BoardState -> Position -> CellContent
cellAt state pos =
    if not (inBounds pos) then
        Empty

    else if List.any (positionEquals pos) state.playerPieces then
        Piece Player

    else if List.any (positionEquals pos) state.aiPieces then
        Piece AI

    else if positionEquals pos state.playerCastlePos then
        Castle Player

    else if positionEquals pos state.aiCastlePos then
        Castle AI

    else
        Empty


initialBoardState : BoardState
initialBoardState =
    { playerPieces = [ playerCastlePos ]
    , aiPieces = [ aiCastlePos ]
    , playerCastlePos = playerCastlePos
    , aiCastlePos = aiCastlePos
    }
