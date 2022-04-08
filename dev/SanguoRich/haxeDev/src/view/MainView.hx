package view;

import model.IModel.ActionInfo;
import tweenx909.advanced.TweenTypeX;
import model.IModel.ActionInfoID;
import model.IModel.EventInfo;
import tweenx909.TweenX;
import model.IModel.GameInfo;
import model.PeopleGenerator;
import haxe.ui.events.UIEvent;
import haxe.ui.core.Component;
import haxe.ui.containers.VBox;
import haxe.ui.events.MouseEvent;

@:build(haxe.ui.ComponentBuilder.build("assets/main-view.xml"))
class MainView extends VBox {
    var grids:Array<GridView> = [];
    var players:Array<PlayerView> = [];
    var peopleListView:PeopleListView;

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

        peopleListView = new PeopleListView();
        box_bottom.addComponent(peopleListView);

        var people = Main.model.getPeople(30);
        peopleListView.setPeopleList(people);
    }

    @:bind(this, UIEvent.READY)
    function onUIReady(e:UIEvent) {
        for (index => grid in grids) {
            grid.name = index + "";
            grid.left = (index % 10) * 50;
            grid.top = Math.floor(index / 10) * 50;
            grid.backgroundColor = '#0000FF';
        }
    }
    
    @:bind(btn_go, MouseEvent.CLICK)
    function onBtnGoClick(e:MouseEvent) {
        Main.model.playerDice(syncView);
    }

    @:bind(btn_start, MouseEvent.CLICK)
    function onBtnStartClick(e:MouseEvent){
        Main.model.gameStart(syncView);
    }

    @:bind(btn_end, MouseEvent.CLICK)
    function onBtnEndClick(e:MouseEvent){
        Main.model.playerEnd(syncView);
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
            playEvents(gameInfo);
            // syncActions(gameInfo);
        }));

        TweenX.serial(tweens);
    }

    function syncViewByInfo(gameInfo:GameInfo){
        syncGameInfo(gameInfo);
        syncGridViews(gameInfo);
        syncPlayerViews(gameInfo);
        
    }

    function playBeforeSync(gameInfo:GameInfo, tweens:Array<TweenX>){
        playActions(gameInfo.beforeActions, tweens);
    }

    function playActions(actions:Array<ActionInfo>, tweens:Array<TweenX>) {
        for(id => event in actions){
            switch (event.id){
                case ActionInfoID.MOVE:
                    var pv = players[event.value.playerId];
                    var toPos = getGridPositionByGridId(event.value.toGridId);
                    tweens.push(TweenX.to(pv, {"left":toPos[0], "top":toPos[1]}));
            }
        }
    }

    var events:Array<EventInfo>;
    function playEvents(gameInfo:GameInfo){
        box_commands.disabled = true;
        events = gameInfo.events;
        doOneEvent();
    }

    function doOneEvent(){
        if(events.length > 0){
            box_commands.disabled = false;
            var event = events.shift();
            trace(event);
        }
    }

    function syncActions(gameInfo:GameInfo) {
        var tweens = [];
        for(id => action in gameInfo.actions){
            function getInfo(_gameInfo:GameInfo){
                return _gameInfo;
            }
            tweens.push(TweenX.func(()->{syncViewByInfo(getInfo(action.gameInfo));}).delay(2));
        }
        if(tweens.length > 0) {
            TweenX.serial(tweens);
        }
    }

    function syncUI(gameInfo:GameInfo){
        btn_start.disabled = gameInfo.isPlaying;

        if(gameInfo.isPlayerTurn){
            btn_go.disabled = false;
        }else{
            btn_go.disabled = true;
        }
    }

    function syncGridViews(gameInfo:GameInfo){
        for (index => grid in grids) {
            var info = gameInfo.grids[index];
            grid.type = info.landType;
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
        var str = '
            玩家:${gameInfo.currentPlayer.name}
            是否自己回合:${gameInfo.isPlayerTurn}
        ';
        lbl_gameInfo.text = str;
    }
}