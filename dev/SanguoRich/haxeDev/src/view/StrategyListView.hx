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
                case TARGET_GRID: '指定格子';
                case TARGET_PLAYER: '指定玩家';
                case TARGET_PEOPLE: '指定武將';
                case SELF_GRID: '玩家自己';
                case SELF_PEOPLE: '玩家自己的武將';
                case SELF_PLAYER: '玩家所在的格子';
            });
            dataSource.add(strategy);
        }
    }
}