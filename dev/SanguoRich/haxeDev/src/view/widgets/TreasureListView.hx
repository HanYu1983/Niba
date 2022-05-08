package view.widgets;
import model.TreasureGenerator.TreasureInfo;
import model.PeopleGenerator;
import haxe.ui.containers.TableView;

@:build(haxe.ui.ComponentBuilder.build("assets/widgets/treasureList-view.xml"))
class TreasureListView extends TableView{
    public function new(){
        super();
    }

    public function setList(treasures:Array<TreasureInfo>) {
        updateList(treasures);
    }
    
    function updateList(treasures:Array<Dynamic>){
        final gameInfo = Main.model.gameInfo();

        final clones = [];
        dataSource.clear();
        for (t in treasures) {
            var info:Dynamic = Main.cloneObject(t.catelog);
            for(i in 0...3){
                var abi = "";
                if(i < t.catelog.abilities.length){
                    abi = PeopleGenerator.getInst().getAbilityName(t.catelog.abilities[i]);
                }
                Reflect.setField(info, 'ability${i+1}', abi);
            }
            info.nameView = info.name;
            
            final belongId:Int = t.belongToPeopleId;
            info.equip = switch(belongId){
                case null: '無';
                case other: 
                    final equipPeople = Main.model.getPeopleById(other);
                    equipPeople.name;
            }
            info.id = t.id;
            clones.push(info);
        }
        dataSource.data = clones;
    }
}