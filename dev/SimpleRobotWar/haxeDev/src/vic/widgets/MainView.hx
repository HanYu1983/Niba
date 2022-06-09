package vic.widgets;

import haxe.ui.containers.Box;

@:build(haxe.ui.ComponentBuilder.build('vic/widgets/MainView.xml'))
class MainView extends Box{

    // public var lobbyView(default,null):LobbyView;

    public function new() {
        super();

        // lobbyView = new LobbyView();
		// lobbyView.hide();
        // box_pages.addComponent(lobbyView);
    }

    // public function closeAllPages(){
	// 	lobbyView.hide();
	// }
}