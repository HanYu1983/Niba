package model.ver1.game.define;

import model.ver1.game.define.Define;
import model.ver1.game.define.TargetCardFilter;

interface ITarget {}
class AbstractTarget implements ITarget {}

class AbstractTargetOr extends AbstractTarget {
	public final values:Array<ITarget> = [];
}

class TargetCard extends AbstractTarget {
	public final player:RelativePlayer;
	public final filter:ITargetCardFilter;
	public final count:TargetCount;

	public function new(player:RelativePlayer, filter:ITargetCardFilter, count:TargetCount) {
		this.player = player;
		this.filter = filter;
		this.count = count;
	}
}
