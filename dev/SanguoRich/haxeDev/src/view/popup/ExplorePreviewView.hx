package view.popup;

import model.IModel.PreResultOnExplore;
import model.IModel.ExplorePreview;
import model.IModel.PreResultOnHire;
import haxe.ui.events.MouseEvent;
import model.PeopleGenerator.People;
import haxe.ui.events.UIEvent;
import model.IModel.HirePreview;

@:build(haxe.ui.ComponentBuilder.build("assets/popup/explorePreview-view.xml"))
class ExplorePreviewView extends PopupView{

    var p1List:PeopleListView;

    public function new() {
        super();

        p1List = new PeopleListView();
        box_peopleList1.addComponent(p1List);
    }

    override function showPopup(info:Dynamic) {
        super.showPopup(info);


        var info:ExplorePreview = info;

        function setRate(){
            var p1 = p1List.selectedItem;

            var gameInfo = Main.model.gameInfo();
            var result:PreResultOnExplore = Main.model.getPreResultOfExplore(
                gameInfo.currentPlayer.id,
                gameInfo.currentPlayer.atGridId,
                p1);
        
            pro_energy.value = '${result.energyBefore} => ${result.energyAfter}';
            pro_successRate.value = Main.getRateString(result.successRate);
        }

        function setOnePeople(){
            var p1:People = p1List.selectedItem;
            pro_name.value = p1.name;
            pro_charm.value = p1.charm;

            pro_ability.value = '';
            if( p1.abilities.indexOf(10) > -1 ){
                pro_ability.value = '人脈';
            }
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
    }

    @:bind(btn_cancel, MouseEvent.CLICK)
    function onBtnCancel(e:MouseEvent) {
        fadeOut();
    }

    @:bind(btn_confirm, MouseEvent.CLICK)
    function onBtnConfirm(e:MouseEvent) {
        fadeOut();

        Main.view.onExplorePreviewConfirmClick(p1List.selectedItem.id);
    }
}