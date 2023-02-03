package assets;

import haxe.ui.containers.Absolute;

@:build(haxe.ui.ComponentBuilder.build('assets/playerTable.xml'))
class PlayerTable extends Absolute {
	public final hand:Array<Card> = [];

	public function new() {
		super();
	}
}
