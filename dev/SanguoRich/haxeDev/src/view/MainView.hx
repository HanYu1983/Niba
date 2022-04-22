package view;

import view.popup.ExploreSuccessView;
import view.popup.GrowView;
import view.popup.ExplorePreviewView;
import view.popup.HirePreviewView;
import view.popup.MessageView;
import view.popup.NegoPreviewView;
import view.popup.WarPreviewView;
import model.GridGenerator.BUILDING;
import haxe.ui.components.OptionBox;
import haxe.ui.containers.Absolute;
import model.GridGenerator.Grid;
import model.IModel.ActionInfo;
import model.IModel.ActionInfoID;
import model.IModel.EventInfo;
import tweenx909.TweenX;
import model.IModel.GameInfo;
import haxe.ui.events.UIEvent;
import haxe.ui.core.Component;
import haxe.ui.containers.VBox;
import haxe.ui.events.MouseEvent;

@:build(haxe.ui.ComponentBuilder.build("assets/main-view.xml"))
class MainView extends Absolute {
    var grids:Array<GridView> = [];
    var players:Array<PlayerView> = [];
    var peopleListView:PeopleListView;
    var warPreviewView:WarPreviewView;
    var negoPreviewView:NegoPreviewView;
    var messageView:MessageView;
    var hirePreviewView:HirePreviewView;
    var explorePreviewView:ExplorePreviewView;
    var exploreSuccessView:ExploreSuccessView;
    var growView:GrowView;

    public function new() {
        super();

        for(i in 0...100){
            var grid = new GridView();
            box_grids.addComponent(grid);
            grids.push(grid);
        }

        for(i in 0...4){
            var p = new PlayerView(25, 25);
            switch(i){
                case 0: p.boxColor = '#FF0000';
                case 1: p.boxColor = '#00FF00';
                case 2: p.boxColor = '#0000FF';
                case 3: p.boxColor = '#FFFF00';
            }
            players.push(p);
            box_players.addComponent(p);
        }

        box_popup.hide();

        warPreviewView = new WarPreviewView();
        warPreviewView.hide();
        box_popup.addComponent(warPreviewView);

        negoPreviewView = new NegoPreviewView();
        negoPreviewView.hide();
        box_popup.addComponent(negoPreviewView);

        messageView = new MessageView();
        messageView.hide();
        box_popup.addComponent(messageView);

        hirePreviewView = new HirePreviewView();
        hirePreviewView.hide();
        box_popup.addComponent(hirePreviewView);

        explorePreviewView = new ExplorePreviewView();
        explorePreviewView.hide();
        box_popup.addComponent(explorePreviewView);

        exploreSuccessView = new ExploreSuccessView();
        exploreSuccessView.hide();
        box_popup.addComponent(exploreSuccessView);

        growView = new GrowView();
        growView.hide();
        box_popup.addComponent(growView);

        peopleListView = new PeopleListView();
        box_bottom.addComponent(peopleListView);
    }

    public function onShowPopup() {
        box_popup.fadeIn();
    }

    public function onHidePopup() {
        box_popup.fadeOut();
    }

    // public function onWarPreviewConfirmWarClick() {
    //     Main.model.takeWarOn(0,0, (gameInfo:GameInfo)->{
    //         syncViewByInfo(gameInfo);
    //     });
    // }

    public function onNegoPreviewConfirmNegoClick(p1Id:Int, p2Id:Int) {
        var gameInfo = Main.model.gameInfo();
        Main.model.takeNegoOn(
            gameInfo.currentPlayer.id,
            gameInfo.currentPlayer.atGridId,
            p1Id,
            p2Id,
            syncViewByInfo 
        );
    }

    public function onExplorePreviewConfirmClick(p1Id:Int){
        var gameInfo = Main.model.gameInfo();
        Main.model.takeExplore(
            gameInfo.currentPlayer.id,
            gameInfo.currentPlayer.atGridId,
            p1Id,
            syncViewByInfo
        );
    }

    public function onHirePreviewViewConfirmClick(p1Id:Int, p2Id:Int){
        var gameInfo = Main.model.gameInfo();
        Main.model.takeHire(
            gameInfo.currentPlayer.id,
            gameInfo.currentPlayer.atGridId,
            p1Id,
            p2Id,
            syncViewByInfo
        );
    }

    public function onWarPreviewConfirmClick(p1Id:Int, p2Id:Int, p1Army:Float, p2Army:Float){
        var gameInfo = Main.model.gameInfo();
        Main.model.takeWarOn(
            gameInfo.currentPlayer.id,
            gameInfo.currentPlayer.atGridId,
            p1Id,
            p2Id,
            p1Army,
            p2Army,
            syncViewByInfo
        );
    }

    public function onExploreSuccessViewConfirmClick(){
        onBtnHireClick(null);
    }

    @:bind(this, UIEvent.READY)
    function onUIReady(e:UIEvent) {
        for (index => grid in grids) {
            grid.name = index + "";
            grid.left = (index % 10) * 50;
            grid.top = Math.floor(index / 10) * 50;
            grid.backgroundColor = '#0000FF';
        }
        box_npcCmds.hide();
        box_enemyCmds.hide();
    }
    
    @:bind(btn_go, MouseEvent.CLICK)
    function onBtnGoClick(e:MouseEvent) {
        Main.model.playerDice(syncView);

        box_npcCmds.hide();
        box_enemyCmds.hide();
    }

    @:bind(btn_negotiate, MouseEvent.CLICK)
    function onBtnNegotiateClick(e:MouseEvent){
        var player = Main.model.gameInfo().currentPlayer;
        var previewInfo = Main.model.getTakeNegoPreview(player.id, player.atGridId);
        negoPreviewView.showPopup(previewInfo);
    }

    @:bind(btn_occupation, MouseEvent.CLICK)
    function onBtnOccupationClick(e:MouseEvent){
        var player = Main.model.gameInfo().currentPlayer;
        var previewInfo = Main.model.getTakeWarPreview(player.id, player.atGridId);
        if(previewInfo.p1ValidPeople.length < 1){
            messageView.showMessage('沒有武將可以執行');
            return;
        }
        if(previewInfo.p2ValidPeople.length < 1){
            messageView.showMessage('沒有武將可以占領');
            return ;
        }else{
            warPreviewView.showPopup(previewInfo);
        }
    }

    @:bind(btn_explore, MouseEvent.CLICK)
    function onBtnExploreClick(e:MouseEvent) {
        var gameInfo = Main.model.gameInfo();
        var previewInfo = Main.model.getTakeExplorePreview(gameInfo.currentPlayer.id, gameInfo.currentPlayer.atGridId);
        if(previewInfo.p1ValidPeople.length < 1){
            messageView.showMessage('沒有武將可以執行');
            return;
        }
        explorePreviewView.showPopup(previewInfo);
    }
    
    @:bind(btn_hire, MouseEvent.CLICK)
    function onBtnHireClick(e:MouseEvent) {
        var gameInfo = Main.model.gameInfo();
        var previewInfo = Main.model.getTakeHirePreview(gameInfo.currentPlayer.id, gameInfo.currentPlayer.atGridId);
        if(previewInfo.p1ValidPeople.length < 1){
            messageView.showMessage('沒有武將可以執行');
            return;
        }
        if(previewInfo.p2ValidPeople.length < 1){
            messageView.showMessage('沒有武將可以聘用');
            return ;
        }else{
            hirePreviewView.showPopup(previewInfo);
        }
    }

    @:bind(btn_start, MouseEvent.CLICK)
    function onBtnStartClick(e:MouseEvent){
        Main.model.gameStart(()->{
            for(index => player in Main.model.gameInfo().players){
                players[index].name = player.name;
            }
            syncView();
        });
    }

    @:bind(btn_end, MouseEvent.CLICK)
    function onBtnEndClick(e:MouseEvent){
        Main.model.playerEnd(syncView);
    }

    @:bind(opt_p1, MouseEvent.CLICK)
    function onBtnShowP1Click(e:MouseEvent){
        syncPlayerInfo(0);
    }


    @:bind(opt_p2, MouseEvent.CLICK)
    function onBtnShowP2Click(e:MouseEvent){
        syncPlayerInfo(1);
    }

    @:bind(opt_p3, MouseEvent.CLICK)
    function onBtnShowP3Click(e:MouseEvent){
        syncPlayerInfo(2);
    }

    @:bind(opt_p4, MouseEvent.CLICK)
    function onBtnShowP4Click(e:MouseEvent){
        syncPlayerInfo(3);
    }

    @:bind(btn_showStrategy, MouseEvent.CLICK)
    function onBtnShowStrategyClick(e:MouseEvent){
        
    }

    @:bind(btn_smallWar, MouseEvent.CLICK)
    function onBtnWarClick(e:MouseEvent){
        var player = Main.model.gameInfo().currentPlayer;
        var previewInfo = Main.model.getTakeWarPreview(player.id, player.atGridId);
        // warPreviewView.showPreviewWar(previewInfo);
    }

    @:bind(btn_warStrategy, MouseEvent.CLICK)
    function onBtnWarStrategyClick(e:MouseEvent){
        
    }

    @:bind(btn_give, MouseEvent.CLICK)
    function onBtnGiveClick(e:MouseEvent){
        
    }

    function getGridPositionByGridId(pid:Int, gridId:Int) {
        var grid = grids[gridId];
        return offsetPlayerPos(pid, grid.left, grid.top);
    }

    function syncView() {
        var gameInfo = Main.model.gameInfo();

        // ui可以直接更新
        syncUI(gameInfo);

        // 播放同步前的所有動畫
        var tweens = [];
        playBeforeSync(gameInfo, tweens);
        
        tweens.push(TweenX.func(()->{
            syncViewByInfo(gameInfo);
        }));

        TweenX.serial(tweens);
    }

    function syncViewByInfo(gameInfo:GameInfo){
        syncUI(gameInfo);
        syncGameInfo(gameInfo);
        syncGridViews(gameInfo);
        syncPlayerViews(gameInfo);
        playEvents(gameInfo);
    }

    function playBeforeSync(gameInfo:GameInfo, tweens:Array<TweenX>){
        playActions(gameInfo.actions, tweens);
    }

    function playActions(actions:Array<ActionInfo>, tweens:Array<TweenX>) {
        for(id => action in actions){
            setActionInfo(action);
            switch (action.id){
                case ActionInfoID.MOVE:

                    var pv = players[action.value.playerId];
                    var toPos = getGridPositionByGridId(action.value.playerId, action.value.toGridId);
                    
                    tweens.push(TweenX.to(pv, {"left":toPos[0], "top":toPos[1]}));
            }
        }
    }

    function offsetPlayerPos(pid:Int, x:Float, y:Float){
        var newPos = switch (pid){
            case 0: [x, y];
            case 1: [x+25, y];
            case 2: [x, y+25];
            case 3: [x+25, y+25];
            case _: [x,y];
        }
        return newPos;
    }

    var events:Array<EventInfo>;
    function playEvents(gameInfo:GameInfo){
        events = gameInfo.events;
        doOneEvent(gameInfo);
    }

    function doOneEvent(gameInfo:GameInfo){
        if(events.length > 0){
            disabledAllCommands();

            var event = events.shift();
            setEventInfo(event);
            trace(event);
            switch (event.id){
                case WALK_STOP:
                    var g:Grid = event.value.grid;
                    if(g.buildtype == BUILDING.EMPTY){
                        box_emptyCmds.show();
                    }else{
                        if(g.belongPlayerId == null){
                            box_npcCmds.show();
                        }else{
                            if(g.belongPlayerId == gameInfo.currentPlayer.id){
    
                            }else{
                                box_enemyCmds.show();
                            }
                        }
                    }
                    btn_end.show();
                case HIRE_RESULT:
                    messageView.showMessage(event.value);
                    btn_end.show();
                case NEGOTIATE_RESULT:
                    messageView.showMessage(event.value);
                    btn_end.show();
                case EXPLORE_RESULT:
                    exploreSuccessView.showMessage(event.value);
                    btn_end.show();
                case WAR_RESULT:
                    messageView.showMessage(event.value);
                    btn_end.show();
                case WORLD_EVENT:
                    growView.showPopup(event.value);
            }
        }
    }

    function setEventInfo(event:EventInfo){
        switch(event.id){
            case HIRE_RESULT:
                pro_currentEvent.value = "探索停止。等待指令中";
            case EXPLORE_RESULT:
                pro_currentEvent.value = "聘用停止。等待指令中";
            case WALK_STOP:
                pro_currentEvent.value = "行走停止。等待指令中";
            case WAR_RESULT:
                pro_currentEvent.value = "戰爭結果。等待指令中";
            case NEGOTIATE_RESULT:
                pro_currentEvent.value = "交涉結果。等待指令中";
            case WORLD_EVENT:
        };
    }

    function setActionInfo(action:ActionInfo) {
        switch (action.id){
            case MOVE:
                pro_currentEvent.value = '由${action.value.fromGridId}往${action.value.toGridId}行走中...';
        }
    }

    // function syncActions(gameInfo:GameInfo) {
    //     var tweens = [];
    //     for(id => action in gameInfo.actions){
    //         function getInfo(_gameInfo:GameInfo){
    //             return _gameInfo;
    //         }
    //         tweens.push(TweenX.func(()->{syncViewByInfo(getInfo(action.gameInfo));}).delay(2));
    //     }
    //     if(tweens.length > 0) {
    //         TweenX.serial(tweens);
    //     }
    // }


    function disabledAllCommands() {
        box_basicCmds.hide();
        box_npcCmds.hide();
        box_enemyCmds.hide();
        box_emptyCmds.hide();
        btn_end.hide();
    }

    function syncUI(gameInfo:GameInfo){
        gameInfo.isPlaying ? btn_start.hide() : btn_start.show();
        disabledAllCommands();
        gameInfo.isPlayerTurn ? box_basicCmds.show() : box_basicCmds.hide();

        var pid = gameInfo.currentPlayer.id;
        var opt_p:OptionBox = Reflect.field(this, 'opt_p${pid+1}');
        opt_p.selected = true;

        stage.unregisterEvents();
        if(gameInfo.isPlayerTurn){
            pro_currentEvent.value = "等待指令中";

            stage.registerEvent(MouseEvent.MOUSE_MOVE, function(e:MouseEvent){
                var gx = Math.floor(e.screenX / 50);
                var gy = Math.floor(e.screenY / 50);
                var gridId = gx + gy * 10;
                var pos = getGridPositionByGridId(0, gridId);
                box_cursor.left = pos[0];
                box_cursor.top = pos[1];
                syncGridInfo(gridId);

                var gridInfo = gameInfo.grids[gridId];
                peopleListView.setPeopleList(gridInfo.people);
            });

            stage.registerEvent(MouseEvent.MOUSE_OUT, function(e:MouseEvent){
                syncGridInfo(gameInfo.currentPlayer.atGridId);
                peopleListView.setPeopleList(gameInfo.currentPlayer.people);
            });
        }
        syncPlayerInfo(pid);
    }

    function name() {
        
    }

    function syncPlayerInfo(id:Int){
        var gameInfo = Main.model.gameInfo();
        var p = gameInfo.players[id];
        pro_name.value = p.name;
        pro_money.value = '${Math.floor(p.money)} (${Main.getFixNumber(p.maintainPeople)})';
        pro_food.value = '${Math.floor(p.food)} (${Main.getFixNumber(p.maintainArmy)})';
        pro_army.value = Math.floor(p.army);
        pro_peopleCount.value = p.people.length;
        pro_maintainPeople.value = p.maintainPeople;
        pro_maintainArmy.value = p.maintainArmy;
        pro_cityCount.value = "0";
        peopleListView.setPeopleList(p.people);

        syncGridInfo(gameInfo.players[id].atGridId);
    }

    function syncGridInfo(gridId:Int){
        var grid:Grid = Main.model.gameInfo().grids[gridId];
        pro_gridName.value = grid.id;
        pro_gridLandType.value = grids[gridId].lbl_building.text;
        
        pro_gridMoney.value = '${Math.floor(grid.money)} (${Main.getFixNumber(grid.moneyGrow, 4)}%)';
        pro_gridFood.value = '${Math.floor(grid.food)} (${Main.getFixNumber(grid.foodGrow, 4)}%)';
        pro_gridArmy.value = '${Math.floor(grid.army)} (${Main.getFixNumber(grid.armyGrow, 4)}%)';
    }

    function syncGridViews(gameInfo:GameInfo){
        for (index => grid in grids) {
            var info = gameInfo.grids[index];
            grid.type = info.landType;
            grid.building = info.buildtype;
        }
    }

    function syncPlayerViews(gameInfo:GameInfo){
        for (index => playerInfo in gameInfo.players) {
            var playerView = players[index];
            
            var pos = getGridPositionByGridId(playerInfo.id, playerInfo.atGridId);
            playerView.left = pos[0];
            playerView.top = pos[1];
        }
    }

    function syncGameInfo(gameInfo:GameInfo){
        pro_currentPlayer.value = gameInfo.currentPlayer.name;
    }
}