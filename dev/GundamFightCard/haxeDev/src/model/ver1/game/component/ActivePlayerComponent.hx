package model.ver1.game.component;

using haxe.ds.Option;

import haxe.Exception;
import model.ver1.game.define.Player;
import model.ver1.game.define.Timing;
import model.ver1.game.define.Define;

interface IActivePlayerComponent {
	var activePlayerId:Option<PlayerId>;
}

function setActivePlayerId(ctx:IActivePlayerComponent, playerId:Option<PlayerId>):Void {
	ctx.activePlayerId = playerId;
}

function getActivePlayerIdAndAssert(ctx:IActivePlayerComponent):PlayerId {
	switch ctx.activePlayerId {
		case Some(playerId):
			return playerId;
		case _:
			throw new haxe.Exception("activePlayerId not found");
	}
}

function isPlayerTiming(ctx:IActivePlayerComponent, useTiming:UseTiming, responsePlayerId:PlayerId, timing:Timing, playerId:PlayerId) {
	switch (useTiming) {
		case Relative(You, _) if (responsePlayerId != playerId):
			return false;
		case Relative(Opponent, _) if (responsePlayerId != ~(playerId)):
			return false;
		case _:
	}
	switch (useTiming) {
		case Absolute(Any) | Relative(_, Turn):
			switch timing {
				case Default(_, _, Free1 | Free2):
					return true;
				case _:
			}
		case Absolute(Draw) | Relative(_, Draw):
			switch timing {
				case Default(Draw, _, Free1 | Free2):
					return true;
				case _:
			}
		case Absolute(Maintenance) | Relative(_, Maintenance):
			switch timing {
				case Default(Maintenance, _, Free1 | Free2):
					return true;
				case _:
			}
		case Absolute(Battle) | Relative(_, Battle):
			switch timing {
				case Default(Battle, _, Free1 | Free2):
					return true;
				case _:
			}
		case Absolute(Attack) | Relative(_, Attack):
			switch timing {
				case Default(Battle, Some(Attack), Free1 | Free2):
					return true;
				case _:
			}
		case Absolute(Defense) | Relative(_, Defense):
			switch timing {
				case Default(Battle, Some(Defense), Free1 | Free2):
					return true;
				case _:
			}
		case Absolute(DamageChecking) | Relative(_, DamageChecking):
			switch timing {
				case Default(Battle, Some(DamageChecking), Free1 | Free2):
					return true;
				case _:
			}
		case Absolute(Return) | Relative(_, Return):
			switch timing {
				case Default(Battle, Some(Return), Free1 | Free2):
					return true;
				case _:
			}
		case _:
	}
	return false;
}
