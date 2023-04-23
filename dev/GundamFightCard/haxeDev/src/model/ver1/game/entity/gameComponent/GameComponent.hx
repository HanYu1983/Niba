package model.ver1.game.entity.gameComponent;

import tool.Table;
import model.ver1.game.component.CutComponent;
import model.ver1.game.component.BlockComponent;
import model.ver1.game.component.CardProtoPoolComponent;
import model.ver1.game.component.SelectionComponent;
import model.ver1.game.component.MarkComponent;
import model.ver1.game.component.TimingComponent;

interface IGameComponent extends ICutComponent extends IBlockComponent extends ICardProtoPoolComponent extends ISelectionComponent extends IMarkComponent extends ITimingComponent {
	var playersOrder:Array<String>;
	var table:Table;
	var activePlayerId:String;
}
