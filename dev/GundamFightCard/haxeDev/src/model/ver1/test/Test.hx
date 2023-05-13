package model.ver1.test;

using Lambda;

import haxe.ds.Option;
import tool.Table;
import model.ver1.game.define.Define;
import model.ver1.game.define.BaSyou;
import model.ver1.game.define.Runtime;
import model.ver1.game.define.Mark;
import model.ver1.game.define.Player;
import model.ver1.game.component.CardProtoPoolComponent;
import model.ver1.game.component.MarkComponent;
import model.ver1.game.gameComponent.Alg;
import model.ver1.game.gameComponent.Runtime;
import model.ver1.game.gameComponent.GameMark;
import model.ver1.game.gameComponent.GameCardProto;
import model.ver1.game.gameComponent.PlayRule;
import model.ver1.game.gameComponent.DrawRule;
import model.ver1.game.gameComponent.RerollRule;
import model.ver1.game.gameComponent.AttackRule;
import model.ver1.game.gameComponent.DamageRule;
import model.ver1.game.gameComponent.ReturnRule;
import model.ver1.game.entity.Context;
import model.ver1.data.CardProto_179001_01A_CH_WT007R_white;
import model.ver1.data.CardProto_179003_01A_U_BK008U_black;
import model.ver1.data.CardProto_179004_01A_CH_WT009R_white;
import model.ver1.data.CardProto_179030_11E_U_VT186R_purple;
import model.ver1.test.common.Common;

function test() {
	model.ver1.game.Game.test();
	model.ver1.game.define.BaSyou.test();
	model.ver1.game.flowComponent.FlowComponent.test();
	model.ver1.test.Test_getRuntimeText.test();
	test_getMarkEffects();
	test_constantText();
	model.ver1.data.CardProto_179030_11E_U_VT186R_purple.test();
	model.ver1.data.CardProto_179030_11E_CH_BN091N_brown.test();
	model.ver1.data.CardProto_179004_01A_CH_WT009R_white.test();
}

function test_constantText() {
	final playerId = PlayerId.A;
	final ctx = new Context();
	registerCardProto(ctx, "AddTextCardProto", new AddTextCardProto());
	registerCardProto(ctx, "OnlyConstentTextCardProto", new OnlyConstentTextCardProto());
	final card = new Card("0");
	card.protoId = "AddTextCardProto";
	final runtime = new DefaultRuntime(card.id, playerId);
	var texts = getCurrentCardProto(ctx, card.protoId).getTexts(ctx, runtime);
	if (texts.length != 1) {
		throw "確定卡的內文有1個";
	}
	switch texts[0].type {
		case Automatic(Constant):
			throw "並且不是恆常能力";
		case _:
	}
	addCard(ctx.table, (Default(PlayerId.A, TeHuTa) : BaSyouId), card);
	if (getRuntimeText(ctx).length != 0) {
		throw new haxe.Exception("但找不到那個內文，因為在手牌中只有恆常能力可發動");
	}
	card.protoId = "OnlyConstentTextCardProto";
	texts = getCurrentCardProto(ctx, card.protoId).getTexts(ctx, runtime);
	if (texts.length != 1) {
		throw "確定卡的內文有1個";
	}
	switch texts[0].type {
		case Automatic(Constant):
		case _:
			throw "並且是恆常能力";
	}
	if (getRuntimeText(ctx).length != 1) {
		throw new haxe.Exception("必須找到1個恆常能力");
	}
}

function test_getMarkEffects() {
	final ctx = new Context();
	registerCardProto(ctx, "AddTextCardProto", new AddTextCardProto());
	final card = new Card("0");
	card.protoId = "AddTextCardProto";
	addCard(ctx.table, (Default(PlayerId.A, MaintenanceArea) : BaSyouId), card);
	if (getRuntimeText(ctx).length != 2) {
		throw new haxe.Exception("必須找到2個內文");
	}
	if (getMarkEffects(ctx).length != 1) {
		throw new haxe.Exception("必須找到1個效果");
	}
	final enterFieldMark = new EnterFieldThisTurnMark('EnterFieldThisTurnMark', card.id);
	addMark(ctx, enterFieldMark);
	if (getRuntimeText(ctx).length != 2) {
		throw new haxe.Exception("還是找到2個內文");
	}
	if (getMarkEffects(ctx).length != 2) {
		throw new haxe.Exception("找到2個效果");
	}
}
