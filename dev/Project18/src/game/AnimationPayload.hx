package game;

import game.GameIds;

enum AnimationPayload {
  PawnMove(from:TileIndex, to:TileIndex, delta:Int);
  Text(message:String);
}

