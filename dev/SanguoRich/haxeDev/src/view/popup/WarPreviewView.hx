package view.popup;

import model.IModel.PreResultOnWar;
import view.widgets.LeaderGridView;
import haxe.ui.events.UIEvent;
import model.PeopleGenerator.People;
import haxe.ui.containers.properties.Property;
import model.IModel.WarPreview;
import haxe.ui.events.MouseEvent;

@:build(haxe.ui.ComponentBuilder.build("assets/popup/warPreview-view.xml"))
class WarPreviewView extends PopupView{

    var p1List:PeopleListView;
    var p2List:PeopleListView;

    public function new() {
        super();

        p1List = new PeopleListView();
        box_peopleList1.addComponent(p1List);

        p2List = new PeopleListView();
        box_peopleList2.addComponent(p2List);
    }

    @:bind(btn_cancel, MouseEvent.CLICK)
    function onBtnCancelClick(e:MouseEvent) {
        fadeOut();
    }

    @:bind(btn_confirm, MouseEvent.CLICK)
    function onBtnConfirmClick(e:MouseEvent) {
        fadeOut();

        Main.view.onWarPreviewConfirmClick(p1List.selectedItem.id, p2List.selectedItem.id, outData[0], outData[1]);
    }

    var outData = [];
    override function showPopup(info:Dynamic) {
        super.showPopup(info);

        var info:WarPreview = info;

        function setRate(){
            var p1 = p1List.selectedItem;
            var p2 = p2List.selectedItem;

            var gameInfo = Main.model.gameInfo();
            var p1army = Main.getFixNumber(info.p1.army * sli_army.value, 0);
            var grid = gameInfo.grids[gameInfo.currentPlayer.atGridId];
            var result:Array<PreResultOnWar> = Main.model.getPreResultOfWar(
                gameInfo.currentPlayer.id,
                gameInfo.currentPlayer.atGridId,
                p1, p2, p1army, grid.army);

            pro_money1.value = '${result[0].moneyBefore}=>${result[0].moneyAfter}';
            pro_money2.value = '${result[1].moneyBefore}=>${result[1].moneyAfter}';

            pro_food1.value = '${result[0].foodBefore}=>${result[0].foodAfter}';
            pro_food2.value = '${result[1].foodBefore}=>${result[1].foodAfter}';

            pro_army1.value = '${result[0].armyBefore}=>${result[0].armyAfter}';
            pro_army2.value = '${result[1].armyBefore}=>${result[1].armyAfter}';

            outData = [p1army, grid.army];
        }

        function setOnePeople(id:Int, p:People){
            var pro_name:Property = Reflect.getProperty(this, 'pro_name${id}');
            var pro_energy:Property = Reflect.getProperty(this, 'pro_energy${id}');
            var pro_force:Property = Reflect.getProperty(this, 'pro_force${id}');
            var pro_command:Property = Reflect.getProperty(this, 'pro_command${id}');
            var pro_intelligence:Property = Reflect.getProperty(this, 'pro_intelligence${id}');
            
            pro_name.value = p.name;
            pro_energy.value = p.energy;
            pro_force.value = p.force;
            pro_command.value = p.command;
            pro_intelligence.value = p.intelligence;

            setRate();
        }

        sli_army.onChange = function(e) {
            setRate();
        }
        sli_army.value = 50;

        p1List.setPeopleList(info.p1ValidPeople);
        p1List.onChange = function(e){
            var p:Dynamic = p1List.selectedItem;
            if(p){
                setOnePeople(1, p);
            }
        }
        p1List.selectedIndex = 0;

        p2List.setPeopleList(info.p2ValidPeople);
        p2List.onChange = function(e){
            var p:Dynamic = p2List.selectedItem;
            if(p){
                setOnePeople(2, p);
            }
        }
        p2List.selectedIndex = 0;
    }
}