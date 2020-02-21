import MenuButtons from "../../MenuButtons";
import BasicViewer from "../../BasicViewer";
import WeaponMenu from "../../GamePage/WeaponMenu";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RobotDetail extends BasicViewer {

    @property(MenuButtons)
    feature:MenuButtons = null;

    @property(WeaponMenu)
    weaponList:WeaponMenu = null;

    init(){
        super.init();
        this.feature.updateItem = (btn, data)=>{
            btn.setLabel(data);
        };
        this.feature.setData(["更換駕駛員"]);
    }


}
