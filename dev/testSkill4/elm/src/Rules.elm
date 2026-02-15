module Rules exposing
    ( cannonLegalMoves
    , horseLegalMoves
    , isPositionProtectedOrShielded
    )

import Board exposing (BoardState, CellContent(..), Position, Side(..), boardSize, cellAt, inBounds, positionEquals)


maxCannonDistance : Int
maxCannonDistance =
    10


horseOffsets : List ( ( Int, Int ), ( Int, Int ) )
horseOffsets =
    [ ( ( -2, -1 ), ( -1, 0 ) )
    , ( ( -2, 1 ), ( -1, 0 ) )
    , ( ( -1, -2 ), ( 0, -1 ) )
    , ( ( -1, 2 ), ( 0, 1 ) )
    , ( ( 1, -2 ), ( 0, -1 ) )
    , ( ( 1, 2 ), ( 0, 1 ) )
    , ( ( 2, -1 ), ( 1, 0 ) )
    , ( ( 2, 1 ), ( 1, 0 ) )
    ]


isPositionProtectedOrShielded : Position -> List Position -> List Position -> Bool
isPositionProtectedOrShielded pos protected shielded =
    List.any (positionEquals pos) protected || List.any (positionEquals pos) shielded


horseLegalMoves :
    BoardState
    -> Position
    -> List Position
    -> List Position
    -> List Position
horseLegalMoves state from protectedPositions shieldedPositions =
    horseOffsets
        |> List.filterMap
            (\( ( dr, dc ), ( footR, footC ) ) ->
                let
                    foot =
                        { row = from.row + footR, col = from.col + footC }

                    to =
                        { row = from.row + dr, col = from.col + dc }
                in
                if not (inBounds to) then
                    Nothing

                else if not (inBounds foot) then
                    Nothing

                else
                    case cellAt state foot of
                        Empty ->
                            case cellAt state to of
                                Piece Player ->
                                    Nothing

                                Castle Player ->
                                    Nothing

                                Piece AI ->
                                    if isPositionProtectedOrShielded to protectedPositions shieldedPositions then
                                        Nothing
                                    else
                                        Just to

                                Castle AI ->
                                    if isPositionProtectedOrShielded to protectedPositions shieldedPositions then
                                        Nothing
                                    else
                                        Just to

                                Empty ->
                                    Just to

                        _ ->
                            Nothing
            )
        |> List.filter (\to -> not (positionEquals to from))


cannonDirections : List ( Int, Int )
cannonDirections =
    [ ( -1, 0 ), ( 1, 0 ), ( 0, -1 ), ( 0, 1 ) ]


cannonLegalMoves :
    BoardState
    -> Position
    -> List Position
    -> List Position
    -> List Position
cannonLegalMoves state from protectedPositions shieldedPositions =
    cannonDirections
        |> List.concatMap
            (\( dr, dc ) ->
                let
                    emptyInDirection =
                        scanLine state from dr dc 0 0

                    captureInDirection =
                        scanCannonCapture state from dr dc protectedPositions shieldedPositions
                in
                emptyInDirection ++ captureInDirection
            )
        |> List.filter (\to -> not (positionEquals to from))


scanLine : BoardState -> Position -> Int -> Int -> Int -> Int -> List Position
scanLine state from dr dc dist count =
    if dist >= maxCannonDistance then
        []

    else
        let
            d =
                dist + 1

            to =
                { row = from.row + dr * d, col = from.col + dc * d }
        in
        if not (inBounds to) then
            []

        else
            case cellAt state to of
                Empty ->
                    to :: scanLine state from dr dc d (count + 1)

                _ ->
                    []


scanCannonCapture :
    BoardState
    -> Position
    -> Int
    -> Int
    -> List Position
    -> List Position
    -> List Position
scanCannonCapture state from dr dc protectedPositions shieldedPositions =
    findFirstPieceInDirection state from dr dc 1
        |> Maybe.andThen
            (\( screenDist, _ ) ->
                let
                    toDist =
                        screenDist + 1

                    to =
                        { row = from.row + dr * toDist, col = from.col + dc * toDist }
                in
                if toDist > maxCannonDistance || not (inBounds to) then
                    Nothing

                else
                    case cellAt state to of
                        Piece Player ->
                            if isPositionProtectedOrShielded to protectedPositions shieldedPositions then
                                Nothing
                            else
                                Just to

                        Castle Player ->
                            if isPositionProtectedOrShielded to protectedPositions shieldedPositions then
                                Nothing
                            else
                                Just to

                        _ ->
                            Nothing
            )
        |> Maybe.map List.singleton
        |> Maybe.withDefault []


findFirstPieceInDirection : BoardState -> Position -> Int -> Int -> Int -> Maybe ( Int, Position )
findFirstPieceInDirection state from dr dc startDist =
    if startDist > maxCannonDistance then
        Nothing

    else
        let
            pos =
                { row = from.row + dr * startDist, col = from.col + dc * startDist }
        in
        if not (inBounds pos) then
            Nothing

        else
            case cellAt state pos of
                Empty ->
                    findFirstPieceInDirection state from dr dc (startDist + 1)

                _ ->
                    Just ( startDist, pos )
