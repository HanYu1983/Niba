package model.ver2.alg;

import model.GridGenerator;
import model.IModel;
import model.Config;
import model.ver2.Define;
import model.ver2.alg.Alg;

private final FILE_NAME = "SanguoRichSave.txt";
private final _storage = js.Browser.getLocalStorage();

function _save(ctx:Context) {
	final memonto = getMemontoByContext(ctx);
	_storage.setItem(FILE_NAME, memonto);
}

function _load():Null<Context> {
	final memonto = _storage.getItem(FILE_NAME);
	if (memonto == null) {
		return null;
	}
	final ctx = getConetxtByMemonto(memonto);
	for (player in ctx.players) {
		player.score = getPlayerScore(ctx, player.id);
	}
	return ctx;
}
