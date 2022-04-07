package view;

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
        setPeopleList(people);
    }

    private function setPeopleList(people:Array<People>) {
        peopleListView.dataSource.clear();
        for (index => p in people) {
            for(i in 0...3){
                var abi = "";
                if(i < p.abilities.length){
                    abi = PeopleGenerator.getInst().getAbilityName(p.abilities[i]);
                }
                Reflect.setField(p, 'ability${i+1}', abi);
            }
            peopleListView.dataSource.add(p);
        }
    }

    @:bind(this, UIEvent.READY)
    private function onUIReady(e:UIEvent) {
        for (index => grid in grids) {
            grid.name = index + "";
            grid.left = (index % 10) * 50;
            grid.top = Math.floor(index / 10) * 50;
            grid.backgroundColor = '#0000FF';
        }
    }
    
    @:bind(btn_go, MouseEvent.CLICK)
    private function onBtnGoClick(e:MouseEvent) {
        Main.model.playerDice(syncView);
    }

    @:bind(btn_start, MouseEvent.CLICK)
    private function onBtnStartClick(e:MouseEvent){
        Main.model.gameStart(syncView);
    }

    private function getGridPositionByGridId(id:Int) {
        return [grids[id].left, grids[id].top];
    }

    private function syncView() {
        var gameInfo = Main.model.gameInfo();
        syncViewByInfo(gameInfo);
        syncActions(gameInfo);
    }

    private function syncViewByInfo(gameInfo:GameInfo){
        syncGameInfo(gameInfo);
        syncGridViews(gameInfo);
        syncPlayerViews(gameInfo);
        syncUI(gameInfo);
    }

    private function syncActions(gameInfo:GameInfo) {
        var tweens = [];
        for(id => action in gameInfo.actions){
            function getInfo(_gameInfo:GameInfo){
                return _gameInfo;
            }
            tweens.push(TweenX.func(()->{syncViewByInfo(getInfo(action.gameInfo));}).delay(2));
        }
        if(tweens.length > 0) {
            tweens.push(TweenX.func(syncView));
            TweenX.serial(tweens);
        }
    }

    private function syncUI(gameInfo:GameInfo){
        btn_start.disabled = gameInfo.isPlaying;

        if(gameInfo.isPlayerTurn){
            btn_go.disabled = false;
        }else{
            btn_go.disabled = true;
        }
    }

    private function syncGridViews(gameInfo:GameInfo){
        for (index => grid in grids) {
            var info = gameInfo.grids[index];
            grid.type = info.landType;
        }
    }

    private function syncPlayerViews(gameInfo:GameInfo){
        for (index => playerInfo in gameInfo.players) {
            var playerView = players[index];
            var pos = getGridPositionByGridId(playerInfo.atGridId);
            playerView.left = pos[0];
            playerView.top = pos[1];
        }
    }

    private function syncGameInfo(gameInfo:GameInfo){
        var str = '
            玩家:${gameInfo.currentPlayer.name}
            是否自己回合:${gameInfo.isPlayerTurn}
        ';
        lbl_gameInfo.text = str;
    }
}