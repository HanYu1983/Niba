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

    override function showPopup(info:Dynamic, cb:()->Void = null) {
        super.showPopup(info, cb);

        function setOnePeople(){
            var gameInfo = Main.model.gameInfo();

            final list:Array<Dynamic> = p1List.dataSource.data;
            var fireList = list.filter((p:Dynamic)-> Reflect.field(p, 'chk_sel')).map((p)->p.id);

            var result:PreResultOnFire = Main.model.getPreResultOfFire(
                gameInfo.currentPlayer.id,
                fireList);
            pro_maintainMoney.value = '${Main.getFixNumber(result.maintainMoneyBefore, 2)} => ${Main.getFixNumber(result.maintainMoneyAfter, 2)}';
        }

        p1List.setPeopleList(Main.model.gameInfo().currentPlayer.people);
        p1List.registerEvent(UIEvent.CHANGE, (e)->{
            var p:Dynamic = p1List.selectedItem;
            if(p){
                setOnePeople();
            }
        });

    }

    @:bind(btn_cancel, MouseEvent.CLICK)
    function onBtnCancel(e:MouseEvent) {
        fadeOut();
    }

    @:bind(btn_confirm, MouseEvent.CLICK)
    function onBtnConfirm(e:MouseEvent) {
        fadeOut();

        final list:Array<Dynamic> = p1List.dataSource.data;
        var fireList = list.filter((p:Dynamic)-> Reflect.field(p, 'chk_sel')).map((p)->p.id);
        Main.view.onFirePreviewViewConfirmClick(fireList);
    }
}