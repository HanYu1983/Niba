package model.ver1.game;

import haxe.EnumTools;
import model.ver1.game.Define;

class RequireUserSelect<T> extends Require {
	public function new(id:String, description:String) {
		super(id, description);
	}

	public var tips:Array<T> = [];
	public var lengthInclude:Array<Int> = [1];
	public var responsePlayerId = RelativePlayer.You;
}

class RequirePhase extends Require {
	public function new(id:String, description:String, phase:Phase) {
		super(id, description);
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
class RequireG extends RequireUserSelect<String> {
	public function new(id:String, description:String, colors:Array<GColor>, ctx:Context, runtime:ExecuteRuntime) {
		super(id, description);
		trace("查G的ID");
		this.tips = ["0", "1"];
	}

	public override function action(ctx:Context, runtime:ExecuteRuntime):Void {
		// final select = runtime.getSelectedCard(this.id);
		// if (select == null) {
		// 	throw new haxe.Exception("還沒選好牌");
		// }
		// trace("横置選中的卡");
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
