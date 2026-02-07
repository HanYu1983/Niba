module Combat exposing
    ( initCombat
    , getCurrentUnit
    , getWeapon
    , canMove
    , reachableCells
    , moveUnit
    , switchWeaponTo
    , targetsInRange
    , canAffordCurrentWeapon
    , canAttackWithCurrentWeapon
    , beginAttack
    , resolvePendingAttack
    , resolveSnipePrompt
    , checkOverwatchAfterMove
    , attackTarget
    , endTurn
    , advanceTurn
    , battleResult
    , advanceUntilUnitOrResult
    , runEnemyTurn
    , findUnitById
    , cellsInWeaponRange
    )

import Types exposing (..)
import Lobby
import GameData

initCombat : Mission -> List Assembly -> LobbyModel -> CombatModel
initCombat mission deployments lobby =
    let
        w = min 14 mission.mapSizeX
        h = min 10 mission.mapSizeY
        playerUnits = toCombatUnits SidePlayer 1 0 deployments
        enemyAssemblies = GameData.enemyAssembliesForMission mission.id
        enemyUnits = toCombatUnits SideEnemy (w - 2) 0 enemyAssemblies
    in
    { mission = mission
    , gridWidth = w
    , gridHeight = h
    , playerUnits = playerUnits
    , enemyUnits = enemyUnits
    , currentSide = SidePlayer
    , currentUnitIndex = 0
    , round = 1
    , result = Nothing
    , pendingAttack = Nothing
    , counterPrompt = Nothing
    , snipePrompt = Nothing
    , lastAttackResult = Nothing
    , statusUnitId = Nothing
    , counterPromptAfterDismiss = Nothing
    , lobbySnapshot = lobby
    }


toCombatUnits : BattleSide -> Int -> Int -> List Assembly -> List CombatUnit
toCombatUnits side startX startY assemblies =
    List.indexedMap (toCombatUnit side startX startY) assemblies


toCombatUnit : BattleSide -> Int -> Int -> Int -> Assembly -> CombatUnit
toCombatUnit side baseX baseY index a =
    let
        hp = Lobby.finalHp a.mecha a.parts
        en = a.mecha.maxEn
        ammo = List.map (\w -> if w.maxAmmo < 0 then -1 else w.maxAmmo) a.weapons
        x = baseX + (index // 4)
        y = baseY + modBy 4 index
        sidePrefix = case side of
            SidePlayer -> "p"
            SideEnemy -> "e"
        uid = sidePrefix ++ "-" ++ String.fromInt index ++ "-" ++ a.mecha.id
    in
    { id = uid
    , side = side
    , assembly = a
    , x = x
    , y = y
    , currentHp = hp
    , currentEn = en
    , currentWeaponIndex = 0
    , actionState = Active
    , ammoRemaining = ammo
    , snipeTriggeredRound = 0
    }


getCurrentUnit : CombatModel -> Maybe CombatUnit
getCurrentUnit cm =
    let
        units = if cm.currentSide == SidePlayer then cm.playerUnits else cm.enemyUnits
    in
    List.drop cm.currentUnitIndex units |> List.head


allUnits : CombatModel -> List CombatUnit
allUnits cm =
    cm.playerUnits ++ cm.enemyUnits


manhattan : Int -> Int -> Int -> Int -> Int
manhattan x1 y1 x2 y2 =
    abs (x2 - x1) + abs (y2 - y1)


getWeapon : CombatUnit -> Maybe WeaponProfile
getWeapon u =
    u.assembly.weapons |> List.drop u.currentWeaponIndex |> List.head


canMove : CombatModel -> CombatUnit -> Bool
canMove cm u =
    u.actionState == Active && u.currentHp > 0


reachableCells : CombatModel -> CombatUnit -> List ( Int, Int )
reachableCells cm u =
    let
        mov = u.assembly.mecha.baseMov
    in
    List.range 0 (cm.gridWidth - 1) |> List.concatMap (\x ->
        List.range 0 (cm.gridHeight - 1) |> List.map (\y -> ( x, y ))
    )
        |> List.filter (\( cx, cy ) -> manhattan u.x u.y cx cy <= mov && manhattan u.x u.y cx cy > 0)
        |> List.filter (\( cx, cy ) -> not (List.any (\o -> o.x == cx && o.y == cy) (allUnits cm)))


moveUnit : CombatModel -> CombatUnit -> Int -> Int -> Maybe CombatModel
moveUnit cm u nx ny =
    if not (canMove cm u) then Nothing
    else if not (List.member ( nx, ny ) (reachableCells cm u)) then Nothing
    else
        let
            update u2 = if u2.id == u.id then { u2 | x = nx, y = ny, actionState = PostMove } else u2
            playerUnits2 = List.map update cm.playerUnits
            enemyUnits2 = List.map update cm.enemyUnits
        in
        Just { cm | playerUnits = playerUnits2, enemyUnits = enemyUnits2 }


switchWeaponTo : CombatModel -> CombatUnit -> Int -> Maybe CombatModel
switchWeaponTo cm u weaponIndex =
    let
        weapons = u.assembly.weapons
        n = List.length weapons
    in
    if u.actionState /= Active || u.currentHp <= 0 || n <= 1 then
        Nothing
        else if weaponIndex < 0 || weaponIndex >= n || weaponIndex == u.currentWeaponIndex then
        Nothing
    else
        let
            update u2 =
                if u2.id == u.id then
                    { u2 | currentWeaponIndex = weaponIndex }
                else
                    u2
        in
        Just
            { cm
                | playerUnits = List.map update cm.playerUnits
                , enemyUnits = List.map update cm.enemyUnits
            }


cellsInWeaponRange : CombatModel -> CombatUnit -> List ( Int, Int )
cellsInWeaponRange cm u =
    case getWeapon u of
        Nothing ->
            []
        Just w ->
            let
                allCells = List.range 0 (cm.gridWidth - 1) |> List.concatMap (\gx -> List.range 0 (cm.gridHeight - 1) |> List.map (\gy -> ( gx, gy )))
            in
            allCells
                |> List.filter (\( gx, gy ) -> (gx /= u.x || gy /= u.y) && let d = manhattan u.x u.y gx gy in d >= w.rngMin && d <= w.rngMax)


targetsInRange : CombatModel -> CombatUnit -> List CombatUnit
targetsInRange cm attacker =
    getWeapon attacker |> Maybe.map (\w ->
        let
            enemies = if cm.currentSide == SidePlayer then cm.enemyUnits else cm.playerUnits
        in
        List.filter (\t -> t.currentHp > 0) enemies
            |> List.filter (\t -> let d = manhattan attacker.x attacker.y t.x t.y in d >= w.rngMin && d <= w.rngMax)
    ) |> Maybe.withDefault []


canAffordCurrentWeapon : CombatUnit -> Bool
canAffordCurrentWeapon u =
    case getWeapon u of
        Nothing ->
            False
        Just w ->
            let
                enOk = u.currentEn >= w.enCost
                ammoOk = w.maxAmmo < 0 || (u.ammoRemaining |> List.drop u.currentWeaponIndex |> List.head |> Maybe.map (\a -> a > 0) |> Maybe.withDefault False)
            in
            enOk && ammoOk


-- 架勢邏輯：Direct_Fire 需靜止（本回合未移動）才能攻擊；Melee/Assault/Snipe 可移動後攻擊；攻擊前檢查 EN/彈藥
canAttackWithCurrentWeapon : CombatModel -> CombatUnit -> Bool
canAttackWithCurrentWeapon cm u =
    u.actionState /= Finished
        && canAffordCurrentWeapon u
        && List.length (targetsInRange cm u) > 0
        && (getWeapon u |> Maybe.map (\w -> w.stance /= "Direct_Fire" || u.actionState == Active) |> Maybe.withDefault False)


inWeaponRange : WeaponProfile -> CombatUnit -> CombatUnit -> Bool
inWeaponRange w attacker target =
    let
        d = manhattan attacker.x attacker.y target.x target.y
    in
    d >= w.rngMin && d <= w.rngMax


spendWeaponCost : Int -> CombatUnit -> WeaponProfile -> CombatUnit
spendWeaponCost weaponIndex u w =
    let
        newEn =
            max 0 (u.currentEn - w.enCost)

        spendAmmo i a =
            if i /= weaponIndex then
                a
            else if a < 0 then
                a
            else
                max 0 (a - 1)

        newAmmo =
            List.indexedMap spendAmmo u.ammoRemaining
    in
    { u | currentEn = newEn, ammoRemaining = newAmmo }


findUnitById : String -> CombatModel -> Maybe CombatUnit
findUnitById uid cm =
    allUnits cm |> List.filter (\u -> u.id == uid) |> List.head


unitDisplayName : CombatUnit -> String
unitDisplayName u =
    let
        m = u.assembly.mecha
    in
    if m.nameTw == "" then m.name else m.nameTw


withAttackResult : CombatModel -> AttackOutcome -> Int -> Bool -> Maybe String -> Maybe String -> CombatUnit -> CombatUnit -> CombatModel
withAttackResult cm outcome damage isCrit defenseNote evadeNote attacker defender =
    { cm
        | lastAttackResult =
            Just
                { outcome = outcome
                , damage = damage
                , isCrit = isCrit
                , defenseNote = defenseNote
                , evadeNote = evadeNote
                , attackerName = unitDisplayName attacker
                , defenderName = unitDisplayName defender
                }
    }


checkOverwatchAfterMove : CombatModel -> String -> CombatModel
checkOverwatchAfterMove cm movedUnitId =
    if cm.snipePrompt /= Nothing then
        cm
    else
        case findUnitById movedUnitId cm of
            Nothing ->
                cm

            Just movedUnit ->
                if movedUnit.currentHp <= 0 then
                    cm
                else
                    let
                        snipers =
                            if movedUnit.side == SidePlayer then
                                cm.enemyUnits
                            else
                                cm.playerUnits

                        eligibleSniper u =
                            case getWeapon u of
                                Just w ->
                                    w.stance == "Snipe"
                                        && u.currentHp > 0
                                        && u.snipeTriggeredRound /= cm.round
                                        && inWeaponRange w u movedUnit

                                Nothing ->
                                    False

                        maybeSniper =
                            snipers |> List.filter eligibleSniper |> List.head
                    in
                    case maybeSniper of
                        Nothing ->
                            cm

                        Just sniper ->
                            if sniper.side == SideEnemy then
                                -- 敵方狙擊：自動執行（不提示玩家）
                                let
                                    damage =
                                        25

                                    sniperWeaponIndex =
                                        sniper.currentWeaponIndex

                                    maybeWeapon =
                                        getWeapon sniper

                                    apply u =
                                        if u.id == movedUnit.id then
                                            { u | currentHp = max 0 (u.currentHp - damage) }
                                        else if u.id == sniper.id then
                                            let
                                                u2 =
                                                    { u | snipeTriggeredRound = cm.round }
                                            in
                                            maybeWeapon
                                                |> Maybe.map (spendWeaponCost sniperWeaponIndex u2)
                                                |> Maybe.withDefault u2
                                        else
                                            u
                                in
                                withAttackResult
                                    { cm
                                        | playerUnits = List.map apply cm.playerUnits
                                        , enemyUnits = List.map apply cm.enemyUnits
                                    }
                                    AttackHit
                                    damage
                                    False
                                    Nothing
                                    Nothing
                                    sniper
                                    movedUnit
                            else
                                -- 我方狙擊：提示玩家確認
                                { cm
                                    | snipePrompt =
                                        Just
                                            { sniperId = sniper.id
                                            , enemyId = movedUnit.id
                                            }
                                }


resolveSnipePrompt : Bool -> CombatModel -> CombatModel
resolveSnipePrompt doSnipe cm =
    case cm.snipePrompt of
        Nothing ->
            cm

        Just prompt ->
            let
                damage =
                    25

                maybeSniper =
                    findUnitById prompt.sniperId cm

                maybeEnemy =
                    findUnitById prompt.enemyId cm

                apply u =
                    if Just u.id == Maybe.map .id maybeEnemy then
                        if doSnipe then
                            { u | currentHp = max 0 (u.currentHp - damage) }
                        else
                            u
                    else if Just u.id == Maybe.map .id maybeSniper then
                        -- 不論是否執行狙擊，都消耗本回合觸發權，避免重複提示
                        let
                            u2 =
                                { u | snipeTriggeredRound = cm.round }
                        in
                        if doSnipe then
                            getWeapon u2 |> Maybe.map (spendWeaponCost u2.currentWeaponIndex u2) |> Maybe.withDefault u2
                        else
                            u2
                    else
                        u
            in
            if doSnipe then
                case ( maybeSniper, maybeEnemy ) of
                    ( Just sniper, Just enemy ) ->
                        withAttackResult
                            { cm
                                | playerUnits = List.map apply cm.playerUnits
                                , enemyUnits = List.map apply cm.enemyUnits
                                , snipePrompt = Nothing
                            }
                            AttackHit
                            damage
                            False
                            Nothing
                            Nothing
                            sniper
                            enemy
                    _ ->
                        { cm
                            | playerUnits = List.map apply cm.playerUnits
                            , enemyUnits = List.map apply cm.enemyUnits
                            , snipePrompt = Nothing
                        }
            else
                { cm
                    | playerUnits = List.map apply cm.playerUnits
                    , enemyUnits = List.map apply cm.enemyUnits
                    , snipePrompt = Nothing
                }


beginAttack : CombatModel -> CombatUnit -> CombatUnit -> CombatModel
beginAttack cm attacker defender =
    let
        damage =
            25

        predictedDefenderHp =
            defender.currentHp - damage

        eligibleForCounterMenu =
            case getWeapon defender of
                Just dw ->
                    predictedDefenderHp > 0
                        && inWeaponRange dw defender attacker
                        && (dw.stance == "Melee" || List.member "Counter_Expert" (Maybe.withDefault [] (Maybe.map .passiveAbilities defender.assembly.pilot)))

                Nothing ->
                    False
    in
    if eligibleForCounterMenu then
        if defender.side == SidePlayer then
            -- 被攻擊方為我方：先結算攻擊並顯示結果，關閉後再顯示反擊選單
            let
                cm2 = attackTarget cm attacker defender
                maybeDefender2 = findUnitById defender.id cm2
                stillEligible =
                    case ( maybeDefender2, getWeapon defender ) of
                        ( Just d2, Just dw ) ->
                            d2.currentHp > 0 && inWeaponRange dw d2 attacker
                        _ ->
                            False
            in
            if stillEligible then
                { cm2
                    | counterPromptAfterDismiss = Just { attackerId = attacker.id, defenderId = defender.id }
                    , pendingAttack = Just { attackerId = attacker.id, defenderId = defender.id, damage = damage }
                }
            else
                cm2
        else
            -- 被攻擊方為敵方：先結算攻擊，再自動反擊（不顯示選單）
            let
                cm2 = attackTarget cm attacker defender
                maybeDefender2 = findUnitById defender.id cm2
                stillEligible =
                    case ( maybeDefender2, getWeapon defender ) of
                        ( Just d2, Just dw ) ->
                            d2.currentHp > 0 && (inWeaponRange dw d2 attacker)
                        _ ->
                            False
                cm2WithPending =
                    { cm2
                        | pendingAttack = Just { attackerId = attacker.id, defenderId = defender.id, damage = damage }
                        , counterPrompt = Just { attackerId = attacker.id, defenderId = defender.id }
                    }
            in
            if stillEligible then
                resolvePendingAttack CounterAttack cm2WithPending
            else
                cm2
    else
        attackTarget cm attacker defender


resolvePendingAttack : CounterChoice -> CombatModel -> CombatModel
resolvePendingAttack choice cm =
    case ( cm.pendingAttack, cm.counterPrompt ) of
        ( Just pending, Just _ ) ->
            let
                maybeAttacker =
                    findUnitById pending.attackerId cm

                maybeDefender =
                    findUnitById pending.defenderId cm

                baseDamage =
                    pending.damage

                maxHpDefender =
                    maybeDefender |> Maybe.map (\d -> Lobby.finalHp d.assembly.mecha d.assembly.parts) |> Maybe.withDefault 0

                --  primary attack was already applied in attackTarget; only apply Defend/Evade heal or Attack counter
                applyChoice u =
                    if u.id == pending.defenderId then
                        case choice of
                            CounterDefend ->
                                { u | currentHp = min maxHpDefender (u.currentHp + round (0.4 * toFloat baseDamage)) }
                            CounterEvade ->
                                { u | currentHp = min maxHpDefender (u.currentHp + baseDamage) }
                            CounterAttack ->
                                u
                    else
                        u

                cmAfterChoice =
                    { cm
                        | playerUnits = List.map applyChoice cm.playerUnits
                        , enemyUnits = List.map applyChoice cm.enemyUnits
                    }

                maybeAttacker2 =
                    findUnitById pending.attackerId cmAfterChoice

                maybeDefender2 =
                    findUnitById pending.defenderId cmAfterChoice

                cmAfterCounter =
                    case ( choice, maybeAttacker2, maybeDefender2 ) of
                        ( CounterAttack, Just a2, Just d2 ) ->
                            case getWeapon d2 of
                                Just dw ->
                                    if d2.currentHp > 0 && (dw.stance == "Melee" || List.member "Counter_Expert" (Maybe.withDefault [] (Maybe.map .passiveAbilities d2.assembly.pilot))) && inWeaponRange dw d2 a2 then
                                        let
                                            defenderWeaponIndex =
                                                d2.currentWeaponIndex

                                            applyCounter u =
                                                if u.id == a2.id then
                                                    { u | currentHp = max 0 (u.currentHp - baseDamage) }
                                                else if u.id == d2.id then
                                                    spendWeaponCost defenderWeaponIndex u dw
                                                else
                                                    u
                                        in
                                        { cmAfterChoice
                                            | playerUnits = List.map applyCounter cmAfterChoice.playerUnits
                                            , enemyUnits = List.map applyCounter cmAfterChoice.enemyUnits
                                        }
                                    else
                                        cmAfterChoice

                                Nothing ->
                                    cmAfterChoice

                        _ ->
                            cmAfterChoice

                resultCm =
                    { cmAfterCounter | pendingAttack = Nothing, counterPrompt = Nothing, counterPromptAfterDismiss = Nothing }
            in
            case choice of
                CounterAttack ->
                    case ( findUnitById pending.defenderId cmAfterCounter, findUnitById pending.attackerId cmAfterCounter ) of
                        ( Just counterAttacker, Just counterDefender ) ->
                            withAttackResult resultCm AttackHit baseDamage False Nothing Nothing counterAttacker counterDefender
                        _ ->
                            resultCm
                _ ->
                    resultCm
        _ ->
            cm


attackTarget : CombatModel -> CombatUnit -> CombatUnit -> CombatModel
attackTarget cm attacker target =
    let
        damage =
            25

        attackerWeaponIndex =
            attacker.currentWeaponIndex

        attackerWeapon =
            getWeapon attacker

        updateAfterAttack u =
            if u.id == target.id then
                { u | currentHp = max 0 (u.currentHp - damage) }
            else if u.id == attacker.id then
                let
                    u2 =
                        { u | actionState = Finished }
                in
                attackerWeapon |> Maybe.map (spendWeaponCost attackerWeaponIndex u2) |> Maybe.withDefault u2
            else
                u

        cm2 =
            { cm
                | playerUnits = List.map updateAfterAttack cm.playerUnits
                , enemyUnits = List.map updateAfterAttack cm.enemyUnits
            }
    in
    withAttackResult cm2 AttackHit damage False Nothing Nothing attacker target


endTurn : CombatModel -> CombatUnit -> CombatModel
endTurn cm u =
    let
        update u2 = if u2.id == u.id then { u2 | actionState = Finished } else u2
    in
    { cm | playerUnits = List.map update cm.playerUnits, enemyUnits = List.map update cm.enemyUnits }


advanceTurn : CombatModel -> CombatModel
advanceTurn cm =
    let
        units = if cm.currentSide == SidePlayer then cm.playerUnits else cm.enemyUnits
        total = List.length units
        unitAt i = List.drop i units |> List.head
        canAct u = u.actionState /= Finished && u.currentHp > 0
        nextIdx = List.range (cm.currentUnitIndex + 1) (total - 1)
            |> List.filter (\i -> Maybe.withDefault False (Maybe.map canAct (unitAt i)))
            |> List.head
    in
    case nextIdx of
        Just i -> { cm | currentUnitIndex = i }
        Nothing -> nextSideOrRound cm


nextSideOrRound : CombatModel -> CombatModel
nextSideOrRound cm =
    let
        reset u = { u | actionState = if u.currentHp > 0 then Active else u.actionState }
    in
    if cm.currentSide == SidePlayer then
        { cm | currentSide = SideEnemy, currentUnitIndex = 0
        , playerUnits = List.map reset cm.playerUnits
        , enemyUnits = List.map reset cm.enemyUnits
        }
    else
        { cm | currentSide = SidePlayer, currentUnitIndex = 0, round = cm.round + 1
        , playerUnits = List.map reset cm.playerUnits
        , enemyUnits = List.map reset cm.enemyUnits
        }


battleResult : CombatModel -> Maybe BattleResult
battleResult cm =
    let
        playerAlive = List.any (\u -> u.currentHp > 0) cm.playerUnits
        enemyAlive = List.any (\u -> u.currentHp > 0) cm.enemyUnits
    in
    if not playerAlive then Just Defeat
    else if not enemyAlive then Just Victory
    else Nothing


advanceUntilUnitOrResult : CombatModel -> CombatModel
advanceUntilUnitOrResult cm =
    if cm.result /= Nothing then
        cm
    else
        case getCurrentUnit cm of
            Nothing ->
                advanceUntilUnitOrResult (nextSideOrRound cm)
            Just u ->
                if u.currentHp <= 0 then
                    advanceUntilUnitOrResult ((\c -> endTurn c u) cm |> advanceTurn)
                else
                    cm


-- =============================================================================
-- 敵人回合：簡單 AI — 有目標則攻擊，否則朝最近玩家移動後再判定攻擊
-- =============================================================================

runEnemyTurn : CombatModel -> CombatModel
runEnemyTurn cm =
    if cm.snipePrompt /= Nothing then
        cm
    else
    case getCurrentUnit cm of
        Nothing ->
            advanceUntilUnitOrResult cm
        Just enemy ->
            if enemy.side /= SideEnemy then
                advanceUntilUnitOrResult cm
            else if enemy.currentHp <= 0 then
                advanceUntilUnitOrResult ((\c -> endTurn c enemy) cm |> advanceTurn)
            else
                let
                    cm2 =
                        tryEnemyAttackOrMove cm
                in
                if cm2.snipePrompt /= Nothing then
                    cm2
                else
                    endCurrentEnemyAndAdvance cm2


tryEnemyAttackOrMove : CombatModel -> CombatModel
tryEnemyAttackOrMove cm =
    case getCurrentUnit cm of
        Nothing -> cm
        Just u ->
            let
                targets = targetsInRange cm u
            in
            case targets of
                t :: _ ->
                    attackTarget cm u t |> (\cm2 -> checkOverwatchAfterMove cm2 u.id)
                [] ->
                    tryEnemyMoveTowardPlayer cm u


tryEnemyMoveTowardPlayer : CombatModel -> CombatUnit -> CombatModel
tryEnemyMoveTowardPlayer cm u =
    let
        players = List.filter (\p -> p.currentHp > 0) cm.playerUnits
        reachable = reachableCells cm u
    in
    case ( players, reachable ) of
        ( [], _ ) ->
            checkOverwatchAfterMove cm u.id
        ( _, [] ) ->
            checkOverwatchAfterMove cm u.id
        ( p0 :: _, _ ) ->
            let
                best = List.map (\c -> ( c, manhattan (Tuple.first c) (Tuple.second c) p0.x p0.y )) reachable
                    |> List.sortBy Tuple.second
                    |> List.head
            in
            case best of
                Nothing -> checkOverwatchAfterMove cm u.id
                Just ( ( nx, ny ), _ ) ->
                    let
                        cm2 =
                            Maybe.withDefault cm (moveUnit cm u nx ny)
                    in
                    checkOverwatchAfterMove cm2 u.id


endCurrentEnemyAndAdvance : CombatModel -> CombatModel
endCurrentEnemyAndAdvance cm =
    case getCurrentUnit cm of
        Nothing ->
            advanceUntilUnitOrResult cm
        Just u ->
            cm
                |> (\c -> endTurn c u)
                |> advanceTurn
                |> advanceUntilUnitOrResult
