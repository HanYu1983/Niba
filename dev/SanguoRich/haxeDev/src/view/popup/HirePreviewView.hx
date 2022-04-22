package view.popup;

import model.IModel.PreResultOnHire;
import haxe.ui.events.MouseEvent;
import model.PeopleGenerator.People;
import haxe.ui.events.UIEvent;
import model.IModel.HirePreview;

@:build(haxe.ui.ComponentBuilder.build("assets/popup/HirePreview-view.xml"))
class HirePreviewView extends PopupView{

    var p1List:PeopleListView;
    var p2List:PeopleListView;

    public function new() {
        super();

        p1List = new PeopleListView();
        box_peopleList1.addComponent(p1List);

        p2List = new PeopleListView();
        box_peopleList2.addComponent(p2List);
    }

    override function showPopup(info:Dynamic) {
        super.showPopup(info);

        var info:HirePreview = info;

        function setRate(){
            var p1 = p1List.selectedItem;
            var p2 = p2List.selectedItem;

            var gameInfo = Main.model.gameInfo();
            var result:PreResultOnHire = Main.model.getPreResultOfHire(
                gameInfo.currentPlayer.id,
                gameInfo.currentPlayer.atGridId,
                p1, p2);

            pro_energy.value = '${p1.energy}=>${result.energyAfter}';
            pro_successRate.value = Main.getRateString(result.successRate);
        }

        function setOnePeople(){
            var p1:People = p1List.selectedItem;
            var p2:People = p2List.selectedItem;
            pro_name.value = '${p1.name} vs ${p2.name}';
            pro_charm.value = '${p1.charm} vs ${p2.charm}';
            setRate();
        }

        p1List.setPeopleList(info.p1ValidPeople);
        p1List.onChange = function(e){
            var p:Dynamic = p1List.selectedItem;
            if(p){
                setOnePeople();
            }
        }
        p1List.selectedIndex = 0;

        p2List.setPeopleList(info.p2ValidPeople);
        p2List.onChange = function(e){
            var p:Dynamic = p2List.selectedItem;
            if(p){
                setOnePeople();
            }
        }
        p2List.selectedIndex = 0;
    }

    @:bind(btn_cancel, MouseEvent.CLICK)
    function onBtnCancel(e:MouseEvent) {
        fadeOut();
    }

    @:bind(btn_confirm, MouseEvent.CLICK)
    function onBtnConfirm(e:MouseEvent) {
        fadeOut();

        Main.view.onHirePreviewViewConfirmClick(p1List.selectedItem.id, p2List.selectedItem.id);
    }
}