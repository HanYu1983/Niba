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

function test() {
	model.ver1.game.Game.test();
	model.ver1.game.define.BaSyou.test();
	model.ver1.test.Test_getRuntimeText.test();
	test_getMarkEffects();
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
	final enterFieldMark = new EnterFieldMark('EnterFieldMark', card.id);
	ctx.marks[enterFieldMark.id] = enterFieldMark;
	if (getRuntimeText(ctx).length != 2) {
		throw new haxe.Exception("還是找到2個內文");
	}
	if (getMarkEffects(ctx).length != 2) {
		throw new haxe.Exception("找到2個效果");
	}
}
