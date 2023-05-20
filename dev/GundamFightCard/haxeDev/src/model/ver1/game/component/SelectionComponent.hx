package model.ver1.game.component;

using Lambda;

import tool.LogicTree;
import model.ver1.game.define.Require;

typedef PlayerSelection = {
	cardIds:Map<String, Array<String>>
}

interface ISelectionComponent {
	var playerSelection:PlayerSelection;
}

// function getPlayerSelectionCardIdOption(ctx:ISelectionComponent, key:String):Option<Array<String>> {
// 	final selection = ctx.playerSelection.cardIds[key];
// 	if (selection == null) {
// 		throw new haxe.Exception("selection not found");
// 	}
// 	return selection;
// }

function getPlayerSelectionCardId(ctx:ISelectionComponent, key:String):Array<String> {
	final selection = ctx.playerSelection.cardIds[key];
	if (selection == null) {
		throw new haxe.Exception("selection not found");
	}
	return selection;
}

function setPlayerSelectionCardId(ctx:ISelectionComponent, key:String, values:Array<String>):Void {
	ctx.playerSelection.cardIds[key] = values;
}

function checkCount<T>(selection:Array<T>, count:RequireSelectionCount):Void {
	switch count {
		case Constants(n):
			if (selection.length < n) {
				throw "abc";
			}
		case MuchAsPossible(n):
			if (selection.length >= n) {
				throw "abc";
			}
	}
}

function attempt(ctx:ISelectionComponent, require:Require3, options:{onlyTip:Bool}):Void {
	switch require.logic {
		case None:
			for (requireSelection in require.selections) {
				switch requireSelection.type {
					case SelectCard(tips):
						if (options.onlyTip) {
							checkCount(tips, requireSelection.count);
						} else {
							final selection = getPlayerSelectionCardId(ctx, requireSelection.id);
							checkCount(selection, requireSelection.count);
						}
					case SelectBattlePoint(tips):
						if (options.onlyTip) {
							checkCount(tips, requireSelection.count);
						} else {
							//
						}
				}
				if (options.onlyTip) {
					//
				} else {
					requireSelection.action();
				}
			}
		case Some(logic):
			final requireSelectionIds = require.selections.filter(requireSelection -> {
				switch requireSelection.type {
					case SelectCard(tips):
						if (options.onlyTip) {
							checkCount(tips, requireSelection.count);
						} else {
							final selection = getPlayerSelectionCardId(ctx, requireSelection.id);
							checkCount(selection, requireSelection.count);
						}
					case SelectBattlePoint(tips):
				}
				if (options.onlyTip) {
					//
				} else {
					requireSelection.action();
				}
				return true;
			}).map(s -> s.id);
			final possibleSelectionGroups = enumerateAll(logic);
			final hasSolution = possibleSelectionGroups.exists(group -> {
				for (k in group) {
					if (requireSelectionIds.contains(k) == false) {
						return false;
					}
				}
				return true;
			});
	}
}
