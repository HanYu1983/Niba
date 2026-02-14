module Lobby exposing (canAfford, tryBuyMecha, tryBuyPilot, tryBuyWeapon, tryBuyPart, trySellMecha, trySellPilot, trySellWeapon, trySellPart, isAssemblyLegal, finalHp, finalAdaptability, selectMechaForAssembly, clearAssembly, equipWeapon, unequipWeapon, equipPart, unequipPart, assignPilot, unassignPilot, addAssemblyToSquad, removeFromSquad)

import Types exposing (..)

-- =============================================================================
-- Inventory_Control (lobby_logic.md §1)
-- Categories: [Mecha, Pilot, Weapon, Part]
-- Transaction: Balance >= Price -> Transfer_Ownership.
-- =============================================================================

canAfford : Int -> Int -> Bool
canAfford balance price =
    balance >= price


tryBuyMecha : LobbyModel -> MechaFrame -> Maybe LobbyModel
tryBuyMecha model mecha =
    if canAfford model.balance mecha.price then
        Just
            { model
                | balance = model.balance - mecha.price
                , shop = (\s -> { s | mechas = List.filter (\m -> m.id /= mecha.id) s.mechas }) model.shop
                , inventory = (\inv -> { inv | mechas = inv.mechas ++ [ mecha ] }) model.inventory
            }
    else
        Nothing


tryBuyPilot : LobbyModel -> PilotProfile -> Maybe LobbyModel
tryBuyPilot model pilot =
    if canAfford model.balance pilot.price then
        Just
            { model
                | balance = model.balance - pilot.price
                , shop = (\s -> { s | pilots = List.filter (\p -> p.id /= pilot.id) s.pilots }) model.shop
                , inventory = (\inv -> { inv | pilots = inv.pilots ++ [ pilot ] }) model.inventory
            }
    else
        Nothing


tryBuyWeapon : LobbyModel -> WeaponProfile -> Maybe LobbyModel
tryBuyWeapon model weapon =
    if canAfford model.balance weapon.price then
        Just
            { model
                | balance = model.balance - weapon.price
                , shop = (\s -> { s | weapons = List.filter (\w -> w.id /= weapon.id) s.weapons }) model.shop
                , inventory = (\inv -> { inv | weapons = inv.weapons ++ [ weapon ] }) model.inventory
            }
    else
        Nothing


tryBuyPart : LobbyModel -> PartProfile -> Maybe LobbyModel
tryBuyPart model part =
    if canAfford model.balance part.price then
        Just
            { model
                | balance = model.balance - part.price
                , shop = (\s -> { s | parts = List.filter (\q -> q.id /= part.id) s.parts }) model.shop
                , inventory = (\inv -> { inv | parts = inv.parts ++ [ part ] }) model.inventory
            }
    else
        Nothing


removeOne : (a -> Bool) -> List a -> List a
removeOne pred list =
    case list of
        [] -> []
        x :: xs -> if pred x then xs else x :: removeOne pred xs


trySellMecha : LobbyModel -> MechaFrame -> LobbyModel
trySellMecha model mecha =
    { model
        | balance = model.balance + mecha.price
        , shop = (\s -> { s | mechas = s.mechas ++ [ mecha ] }) model.shop
        , inventory = (\inv -> { inv | mechas = removeOne (\m -> m.id == mecha.id) inv.mechas }) model.inventory
    }


trySellPilot : LobbyModel -> PilotProfile -> LobbyModel
trySellPilot model pilot =
    { model
        | balance = model.balance + pilot.price
        , shop = (\s -> { s | pilots = s.pilots ++ [ pilot ] }) model.shop
        , inventory = (\inv -> { inv | pilots = removeOne (\p -> p.id == pilot.id) inv.pilots }) model.inventory
    }


trySellWeapon : LobbyModel -> WeaponProfile -> LobbyModel
trySellWeapon model weapon =
    { model
        | balance = model.balance + weapon.price
        , shop = (\s -> { s | weapons = s.weapons ++ [ weapon ] }) model.shop
        , inventory = (\inv -> { inv | weapons = removeOne (\w -> w.id == weapon.id) inv.weapons }) model.inventory
    }


trySellPart : LobbyModel -> PartProfile -> LobbyModel
trySellPart model part =
    { model
        | balance = model.balance + part.price
        , shop = (\s -> { s | parts = s.parts ++ [ part ] }) model.shop
        , inventory = (\inv -> { inv | parts = removeOne (\q -> q.id == part.id) inv.parts }) model.inventory
    }


-- =============================================================================
-- Assembly_Validation (lobby_logic.md §2)
-- Weight_Constraint: Σ(Weapon.W + Part.W) <= Mecha.Max_Weight
-- Energy_Constraint: Σ(Part.Passive_Draw) <= Mecha.EN_Regen
-- Slot_Constraint: Weapon_Type MUST MATCH Slot_Tag (Hand/Shoulder/Internal)
-- =============================================================================

totalWeight : List WeaponProfile -> List PartProfile -> Int
totalWeight weapons parts =
    List.sum (List.map .weight weapons) + List.sum (List.map .weight parts)


totalPassiveDraw : List PartProfile -> Int
totalPassiveDraw parts =
    List.sum (List.map .passiveDraw parts)


weightOk : MechaFrame -> List WeaponProfile -> List PartProfile -> Bool
weightOk mecha weapons parts =
    totalWeight weapons parts <= mecha.weightLimit


energyOk : MechaFrame -> List PartProfile -> Bool
energyOk mecha parts =
    totalPassiveDraw parts <= mecha.enRegen


uniqueSlotTags : List WeaponSlotTag -> List WeaponSlotTag
uniqueSlotTags tags =
    List.foldr
        (\t acc ->
            if List.member t acc then
                acc
            else
                t :: acc
        )
        []
        tags


slotCount : WeaponSlotTag -> List WeaponSlotTag -> Int
slotCount tag tags =
    List.length (List.filter ((==) tag) tags)


weaponSlotCounts : List WeaponProfile -> List ( WeaponSlotTag, Int )
weaponSlotCounts weapons =
    let
        tags =
            List.map .slotTag weapons
    in
    List.map (\tag -> ( tag, slotCount tag tags )) (uniqueSlotTags tags)


mechaSlotCounts : MechaFrame -> List ( WeaponSlotTag, Int )
mechaSlotCounts mecha =
    let
        tags =
            mecha.weaponSlots
    in
    List.map (\tag -> ( tag, slotCount tag tags )) (uniqueSlotTags tags)


lookupSlot : WeaponSlotTag -> List ( WeaponSlotTag, Int ) -> Maybe Int
lookupSlot tag counts =
    List.filterMap
        (\( t, m ) ->
            if t == tag then
                Just m
            else
                Nothing
        )
        counts
        |> List.head


slotOk : MechaFrame -> List WeaponProfile -> Bool
slotOk mecha weapons =
    List.all
        (\( tag, n ) ->
            n <= Maybe.withDefault 0 (lookupSlot tag (mechaSlotCounts mecha))
        )
        (weaponSlotCounts weapons)


isAssemblyLegal : Assembly -> Bool
isAssemblyLegal a =
    weightOk a.mecha a.weapons a.parts
        && energyOk a.mecha a.parts
        && slotOk a.mecha a.weapons


-- =============================================================================
-- Stat_Stacking (lobby_logic.md §3)
-- Final_HP = Mecha.Base_HP + Part.HP_Bonus
-- Final_Adaptability = Mecha.Base_Adaptability -> Apply(Part_Modifiers)
-- =============================================================================

finalHp : MechaFrame -> List PartProfile -> Int
finalHp mecha parts =
    mecha.maxHp + List.sum (List.map .hpBonus parts)


applyAdaptabilityMod : ( String, Grade ) -> Adaptability -> Adaptability
applyAdaptabilityMod ( name, grade ) acc =
    case name of
        "Land" ->
            { acc | land = grade }

        "Mountain" ->
            { acc | mountain = grade }

        "Sea" ->
            { acc | sea = grade }

        "Air" ->
            { acc | air = grade }

        "Space" ->
            { acc | space = grade }

        _ ->
            acc


finalAdaptability : MechaFrame -> List PartProfile -> Adaptability
finalAdaptability mecha parts =
    List.foldl applyAdaptabilityMod mecha.adaptability (List.concatMap .adaptabilityModifiers parts)


-- =============================================================================
-- 裝配：選擇機體、武器/配件拆裝、駕駛搭乘/不搭乘
-- =============================================================================

returnAssemblyToInventory : LobbyModel -> LobbyModel
returnAssemblyToInventory model =
    case model.assembly of
        Nothing ->
            model
        Just a ->
            { model
                | inventory =
                    { mechas = model.inventory.mechas
                    , pilots = model.inventory.pilots
                    , weapons = model.inventory.weapons ++ a.weapons
                    , parts = model.inventory.parts ++ a.parts
                    }
                , assembly = Nothing
                }


selectMechaForAssembly : LobbyModel -> MechaFrame -> LobbyModel
selectMechaForAssembly model mecha =
    let
        withReturned =
            returnAssemblyToInventory model
    in
    { withReturned
        | assembly =
            Just
                { mecha = mecha
                , pilot = Nothing
                , weapons = []
                , parts = []
                }
    }


clearAssembly : LobbyModel -> LobbyModel
clearAssembly model =
    returnAssemblyToInventory model


weaponInInventory : Inventory -> WeaponProfile -> Bool
weaponInInventory inv w =
    List.any (\x -> x.id == w.id) inv.weapons


partInInventory : Inventory -> PartProfile -> Bool
partInInventory inv p =
    List.any (\x -> x.id == p.id) inv.parts


equipWeapon : LobbyModel -> WeaponProfile -> Maybe LobbyModel
equipWeapon model weapon =
    case model.assembly of
        Nothing ->
            Nothing
        Just a ->
            if not (weaponInInventory model.inventory weapon) then
                Nothing
            else if not (slotOk a.mecha (a.weapons ++ [ weapon ])) then
                Nothing
            else
                Just
                    { model
                        | assembly = Just { a | weapons = a.weapons ++ [ weapon ] }
                        , inventory = (\inv -> { inv | weapons = removeOne (\w -> w.id == weapon.id) inv.weapons }) model.inventory
                    }


unequipWeapon : LobbyModel -> WeaponProfile -> Maybe LobbyModel
unequipWeapon model weapon =
    case model.assembly of
        Nothing ->
            Nothing
        Just a ->
            if not (List.any (\w -> w.id == weapon.id) a.weapons) then
                Nothing
            else
                Just
                    { model
                        | assembly = Just { a | weapons = removeOne (\w -> w.id == weapon.id) a.weapons }
                        , inventory = (\inv -> { inv | weapons = inv.weapons ++ [ weapon ] }) model.inventory
                    }


equipPart : LobbyModel -> PartProfile -> Maybe LobbyModel
equipPart model part =
    case model.assembly of
        Nothing ->
            Nothing
        Just a ->
            if not (partInInventory model.inventory part) then
                Nothing
            else if List.length a.parts >= a.mecha.partSlots then
                Nothing
            else
                Just
                    { model
                        | assembly = Just { a | parts = a.parts ++ [ part ] }
                        , inventory = (\inv -> { inv | parts = removeOne (\q -> q.id == part.id) inv.parts }) model.inventory
                    }


unequipPart : LobbyModel -> PartProfile -> Maybe LobbyModel
unequipPart model part =
    case model.assembly of
        Nothing ->
            Nothing
        Just a ->
            if not (List.any (\p -> p.id == part.id) a.parts) then
                Nothing
            else
                Just
                    { model
                        | assembly = Just { a | parts = removeOne (\q -> q.id == part.id) a.parts }
                        , inventory = (\inv -> { inv | parts = inv.parts ++ [ part ] }) model.inventory
                    }


assignPilot : LobbyModel -> PilotProfile -> Maybe LobbyModel
assignPilot model pilot =
    case model.assembly of
        Nothing ->
            Nothing
        Just a ->
            if not (List.any (\p -> p.id == pilot.id) model.inventory.pilots) then
                Nothing
            else
                Just { model | assembly = Just { a | pilot = Just pilot } }


unassignPilot : LobbyModel -> Maybe LobbyModel
unassignPilot model =
    case model.assembly of
        Nothing ->
            Nothing
        Just a ->
            Just { model | assembly = Just { a | pilot = Nothing } }


-- =============================================================================
-- 出擊小隊 (state_flow § 2.2)：供策略階段派擊用
-- =============================================================================

addAssemblyToSquad : LobbyModel -> Maybe LobbyModel
addAssemblyToSquad model =
    case model.assembly of
        Nothing ->
            Nothing
        Just a ->
            if isAssemblyLegal a then
                Just
                    { model
                        | squad = model.squad ++ [ a ]
                        , assembly = Nothing
                    }
            else
                Nothing


removeFromSquad : Int -> LobbyModel -> LobbyModel
removeFromSquad index model =
    { model
        | squad =
            model.squad
                |> List.indexedMap Tuple.pair
                |> List.filter (\( i, _ ) -> i /= index)
                |> List.map Tuple.second
    }
