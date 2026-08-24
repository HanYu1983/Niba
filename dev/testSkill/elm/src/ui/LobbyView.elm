module Ui.LobbyView exposing (viewLobby)

import Html exposing (Html, div, h1, h2, h3, ul, li, text, span, button, p, section)
import Html.Attributes exposing (class, disabled, style)
import Html.Events exposing (onClick)
import Lobby
import Messages exposing (GameMsg(..))
import Types exposing (LobbyModel, MechaFrame, PilotProfile, WeaponProfile, PartProfile)
import Ui.Common exposing (displayName, flexColumn, flexRow, gap, rem, slotTagName)


viewLobby : LobbyModel -> Html GameMsg
viewLobby lobby =
    div [ class "lobby" ]
        [ viewLobbyHeader lobby.balance
        , div (flexColumn ++ gap "1.5rem")
            [ viewSection "編成" [ viewAssemblyBlock lobby, viewAssemblyStatus lobby, viewSquadBlock lobby ]
            , viewSection "商店" [ viewShop lobby ]
            , viewSection "持有" [ viewInventory lobby ]
            ]
        ]


viewLobbyHeader : Int -> Html GameMsg
viewLobbyHeader balance =
    div
        [ class "lobby-header"
        , style "display" "flex"
        , style "flex-wrap" "wrap"
        , style "align-items" "center"
        , style "justify-content" "space-between"
        , style "gap" "1rem"
        , style "margin-bottom" "1.5rem"
        , style "padding-bottom" "1rem"
        , style "border-bottom" "1px solid rgba(15,52,96,0.8)"
        ]
        [ h1 [ style "margin" "0", style "font-size" "1.5rem", style "color" "#e8e8e8" ]
            [ text "大廳 — 未命名的機甲戰棋" ]
        , span
            [ class "balance"
            , style "display" "inline-flex"
            , style "align-items" "center"
            , style "padding" "0.35rem 0.85rem"
            , style "background" "linear-gradient(135deg, #1a3a5c 0%, #0f3460 100%)"
            , style "border-radius" "999px"
            , style "font-weight" "bold"
            , style "font-size" "1.1rem"
            , style "color" "#aaccff"
            , style "border" "1px solid rgba(170,204,255,0.3)"
            ]
            [ text ("§ " ++ String.fromInt balance) ]
        , button
            [ onClick GoToTestCombat
            , class "btn btn-test-combat"
            , style "padding" "0.4rem 0.9rem"
            , style "font-size" "0.95rem"
            ]
            [ text "測試戰鬥" ]
        ]


viewSection : String -> List (Html GameMsg) -> Html GameMsg
viewSection title children =
    section
        [ class "lobby-section"
        , style "margin" "0"
        ]
        [ h2
            [ class "lobby-section-title"
            , style "margin" "0 0 0.75rem"
            , style "font-size" "1.15rem"
            , style "color" "#aaccff"
            , style "font-weight" "600"
            ]
            [ text title ]
        , div (flexColumn ++ gap (rem 0.75))
            children
        ]


viewSquadBlock : LobbyModel -> Html GameMsg
viewSquadBlock lobby =
    div [ class "squad-block assembly-block" ]
        [ h3 [ style "margin" "0 0 0.5rem", style "color" "#e94560" ] [ text "出擊小隊" ]
        , case lobby.assembly of
            Nothing ->
                p [ style "margin" "0.5rem 0", style "color" "#aaa" ] [ text "請先選擇機體並完成裝配，再點「加入出擊小隊」。" ]
            Just a ->
                if Lobby.isAssemblyLegal a then
                    p [ style "margin" "0.5rem 0", style "display" "flex", style "align-items" "center", style "gap" "0.5rem" ]
                        [ button [ onClick AddAssemblyToSquad, class "btn btn-assembly" ] [ text "加入出擊小隊" ]
                        , span [ style "color" "#7bed9f", style "font-size" "0.9rem" ] [ text "當前裝配合法，可加入" ]
                        ]
                else
                    p [ style "margin" "0.5rem 0", style "color" "#ff8a8a" ] [ text "當前裝配不合法，無法加入小隊。" ]
        , if List.isEmpty lobby.squad then
            p [ style "margin" "0.5rem 0", style "color" "#888" ] [ text "小隊尚無成員。" ]
          else
            ul [ class "item-list", style "margin" "0.5rem 0" ]
                (lobby.squad
                    |> List.indexedMap
                        (\i a ->
                            li ([ class "item-row" ] ++ itemRowAttrs)
                                [ span [ style "flex" "1", style "min-width" "0" ] [ text (displayName a.mecha.name a.mecha.nameTw) ]
                                , span [ style "color" "#aaa", style "font-size" "0.9rem" ] [ text ("武器 " ++ String.fromInt (List.length a.weapons) ++ " · 配件 " ++ String.fromInt (List.length a.parts)) ]
                                , button [ onClick (RemoveFromSquad i), class "btn btn-small" ] [ text "從小隊移除" ]
                                ]
                        )
                )
        , if not (List.isEmpty lobby.squad) then
            button [ onClick GoToStrategy, class "btn", style "margin-top" "0.75rem", style "align-self" "flex-start" ] [ text "出擊 → 任務選擇" ]
          else
            text ""
        ]


itemRowAttrs : List (Html.Attribute GameMsg)
itemRowAttrs =
    [ style "display" "flex"
    , style "flex-wrap" "wrap"
    , style "align-items" "center"
    , style "gap" "0.5rem"
    ]


viewShop : LobbyModel -> Html GameMsg
viewShop lobby =
    div [ class "shop", style "display" "grid", style "gap" "1rem" ]
        [ viewShopSection "機體" (List.map (viewMechaRow lobby.balance True) lobby.shop.mechas)
        , viewShopSection "駕駛" (List.map (viewPilotRow lobby.balance True) lobby.shop.pilots)
        , viewShopSection "武器" (List.map (viewWeaponRow lobby.balance True) lobby.shop.weapons)
        , viewShopSection "配件" (List.map (viewPartRow lobby.balance True) lobby.shop.parts)
        ]


viewInventory : LobbyModel -> Html GameMsg
viewInventory lobby =
    div [ class "inventory", style "display" "grid", style "gap" "1rem" ]
        [ viewShopSection "機體" (List.map (viewMechaRow lobby.balance False) lobby.inventory.mechas)
        , viewShopSection "駕駛" (List.map (viewPilotRow lobby.balance False) lobby.inventory.pilots)
        , viewShopSection "武器" (List.map (viewWeaponRow lobby.balance False) lobby.inventory.weapons)
        , viewShopSection "配件" (List.map (viewPartRow lobby.balance False) lobby.inventory.parts)
        ]


viewShopSection : String -> List (Html GameMsg) -> Html GameMsg
viewShopSection title rows =
    div
        [ class "shop-section"
        , style "border-radius" "8px"
        , style "overflow" "hidden"
        ]
        [ h3 [ style "margin" "0", style "padding" "0.5rem 0.75rem", style "color" "#e94560", style "font-size" "1rem" ] [ text title ]
        , if List.isEmpty rows then
            p [ style "margin" "0", style "padding" "0.75rem", style "color" "#888" ] [ text "（無）" ]
          else
            ul [ class "item-list", style "margin" "0", style "padding" "0 0.5rem 0.5rem" ] rows
        ]


viewMechaRow : Int -> Bool -> MechaFrame -> Html GameMsg
viewMechaRow balance isShop mecha =
    li ([ class "item-row" ] ++ itemRowAttrs)
        [ span [ style "flex" "1", style "min-width" "0", style "font-weight" "500" ] [ text (displayName mecha.name mecha.nameTw) ]
        , span [ style "color" "#aaa", style "font-size" "0.85rem" ] [ text ("HP " ++ String.fromInt mecha.maxHp ++ " · 載重 " ++ String.fromInt mecha.weightLimit) ]
        , span [ style "color" "#aaccff", style "font-size" "0.9rem" ] [ text ("§" ++ String.fromInt mecha.price) ]
        , viewRowAction isShop (balance < mecha.price) (BuyMecha mecha) (SellMecha mecha)
        ]


viewPilotRow : Int -> Bool -> PilotProfile -> Html GameMsg
viewPilotRow balance isShop pilot =
    li ([ class "item-row" ] ++ itemRowAttrs)
        [ span [ style "flex" "1", style "min-width" "0", style "font-weight" "500" ] [ text (displayName pilot.name pilot.nameTw) ]
        , span [ style "color" "#aaa", style "font-size" "0.85rem" ] [ text pilot.rank ]
        , span [ style "color" "#aaccff", style "font-size" "0.9rem" ] [ text ("§" ++ String.fromInt pilot.price) ]
        , viewRowAction isShop (balance < pilot.price) (BuyPilot pilot) (SellPilot pilot)
        ]


viewWeaponRow : Int -> Bool -> WeaponProfile -> Html GameMsg
viewWeaponRow balance isShop weapon =
    li ([ class "item-row" ] ++ itemRowAttrs)
        [ span [ style "flex" "1", style "min-width" "0", style "font-weight" "500" ] [ text (displayName weapon.name weapon.nameTw) ]
        , span [ style "color" "#aaa", style "font-size" "0.85rem" ] [ text (slotTagName weapon.slotTag ++ " · " ++ String.fromInt weapon.weight ++ "kg") ]
        , span [ style "color" "#aaccff", style "font-size" "0.9rem" ] [ text ("§" ++ String.fromInt weapon.price) ]
        , viewRowAction isShop (balance < weapon.price) (BuyWeapon weapon) (SellWeapon weapon)
        ]


viewPartRow : Int -> Bool -> PartProfile -> Html GameMsg
viewPartRow balance isShop part =
    li ([ class "item-row" ] ++ itemRowAttrs)
        [ span [ style "flex" "1", style "min-width" "0", style "font-weight" "500" ] [ text (displayName part.name part.nameTw) ]
        , span [ style "color" "#aaa", style "font-size" "0.85rem" ] [ text (String.fromInt part.weight ++ "kg · EN-" ++ String.fromInt part.passiveDraw ++ " · HP+" ++ String.fromInt part.hpBonus) ]
        , span [ style "color" "#aaccff", style "font-size" "0.9rem" ] [ text ("§" ++ String.fromInt part.price) ]
        , viewRowAction isShop (balance < part.price) (BuyPart part) (SellPart part)
        ]


viewRowAction : Bool -> Bool -> GameMsg -> GameMsg -> Html GameMsg
viewRowAction isShop insufficient buyMsg sellMsg =
    if isShop then
        button [ onClick buyMsg, class "btn", disabled insufficient, style "flex-shrink" "0" ]
            [ text (if insufficient then "餘額不足" else "購買") ]
    else
        button [ onClick sellMsg, class "btn", style "flex-shrink" "0" ] [ text "出售" ]


viewAssemblyBlock : LobbyModel -> Html GameMsg
viewAssemblyBlock lobby =
    case lobby.assembly of
        Nothing ->
            div [ class "assembly-block" ]
                [ p [ style "margin" "0 0 0.5rem", style "color" "#ccc" ] [ text "選擇機體進行裝配：" ]
                , if List.isEmpty lobby.inventory.mechas then
                    p [ style "margin" "0", style "color" "#888" ] [ text "（尚無機體，請先從商店購買）" ]
                  else
                    ul [ class "item-list", style "margin" "0" ]
                        (List.map
                            (\m ->
                                li ([ class "item-row" ] ++ itemRowAttrs)
                                    [ span [ style "flex" "1" ] [ text (displayName m.name m.nameTw) ]
                                    , button [ onClick (SelectMechaForAssembly m), class "btn btn-assembly" ] [ text "選擇此機體" ]
                                    ]
                            )
                            lobby.inventory.mechas
                        )
                ]

        Just a ->
            div
                [ class "assembly-block assembly-block--two-col"
                , style "display" "grid"
                , style "grid-template-columns" "1fr 1fr"
                , style "gap" "1.25rem"
                ]
                [ div [ class "assembly-current", style "min-width" "0" ]
                    [ p [ style "margin" "0 0 0.5rem", style "font-weight" "600", style "color" "#aaccff" ] [ text ("當前機體: " ++ displayName a.mecha.name a.mecha.nameTw) ]
                    , p [ class "pilot-row", style "margin" "0.5rem 0", style "display" "flex", style "flex-wrap" "wrap", style "align-items" "center", style "gap" "0.5rem" ]
                        [ text "駕駛: "
                        , case a.pilot of
                            Nothing -> span [ style "color" "#888" ] [ text "未搭乘" ]
                            Just p_ -> span [] [ text (displayName p_.name p_.nameTw) ]
                        , case a.pilot of
                            Nothing -> text ""
                            Just _ -> button [ onClick UnassignPilot, class "btn btn-small" ] [ text "卸下駕駛" ]
                        ]
                    , p [ style "margin" "0.5rem 0 0.25rem", style "font-size" "0.9rem", style "color" "#aaa" ] [ text ("已裝備武器 " ++ String.fromInt (List.length a.weapons) ++ "/" ++ String.fromInt (List.length a.mecha.weaponSlots)) ]
                    , ul [ class "item-list", style "margin" "0 0 0.5rem" ]
                        (List.map (\w -> li ([ class "item-row" ] ++ itemRowAttrs) [ span [ style "flex" "1" ] [ text (displayName w.name w.nameTw) ], button [ onClick (UnequipWeapon w), class "btn btn-small" ] [ text "卸下" ] ]) a.weapons)
                    , p [ style "margin" "0.5rem 0 0.25rem", style "font-size" "0.9rem", style "color" "#aaa" ] [ text ("已裝備配件 " ++ String.fromInt (List.length a.parts) ++ "/" ++ String.fromInt a.mecha.partSlots) ]
                    , ul [ class "item-list", style "margin" "0 0 0.75rem" ]
                        (List.map (\pt -> li ([ class "item-row" ] ++ itemRowAttrs) [ span [ style "flex" "1" ] [ text (displayName pt.name pt.nameTw) ], button [ onClick (UnequipPart pt), class "btn btn-small" ] [ text "卸下" ] ]) a.parts)
                    , button [ onClick ClearAssembly, class "btn" ] [ text "清除裝配" ]
                    ]
                , div [ class "assembly-equip", style "min-width" "0" ]
                    [ h3 [ style "margin" "0 0 0.5rem", style "font-size" "0.95rem", style "color" "#aaccff" ] [ text "可裝備的武器（從持有中選擇）" ]
                    , if List.isEmpty lobby.inventory.weapons then
                        p [ style "margin" "0 0 0.75rem", style "color" "#888" ] [ text "（無）" ]
                      else
                        ul [ class "item-list", style "margin" "0 0 0.75rem" ]
                            (List.map (\w -> li ([ class "item-row" ] ++ itemRowAttrs) [ span [ style "flex" "1" ] [ text (displayName w.name w.nameTw) ], span [ style "color" "#888", style "font-size" "0.85rem" ] [ text (slotTagName w.slotTag ++ " " ++ String.fromInt w.weight ++ "kg") ], button [ onClick (EquipWeapon w), class "btn btn-small" ] [ text "裝備" ] ]) lobby.inventory.weapons)
                    , h3 [ style "margin" "0 0 0.5rem", style "font-size" "0.95rem", style "color" "#aaccff" ] [ text "可裝備的配件" ]
                    , if List.isEmpty lobby.inventory.parts then
                        p [ style "margin" "0 0 0.75rem", style "color" "#888" ] [ text "（無）" ]
                      else
                        ul [ class "item-list", style "margin" "0 0 0.75rem" ]
                            (List.map (\pt -> li ([ class "item-row" ] ++ itemRowAttrs) [ span [ style "flex" "1" ] [ text (displayName pt.name pt.nameTw) ], button [ onClick (EquipPart pt), class "btn btn-small" ] [ text "裝備" ] ]) lobby.inventory.parts)
                    , h3 [ style "margin" "0 0 0.5rem", style "font-size" "0.95rem", style "color" "#aaccff" ] [ text "駕駛搭乘" ]
                    , case a.pilot of
                        Nothing ->
                            if List.isEmpty lobby.inventory.pilots then
                                p [ style "margin" "0", style "color" "#888" ] [ text "（尚無駕駛，請先從商店招募）" ]
                            else
                                ul [ class "item-list", style "margin" "0" ] (List.map (\p_ -> li ([ class "item-row" ] ++ itemRowAttrs) [ span [ style "flex" "1" ] [ text (displayName p_.name p_.nameTw) ], button [ onClick (AssignPilot p_), class "btn btn-small" ] [ text "搭乘" ] ]) lobby.inventory.pilots)
                        Just _ ->
                            p [ style "margin" "0", style "color" "#7bed9f", style "font-size" "0.9rem" ] [ text "已分配駕駛，可點「卸下駕駛」更換。" ]
                    ]
                ]


viewAssemblyStatus : LobbyModel -> Html GameMsg
viewAssemblyStatus lobby =
    case lobby.assembly of
        Nothing ->
            div [ style "margin" "0.5rem 0", style "color" "#888" ] [ text "尚未選擇裝配" ]
        Just a ->
            if Lobby.isAssemblyLegal a then
                div
                    [ class "assembly-legal"
                    , style "display" "inline-flex"
                    , style "align-items" "center"
                    , style "gap" "0.5rem"
                    , style "margin" "0.5rem 0"
                    , style "padding" "0.35rem 0.75rem"
                    , style "background" "rgba(123,237,159,0.15)"
                    , style "border" "1px solid rgba(123,237,159,0.4)"
                    , style "border-radius" "6px"
                    , style "color" "#7bed9f"
                    , style "font-size" "0.9rem"
                    ]
                    [ text "裝配合法"
                    , span [ style "opacity" "0.9" ] [ text ("Final HP: " ++ String.fromInt (Lobby.finalHp a.mecha a.parts)) ]
                    ]
            else
                div
                    [ class "assembly-illegal"
                    , style "margin" "0.5rem 0"
                    , style "padding" "0.35rem 0.75rem"
                    , style "background" "rgba(255,107,107,0.1)"
                    , style "border" "1px solid rgba(255,107,107,0.4)"
                    , style "border-radius" "6px"
                    , style "color" "#ff8a8a"
                    , style "font-size" "0.9rem"
                    ]
                    [ text "裝配不合法（重量/EN/槽位檢查未通過）" ]
