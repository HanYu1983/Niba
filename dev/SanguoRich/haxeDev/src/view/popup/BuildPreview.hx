package view.popup;

import model.IModel.GameInfo;
import view.widgets.PeopleListView;
import haxe.ui.containers.dialogs.Dialog.DialogButton;
import haxe.ui.containers.dialogs.MessageBox.MessageBoxType;
import haxe.ui.containers.dialogs.Dialogs;
import model.GridGenerator.BUILDING;
import model.GridGenerator.Grid;
import view.widgets.GridGridView;
import haxe.ui.events.MouseEvent;

using Lambda;

@:build(haxe.ui.ComponentBuilder.build("assets/popup/buildingPreview-view.xml"))
class BuildPreview extends PopupView{

    var plist:PeopleListView;
    var gridView:GridGridView;

    public function new() {
        super();

        plist = new PeopleListView();
        box_plist.addComponent(plist);

        gridView = new GridGridView();
        box_grid.addComponent(gridView);
    }

    @:bind(btn_cancel, MouseEvent.CLICK)
    function onBtnCancelClick(e:MouseEvent) {
        fadeOut();
    }

    var isChecked = false;

    @:bind(btn_confirm, MouseEvent.CLICK)
    function onBtnConfirmClick(e:MouseEvent) {
        
        final current:BUILDING = tab_buildingList.selectedItem.type;
        final to = switch(current){
            case MARKET(level):
                if(level < 3) BUILDING.MARKET(level+1);
                else BUILDING.MARKET(3);
            case FARM(level):
                if(level < 3) BUILDING.FARM(level+1);
                else BUILDING.FARM(3);
            case BARRACKS(level):
                if(level < 3) BUILDING.BARRACKS(level+1);
                else BUILDING.BARRACKS(3);
            case HOME(level):
                if(level < 3) BUILDING.HOME(level+1);
                else BUILDING.HOME(3);
            case EXPLORE(level):
                if(level < 1) BUILDING.EXPLORE(level+1);
                else BUILDING.EXPLORE(1);
            case CITYATTACKER(level):
                if(level < 1) BUILDING.CITYATTACKER(level+1);
                else BUILDING.CITYATTACKER(1);
            case EXPADDER(level):
                if(level < 1) BUILDING.EXPADDER(level+1);
                else BUILDING.EXPADDER(1);
            case WALL(level):
                if(level < 3) BUILDING.WALL(level+1);
                else BUILDING.WALL(1);
            case BANK(level):
                if(level < 3) BUILDING.BANK(level+1);
                else BUILDING.BANK(1);
            case BARN(level):
                if(level < 3) BUILDING.BARN(level+1);
                else BUILDING.BARN(1);
        }

        if(Type.enumEq(current, to)) return;

        final people = plist.selectedItem;
        var catelog = tab_buildingList.selectedItem;
        var toCatelog = Main.getBuildingCatelog(to);

        final gameInfo = Main.model.gameInfo();
        if(gameInfo.currentPlayer.money < catelog.money){
            Dialogs.messageBox('金錢不足', '金錢不足', MessageBoxType.TYPE_INFO);
            return;
        }
        
        var title = '確定要擴建 ${catelog.name} 成 ${toCatelog.name} 嗎?';
        var msg = '金錢:${Main.getCompareString(gameInfo.currentPlayer.money, gameInfo.currentPlayer.money - catelog.money)}\n';
        msg += '功能:${toCatelog.describe}';

        Dialogs.messageBox(msg, title, MessageBoxType.TYPE_QUESTION, true, (e)->{
            if( e == DialogButton.YES){
                fadeOut();
                Main.view.onBuildingPreviewConfirmClick(people.id, current, to);
            }
        });
    }

    var outData:Dynamic = [];
    override function showPopup(info:Dynamic, cb:()->Void = null) {
        super.showPopup(info, cb);

        final gameInfo = Main.model.gameInfo();
        final player = gameInfo.currentPlayer;
        final grid:Grid = gameInfo.grids[player.atGridId];
        plist.setPeopleList(player.people);
        plist.selectedIndex = 0;

        gridView.setInfo(grid);

        tab_buildingList.dataSource.clear();
        for(b in grid.attachs){
            final catelog = Main.getBuildingCatelog(b);
            tab_buildingList.dataSource.add( catelog );

            // final catelog = BuildingList.filter((catelog)-> Type.enumEq(catelog.type, b));
            // if(catelog.length > 0){
            //     tab_buildingList.dataSource.add( catelog[0] );
            // }
        }
        tab_buildingList.selectedIndex = 0;

        // plist.onChange = function(e){
        //     updateView();
        // }

        tab_buildingList.onChange = function(e){
            final catelog = tab_buildingList.selectedItem;
            btn_confirm.disabled = !(catelog.money <= Main.model.gameInfo().currentPlayer.money);
        }
    }
}