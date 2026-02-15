module Debug.GameTests exposing (runTests)

import Board exposing (CellContent(..), Position, Side(..), aiCastlePos, cellAt, playerCastlePos, positionEquals)
import Game exposing (GameState, applyAIMove, applyPlayerMove, expectedCastleHpLogLines, init, protectedPositions, shieldedPositions)
import Items exposing (Item(..), applyBomb, applyLaser, applyShield, cost)
import Rules exposing (horseLegalMoves)


runTests : List String
runTests =
    horseMoveStateTests ++ castleAttackHpTests ++ shieldNoDoubleTests ++ itemDeductsScoreTests ++ castleHpLogTests


{-| 馬點擊移動後狀態與畫面顯示驗證：

  **畫面邏輯**：Main.view 傳 model.gameState.board 給 BoardView.view；
  每個格子用 Board.cellAt board pos 決定內容，Piece Player -> 顯示「馬」。
  因此只要 board.playerPieces 含 (2,1)，cellAt (2,1) 就會是 Piece Player，該格會顯示馬。

  **測試**：
  - 從 (0,0) 選馬、合法格含 (2,1)/(1,2)
  - 執行 applyPlayerMove 到 (2,1) 後，狀態應正確且 cellAt (2,1) 為 Piece Player（畫面上會顯示馬）
  - 若測試通過但畫面仍無馬：表示 update 回傳的 model 或 view 的 diff 有問題，Main 已用 boardKey 強制重繪棋盤。
-}
horseMoveStateTests : List String
horseMoveStateTests =
    let
        state0 : GameState
        state0 =
            init

        from00 : Position
        from00 =
            { row = 0, col = 0 }

        to21 : Position
        to21 =
            { row = 2, col = 1 }

        to12 : Position
        to12 =
            { row = 1, col = 2 }

        prot =
            protectedPositions state0

        sh =
            shieldedPositions state0

        legal =
            horseLegalMoves state0.board from00 prot sh

        has21 =
            List.any (positionEquals to21) legal

        has12 =
            List.any (positionEquals to12) legal

        moveResult =
            applyPlayerMove state0 from00 to21
    in
    []
        ++ (if not has21 then
                [ "測試失敗: 馬從 (0,0) 合法格應包含 (2,1)" ]
            else
                []
           )
        ++ (if not has12 then
                [ "測試失敗: 馬從 (0,0) 合法格應包含 (1,2)" ]
            else
                []
           )
        ++ (case moveResult of
                Err e ->
                    [ "測試失敗: 點擊目的地 (2,1) 後 applyPlayerMove 應成功，錯誤: " ++ e ]

                Ok state1 ->
                    []
                        ++ (if not (List.any (positionEquals to21) state1.board.playerPieces) then
                                [ "測試失敗: 放置後 playerPieces 應包含 (2,1)" ]
                            else
                                []
                           )
                        ++ (if not (List.any (positionEquals from00) state1.board.playerPieces) then
                                [ "測試失敗: 放置後 playerPieces 應仍包含起點 (0,0)" ]
                            else
                                []
                           )
                        ++ (if state1.currentSide /= Board.AI then
                                [ "測試失敗: 放置後 currentSide 應為 AI" ]
                            else
                                []
                           )
                        ++ (if cellAt state1.board to21 /= Piece Board.Player then
                                [ "測試失敗: 放置後 cellAt (2,1) 應為 Piece Player，畫面才會顯示馬" ]
                            else
                                []
                           )
           )


{-| 雙方主堡被攻擊時僅扣 HP（扣 3），不佔領、不吃子；驗證攻擊前後 HP 與棋盤不變。
-}
castleAttackHpTests : List String
castleAttackHpTests =
    playerAttacksAiCastleTests ++ aiAttacksPlayerCastleTests


{-| 玩家攻擊 AI 主堡：攻擊前 aiCastleHp=20，攻擊後 aiCastleHp=17，棋盤不變、主堡仍在 (9,9)。
-}
playerAttacksAiCastleTests : List String
playerAttacksAiCastleTests =
    let
        from78 : Position
        from78 =
            { row = 7, col = 8 }

        castlePos : Position
        castlePos =
            aiCastlePos

        baseBoard = init.board
        stateBefore : GameState
        stateBefore =
            { init
                | board = { baseBoard | playerPieces = [ from78 ], aiPieces = [] }
            }

        hpBefore = stateBefore.aiCastleHp
        moveResult = applyPlayerMove stateBefore from78 castlePos
    in
    (if hpBefore /= 20 then
        [ "測試失敗(玩家攻AI堡): 攻擊前 aiCastleHp 應為 20，實際 " ++ String.fromInt hpBefore ]
     else
        []
    )
        ++ (case moveResult of
                Err e ->
                    [ "測試失敗(玩家攻AI堡): applyPlayerMove 應成功，錯誤: " ++ e ]

                Ok stateAfter ->
                    []
                        ++ (if stateAfter.aiCastleHp /= 17 then
                                [ "測試失敗(玩家攻AI堡): 攻擊後 aiCastleHp 應為 17，實際 " ++ String.fromInt stateAfter.aiCastleHp ]
                            else
                                []
                           )
                        ++ (if stateAfter.board.playerPieces /= [ from78 ] then
                                [ "測試失敗(玩家攻AI堡): 攻擊後 playerPieces 應不變(不佔領)" ]
                            else
                                []
                           )
                        ++ (if stateAfter.board.aiPieces /= [] then
                                [ "測試失敗(玩家攻AI堡): 攻擊後 aiPieces 應不變" ]
                            else
                                []
                           )
                        ++ (if cellAt stateAfter.board castlePos /= Castle Board.AI then
                                [ "測試失敗(玩家攻AI堡): 攻擊後 (9,9) 應仍為 Castle AI" ]
                            else
                                []
                           )
           )


{-| AI 攻擊玩家主堡：攻擊前 playerCastleHp=20，攻擊後 playerCastleHp=17，棋盤不變、主堡仍在 (0,0)。
-}
aiAttacksPlayerCastleTests : List String
aiAttacksPlayerCastleTests =
    let
        from30 : Position
        from30 =
            { row = 3, col = 0 }

        screen10 : Position
        screen10 =
            { row = 1, col = 0 }

        castlePos : Position
        castlePos =
            playerCastlePos

        baseBoard2 = init.board
        stateBefore : GameState
        stateBefore =
            { init
                | currentSide = Board.AI
                , board = { baseBoard2 | playerPieces = [], aiPieces = [ from30, screen10 ] }
            }

        hpBefore = stateBefore.playerCastleHp
        moveResult = applyAIMove stateBefore from30 castlePos
    in
    (if hpBefore /= 20 then
        [ "測試失敗(AI攻玩家堡): 攻擊前 playerCastleHp 應為 20，實際 " ++ String.fromInt hpBefore ]
     else
        []
    )
        ++ (case moveResult of
                Err e ->
                    [ "測試失敗(AI攻玩家堡): applyAIMove 應成功，錯誤: " ++ e ]

                Ok stateAfter ->
                    []
                        ++ (if stateAfter.playerCastleHp /= 17 then
                                [ "測試失敗(AI攻玩家堡): 攻擊後 playerCastleHp 應為 17，實際 " ++ String.fromInt stateAfter.playerCastleHp ]
                            else
                                []
                           )
                        ++ (if stateAfter.board.playerPieces /= [] then
                                [ "測試失敗(AI攻玩家堡): 攻擊後 playerPieces 應不變(不佔領)" ]
                            else
                                []
                           )
                        ++ (if stateAfter.board.aiPieces /= [ from30, screen10 ] then
                                [ "測試失敗(AI攻玩家堡): 攻擊後 aiPieces 應不變" ]
                            else
                                []
                           )
                        ++ (if cellAt stateAfter.board castlePos /= Castle Board.Player then
                                [ "測試失敗(AI攻玩家堡): 攻擊後 (0,0) 應仍為 Castle Player" ]
                            else
                                []
                           )
           )


{-| 一個棋子的護盾在消失前不能再使用護盾於同一個棋子。
-}
shieldNoDoubleTests : List String
shieldNoDoubleTests =
    let
        from00 : Position
        from00 =
            { row = 0, col = 0 }

        to21 : Position
        to21 =
            { row = 2, col = 1 }

        state1Result =
            applyPlayerMove init from00 to21

        state2Result =
            state1Result
                |> Result.andThen (\s1 -> applyShield s1 Player to21)

        secondShieldResult =
            state2Result
                |> Result.andThen (\s2 -> applyShield s2 Player to21)
    in
    (case state2Result of
        Err _ ->
            [ "測試失敗(護盾不可重複): 第一次對 (2,1) 使用護盾應成功" ]

        Ok _ ->
            []
    )
        ++ (case secondShieldResult of
                Ok _ ->
                    [ "測試失敗(護盾不可重複): 同一格已有護盾時再使用護盾應失敗" ]

                Err _ ->
                    []
           )


{-| 使用道具時會扣分（炸彈 3、雷射 4、護盾 2）。
-}
itemDeductsScoreTests : List String
itemDeductsScoreTests =
    let
        initial = init.playerScore

        bombTests =
            let
                aiPiecePos = { row = 7, col = 9 }
                baseBoard = init.board
                stateWithAiPiece =
                    { init
                        | board = { baseBoard | aiPieces = [ aiPiecePos ] }
                    }
                result = applyBomb stateWithAiPiece Player aiPiecePos
            in
            case result of
                Err e ->
                    [ "測試失敗(道具扣分-炸彈): applyBomb 應成功，錯誤: " ++ e ]

                Ok s ->
                    if s.playerScore /= initial - cost Bomb then
                        [ "測試失敗(道具扣分-炸彈): 玩家分數應為 " ++ String.fromInt (initial - cost Bomb) ++ "，實際 " ++ String.fromInt s.playerScore ]
                    else
                        []

        laserTests =
            let
                result = applyLaser init Player True 0
            in
            case result of
                Err e ->
                    [ "測試失敗(道具扣分-雷射): applyLaser 應成功，錯誤: " ++ e ]

                Ok s ->
                    if s.playerScore /= initial - cost Laser then
                        [ "測試失敗(道具扣分-雷射): 玩家分數應為 " ++ String.fromInt (initial - cost Laser) ++ "，實際 " ++ String.fromInt s.playerScore ]
                    else
                        []

        shieldTests =
            let
                to21 = { row = 2, col = 1 }
                state1Result = applyPlayerMove init { row = 0, col = 0 } to21
                shieldResult = state1Result |> Result.andThen (\s -> applyShield s Player to21)
            in
            case shieldResult of
                Err e ->
                    [ "測試失敗(道具扣分-護盾): applyShield 應成功，錯誤: " ++ e ]

                Ok s ->
                    if s.playerScore /= initial - cost Shield then
                        [ "測試失敗(道具扣分-護盾): 玩家分數應為 " ++ String.fromInt (initial - cost Shield) ++ "，實際 " ++ String.fromInt s.playerScore ]
                    else
                        []
    in
    bombTests ++ laserTests ++ shieldTests


{-| 主堡 HP 扣減時應寫入 LOG：驗證 expectedCastleHpLogLines 與實際攻擊後狀態。
-}
castleHpLogTests : List String
castleHpLogTests =
    expectedCastleHpLogLinesUnitTests
        ++ castleHpLogWhenPlayerAttacksAiCastleTests
        ++ castleHpLogWhenAiAttacksPlayerCastleTests
        ++ castleHpLogWhenItemHitsCastleTests


expectedCastleHpLogLinesUnitTests : List String
expectedCastleHpLogLinesUnitTests =
    let
        s0 = init
        playerHpDown =
            expectedCastleHpLogLines s0 { s0 | playerCastleHp = 17 }
        aiHpDown =
            expectedCastleHpLogLines s0 { s0 | aiCastleHp = 17 }
        bothDown =
            expectedCastleHpLogLines s0 { s0 | playerCastleHp = 17, aiCastleHp = 14 }
        noChange =
            expectedCastleHpLogLines s0 s0
    in
    (if playerHpDown /= [ "玩家主堡受攻擊 HP 20→17" ] then
        [ "測試失敗(主堡LOG): 玩家主堡扣3應得一行「玩家主堡受攻擊 HP 20→17」，實際 " ++ String.join "; " playerHpDown ]
     else
        []
    )
        ++ (if aiHpDown /= [ "AI主堡受攻擊 HP 20→17" ] then
                [ "測試失敗(主堡LOG): AI主堡扣3應得一行「AI主堡受攻擊 HP 20→17」，實際 " ++ String.join "; " aiHpDown ]
            else
                []
           )
        ++ (if List.length bothDown /= 2 || not (List.member "玩家主堡受攻擊 HP 20→17" bothDown) || not (List.member "AI主堡受攻擊 HP 20→14" bothDown) then
                [ "測試失敗(主堡LOG): 雙方主堡都扣時應得兩行（玩家 20→17、AI 20→14），實際 " ++ String.join "; " bothDown ]
            else
                []
           )
        ++ (if not (List.isEmpty noChange) then
                [ "測試失敗(主堡LOG): HP 無變化時應無 LOG，實際 " ++ String.join "; " noChange ]
            else
                []
           )


castleHpLogWhenPlayerAttacksAiCastleTests : List String
castleHpLogWhenPlayerAttacksAiCastleTests =
    let
        from78 = { row = 7, col = 8 }
        baseBoard = init.board
        stateBefore =
            { init
                | board = { baseBoard | playerPieces = [ from78 ], aiPieces = [] }
            }
        moveResult = applyPlayerMove stateBefore from78 aiCastlePos
        lines =
            moveResult
                |> Result.map (\stateAfter -> expectedCastleHpLogLines stateBefore stateAfter)
                |> Result.withDefault []
    in
    case moveResult of
        Err e ->
            [ "測試失敗(主堡LOG-玩家攻AI堡): applyPlayerMove 應成功，錯誤: " ++ e ]

        Ok stateAfter ->
            (if stateBefore.aiCastleHp /= 20 then
                [ "測試失敗(主堡LOG-玩家攻AI堡): 攻擊前 aiCastleHp 應為 20" ]
             else
                []
            )
                ++ (if stateAfter.aiCastleHp /= 17 then
                        [ "測試失敗(主堡LOG-玩家攻AI堡): 攻擊後 aiCastleHp 應為 17" ]
                    else
                        []
                   )
                ++ (if not (List.member "AI主堡受攻擊 HP 20→17" lines) then
                        [ "測試失敗(主堡LOG-玩家攻AI堡): LOG 應含「AI主堡受攻擊 HP 20→17」，實際 " ++ String.join "; " lines ]
                    else
                        []
                   )


castleHpLogWhenAiAttacksPlayerCastleTests : List String
castleHpLogWhenAiAttacksPlayerCastleTests =
    let
        from30 = { row = 3, col = 0 }
        screen10 = { row = 1, col = 0 }
        baseBoard2 = init.board
        stateBefore =
            { init
                | currentSide = Board.AI
                , board = { baseBoard2 | playerPieces = [], aiPieces = [ from30, screen10 ] }
            }
        moveResult = applyAIMove stateBefore from30 playerCastlePos
        lines =
            moveResult
                |> Result.map (\stateAfter -> expectedCastleHpLogLines stateBefore stateAfter)
                |> Result.withDefault []
    in
    case moveResult of
        Err e ->
            [ "測試失敗(主堡LOG-AI攻玩家堡): applyAIMove 應成功，錯誤: " ++ e ]

        Ok stateAfter ->
            (if stateBefore.playerCastleHp /= 20 then
                [ "測試失敗(主堡LOG-AI攻玩家堡): 攻擊前 playerCastleHp 應為 20" ]
             else
                []
            )
                ++ (if stateAfter.playerCastleHp /= 17 then
                        [ "測試失敗(主堡LOG-AI攻玩家堡): 攻擊後 playerCastleHp 應為 17" ]
                    else
                        []
                   )
                ++ (if not (List.member "玩家主堡受攻擊 HP 20→17" lines) then
                        [ "測試失敗(主堡LOG-AI攻玩家堡): LOG 應含「玩家主堡受攻擊 HP 20→17」，實際 " ++ String.join "; " lines ]
                    else
                        []
                   )


castleHpLogWhenItemHitsCastleTests : List String
castleHpLogWhenItemHitsCastleTests =
    let
        {- 炸彈中心 (8,9)：範圍含 (9,9)=aiCastlePos，會扣 AI 主堡 HP -}
        bombCenter = { row = 8, col = 9 }
        baseBoard = init.board
        stateBefore =
            { init
                | board = { baseBoard | aiPieces = [ bombCenter ] }
            }
        bombResult = applyBomb stateBefore Board.Player bombCenter
        linesBomb =
            bombResult
                |> Result.map (\s -> expectedCastleHpLogLines stateBefore s)
                |> Result.withDefault []
    in
    case bombResult of
        Err e ->
            [ "測試失敗(主堡LOG-道具炸堡): 炸彈應成功，錯誤: " ++ e ]

        Ok s ->
            if not (List.member "AI主堡受攻擊 HP 20→17" linesBomb) then
                [ "測試失敗(主堡LOG-道具炸堡): 炸彈範圍含 AI 主堡時 LOG 應含「AI主堡受攻擊 HP 20→17」，實際 " ++ String.join "; " linesBomb ]
            else if s.aiCastleHp /= 17 then
                [ "測試失敗(主堡LOG-道具炸堡): 攻擊後 aiCastleHp 應為 17" ]
            else
                []
