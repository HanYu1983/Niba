package view.popup;

import haxe.ui.events.MouseEvent;

@:build(haxe.ui.ComponentBuilder.build("assets/popup/message-view.xml"))
class MessageView extends PopupView{

    var pList:PeopleListView;

    public function new() {
        super();

        pList = new PeopleListView();
        box_peopleList.addComponent(pList);
    }
    

    public function showMessage(info:Dynamic){
        fadeIn();
        
        lbl_content.text = '
        ${info.success ? '任務成功' : '任務失敗'}\n
        武將:${info.people.name}\n
        體力:${Main.getFixNumber(info.energyBefore,0)} => ${Main.getFixNumber(info.energyAfter,0)}\n
        金錢:${Main.getFixNumber(info.moneyBefore,0)} => ${Main.getFixNumber(info.moneyAfter,0)}\n
        糧草:${Main.getFixNumber(info.foodBefore,0)} => ${Main.getFixNumber(info.foodAfter,0)}\n
        士兵:${Main.getFixNumber(info.armyBefore,0)} => ${Main.getFixNumber(info.armyAfter,0)}\n
        ';

        box_peopleList.hide();
        if(info.peopleList && info.peopleList.length > 0){
            box_peopleList.show();
            pList.setPeopleList(info.peopleList);
        }
    }

    @:bind(btn_cancel, MouseEvent.CLICK)
    function onBtnCancelClick(e:MouseEvent){
        fadeOut();
    }

    @:bind(btn_confirm, MouseEvent.CLICK)
    function onBtnComfirmClick(e:MouseEvent){
        fadeOut();
    }
}