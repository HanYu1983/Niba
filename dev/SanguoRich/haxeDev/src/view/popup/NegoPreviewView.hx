package view.popup;

import model.ModelVer2.ENERGY_COST_ON_NEGO;
import model.IModel.PreResultOnNego;
import haxe.ui.events.UIEvent;
import model.PeopleGenerator.People;
import haxe.ui.containers.properties.Property;
import model.IModel.NegoPreview;
import haxe.ui.events.MouseEvent;

@:build(haxe.ui.ComponentBuilder.build("assets/popup/negoPreview-view.xml"))
class NegoPreviewView extends PopupView{

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

        var info:NegoPreview = info;

        function setRate(){
            var p1 = p1List.selectedItem;
            var p2 = p2List.selectedItem;

            var gameInfo = Main.model.gameInfo();
            var result:PreResultOnNego = Main.model.getPreResultOfNego(
                gameInfo.currentPlayer.id,
                gameInfo.currentPlayer.atGridId,
                p1, p2);

            pro_energy.value = Main.getEnergyString(result.energyBefore, result.energyAfter, ENERGY_COST_ON_NEGO);
            pro_money.value = '${result.moneyBefore} => ${result.moneyAfter}';
            pro_food.value = '${result.foodBefore} => ${result.foodAfter}';
            pro_army.value = '${result.armyBefore} => ${result.armyAfter}';
            // pro_maintainFood.value = '${Main.getFixNumber(result.maintainFoodBefore, 2)} => ${Main.getFixNumber(result.maintainFoodAfter, 2)}';
            pro_successRate.value = Main.getRateString(result.successRate);
        }

        function setOnePeople(){
            var p1:People = p1List.selectedItem;
            var p2:People = p2List.selectedItem;
            pro_name.value = '${p1.name} vs ${p2.name}';
            pro_charm.value = Main.getVSString(p1.charm, p2.charm);
            pro_political.value = Main.getVSString(p1.political, p2.political);
            pro_intelligence.value = Main.getVSString(p1.intelligence, p2.intelligence);
            pro_ability.value = Main.getAbilityString(p1, [7]);
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
    function onBtnCancelNego(e:MouseEvent) {
        fadeOut();
    }

    @:bind(btn_confirm, MouseEvent.CLICK)
    function onBtnConfirmNego(e:MouseEvent) {
        fadeOut();

        Main.view.onNegoPreviewConfirmNegoClick(p1List.selectedItem.id, p2List.selectedItem.id);
    }
}