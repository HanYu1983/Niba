package vic.widgets;

import haxe.ui.events.MouseEvent;
import haxe.ui.containers.Box;

@:build(haxe.ui.ComponentBuilder.build('vic/widgets/PilotPage.xml'))
class PilotPage extends Box {
	public function new() {
		super();
	}

	override function show() {
		super.show();

		final pilots = HaxeUIView.getInst().getImpl().getLobbyController().getPilots();
		trace('vic get pilots:${pilots}');
	}

}
