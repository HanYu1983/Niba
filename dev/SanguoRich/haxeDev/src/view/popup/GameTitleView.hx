package view.popup;

import model.IModel.WarPreview;
import haxe.ui.events.MouseEvent;

@:build(haxe.ui.ComponentBuilder.build("assets/popup/gameTitleView-view.xml"))
class GameTitleView extends PopupView{

    public function new() {
        super();

    }

    override function ready() {
        super.ready();

        grp_p0.selectedIndex = 0;
        grp_p1.selectedIndex = 1;
        grp_p2.selectedIndex = 2;
        grp_p3.selectedIndex = 2;
        grp_ai_level.selectedIndex = 0;
        grp_gridCount.selectedIndex = 1;
        grp_growSpeed.selectedIndex = 1;
        grp_resource.selectedIndex = 1;
        grp_limitBuilding.selectedIndex = 1;
        grp_putong.selectedIndex = 0;
        grp_p0.disabled = true;
    }


    @:bind(btn_start, MouseEvent.CLICK)
    function onBtnConfirmClick(e:MouseEvent) {
        fadeOut();

        Main.view.onGameTitleStartClick({
            players:[
                {type:grp_p0.selectedIndex},
                {type:grp_p1.selectedIndex},
                {type:grp_p2.selectedIndex},
                {type:grp_p3.selectedIndex}
            ],
            gridCount: Std.parseInt(grp_gridCount.selectedButton.text),
            growSpeed: Std.parseFloat(grp_growSpeed.selectedButton.text),
            resource: Std.parseFloat(grp_resource.selectedButton.text),
            limitBuilding: (grp_limitBuilding.selectedIndex == 0),
            aiLevel: grp_ai_level.selectedIndex,
            putong: (grp_putong.selectedIndex == 0)
        });
    }

}