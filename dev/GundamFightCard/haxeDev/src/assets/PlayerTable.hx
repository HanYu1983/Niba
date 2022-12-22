package assets;

import haxe.ui.containers.Absolute;

@:build(haxe.ui.ComponentBuilder.build('assets/PlayerTable.xml'))
class PlayerTable extends Absolute {
	public function new() {
		super();
    }

	// public function getDeck():Component {
	// 	return box_deck;
	// }
}
