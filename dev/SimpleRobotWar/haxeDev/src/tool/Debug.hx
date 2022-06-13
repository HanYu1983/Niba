package tool;

using Lambda;

private enum LogLevel {
	Verbose;
	Info;
	Warn;
	Err;
}

private final filterLevel:Array<LogLevel> = [
	//
	Verbose,
	Info,
	Warn,
	Err
];

private final filterCategoryLevel = [
	"RobotPage" => [Info],
	"GamePage" => [Info],
	"DefaultViewImpl" => [Info],
	"DefaultView" => [Verbose, Info],
	"BattleController" => [Verbose, Info],
];

function verbose(category:String, msg:Dynamic) {
	switch filterCategoryLevel.get(category) {
		case levels if (levels.has(Verbose) == false):
			return;
	}
	if (filterLevel.has(Verbose) == false) {
		return;
	}
	js.Browser.console.log('[Verbose][${category}]', msg);
}

function info(category:String, msg:Dynamic) {
	switch filterCategoryLevel.get(category) {
		case levels if (levels.has(Info) == false):
			return;
	}
	if (filterLevel.has(Info) == false) {
		return;
	}
	js.Browser.console.log('[${category}]', msg);
}

function warn(category:String, msg:Dynamic) {
	if (filterLevel.has(Warn) == false) {
		return;
	}
	// if (filterCategory.has(category) == false) {
	// 	return;
	// }
	js.Browser.console.warn('[${category}]', msg);
}

function err(category:String, msg:Dynamic) {
	if (filterLevel.has(Err) == false) {
		return;
	}
	// if (filterCategory.has(category) == false) {
	// 	return;
	// }
	js.Browser.console.error('[${category}]', msg);
}
