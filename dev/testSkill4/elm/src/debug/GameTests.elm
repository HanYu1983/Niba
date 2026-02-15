module Debug.GameTests exposing (runTests)

import Board exposing (CellContent(..), Position, aiCastlePos, cellAt, playerCastlePos, positionEquals)
import Game exposing (GameState, applyAIMove, applyPlayerMove, init, protectedPositions, shieldedPositions)
import Rules exposing (horseLegalMoves)


runTests : List String
runTests =
    horseMoveStateTests ++ castleAttackHpTests


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
