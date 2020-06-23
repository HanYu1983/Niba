// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import MenuButtons from "../../MenuButtons";
import BasicViewer from "../../BasicViewer";
import MenuButton from "../../MenuButton";
import ViewController from "../../ViewController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MainMenu extends BasicViewer {

    @property(MenuButtons)
    menu: MenuButtons = null;
    
    init(){
        this.menu.updateItem = (btn: MenuButton, data: any) => {
            btn.setLabel(data);
        };
    }

    open(){
        super.open();

        this.menu.open();
        this.menu.setData(["整備部隊", "進入副本", "儲存", "讀取"]);
    }

    onPrevClick(){
        this.menu.onPrevClick();
    }

    onNextClick(){
        this.menu.onNextClick();
    }

    // onEnterClick(){
    //     switch (this.menu.getFocus()) {
    //         case "整備部隊":
    //             {
    //                 ViewController.instance.view.getMainPage().openPrepareMenu();
    //             }
    //             break;
    //         case "進入副本":
    //             {
    //             }
    //             break;
    //         case "儲存":
    //             {
    //             }
    //             break;
    //         case "讀取":
    //             {
    //             }
    //             break;
    //     }
    // }
}
