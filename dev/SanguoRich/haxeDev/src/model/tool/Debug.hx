package model.tool;

using Lambda;

private enum LogLevel {
	Info;
	Warn;
	Err;
}

private final filterLevel:Array<LogLevel> = [Info, Warn, Err];
private final filterCategory:Array<String> = [];

function info(category:String, msg:Dynamic) {
	if (filterLevel.has(Info) == false) {
		return;
	}
	if (filterCategory.has(category) == false) {
		return;
	}
	js.Browser.console.log('[${category}]', msg);
}

function warn(category:String, msg:Dynamic) {
	if (filterLevel.has(Warn) == false) {
		return;
	}
	if (filterCategory.has(category) == false) {
		return;
	}
	js.Browser.console.warn('[${category}]', msg);
}

function err(category:String, msg:Dynamic) {
	if (filterLevel.has(Err) == false) {
		return;
	}
	if (filterCategory.has(category) == false) {
		return;
	}
	js.Browser.console.error('[${category}]', msg);
	throw new haxe.Exception(msg);
}
