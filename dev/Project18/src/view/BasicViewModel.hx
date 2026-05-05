package view;

import game.GameIds;
import game.IBoard;
import game.IGameMatch;
import game.IJiCe;
import game.IJiCeMovementStepHook;
import game.IJiCeStagingPreviewRow;
import game.IMonarch;
import game.IPlayer;
import game.IPlayerMenu;
import game.ITile;
import game.ITileEvent;
import game.MatchTerminationReason;

/**
 * 最小可用的 ViewModel 包裝：直接委派到底層 IGameMatch（以便快速把 HTML view 跑起來）。
 */
class BasicViewModel implements IViewModel {
  final match:IGameMatch;

  public function new(match:IGameMatch) {
    this.match = match;
  }

  public function dispose():Void {}

  public function board():IBoard
    return match.board();

  public function monarchs():Array<IMonarch>
    return match.monarchs();

  public function activeMonarch():IMonarch
    return match.activeMonarch();

  public function monarchById(monarchId:MonarchId):IMonarch
    return match.monarchById(monarchId);

  public function pawnIndexOfPlayer(player:IPlayer):TileIndex
    return match.pawnIndexOfPlayer(player);

  public function pawnIndexOfMonarch(monarchId:MonarchId):TileIndex
    return match.pawnIndexOfMonarch(monarchId);

  public function tileAt(index:TileIndex):ITile
    return match.tileAt(index);

  public function availableJiCe(monarchId:MonarchId):Array<IJiCe>
    return match.availableJiCe(monarchId);

  public function isActivePlayerSliceComplete():Bool
    return match.isActivePlayerSliceComplete();

  public function getTerminationReason():MatchTerminationReason
    return match.getTerminationReason();

  public function movementStepHooks():Array<IJiCeMovementStepHook>
    return match.movementStepHooks();

  public function forceGetPendingTileEvent():Null<ITileEvent>
    return match.forceGetPendingTileEvent();

  public function forceGetPendingJiCe():Null<IJiCe>
    return match.forceGetPendingJiCe();

  public function forceJiCeStagingPreviewRows():Array<IJiCeStagingPreviewRow>
    return match.forceJiCeStagingPreviewRows();

  public function cityVacantNoGarrison(at:TileIndex):Bool
    return match.cityVacantNoGarrison(at);

  public function forceGetPendingEmptyCityOccupyTile():Null<TileIndex>
    return match.forceGetPendingEmptyCityOccupyTile();

  public function forceGetCityStoredTroops(at:TileIndex):Int
    return match.forceGetCityStoredTroops(at);

  public function forceGetCityStoredGrain(at:TileIndex):Int
    return match.forceGetCityStoredGrain(at);

  public function forceGetCityGarrisonGeneralIds(at:TileIndex):Array<GeneralId>
    return match.forceGetCityGarrisonGeneralIds(at);

  public function forceGetPendingFriendlyCityVisitTile():Null<TileIndex>
    return match.forceGetPendingFriendlyCityVisitTile();

  public function forceGetPendingHostileCityTile():Null<TileIndex>
    return match.forceGetPendingHostileCityTile();

  public function forceGetHostileCityFlowPhase():Null<String>
    return match.forceGetHostileCityFlowPhase();

  public function forceGetHostileCitySettlementSummary():Null<String>
    return match.forceGetHostileCitySettlementSummary();

  public function cityOwnedByActiveMonarch(at:TileIndex):Bool
    return match.cityOwnedByActiveMonarch(at);

  public function createPlayerMenu(actor:IPlayer):IPlayerMenu
    return match.createPlayerMenu(actor);
}

