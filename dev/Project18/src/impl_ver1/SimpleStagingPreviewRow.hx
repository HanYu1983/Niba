package impl_ver1;

import game.GameIds;
import game.IJiCeStagingPreviewRow;

/** 非計策也可用的最小預覽列實作。 */
class SimpleStagingPreviewRow implements IJiCeStagingPreviewRow {
  var _generalId:GeneralId;
  var _desc:String;
  var _loss:Int;

  public function new(generalId:GeneralId, desc:String, predictedTroopLoss:Int = 0) {
    _generalId = generalId;
    _desc = desc;
    _loss = predictedTroopLoss;
  }

  public function generalId():GeneralId
    return _generalId;

  public function outcomeDescription():String
    return _desc;

  public function predictedTroopLoss():Int
    return _loss;
}

