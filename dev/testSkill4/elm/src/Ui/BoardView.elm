module Ui.BoardView exposing (view)

import Board exposing (BoardState, CellContent(..), Position, Side(..), boardSize, cellAt, positionEquals)
import Html exposing (Html, div, span)
import Html.Attributes exposing (class, style)
import Html.Events exposing (onClick)


cellSize : Int
cellSize =
    36


remainingAt : Position -> List ( Position, Int ) -> Maybe Int
remainingAt pos list =
    list
        |> List.filter (\( p, _ ) -> positionEquals p pos)
        |> List.head
        |> Maybe.map (\( _, n ) -> n)


view :
    BoardState
    -> Maybe Position
    -> List Position
    -> List Position
    -> List ( Position, Int )
    -> List Position
    -> Maybe String
    -> Maybe ( Position, String )
    -> Bool
    -> (Position -> msg)
    -> Html msg
view board selected legalMoves previewCells protectedWithTurns shieldedCells itemPreviewLabel pendingApplyCell isItemMode toMsg =
    div [ class "board", style "display" "inline-block" ]
        [ div [ style "display" "grid", style "grid-template-columns" (String.repeat boardSize "1fr "), style "gap" "1px", style "background" "#333" ]
            (List.range 0 (boardSize - 1)
                |> List.concatMap
                    (\r ->
                        List.range 0 (boardSize - 1)
                            |> List.map
                                (\c ->
                                    let
                                        pos = { row = r, col = c }
                                        isSelected = Maybe.map (positionEquals pos) selected |> Maybe.withDefault False
                                        isLegal = List.any (positionEquals pos) legalMoves
                                        isPreview = List.any (positionEquals pos) previewCells
                                        isShielded = List.any (positionEquals pos) shieldedCells
                                        isPendingApply = pendingApplyCell |> Maybe.map (\( p, _ ) -> positionEquals pos p) |> Maybe.withDefault False
                                        pendingLabel = pendingApplyCell |> Maybe.andThen (\( p, l ) -> if positionEquals pos p then Just l else Nothing)
                                        content = cellAt board pos
                                        protectionTurns = remainingAt pos protectedWithTurns
                                        ( bg, txt ) = cellStyle content isSelected isLegal isPreview isItemMode
                                    in
                                    div
                                        [ style "width" (String.fromInt cellSize ++ "px")
                                        , style "height" (String.fromInt cellSize ++ "px")
                                        , style "background" bg
                                        , style "color" txt
                                        , style "display" "flex"
                                        , style "flex-direction" "column"
                                        , style "align-items" "center"
                                        , style "justify-content" "center"
                                        , style "cursor" "pointer"
                                        , style "font-size" "20px"
                                        , style "position" "relative"
                                        , onClick (toMsg pos)
                                        ]
                                        [ span [] [ Html.text (cellLabel content) ]
                                        , case protectionTurns of
                                            Just n ->
                                                span
                                                    [ style "font-size" "9px"
                                                    , style "opacity" "0.9"
                                                    , style "margin-top" "0px"
                                                    ]
                                                    [ Html.text ("護" ++ String.fromInt n) ]
                                            Nothing ->
                                                span [] []
                                        , if isShielded then
                                            span
                                                [ style "font-size" "9px"
                                                , style "opacity" "0.95"
                                                , style "margin-top" "0px"
                                                , style "color" "#2e7d32"
                                                ]
                                                [ Html.text "盾" ]
                                          else
                                            span [] []
                                        , if isPreview then
                                            case itemPreviewLabel of
                                                Just label ->
                                                    span
                                                        [ style "font-size" "10px"
                                                        , style "font-weight" "bold"
                                                        , style "margin-top" "1px"
                                                        , style "color" "#5d4037"
                                                        ]
                                                        [ Html.text label ]
                                                Nothing ->
                                                    span [] []
                                          else
                                            span [] []
                                        , if isPendingApply then
                                            case pendingLabel of
                                                Just label ->
                                                    span
                                                        [ style "font-size" "14px"
                                                        , style "font-weight" "bold"
                                                        , style "margin-top" "2px"
                                                        , style "color" "#bf360c"
                                                        ]
                                                        [ Html.text label ]
                                                Nothing ->
                                                    span [] []
                                          else
                                            span [] []
                                        ]
                                )
                    )
            )
        ]


cellLabel : CellContent -> String
cellLabel content =
    case content of
        Empty -> ""
        Piece Player -> "馬"
        Piece AI -> "炮"
        Castle Player -> "堡"
        Castle AI -> "堡"


cellStyle : CellContent -> Bool -> Bool -> Bool -> Bool -> ( String, String )
cellStyle content isSelected isLegal isPreview isItemMode =
    let
        baseBg = "#e8dcc4"
        baseTxt = "#333"
    in
    if isPreview then
        if isItemMode then
            ( "#ffcc80", "#5d4037" )
        else
            ( "#b8a888", baseTxt )
    else if isLegal then
        ( "#7cb342", "#fff" )
    else if isSelected then
        ( "#ffb74d", "#fff" )
    else
        ( baseBg, baseTxt )
