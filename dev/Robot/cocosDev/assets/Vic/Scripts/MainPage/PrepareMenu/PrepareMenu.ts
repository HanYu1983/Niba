// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BasicViewer from "../../BasicViewer";
import MenuButtons from "../../MenuButtons";
import MenuButton from "../../MenuButton";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PrepareMenu extends BasicViewer {

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
        this.menu.setData(["購買機甲", "雇傭駕駛", "購買軍火", "購買配件", "配置駕駛", "配置軍火", "配置配件"]);
    }

    onPrevClick(){
        this.menu.onPrevClick();
    }

    onNextClick(){
        this.menu.onNextClick();
    }

    onEnterClick(){
        cc.log(this.menu.getFocus())
        switch (this.menu.getFocus()) {
            case "整備部隊":
                {
                }
                break;
            case "進入副本":
                {
                }
                break;
            case "儲存":
                {
                }
                break;
            case "讀取":
                {
                }
                break;
        }
    }
}
