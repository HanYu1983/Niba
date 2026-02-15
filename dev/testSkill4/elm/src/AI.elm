module AI exposing (AIDecision(..), decide)

import Board exposing (BoardState, CellContent(..), Position, Side(..), aiCastlePos, boardSize, cellAt, playerCastlePos, positionEquals)
import Game exposing (GameState, protectedPositions, shieldedPositions)
import Items exposing (applyBomb, applyLaser, applyShield, bombAffectedCells, canUseBomb, canUseLaser, canUseShield, laserLine)
import Rules exposing (cannonLegalMoves, horseLegalMoves)


type AIDecision
    = PlacePiece Position Position
    | UseBomb Position
    | UseLaser Bool Int
    | UseShield Position


manhattan : Position -> Position -> Int
manhattan a b =
    abs (a.row - b.row) + abs (a.col - b.col)


allCannonMoves : GameState -> List ( Position, Position )
allCannonMoves state =
    let
        prot = protectedPositions state
        sh = shieldedPositions state
    in
    state.board.aiPieces
        |> List.concatMap
            (\from ->
                cannonLegalMoves state.board from prot sh
                    |> List.map (\to -> ( from, to ))
            )


captureMoves : GameState -> List ( Position, Position )
captureMoves state =
    allCannonMoves state
        |> List.filter
            (\( _, to ) ->
                case cellAt state.board to of
                    Piece Player -> True
                    Castle Player -> True
                    _ -> False
            )


closerToPlayerCastle : ( Position, Position ) -> ( Position, Position ) -> Order
closerToPlayerCastle ( _, to1 ) ( _, to2 ) =
    let
        d1 = manhattan to1 playerCastlePos
        d2 = manhattan to2 playerCastlePos
    in
    compare d1 d2


bestCapture : GameState -> Maybe ( Position, Position )
bestCapture state =
    captureMoves state
        |> List.sortWith closerToPlayerCastle
        |> List.head


bombScore : GameState -> Position -> Maybe Int
bombScore state center =
    if not (canUseBomb state AI center) then
        Nothing

    else
        let
            affected = bombAffectedCells center
            containsCastle p = positionEquals p playerCastlePos || positionEquals p aiCastlePos
        in
        if List.any containsCastle affected then
            Nothing

        else
            let
                playerKilled = List.filter (\p -> List.any (positionEquals p) state.board.playerPieces) affected
                    |> List.length
                aiKilled = List.filter (\p -> List.any (positionEquals p) state.board.aiPieces) affected
                    |> List.length
                nearAiCastle p = manhattan p aiCastlePos <= 2
                defenseBonus = if List.any (\p -> List.any (positionEquals p) state.board.playerPieces && nearAiCastle p) affected then 3 else 0
            in
            Just (playerKilled * 2 - aiKilled * 3 + defenseBonus)


bestBomb : GameState -> Maybe ( Position, Int )
bestBomb state =
    let
        allPositions = List.range 0 (boardSize - 1)
            |> List.concatMap (\r -> List.range 0 (boardSize - 1) |> List.map (\c -> { row = r, col = c }))
        scored = List.filterMap (\p -> Maybe.map (\s -> ( p, s )) (bombScore state p)) allPositions
    in
    scored |> List.sortBy (\( _, s ) -> negate s) |> List.head


laserScore : GameState -> Bool -> Int -> Maybe Int
laserScore state isRow index =
    let
        line = laserLine isRow index
        containsCastle p = positionEquals p playerCastlePos || positionEquals p aiCastlePos
    in
    if List.any containsCastle line then
        Nothing

    else if not (canUseLaser state AI isRow index) then
        Nothing

    else
        let
            playerKilled = List.filter (\p -> List.any (positionEquals p) state.board.playerPieces) line
                |> List.length
            aiKilled = List.filter (\p -> List.any (positionEquals p) state.board.aiPieces) line
                |> List.length
            clearsPathToPlayerCastle =
                let
                    row9 = line |> List.any (\p -> p.row == 9)
                    col9 = line |> List.any (\p -> p.col == 9)
                in
                if isRow then
                    index == 0
                else
                    index == 0
            offenseBonus = if clearsPathToPlayerCastle then 2 else 0
        in
        Just (playerKilled * 2 - aiKilled * 3 + offenseBonus)


bestLaser : GameState -> Maybe ( Bool, Int, Int )
bestLaser state =
    let
        rows = List.range 0 (boardSize - 1) |> List.map (\i -> ( True, i ))
        cols = List.range 0 (boardSize - 1) |> List.map (\i -> ( False, i ))
        options = rows ++ cols
        scored = List.filterMap (\( isRow, i ) -> Maybe.map (\s -> ( isRow, i, s )) (laserScore state isRow i)) options
    in
    scored |> List.sortBy (\( _, _, s ) -> negate s) |> List.head
        |> Maybe.map (\( isRow, i, s ) -> ( isRow, i, s ))


shieldImportance : Position -> Int
shieldImportance pos =
    if positionEquals pos aiCastlePos then
        5
    else if manhattan pos aiCastlePos == 1 then
        3
    else
        1


playerCanEatNext : GameState -> Position -> Bool
playerCanEatNext state pos =
    let
        prot = protectedPositions state
        sh = shieldedPositions state
    in
    state.board.playerPieces
        |> List.any (\from -> List.any (positionEquals pos) (horseLegalMoves state.board from prot sh))


shieldScore : GameState -> Position -> Maybe Int
shieldScore state pos =
    if not (canUseShield state AI pos) then
        Nothing

    else
        let
            imp = shieldImportance pos
            risk = if playerCanEatNext state pos then 3 else 0
        in
        Just (imp + risk)


bestShield : GameState -> Maybe ( Position, Int )
bestShield state =
    state.board.aiPieces
        |> List.filterMap (\p -> Maybe.map (\s -> ( p, s )) (shieldScore state p))
        |> List.sortBy (\( _, s ) -> negate s)
        |> List.head


itemThreshold : Int
itemThreshold =
    2


decide : GameState -> AIDecision
decide state =
    case bestCapture state of
        Just ( from, to ) ->
            PlacePiece from to

        Nothing ->
            let
                bomb = bestBomb state
                laser = bestLaser state
                shield = bestShield state
                bestItemScore = List.filterMap identity
                    [ Maybe.map (\( _, s ) -> s) bomb
                    , Maybe.map (\( _, _, s ) -> s) laser
                    , Maybe.map (\( _, s ) -> s) shield
                    ]
                    |> List.maximum
            in
            case bestItemScore of
                Just s ->
                    if s >= itemThreshold then
                        case ( bomb, laser, shield ) of
                            ( Just ( pos, sb ), _, _ ) ->
                                if sb >= itemThreshold then UseBomb pos else tryLaserOrShield laser shield

                            ( Nothing, Just ( isRow, i, sl ), _ ) ->
                                if sl >= itemThreshold then UseLaser isRow i else tryShield shield

                            ( Nothing, Nothing, Just ( pos, ss ) ) ->
                                if ss >= itemThreshold then UseShield pos else defensiveOrOffensivePlace state

                            _ ->
                                defensiveOrOffensivePlace state
                    else
                        defensiveOrOffensivePlace state

                Nothing ->
                    defensiveOrOffensivePlace state


tryLaserOrShield : Maybe ( Bool, Int, Int ) -> Maybe ( Position, Int ) -> AIDecision
tryLaserOrShield laser shield =
    case ( laser, shield ) of
        ( Just ( isRow, i, s ), _ ) ->
            if s >= itemThreshold then UseLaser isRow i else tryShield shield

        ( Nothing, Just ( pos, ss ) ) ->
            if ss >= itemThreshold then UseShield pos else PlacePiece { row = 9, col = 9 } { row = 9, col = 9 }

        _ ->
            PlacePiece { row = 9, col = 9 } { row = 9, col = 9 }


tryShield : Maybe ( Position, Int ) -> AIDecision
tryShield shield =
    case shield of
        Just ( pos, s ) ->
            if s >= itemThreshold then UseShield pos else PlacePiece { row = 9, col = 9 } { row = 9, col = 9 }

        Nothing ->
            PlacePiece { row = 9, col = 9 } { row = 9, col = 9 }


defensiveOrOffensivePlace : GameState -> AIDecision
defensiveOrOffensivePlace state =
    let
        moves = allCannonMoves state
    in
    case List.head (List.sortBy (manhattan playerCastlePos << Tuple.second) moves) of
        Just ( from, to ) ->
            PlacePiece from to

        Nothing ->
            PlacePiece aiCastlePos aiCastlePos
