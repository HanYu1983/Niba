module View.Log exposing (viewLog)

{-| 事件 log：最近幾條系統報告。
-}

import Html exposing (Html, div, text)
import Html.Attributes exposing (class)


maxLogLines : Int
maxLogLines =
    8


viewLog : List String -> Html msg
viewLog log =
    div [ class "view-log" ]
        [ div [ class "log-title" ] [ text "控制台日誌" ]
        , div [ class "log-entries" ]
            (List.map (\line -> div [ class "log-line" ] [ text line ]) (List.take maxLogLines log))
        ]
