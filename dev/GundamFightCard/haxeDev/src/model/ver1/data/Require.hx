package model.ver1.data;

using Lambda;

import haxe.Exception;
import haxe.EnumTools;
import model.ver1.game.Define;
import model.ver1.alg.Alg;

class RequirePhase extends Require {
	public function new(id:String, phase:Phase) {
		super(id, "RequirePhase");
		this.phase = phase;
	}

	public final phase:Phase;

	public override function action(ctx:Context, runtime:ExecuteRuntime):Void {
		if (EnumValueTools.equals(ctx.phase, phase) == false) {
			throw new haxe.Exception('ctx.phase != this.phase: ${ctx.phase} != ${phase}');
		}
	}
}

@:nullSafety
class RequireGTap extends RequireUserSelectCard {
	public function new(id:String, colors:Array<GColor>, ctx:Context, runtime:ExecuteRuntime) {
		super(id, "RequireGTap");
		final responsePlayerId = runtime.getResponsePlayerId();
		final gCardIds = getPlayerGCardIds(ctx, responsePlayerId);
		final tips = gCardIds.filter(id -> {
			final cardColors = getCardGSign(ctx, id).colors;
			return cardColors.fold((c:GColor, a:Bool) -> {
				return a || colors.contains(c);
			}, true);
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

@:nullSafety
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

	@:s public var count:Int;

	public override function action(ctx:Context, runtime:ExecuteRuntime):Void {
		final responsePlayerId = runtime.getResponsePlayerId();
		final gCount = getPlayerGCountForPlay(ctx, responsePlayerId);
		if (gCount < count) {
			throw new Exception('g count not enougth: ${gCount} < ${count}');
		}
	}
}
