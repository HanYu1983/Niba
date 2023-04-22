package model.ver1.data;

using Lambda;

import haxe.Exception;
import haxe.EnumTools;
import model.ver1.game.define.Define;
import model.ver1.game.define.ExecuteRuntime;
import model.ver1.game.define.Timing;
import model.ver1.game.define.Require;
import model.ver1.game.alg.Context;
import model.ver1.game.entity.Context;

class RequirePhase extends Require {
	public function new(id:String, timing:Timing) {
		super(id, "RequirePhase");
		this.timing = timing;
	}

	public final timing:Timing;

	public override function action(ctx:Context, runtime:ExecuteRuntime):Void {
		if (EnumValueTools.equals(ctx.timing, timing) == false) {
			throw new haxe.Exception('ctx.phase != this.phase: ${ctx.timing} != ${timing}');
		}
	}
}

function getRequirePhase(ctx:Context, runtime:ExecuteRuntime, timing:Timing, id:String):Require2 {
	return {
		id: id,
		description: "RequirePhase",
		type: Pending,
		action: () -> {
			if (EnumValueTools.equals(ctx.timing, timing) == false) {
				throw new haxe.Exception('ctx.phase != this.phase: ${ctx.timing} != ${timing}');
			}
		},
	}
}

class RequireGTap extends RequireUserSelectCard {
	public function new(id:String, colors:Array<GColor>, ctx:Context, runtime:ExecuteRuntime) {
		super(id, "RequireGTap");
		final responsePlayerId = runtime.getResponsePlayerId();
		final gCardIds = getPlayerGCardIds(ctx, responsePlayerId);
		final tips = gCardIds.filter(id -> {
			// final cardColors = getCardGSign(ctx, id).colors;
			// return cardColors.fold((c:GColor, a:Bool) -> {
			// 	return a || colors.contains(c);
			// }, true);

			final cardColor = switch getCardGSign(ctx, id) {
				case Default(color, _):
					color;
			}
			return colors.contains(cardColor);
		});
		this.tips = tips;
		this.lengthInclude = [2];
	}

	public override function action(ctx:Context, runtime:ExecuteRuntime):Void {
		final selectIds = ctx.memory.playerSelection.cardIds[id];
		if (selectIds == null) {
			throw new haxe.Exception("selectIds not found");
		}
		for (cardId in selectIds) {
			tapCard(ctx, cardId);
		}
	}
}

function getRequireGTap(ctx:Context, runtime:ExecuteRuntime, colors:Array<GColor>, id:String):Require2 {
	final responsePlayerId = runtime.getResponsePlayerId();
	final gCardIds = getPlayerGCardIds(ctx, responsePlayerId);
	final tips:Array<Tip<String>> = gCardIds.filter(id -> {
		// final cardColors = getCardGSign(ctx, id).colors;
		// return cardColors.fold((c:GColor, a:Bool) -> {
		// 	return a || colors.contains(c);
		// }, true);
		final cardColor = switch getCardGSign(ctx, id) {
			case Default(color, _):
				color;
		}
		return colors.contains(cardColor);
	}).map(i -> {
		return {
			value: i,
			weight: 0.0
		}
	});
	return {
		id: id,
		description: "RequireGTap",
		type: SelectCard(tips, [2]),
		action: () -> {
			final selectIds = ctx.memory.playerSelection.cardIds[id];
			if (selectIds == null) {
				throw new haxe.Exception("selectIds not found");
			}
			for (cardId in selectIds) {
				tapCard(ctx, cardId);
			}
		},
	}
}

function getRequireOpponentUnitsEnterFieldThisTurn(ctx:Context, runtime:ExecuteRuntime, id:String):Require2 {
	final thisCardId = runtime.getCardId();
	final unitsEnterFieldThisTurn = getEnterFieldThisTurnCardIds(ctx).filter(cardId -> {
		return isOpponentsCard(ctx, thisCardId, cardId);
	}).filter(cardId -> {
		return switch getCardEntityCategory(ctx, cardId) {
			case Some(Unit):
				true;
			case _:
				false;
		}
	});
	final tips:Array<Tip<String>> = unitsEnterFieldThisTurn.map(i -> {
		return {
			value: i,
			weight: 0.0,
		}
	});
	return {
		id: id,
		description: "このターン中に場に出た敵軍ユニット１枚を",
		type: SelectCard(tips, [1]),
		action: () -> {},
	}
}

class ForceTargetCard extends Require {
	public function new(id:String, description:String, selectKey:String, cardId:String) {
		super(id, description);
		this.selectKey = selectKey;
		this.cardId = cardId;
	}

	public final cardId:String;
	public final selectKey:String;

	public override function action(ctx:Context, runtime:ExecuteRuntime):Void {
		final selectCard = ctx.table.cards[cardId];
		if (selectCard == null) {
			throw new haxe.Exception('指定的卡不存在: ${cardId}');
		}
		ctx.memory.playerSelection.cardIds[this.selectKey] = [cardId];
	}
}

class RequireGCount extends Require {
	public function new(id:String, count:Int) {
		super(id, "RequireGCount");
		this.count = count;
	}

	public var count:Int;

	public override function action(ctx:Context, runtime:ExecuteRuntime):Void {
		final responsePlayerId = runtime.getResponsePlayerId();
		final gCount = getPlayerGCountForPlay(ctx, responsePlayerId);
		if (gCount < count) {
			throw new Exception('g count not enougth: ${gCount} < ${count}');
		}
	}
}

class RequireUserSelect<T> extends Require {
	public function new(id:String, description:String) {
		super(id, description);
	}

	public var tips:Array<T> = [];
	public var lengthInclude:Array<Int> = [1];
	public var responsePlayerId = RelativePlayer.You;
}

class RequireUserSelectCard extends RequireUserSelect<String> {
	public function new(id:String, description:String) {
		super(id, description);
	}

	public override function action(ctx:Context, runtime:ExecuteRuntime):Void {
		final selection = getPlayerSelectionCardId(ctx, id);
		if (lengthInclude.contains(selection.length) == false) {
			throw "select card length not right";
		}
	}
}

class RequireUserSelectBattlePoint extends RequireUserSelect<BattlePoint> {
	public function new(id:String, description:String) {
		super(id, description);
	}
}
