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
        view.pro_money.value = '${Main.getFixNumber(before.money, 2)} => ${Main.getFixNumber(after.money, 2)}';
        view.pro_food.value = '${Main.getFixNumber(before.food, 2)} => ${Main.getFixNumber(after.food, 2)}';
        view.pro_army.value = '${Main.getFixNumber(before.army, 2)} => ${Main.getFixNumber(after.army, 2)}';
        view.pro_peopleCount.value = before.people.length;
        view.pro_cityCount.value = "0";
    }

    override function showPopup(info:Dynamic) {
        super.showPopup(info);

        setInfo(p1Info, info.playerBefore[0], info.playerAfter[0]);
        setInfo(p2Info, info.playerBefore[1], info.playerAfter[1]);
        setInfo(p3Info, info.playerBefore[2], info.playerAfter[2]);
        setInfo(p4Info, info.playerBefore[3], info.playerAfter[3]);
    }

    @:bind(btn_confirm, MouseEvent.CLICK)
    function onBtnComfirmClick(e:MouseEvent){
        fadeOut();
    }
}