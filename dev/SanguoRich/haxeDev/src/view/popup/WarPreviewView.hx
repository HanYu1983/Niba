package view.popup;

import haxe.ui.events.UIEvent;
import model.PeopleGenerator.People;
import haxe.ui.containers.properties.Property;
import model.IModel.WarPreview;
import haxe.ui.events.MouseEvent;

@:build(haxe.ui.ComponentBuilder.build("assets/popup/warPreview-view.xml"))
class WarPreviewView extends PopupView{
    public function new() {
        super();
    }

    @:bind(btn_cancelWar, MouseEvent.CLICK)
    function onBtnCancelWarClick(e:MouseEvent) {
        fadeOut();
    }

    @:bind(btn_confirmWar, MouseEvent.CLICK)
    function onBtnConfirmWarClick(e:MouseEvent) {
        fadeOut();
    }

    public function showPreviewWar(infos:Array<WarPreview>){
        fadeIn();

        function setOnePlayer(id:Int){
            var info = infos[id];

            var pro_name:Property = Reflect.getProperty(this, 'pro_name${id}');
            var pro_energy:Property = Reflect.getProperty(this, 'pro_energy${id}');
            var pro_force:Property = Reflect.getProperty(this, 'pro_force${id}');
            var pro_command:Property = Reflect.getProperty(this, 'pro_command${id}');
            var pro_intelligence:Property = Reflect.getProperty(this, 'pro_intelligence${id}');
            var pro_money:Property = Reflect.getProperty(this, 'pro_money${id}');
            var pro_army:Property = Reflect.getProperty(this, 'pro_army${id}');
            var pro_strategy:Property = Reflect.getProperty(this, 'pro_strategy${id}');

            function setOnePeople(id:Int, p:People){
                pro_energy.value = p.energy;
                pro_force.value = p.force;
                pro_command.value = p.command;
                pro_intelligence.value = p.intelligence;
                pro_money.value = '${info.moneyBefore}=>${info.moneyAfter[id]}';
                pro_army.value = '${info.armyBefore}=>${info.armyAfter[id]}';
            }
            
            pro_name.dataSource.clear();
            pro_name.value = info.fightPeople[0].name;
            for(index => p in info.fightPeople){
                pro_name.dataSource.add({
                    text:p.name, id:index, people:p
                });
            }

            pro_name.onChange = function(e:UIEvent){
                setOnePeople(e.data.id, e.data.people);
            }
        }
        
        setOnePlayer(0);
        setOnePlayer(1);
    }
}