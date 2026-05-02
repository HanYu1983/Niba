package debug;

import game.GameIds;
import game.IJiCeStagingPreviewRow;

class SimpleJiCeStagingPreviewRow implements IJiCeStagingPreviewRow {
  var _generalId:GeneralId;
  var _description:String;
  var _loss:Int;

  public function new(generalId:GeneralId, description:String, predictedTroopLoss:Int) {
    _generalId = generalId;
    _description = description;
    _loss = predictedTroopLoss;
  }

  public function generalId():GeneralId
    return _generalId;

  public function outcomeDescription():String
    return _description;

  public function predictedTroopLoss():Int
    return _loss;
}
