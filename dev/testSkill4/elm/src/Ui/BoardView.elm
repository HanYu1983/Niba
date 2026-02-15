module Ui.BoardView exposing (view)

import Board exposing (BoardState, CellContent(..), Position, Side(..), boardSize, cellAt, positionEquals)
import Html exposing (Html, div, span)
import Html.Attributes exposing (class, style)
import Html.Events exposing (onClick)


cellSize : Int
cellSize =
    36


view :
    BoardState
    -> Maybe Position
    -> List Position
    -> List Position
    -> (Position -> msg)
    -> Html msg
view board selected legalMoves previewCells toMsg =
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
                                        content = cellAt board pos
                                        ( bg, txt ) = cellStyle content isSelected isLegal isPreview
                                    in
                                    div
                                        [ style "width" (String.fromInt cellSize ++ "px")
                                        , style "height" (String.fromInt cellSize ++ "px")
                                        , style "background" bg
                                        , style "color" txt
                                        , style "display" "flex"
                                        , style "align-items" "center"
                                        , style "justify-content" "center"
                                        , style "cursor" "pointer"
                                        , style "font-size" "20px"
                                        , onClick (toMsg pos)
                                        ]
                                        [ span [] [ Html.text (cellLabel content) ] ]
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


cellStyle : CellContent -> Bool -> Bool -> Bool -> ( String, String )
cellStyle content isSelected isLegal isPreview =
    let
        baseBg = "#e8dcc4"
        baseTxt = "#333"
    in
    if isPreview then
        ( "#b8a888", baseTxt )
    else if isLegal then
        ( "#7cb342", "#fff" )
    else if isSelected then
        ( "#ffb74d", "#fff" )
    else
        ( baseBg, baseTxt )
