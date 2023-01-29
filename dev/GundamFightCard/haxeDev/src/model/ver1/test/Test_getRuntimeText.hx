package model.ver1.test;

using Lambda;

import haxe.ds.Option;
import tool.Table;
import model.ver1.game.define.Define;
import model.ver1.game.define.BaSyou;
import model.ver1.game.define.ExecuteRuntime;
import model.ver1.game.alg.Context;
import model.ver1.game.alg.CardProto;
import model.ver1.game.alg.Runtime;
import model.ver1.test.common.Common;

private function test_getRuntimeText1() {
	final ctx = new Context();
	registerCardProto(ctx, "OnlyEmptyTextCardProto", new OnlyEmptyTextCardProto());
	if (getRuntimeText(ctx).length != 0) {
		throw new haxe.Exception("沒有任何牌時必須找不到內文");
	}
	final card = new Card("0");
	card.protoId = "OnlyEmptyTextCardProto";
	addCard(ctx.table, (Default("0", MaintenanceArea):BaSyouId), card);
	if (getRuntimeText(ctx).length != 1) {
		throw new haxe.Exception("必須找到1個內文");
	}
}

private function test_getRuntimeText2() {
	final ctx = new Context();
	registerCardProto(ctx, "AddTextCardProto", new AddTextCardProto());
	final card = new Card("0");
	card.protoId = "AddTextCardProto";
	addCard(ctx.table, (Default("0", MaintenanceArea):BaSyouId), card);
	if (getRuntimeText(ctx).length != 2) {
		throw new haxe.Exception("必須找到2個內文");
	}
}

function test() {
	test_getRuntimeText1();
	test_getRuntimeText2();
}
