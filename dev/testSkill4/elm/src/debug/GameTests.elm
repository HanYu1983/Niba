module Debug.GameTests exposing (runTests)

import Board exposing (CellContent(..), Position, cellAt, positionEquals)
import Game exposing (GameState, applyPlayerMove, init, protectedPositions, shieldedPositions)
import Rules exposing (horseLegalMoves)


runTests : List String
runTests =
    horseMoveStateTests


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
