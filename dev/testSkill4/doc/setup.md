# 棋盤初始化範例

## 1. 座標系定義
- 使用 0 到 9 的行列索引。
- 座標格式： (row, col)
- 建議顯示時以 (行, 列) 表示。

## 2. 主堡位置範例
- 玩家主堡： (0, 0)
- AI 主堡： (9, 9)

## 3. 初始棋子狀態
- 僅放置兩座主堡，不放置其他棋子。
- 分數：玩家 0 分，AI 0 分。
- 回合數：1
- 當前行動方：玩家

## 4. 初始化資料範例（JSON 風格）
```
{
  "boardSize": 10,
  "playerCastle": { "row": 0, "col": 0 },
  "aiCastle": { "row": 9, "col": 9 },
  "playerPieces": [{ "row": 0, "col": 0 }],
  "aiPieces": [{ "row": 9, "col": 9 }],
  "playerScore": 0,
  "aiScore": 0,
  "turn": 1,
  "currentSide": "player",
  "protectedCells": []
}
```
