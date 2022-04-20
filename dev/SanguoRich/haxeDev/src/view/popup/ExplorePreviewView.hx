package view.popup;

import haxe.ui.events.MouseEvent;
import model.PeopleGenerator.People;
import haxe.ui.events.UIEvent;
import model.IModel.ExplorePreview;

@:build(haxe.ui.ComponentBuilder.build("assets/popup/explorePreview-view.xml"))
class ExplorePreviewView extends PopupView{

    var peopleListView:PeopleListView;
    var exploreListView:PeopleListView;

    public function new() {
        super();

        peopleListView = new PeopleListView();
        box_peopleList.addComponent(peopleListView);

        exploreListView = new PeopleListView();
        box_explorePeople.addComponent(exploreListView);
    }

    override function showPopup(info:Dynamic) {
        super.showPopup(info);

        function setRate(){
            var rate = Main.model.getRateOfInvitePeople(peopleListView.selectedItem, exploreListView.selectedItem);
            pro_successRate.value = Main.getRateString(rate);
        }

        function setOnePeople(id:Int, p:People){
            pro_energy.value = '${p.energy}=>${info.energyAfter[id]}';
            pro_charm.value = p.charm;
            setRate();
        }

        var info:ExplorePreview = info;
        peopleListView.setPeopleList(info.fightPeople);
        peopleListView.onChange = function(e){
            var p:Dynamic = peopleListView.selectedItem;
            if(p){
                pro_name.value = p.name;
                setOnePeople(peopleListView.selectedIndex, p);
            }
        }
        peopleListView.selectedIndex = 0;
        pro_name.value = info.fightPeople[0].name;

        exploreListView.setPeopleList(info.explorePeople);
        exploreListView.onChange = function(e){
            var p:Dynamic = exploreListView.selectedItem;
            if(p){
                pro_exploreName.value = p.name;
                setRate();
            }
        }
        exploreListView.selectedIndex = 0;
        pro_exploreName.value = info.explorePeople[0].name;
    }

    @:bind(btn_cancel, MouseEvent.CLICK)
    function onBtnCancel(e:MouseEvent) {
        fadeOut();
    }

    @:bind(btn_confirm, MouseEvent.CLICK)
    function onBtnConfirm(e:MouseEvent) {
        fadeOut();

        Main.view.onExplorePreviewConfirmClick(peopleListView.selectedItem.id, exploreListView.selectedItem.id);
    }
}