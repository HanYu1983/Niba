package view;
import model.PeopleGenerator;
import haxe.ui.containers.TableView;

@:build(haxe.ui.ComponentBuilder.build("assets/peopleList-view.xml"))
class PeopleListView extends TableView{
    public function new(){
        super();
    }

    public function setPeopleList(people:Array<People>) {
        
        updateList(people);
        
        onChange = function(e){
            selectedItem.chk_sel = !selectedItem.chk_sel;

            var list:Array<Dynamic> = dataSource.data;
            updateList(list.slice(0));
        }
        // if(people.length > 0) selectedIndex = 0;
    }
    
    function updateList(people:Array<Dynamic>){
        dataSource.clear();
        for (index => p in people) {
            var info:Dynamic = Main.cloneObject(p);
            info.gridId = p.gridId == null ? "" : p.gridId;
            for(i in 0...3){
                var abi = "";
                if(i < p.abilities.length){
                    abi = PeopleGenerator.getInst().getAbilityName(p.abilities[i]);
                }
                Reflect.setField(info, 'ability${i+1}', abi);
            }
            info.type = PeopleGenerator.getInst().getPeopleTypeName(p.type);
            dataSource.add(info);
        }
    }
}