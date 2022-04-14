package view;

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

    public function new() {
        super();

        for(i in 0...100){
            var grid = new GridView();
            box_grids.addComponent(grid);
            grids.push(grid);
        }

        for(i in 0...4){
            var p = new PlayerView(20, 20);
            switch(i){
                case 0: p.boxColor = '#FF0000'; break;
                case 1: p.boxColor = '#00FF00'; break;
                case 2: p.boxColor = '#0000FF'; break;
                case 3: p.boxColor = '#FFFF00'; break;
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

        peopleListView = new PeopleListView();
        box_bottom.addComponent(peopleListView);

        // var people = Main.model.getPeople(30);
        // peopleListView.setPeopleList(people);
    }

    public function onShowPopup() {
        box_popup.fadeIn();
    }

    public function onHidePopup() {
        box_popup.fadeOut();
    }

    public function onWarPreviewConfirmWarClick() {
        Main.model.takeWarOn(0,0, (gameInfo:GameInfo)->{
            syncViewByInfo(gameInfo);
        });
    }

    public function onNegoPreviewConfirmNegoClick() {
        Main.model.takeNegoOn(0,0, (gameInfo:GameInfo)->{
            syncViewByInfo(gameInfo);
        });
    }

    @:bind(this, UIEvent.READY)
    function onUIReady(e:UIEvent) {
        for (index => grid in grids) {
            grid.name = index + "";
            grid.left = (index % 10) * 50;
            grid.top = Math.floor(index / 10) * 50;
            grid.backgroundColor = '#0000FF';
        }
        box_commands2.disabled = true;
        box_commands3.disabled = true;
    }
    
    @:bind(btn_go, MouseEvent.CLICK)
    function onBtnGoClick(e:MouseEvent) {
        Main.model.playerDice(syncView);

        box_commands2.disabled = true;
        box_commands3.disabled = true;
    }

    @:bind(btn_negotiate, MouseEvent.CLICK)
    function onBtnNegotiateClick(e:MouseEvent){
        negoPreviewView.showNegoPreview();
    }

    @:bind(btn_start, MouseEvent.CLICK)
    function onBtnStartClick(e:MouseEvent){
        Main.model.gameStart(syncView);
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

    @:bind(btn_war, MouseEvent.CLICK)
    function onBtnWarClick(e:MouseEvent){
        var player = Main.model.gameInfo().currentPlayer;
        var previewInfo = Main.model.getTakeWarPreview(player.id, player.atGridId);
        warPreviewView.showPreviewWar(previewInfo);
    }

    @:bind(btn_warStrategy, MouseEvent.CLICK)
    function onBtnWarStrategyClick(e:MouseEvent){
        
    }

    @:bind(btn_give, MouseEvent.CLICK)
    function onBtnGiveClick(e:MouseEvent){
        
    }

    function getGridPositionByGridId(id:Int) {
        return [grids[id].left, grids[id].top];
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
        syncGameInfo(gameInfo);
        syncGridViews(gameInfo);
        syncPlayerViews(gameInfo);
        syncGridInfo(gameInfo.currentPlayer.atGridId);
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
                    var toPos = getGridPositionByGridId(action.value.toGridId);
                    tweens.push(TweenX.to(pv, {"left":toPos[0], "top":toPos[1]}));
            }
        }
    }

    var events:Array<EventInfo>;
    function playEvents(gameInfo:GameInfo){
        events = gameInfo.events;
        doOneEvent(gameInfo);
    }

    function doOneEvent(gameInfo:GameInfo){
        if(events.length > 0){
            box_commands1.disabled = true;
            box_commands2.disabled = true;
            box_commands3.disabled = true;

            var event = events.shift();
            setEventInfo(event);
            switch (event.id){
                case WALK_STOP:
                    var g:Grid = event.value.grid;
                    if(g.buildtype == BUILDING.EMPTY){

                    }else{
                        if(g.belongPlayerId == null){
                            box_commands2.disabled = false;
                        }else{
                            if(g.belongPlayerId == gameInfo.currentPlayer.id){
    
                            }else{
                                box_commands3.disabled = false;
                            }
                        }
                    }
                case NEGOTIATE_RESULT:
                    messageView.showMessage({});
                case WAR_RESULT:

                case WORLD_EVENT:
                    trace("WORLD_EVENT");
            }
            trace(event);
        }
    }

    function setEventInfo(event:EventInfo){
        switch(event.id){
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
                pro_currentEvent.value = "行走中";
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

    function syncUI(gameInfo:GameInfo){
        btn_start.disabled = gameInfo.isPlaying;
        box_commands1.disabled = !gameInfo.isPlayerTurn;
        box_commands2.disabled = true;
        box_commands3.disabled = true;

        var pid = gameInfo.currentPlayer.id;
        var opt_p:OptionBox = Reflect.field(this, 'opt_p${pid+1}');
        opt_p.selected = true;

        if(gameInfo.isPlayerTurn){
            pro_currentEvent.value = "等待指令中";
        }
        syncPlayerInfo(pid);
    }

    function syncPlayerInfo(id:Int){
        var gameInfo = Main.model.gameInfo();
        var p = gameInfo.players[id];
        pro_name.value = p.name;
        pro_money.value = p.money;
        pro_army.value = p.army;
        pro_peopleCount.value = p.people.length;
        pro_cityCount.value = "0";
        peopleListView.setPeopleList(p.people);
    }

    function syncGridInfo(gridId:Int){
        var grid:Grid = Main.model.gameInfo().grids[gridId];
        pro_gridName.value = grid.id;
        pro_gridLandType.value = grids[gridId].lbl_building.text;
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
            var pos = getGridPositionByGridId(playerInfo.atGridId);
            playerView.left = pos[0];
            playerView.top = pos[1];
        }
    }

    function syncGameInfo(gameInfo:GameInfo){
        pro_currentPlayer.value = gameInfo.currentPlayer.name;
    }
}