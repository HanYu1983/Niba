package model.ver1.test;

using Lambda;

import haxe.ds.Option;
import tool.Table;
import model.ver1.game.define.Define;
import model.ver1.game.define.BaSyou;
import model.ver1.game.define.ExecuteRuntimeImpl;
import model.ver1.game.alg.Context;
import model.ver1.game.alg.CardProto;
import model.ver1.game.alg.Runtime;
import model.ver1.test.common.Common;
import model.ver1.data.CardProto_179001_01A_CH_WT007R_white;
import model.ver1.data.CardProto_179003_01A_U_BK008U_black;
import model.ver1.data.CardProto_179004_01A_CH_WT009R_white;
import model.ver1.data.CardProto_179030_11E_U_VT186R_purple;

function test() {
	model.ver1.game.Game.test();
	model.ver1.game.define.BaSyou.test();
	model.ver1.test.Test_getRuntimeText.test();
	test_getMarkEffects();
	test_constantText();
	model.ver1.data.CardProto_179030_11E_U_VT186R_purple.test();
}

function test_constantText() {
	final playerId = "0";
	final ctx = new Context();
	registerCardProto(ctx, "AddTextCardProto", new AddTextCardProto());
	registerCardProto(ctx, "OnlyConstentTextCardProto", new OnlyConstentTextCardProto());
	final card = new Card("0");
	card.protoId = "AddTextCardProto";
	final runtime = new DefaultExecuteRuntime(card.id, playerId);
	var texts = getCurrentCardProto(ctx, card.protoId).getTexts(ctx, runtime);
	if (texts.length != 1) {
		throw "確定卡的內文有1個";
	}
	switch texts[0].type {
		case Automatic(Constant):
			throw "並且不是恆常能力";
		case _:
	}
	addCard(ctx.table, getCardStackId(Default("0", TeHuTa)), card);
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
	addCard(ctx.table, getCardStackId(Default("0", MaintenanceArea)), card);
	if (getRuntimeText(ctx).length != 2) {
		throw new haxe.Exception("必須找到2個內文");
	}
	if (getMarkEffects(ctx).length != 1) {
		throw new haxe.Exception("必須找到1個效果");
	}
	final enterFieldMark = new EnterFieldThisTurnMark('EnterFieldThisTurnMark', card.id);
	ctx.marks[enterFieldMark.id] = enterFieldMark;
	if (getRuntimeText(ctx).length != 2) {
		throw new haxe.Exception("還是找到2個內文");
	}
	if (getMarkEffects(ctx).length != 2) {
		throw new haxe.Exception("找到2個效果");
	}
}
