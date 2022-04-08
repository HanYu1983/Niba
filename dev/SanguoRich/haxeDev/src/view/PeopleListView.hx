package view;
import model.PeopleGenerator;
import haxe.ui.containers.TableView;

@:build(haxe.ui.ComponentBuilder.build("assets/peopleList-view.xml"))
class PeopleListView extends TableView{
    public function new(){
        super();
    }

    public function setPeopleList(people:Array<People>) {
        dataSource.clear();
        for (index => p in people) {
            for(i in 0...3){
                var abi = "";
                if(i < p.abilities.length){
                    abi = PeopleGenerator.getInst().getAbilityName(p.abilities[i]);
                }
                Reflect.setField(p, 'ability${i+1}', abi);
            }
            dataSource.add(p);
        }
    }
}