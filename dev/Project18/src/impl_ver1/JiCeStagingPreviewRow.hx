package impl_ver1;

import game.GameIds;
import game.IJiCeStagingPreviewRow;

class JiCeStagingPreviewRow implements IJiCeStagingPreviewRow {
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
