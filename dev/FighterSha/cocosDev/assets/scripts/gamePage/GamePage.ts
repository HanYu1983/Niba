// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BasicViewer from "../lib/BasicViewer";
import Table from "./Table";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GamePage extends BasicViewer {
    @property(Table)
    table:Table = null;
}
