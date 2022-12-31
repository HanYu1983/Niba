package model.ver1.data;

using Lambda;

import haxe.Exception;
import model.ver1.game.Define;
import model.ver1.game.Timing;
import model.ver1.game.Require;
import model.ver1.game.Context;
import model.ver1.data.RequireImpl;
import model.ver1.alg.Alg;

// カードのプレイ(p.20)
class PlayerPlayCard extends CardText {
	public function new(id:String) {
		super(id, "カードのプレイ");
	}

	public override function getRequires(ctx:Context, runtime:ExecuteRuntime):Array<Require> {
		// TODO: 查詢有沒有快速
		// TODO: 查詢有沒有替代横置國力顏色的效果
		// TODO: 查詢有沒有在SET在特定卡上而減少横置國力的效果
		return [
			new RequirePhase('${id}_RequirePhase', Default(Maintenance, None, Free1)),
			new RequireGCount('${id}_RequireGCount', 3),
			new RequireGTap('${id}_RequireGTap', [Black, Black], ctx, runtime),
		];
	}

	public override function action(ctx:Context, runtime:ExecuteRuntime):Void {
		// TODO: 移到プレイされたカード(場所以外的特殊場所)
		// Unit -> 場に出る効果 -> 配置區横置
		// Command -> 內文效果 -> 解決內文並移到廢棄庫
		// Operation -> 場に出る効果 -> 配置區直立
		// 其它的移到配置區
		final cardId = runtime.getCardId();
		final responsePlayerId = runtime.getResponsePlayerId();
		final block = new Block('${id}_${Date.now()}', PlayCard(responsePlayerId, cardId), new PlayerPlayCardEffect('${id}_PlayerPlayCardEffect'));
		cutIn(ctx, block);
	}
}

private class PlayerPlayCardEffect extends CardText {
	public function new(id:String) {
		super(id, "場に出る効果");
	}

	public override function action(ctx:Context, runtime:ExecuteRuntime):Void {
		final cardId = runtime.getCardId();
		// (p.64)
		// getCardController(cardId)會等於None因為「プレイされたカード場所」是沒有控制者的
		// 所以也沒有自軍或敵軍的分別
		// 這時的自軍是指出牌的人
		playCardToField(ctx, cardId);
	}
}

// Gのプレイ(P.21)
class PlayerPlayG extends CardText {
	public function new(id:String) {
		super(id, "Gのプレイ");
	}

	public override function getRequires(ctx:Context, runtime:ExecuteRuntime):Array<Require> {
		// 必須有GSign
		return [];
	}

	public override function action(ctx:Context, runtime:ExecuteRuntime):Void {
		// 沒有出場效果，所以不會引發切入，直接出場
		// G -> 配置區倒置 (需加一個倒置卡牌的標記)
	}
}