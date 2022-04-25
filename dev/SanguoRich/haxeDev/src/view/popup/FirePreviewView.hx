package view.popup;

import model.IModel.PreResultOnFire;
import model.IModel.PreResultOnHire;
import haxe.ui.events.MouseEvent;
import model.PeopleGenerator.People;
import haxe.ui.events.UIEvent;
import model.IModel.HirePreview;

@:build(haxe.ui.ComponentBuilder.build("assets/popup/FirePreview-view.xml"))
class FirePreviewView extends PopupView{

    var p1List:PeopleListView;

    public function new() {
        super();

        p1List = new PeopleListView();
        box_peopleList1.addComponent(p1List);
    }

    override function showPopup(info:Dynamic) {
        super.showPopup(info);

        function setOnePeople(){
            var p1:People = p1List.selectedItem;
            var gameInfo = Main.model.gameInfo();
            var result:PreResultOnFire = Main.model.getPreResultOfFire(
                gameInfo.currentPlayer.id,
                p1.id);
            pro_maintainMoney.value = '${Main.getFixNumber(result.maintainMoneyBefore, 2)} => ${Main.getFixNumber(result.maintainMoneyAfter, 2)}';
        }

        p1List.setPeopleList(Main.model.gameInfo().currentPlayer.people);
        p1List.onChange = function(e){
            var p:Dynamic = p1List.selectedItem;
            if(p){
                setOnePeople();
            }
        }
        p1List.selectedIndex = 0;

    }

    @:bind(btn_cancel, MouseEvent.CLICK)
    function onBtnCancel(e:MouseEvent) {
        fadeOut();
    }

    @:bind(btn_confirm, MouseEvent.CLICK)
    function onBtnConfirm(e:MouseEvent) {
        fadeOut();

        Main.view.onFirePreviewViewConfirmClick(p1List.selectedItem.id);
    }
}