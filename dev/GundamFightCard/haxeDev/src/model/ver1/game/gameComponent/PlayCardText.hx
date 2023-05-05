package model.ver1.game.gameComponent;

import haxe.ds.Option;
import haxe.Exception;
import model.ver1.game.define.Define;
import model.ver1.game.define.CardText;
import model.ver1.game.define.Runtime;
import model.ver1.game.define.Require;
import model.ver1.game.define.CardProto;
import model.ver1.game.define.Effect;
import model.ver1.game.define.BaSyou;
import model.ver1.game.component.CutComponent;
import model.ver1.game.component.TableComponent;
import model.ver1.game.component.PlayerStateComponent;
import model.ver1.game.gameComponent.GameComponent;
import model.ver1.game.gameComponent.GameCardText;
import model.ver1.game.gameComponent.Alg;

class PlayUnitEffect extends GameCardText {
	public var baSyouOption:Option<BaSyou> = None;

	override function _action(ctx:IGameComponent, runtime:Runtime):Void {
		final baSyou = switch (baSyouOption) {
			case Some(baSyou):
				baSyou;
			case _:
				throw new haxe.Exception("baSyou not found");
		}
		final from = getCardBaSyouAndAssertExist(ctx, runtime.getCardId());
		moveCard(ctx, runtime.getCardId(), from, baSyou);
	}
}

class PlayPilotEffect extends GameCardText {
	var baSyouOption:Option<BaSyou> = None;
	var unitCardIdOption:Option<String> = None;

	override function _action(ctx:IGameComponent, runtime:Runtime):Void {
		switch (baSyouOption) {
			case Some(baSyou):
				final from = getCardBaSyouAndAssertExist(ctx, runtime.getCardId());
				moveCard(ctx, runtime.getCardId(), from, baSyou);
			case _:
		}
		switch (unitCardIdOption) {
			case Some(unitCardId):
				final to = getCardBaSyouAndAssertExist(ctx, unitCardId);
				final from = getCardBaSyouAndAssertExist(ctx, runtime.getCardId());
				moveCard(ctx, runtime.getCardId(), from, to);
			case _:
		}
		throw new haxe.Exception("baSyou and unitCardId not found");
	}
}

class PlayUnitRule extends GameCardText {
	var rollCost:RollCost;

	public function new(id:String) {
		super(id, "PlayUnitRule", PlayCard(Relative(You, Maintenance)));
	}

	override function _getRequires2(ctx:IGameComponent, runtime:Runtime):Array<Require2> {
		return [createRequireRollCost(rollCost, {})];
	}

	override function _action(ctx:IGameComponent, runtime:Runtime):Void {
		// 移到PlayedCard區, 這個區的牌是康牌的對象
		final to = BaSyou.Default(runtime.getResponsePlayerId(), PlayedCard);
		final from = getCardBaSyouAndAssertExist(ctx, runtime.getCardId());
		moveCard(ctx, runtime.getCardId(), from, to);
		// 推入場出的效果
		final playUnitEffect = new PlayUnitEffect("", "", System);
		playUnitEffect.baSyouOption = Some(BaSyou.Default(runtime.getResponsePlayerId(), MaintenanceArea));
		final block = new Effect(getSubKey(0), PlayCard(runtime.getResponsePlayerId(), runtime.getCardId()), playUnitEffect);
		cutIn(ctx, block);
	}
}

class PlayGRule extends GameCardText {
	public function new(id:String) {
		super(id, "PlayGRule", PlayCard(Relative(You, Maintenance)));
	}

	override function _getRequires2(ctx:IGameComponent, runtime:Runtime):Array<Require2> {
		return [
			{
				id: id,
				description: "還沒下G",
				type: Pending,
				player: You,
				action: () -> {
					if (getPlayerState(ctx, runtime.getResponsePlayerId()).hasPlayG) {
						throw new haxe.Exception("has Play G");
					}
				},
			}
		];
	}

	override function _action(ctx:IGameComponent, runtime:Runtime):Void {
		getPlayerState(ctx, runtime.getResponsePlayerId()).hasPlayG = true;
		final from = getCardBaSyouAndAssertExist(ctx, runtime.getCardId());
		final to = BaSyou.Default(runtime.getResponsePlayerId(), GZone);
		moveCard(ctx, runtime.getCardId(), from, to);
	}
}

class PlayCommandEffect extends GameCardText {
	override function _action(ctx:IGameComponent, runtime:Runtime):Void {
		// 解決指令效果
		_commandEffectImpl(ctx, runtime);
		// 移到廢棄庫
		final to = BaSyou.Default(runtime.getResponsePlayerId(), JunkYard);
		final from = getCardBaSyouAndAssertExist(ctx, runtime.getCardId());
		moveCard(ctx, runtime.getCardId(), from, to);
	}

	function _commandEffectImpl(ctx:IGameComponent, runtime:Runtime):Void {}
}

class PlayCommandRule extends GameCardText {
	var rollCost:RollCost;
	var commandEffect:CardText;

	public function new(id:String) {
		super(id, "PlayCommandRule", PlayCard(Relative(You, Maintenance)));
	}

	override function _getRequires2(ctx:IGameComponent, runtime:Runtime):Array<Require2> {
		return [createRequireRollCost(rollCost, {})];
	}

	override function _action(ctx:IGameComponent, runtime:Runtime):Void {
		final block = new Effect(getSubKey(0), PlayCard(runtime.getResponsePlayerId(), runtime.getCardId()), commandEffect);
		cutIn(ctx, block);
	}
}

function createPlayCardText(cardProto:CardProto, options:{}):CardText {
	return new PlayUnitRule("");
}
