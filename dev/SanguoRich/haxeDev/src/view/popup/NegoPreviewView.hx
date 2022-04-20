package view.popup;

import haxe.ui.events.UIEvent;
import model.PeopleGenerator.People;
import haxe.ui.containers.properties.Property;
import model.IModel.NegoPreview;
import haxe.ui.events.MouseEvent;

@:build(haxe.ui.ComponentBuilder.build("assets/popup/negoPreview-view.xml"))
class NegoPreviewView extends PopupView{
    public function new() {
        super();
    }

    public function showNegoPreview(infos:Array<NegoPreview>) {
        fadeIn();

        function setOnePlayer(id:Int){
            var info = infos[id];

            var pro_name:Property = Reflect.getProperty(this, 'pro_name${id}');

            var pro_energy:Property = Reflect.getProperty(this, 'pro_energy${id}');
            var pro_intelligence:Property = Reflect.getProperty(this, 'pro_intelligence${id}');
            var pro_charm:Property = Reflect.getProperty(this, 'pro_charm${id}');
            var pro_political:Property = Reflect.getProperty(this, 'pro_political${id}');
            var pro_money:Property = Reflect.getProperty(this, 'pro_money${id}');
            var pro_army:Property = Reflect.getProperty(this, 'pro_army${id}');
            var pro_successRate:Property = Reflect.getProperty(this, 'pro_successRate${id}');
            // var pro_strategy:Property = Reflect.getProperty(this, 'pro_strategy${id}');

            function setOnePeople(id:Int, p:People){
                pro_energy.value = '${p.energy}=>${info.energyAfter[id]}';
                pro_charm.value = p.charm;
                pro_political.value = p.political;
                pro_intelligence.value = p.intelligence;
                pro_money.value = '${info.moneyBefore}=>${info.moneyAfter[id]}';
                pro_army.value = '${info.armyBefore}=>${info.armyAfter[id]}';
                pro_successRate.value = '${Math.floor(info.successRate * 100)}%';
            }
            
            pro_name.dataSource.clear();
            pro_name.value = info.fightPeople[0].name;
            for(index => p in info.fightPeople){
                pro_name.dataSource.add({
                    text:p.name, id:index, people:p
                });
            }

            pro_name.onChange = function(e:UIEvent){
                if(e.data){
                    setOnePeople(e.data.id, e.data.people);
                }
            }
        }
        
        setOnePlayer(0);
        setOnePlayer(1);
    }

    @:bind(btn_cancelNego, MouseEvent.CLICK)
    function onBtnCancelNego(e:MouseEvent) {
        fadeOut();
    }

    @:bind(btn_confirmNego, MouseEvent.CLICK)
    function onBtnConfirmNego(e:MouseEvent) {
        fadeOut();

        Main.view.onNegoPreviewConfirmNegoClick(pro_name0.value.id, pro_name1.value.id);
    }
}