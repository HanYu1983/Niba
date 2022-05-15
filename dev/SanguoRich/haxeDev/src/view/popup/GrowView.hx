package view.popup;

import model.IModel.PlayerInfo;
import haxe.ui.events.MouseEvent;
import view.widgets.LeaderGridView;

@:build(haxe.ui.ComponentBuilder.build("assets/popup/grow-view.xml"))
class GrowView extends PopupView{

    var p1Info:LeaderGridView;
    var p2Info:LeaderGridView;
    var p3Info:LeaderGridView;
    var p4Info:LeaderGridView;

    public function new() {
        super();        

        p1Info = new LeaderGridView();
        box_p1.addComponent(p1Info);

        p2Info = new LeaderGridView();
        box_p2.addComponent(p2Info);

        p3Info = new LeaderGridView();
        box_p3.addComponent(p3Info);

        p4Info = new LeaderGridView();
        box_p4.addComponent(p4Info);
    }

    function setInfo(view:LeaderGridView, before:PlayerInfo, after:PlayerInfo){
        view.pro_name.value = before.name;
        view.pro_money.value = '${Main.getCompareString(before.money, after.money, 2)}';
        view.pro_food.value = '${Main.getCompareString(before.food, after.food, 2)}';
        view.pro_army.value = '${Main.getCompareString(before.army, after.army, 2)}';
        view.pro_peopleCount.value = before.people.length;
        view.pro_cityCount.value = before.grids.length;
    }

    override function showPopup(info:Dynamic, cb:()->Void = null) {
        super.showPopup(info, cb);

        final gameInfo = Main.model.gameInfo();
        for( index => p in gameInfo.players){
            setInfo([p1Info, p2Info, p3Info, p4Info][index], info.playerBefore[index], info.playerAfter[index]);
        }
    }

    @:bind(btn_confirm, MouseEvent.CLICK)
    function onBtnComfirmClick(e:MouseEvent){
        fadeOut();
    }
}