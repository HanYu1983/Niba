module Ui.Common exposing (displayName, slotTagName, flexColumn, flexRow, gap, px, rem)

import Html exposing (Attribute)
import Html.Attributes exposing (style)
import Types exposing (WeaponSlotTag(..))


displayName : String -> String -> String
displayName name nameTw =
    if nameTw == "" then
        name
    else
        nameTw ++ " (" ++ name ++ ")"


slotTagName : WeaponSlotTag -> String
slotTagName tag =
    case tag of
        Hand ->
            "Hand"

        Shoulder ->
            "Shoulder"

        Internal ->
            "Internal"


{-| Inline style: flex column with optional gap (e.g. gap 0.75)
-}
flexColumn : List (Attribute msg)
flexColumn =
    [ style "display" "flex"
    , style "flex-direction" "column"
    ]


flexRow : List (Attribute msg)
flexRow =
    [ style "display" "flex"
    , style "flex-direction" "row"
    ]


{-| style list for gap (e.g. gap "0.75rem")
-}
gap : String -> List (Attribute msg)
gap v =
    [ style "gap" v ]


px : Int -> String
px n =
    String.fromInt n ++ "px"


rem : Float -> String
rem n =
    String.fromFloat n ++ "rem"
