package view.popup;

import js.html.MediaStreamError;
import model.ver2.Define.Strategy;
import model.ver2.Config.StrategyList;
import model.IModel.PreResultOnWar;
import view.widgets.LeaderGridView;
import haxe.ui.events.UIEvent;
import model.PeopleGenerator.People;
import haxe.ui.containers.properties.Property;
import model.IModel.WarPreview;
import haxe.ui.events.MouseEvent;

@:build(haxe.ui.ComponentBuilder.build("assets/popup/strategyPreview-view.xml"))
class StrategyPreviewView extends PopupView{

    var p1List:PeopleListView;
    var strategyList:StrategyListView;

    public function new() {
        super();

        p1List = new PeopleListView();
        box_peopleList.addComponent(p1List);

        strategyList = new StrategyListView();
        strategyList.setList(StrategyList);
        box_strategyList.addComponent(strategyList);
    }

    @:bind(btn_cancel, MouseEvent.CLICK)
    function onBtnCancelClick(e:MouseEvent) {
        fadeOut();
    }

    @:bind(btn_confirm, MouseEvent.CLICK)
    function onBtnConfirmClick(e:MouseEvent) {
        fadeOut();

        Main.view.onStrategyPreviewConfirmClick(p1List.selectedItem.id, strategyList.selectedItem.id);
    }

    override function showPopup(info:Dynamic) {
        super.showPopup(info);

        final gameInfo = Main.model.gameInfo();

        drp_player.dataSource.clear();
        for( player in gameInfo.players ){
            drp_player.dataSource.add({
                id:player.id, text:player.name
            });
        }
        drp_player.onChange = function(e){
            drp_people.dataSource.clear();
            for(people in gameInfo.players[drp_player.selectedItem.id].people){
                drp_people.dataSource.add({
                    id:people.id, text:people.name
                });
            }
        }
        drp_player.selectedIndex = 0;

        drp_grid.dataSource.clear();
        for( grid in gameInfo.grids){
            drp_grid.dataSource.add({
                id:grid.id, text:grid.id + ''
            });
        }

        function setRate(){
            var p1 = p1List.selectedItem;
            var s = strategyList.selectedItem;

            var result:{energyBefore:Int, energyAfter:Int, rate:Float} = Main.model.getStrategyRate(
                p1,
                s);

            pro_energy.value = '${result.energyBefore} => ${result.energyAfter}';
            lbl_rate.value = Main.getRateString(result.rate);
        }

        function setOnePeople(p:People){
            pro_name.value = p.name;
            
            pro_intelligence.value = p.intelligence;
            pro_ability.value = Main.getAbilityString(p, [4]);

            setRate();
        }

        
        p1List.setPeopleList(gameInfo.currentPlayer.people);
        p1List.onChange = function(e){
            var p:Dynamic = p1List.selectedItem;
            if(p){
                setOnePeople(p);
            }
        }
        p1List.selectedIndex = 0;

        strategyList.onChange = function(e){
            var s:Strategy = strategyList.selectedItem;
            if(s != null){
                lbl_usingStrategy.value = s.name;
                setRate();
            }
        }
        strategyList.selectedIndex = 0;
    }
}