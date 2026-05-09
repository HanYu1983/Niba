package game;

import game.GameIds;

enum AnimationPayload {
  PawnMove(from:TileIndex, to:TileIndex, delta:Int);
  /** 對齊 {@link PopupPayload.MoveCompleted} 之資料（僅非 Popup 管道）。 */
  MoveCompleted(deltaSteps:Null<Int>, pawnTileIndex:TileIndex);
  Text(message:String);
}

