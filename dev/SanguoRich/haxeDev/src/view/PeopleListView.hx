package view;
import haxe.ui.containers.TableView;

@:build(haxe.ui.ComponentBuilder.build("assets/peopleList-view.xml"))
class PeopleListView extends TableView{
    public function new(){
        super();

        // this.dataSource.add({
        //     chk_sel:"true",
        //     name:"A1",
        //     command:"B1"
        // });

    }

    // public function setList(list:Array<Dynamic>){
    //     dataSource.clear();
    //     for (index => value in list) {
    //         dataSource.add(value);
    //     }
    // }
}