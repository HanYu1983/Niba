package view;
import model.ver2.Define.Strategy;
import model.PeopleGenerator;
import haxe.ui.containers.TableView;

@:build(haxe.ui.ComponentBuilder.build("assets/strategyList-view.xml"))
class StrategyListView extends TableView{
    public function new(){
        super();
    }

    public function setList(strategys:Array<Strategy>) {
        
        updateList(strategys);
    }
    
    function updateList(strategys:Array<Strategy>){
        dataSource.clear();
        for (strategy in strategys) {
            Reflect.setField(strategy, 'target', switch(strategy.targetType){
                case PLAYER_SELF: '玩家自己';
                case PLAYER_SELF_PEOPLE: '玩家自己的武將';
                case CURRENT_GRID: '玩家所在的格子';
            });
            dataSource.add(strategy);
        }
    }
}