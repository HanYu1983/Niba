// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import BasicViewer from "../BasicViewer"
import UnitStatuInfo from "./UnitStatuInfo"
import ViewController from "../ViewController";
import LandStatuInfo from "./LandStatuInfo";
import PilotStateInfo from "./PilotStatuInfo";
const { ccclass, property } = cc._decorator;

@ccclass
export default class UnitStatuMenu extends BasicViewer {

    @property(UnitStatuInfo)
    unitSection: UnitStatuInfo = null;
    
    @property(PilotStateInfo)
    pilotSection:PilotStateInfo = null;

    @property(LandStatuInfo)
    terrainSection: LandStatuInfo = null;

    setUnit(unit: any) {
        this.unitSection.setUnit(unit);
        if(unit){
            this._setPilot(unit.robotState.pilotState);
        }else{
            this._setPilot(null);
        }
    }
    
    setTerrain(terrain: any) {
        this.terrainSection.setTerrain(terrain);
    }

    private _setPilot(pilot:any){
        this.pilotSection.setPilot(pilot);
    }

}
