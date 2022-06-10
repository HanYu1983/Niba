package vic.pages;

import haxe.ui.events.MouseEvent;
import haxe.ui.containers.Box;

@:build(haxe.ui.ComponentBuilder.build('vic/pages/PilotPage.xml'))
class PilotPage extends Box {
	public function new() {
		super();
	}

	override function show() {
		super.show();

		final pilots = Main.view.getLobbyController().getPilots();
		trace('vic get pilots:${pilots}');
	}
}
