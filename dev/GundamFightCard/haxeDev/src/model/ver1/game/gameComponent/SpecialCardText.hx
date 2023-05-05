package model.ver1.game.gameComponent;

using StringTools;
using Lambda;

import model.ver1.game.define.Define;
import model.ver1.game.define.CardText;
import model.ver1.game.define.CardProto;
import model.ver1.game.define.Runtime;
import model.ver1.game.define.Require;
import model.ver1.game.define.BaSyou;
import model.ver1.game.component.CardStateComponent;
import model.ver1.game.component.TableComponent;
import model.ver1.game.component.CardProtoPoolComponent;
import model.ver1.game.gameComponent.Alg;
import model.ver1.game.gameComponent.Event;
import model.ver1.game.gameComponent.GameComponent;
import model.ver1.game.gameComponent.Runtime;

function flatSpecial(ctx:IGameComponent, cardId:String, text:CardText):Array<CardText> {
	switch (text.type) {
		case Special(HighMobility):
			return [];
		case Special(PSArmor):
			return [new PSArmorText1(text.id), new PSArmorText2(text.id + "2")];
		case Special(Quick):
			final card = getCard(ctx, cardId);
			final cardProto = getCurrentCardProto(ctx, card.protoId);
			return [cardProto.createPlayCardText({})];
		case _:
			return [text];
	}
}

class PSArmorText1 extends GameCardText {
	public function new(id:String) {
		super(id, "出場時直立");
		type = Automatic(Trigger);
	}

	public override function _onEvent(ctx:IGameComponent, event:Event, runtime:Runtime):Void {
		switch (event) {
			case CardEnter(cardId, baSyouKw, Play) if (isBa(baSyouKw) && cardId == runtime.getCardId()):
				rerollGameCard(ctx, cardId);
			case _:
		}
	}
}

class PSArmorText2 extends GameCardText {
	public function new(id:String) {
		super(id, " 進入戰場時, 下回合開始時回到手上, 當中如果和補給或供給能力的組到隊的話, 就不必回到手上");
		type = Automatic(Trigger);
	}

	public override function _onEvent(ctx:IGameComponent, event:Event, runtime:Runtime):Void {
		switch (event) {
			case CardEnter(cardId, baSyouKw, _) if (isBattleArea(baSyouKw) && cardId == runtime.getCardId()):
				getCardState(ctx, cardId).bools["回合開始時回到手上"] = true;
			case NewBattleGroup(setGroupCardIds) if (setGroupCardIds.contains(runtime.getCardId())):
				final hasSupply = getRuntimeText(ctx).filter(rt -> {
					return setGroupCardIds.contains(rt.runtime.getCardId());
				}).exists(rt -> {
					return switch (rt.text.type) {
						case Special(Supply):
							true;
						case _:
							false;
					};
				});
				if (hasSupply) {
					getCardState(ctx, runtime.getCardId()).bools["回合開始時回到手上"] = false;
				}
			case PlayerEnterTurn(playerId) if (playerId == runtime.getResponsePlayerId()):
				if (getCardState(ctx, runtime.getCardId()).bools["回合開始時回到手上"]) {
					returnToOwnerHand(ctx, runtime.getCardId());
				}
			case _:
		}
	}
}
