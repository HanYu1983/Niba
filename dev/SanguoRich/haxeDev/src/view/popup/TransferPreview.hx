package view.popup;

import model.GridGenerator.Grid;
import view.widgets.GridGridView;
import model.IModel.PreResultOnWar;
import view.widgets.LeaderGridView;
import haxe.ui.events.UIEvent;
import model.PeopleGenerator.People;
import haxe.ui.containers.properties.Property;
import model.IModel.WarPreview;
import haxe.ui.events.MouseEvent;

using Lambda;

@:build(haxe.ui.ComponentBuilder.build("assets/popup/transferPreview-view.xml"))
class TransferPreview extends PopupView{

    var plist:PeopleListView;
    var leaderView:LeaderGridView;
    var gridView:GridGridView;

    public function new() {
        super();

        plist = new PeopleListView();
        box_plist.addComponent(plist);

        leaderView = new LeaderGridView();
        box_leader.addComponent(leaderView);

        gridView = new GridGridView();
        box_grid.addComponent(gridView);
    }

    @:bind(btn_cancel, MouseEvent.CLICK)
    function onBtnCancelClick(e:MouseEvent) {
        fadeOut();
    }

    @:bind(btn_confirm, MouseEvent.CLICK)
    function onBtnConfirmClick(e:MouseEvent) {

        final list:Array<Dynamic> = plist.dataSource.data;
        outData[0].people = list.filter((p:Dynamic)-> !Reflect.field(p, 'chk_sel'));
        outData[1].people = list.filter((p:Dynamic)-> Reflect.field(p, 'chk_sel'));

        final gameInfo = Main.model.gameInfo();
        final valid = Main.model.checkValidTransfer(
            gameInfo.currentPlayer.id,
            gameInfo.currentPlayer.atGridId,
            outData[0], outData[1]
        );

        if(valid){
            fadeOut();
            Main.view.onTransferPreviewConfirmClick(outData);
        }else{
            trace("這裡要再增強ux");
        }
    }

    var outData:Dynamic = [];
    override function showPopup(info:Dynamic) {
        super.showPopup(info);

        function updateView(p, g){
            leaderView.setInfo(p);
            gridView.setInfo(g);

            outData = [p, g];
        }

        final gameInfo = Main.model.gameInfo();
        final player = gameInfo.currentPlayer;
        final grid:Grid = gameInfo.grids[player.atGridId];
        final peopleInPlayer = player.people.slice(0);
        final gridPeopleIds:Array<Int> = grid.people.map(p->p.id);
        for(p in peopleInPlayer){
            Reflect.setField(p, 'chk_sel', gridPeopleIds.has(p.id));
        }
        outData = [player, grid];
        plist.setPeopleList(peopleInPlayer);

        updateView(player, grid);

        final totalMoney = player.money + grid.money;
        final totalFood = player.food + grid.food;
        final totalArmy = player.army + grid.army;

        var percent = player.money / totalMoney;
        sli_money.pos = (1 - percent) * 100;

        percent = player.food / totalFood;
        sli_food.pos = (1 - percent) * 100;

        percent = player.army / totalArmy;
        sli_army.pos = (1 - percent) * 100;

        var tempPlayer:Dynamic = {};
        for(key in Reflect.fields(player)){
            Reflect.setField(tempPlayer, key, Reflect.field(player, key));
        }

        var tempGrid:Dynamic = {};
        for(key in Reflect.fields(grid)){
            Reflect.setField(tempGrid, key, Reflect.field(grid, key));
        }

        sli_money.onChange = function(e){
            tempPlayer.money = (100 - sli_money.value) * .01 * totalMoney;
            tempGrid.money = totalMoney - tempPlayer.money;
            updateView(tempPlayer, tempGrid);
        }

        sli_food.onChange = function(e){
            tempPlayer.food = (100 - sli_food.value) * .01 * totalFood;
            tempGrid.food = totalFood - tempPlayer.food;
            updateView(tempPlayer, tempGrid);
        }

        sli_army.onChange = function(e){
            tempPlayer.army = (100 - sli_army.value) * .01 * totalArmy;
            tempGrid.army = totalArmy - tempPlayer.army;
            updateView(tempPlayer, tempGrid);
        }
    }
}