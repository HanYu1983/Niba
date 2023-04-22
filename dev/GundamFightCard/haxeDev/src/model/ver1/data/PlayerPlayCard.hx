package model.ver1.data;

using Lambda;

import haxe.Exception;
import model.ver1.game.define.Define;
import model.ver1.game.define.Runtime;
import model.ver1.game.define.BaSyou;
import model.ver1.game.define.Timing;
import model.ver1.game.define.Mark;
import model.ver1.game.define.Block;
import model.ver1.game.define.Require;
import model.ver1.game.define.CardText;
import model.ver1.game.define.CardProto;
import model.ver1.game.entity.Alg;
import model.ver1.game.component.Cut;
import model.ver1.data.RequireImpl;
import model.ver1.game.entity.Context;
import model.ver1.game.entity.DefaultMark;

// カードのプレイ(p.20)
class PlayerPlayCard extends CardText {
	public function new(id:String) {
		super(id, "カードのプレイ");
		this.type = Automatic(Constant);
	}

	public override function getRequires(_ctx:Any, runtime:Runtime):Array<Require> {
		final ctx = cast(_ctx, Context);
		// TODO: 查詢有沒有快速
		// TODO: 查詢有沒有替代横置國力顏色的效果
		// TODO: 查詢有沒有在SET在特定卡上而減少横置國力的效果
		final cardId = runtime.getCardId();
		switch getCardType(ctx, cardId) {
			case Character | OperationUnit:
			// TODO: require unit
			case Command:
			// TODO: text
			case _:
		}

		return [
			new RequirePhase('${id}_RequirePhase', Default(Maintenance, None, Free1)),
			new RequireGCount('${id}_RequireGCount', 3),
			new RequireGTap('${id}_RequireGTap', [Black, Black], ctx, runtime),
		];
	}

	public override function action(_ctx:Any, runtime:Runtime):Void {
		final ctx = cast(_ctx, Context);
		final cardId = runtime.getCardId();
		final responsePlayerId = runtime.getResponsePlayerId();
		final from = getCardBaSyouAndAssertExist(ctx, cardId);
		// 移到プレイされたカード
		switch getCardType(ctx, cardId) {
			case Unit | Character | Operation | OperationUnit:
				final to = BaSyou.Default(responsePlayerId, PlayedCard);
				moveCard(ctx, cardId, from, to);
				ctx.table.cards[cardId].isFaceUp = true;
			case _:
		}
		switch getCardType(ctx, cardId) {
			case Unit | Operation | Character | OperationUnit:
				final block = new Block('${id}_${Date.now()}', PlayCard(responsePlayerId, cardId), new EnterFieldEffect('${id}_PlayerPlayCardEffect'));
				cutIn(ctx, block);
			case Command:
			// Command -> 內文效果 -> 解決內文並移到廢棄庫
			case Graphic:
				final to = BaSyou.Default(responsePlayerId, GZone);
				moveCard(ctx, cardId, from, to);
			case _:
				throw new Exception("unsupport type");
		}
	}
}

private class EnterFieldEffect extends CardText {
	public function new(id:String) {
		super(id, "場に出る効果");
	}

	public override function action(_ctx:Any, runtime:Runtime):Void {
		final ctx = cast(_ctx, Context);
		// (p.64)
		// getCardController(cardId)會等於None因為「プレイされたカード場所」是沒有控制者的
		// 所以也沒有自軍或敵軍的分別
		// 這時的自軍是指出牌的人
		final cardId = runtime.getCardId();
		final responsePlayerId = runtime.getResponsePlayerId();
		final from = getCardBaSyouAndAssertExist(ctx, cardId);
		switch getCardType(ctx, cardId) {
			case Unit:
				// 移到配備區
				final to = BaSyou.Default(responsePlayerId, MaintenanceArea);
				moveCard(ctx, cardId, from, to);
				// TODO: 查詢有沒有戰鬥配備
				// 配置區横置
				ctx.table.cards[cardId].isTap = true;
				final enterFieldMark = new EnterFieldThisTurnMark('${id}_EnterFieldMark', cardId);
				ctx.marks[enterFieldMark.id] = enterFieldMark;
				sendEvent(ctx, CardEnterField(cardId));
			case Operation:
				final to = BaSyou.Default(responsePlayerId, MaintenanceArea);
				moveCard(ctx, cardId, from, to);
				// 配置區直立
				ctx.table.cards[cardId].isTap = false;
				sendEvent(ctx, CardEnterField(cardId));
			case Character:
			case OperationUnit:
			case Command:
			case _:
				throw new Exception("unsupport type");
		}
	}
}

// Gのプレイ(P.21)
class PlayerPlayG extends CardText {
	public function new(id:String) {
		super(id, "Gのプレイ");
	}

	public override function getRequires(_ctx:Any, runtime:Runtime):Array<Require> {
		// TODO: 必須有GSign
		return [];
	}

	public override function action(_ctx:Any, runtime:Runtime):Void {
		final ctx = cast(_ctx, Context);
		// 沒有出場效果，所以不會引發切入，直接出場
		final cardId = runtime.getCardId();
		final responsePlayerId = runtime.getResponsePlayerId();
		final from = getCardBaSyouAndAssertExist(ctx, cardId);
		final to = BaSyou.Default(responsePlayerId, GZone);
		// 倒置
		ctx.table.cards[cardId].isReverse = true;
		moveCard(ctx, cardId, from, to);
	}
}
