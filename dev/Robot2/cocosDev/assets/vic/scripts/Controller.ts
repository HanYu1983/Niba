// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, tween, systemEvent, SystemEvent } from 'cc';
import { Drawer } from './Drawer';
const { ccclass, property } = _decorator;
import * as ModelType from "../../han/types"

@ccclass('Controller')
export class Controller extends Component {

    @property(Drawer)
    view: Drawer = null;
    modelView: ModelType.View = window.View = {
        Render: (ui: ModelType.UI) => {
            console.log("Render", ui)

            this.view.build(ui);
        },
        Alert: (msg: string) => {
            alert(msg)
        },
    }
    model: ModelType.Model = window.Model

    start() {
        systemEvent.on(SystemEvent.EventType.KEY_UP, this.model.OnKeyUp, this.model);
        systemEvent.on(SystemEvent.EventType.KEY_DOWN, this.model.OnKeyDown, this.model);
        // 畫第一次(Render), 之後是自動呼叫Render
        this.model.Flush()

        // this.view.build({page:1});

        // tween(this.node).call(() => {
        //     console.log("打開首頁");
        //     this.view.build({ page: 0, content: {} });

        // }).delay(2).call(() => {
        //     console.log("打開游戲頁");
        //     this.view.build({ page: 1, content: { map: [] } });

        // }).delay(2).call(() => {
        //     console.log("打開unit menu");
        //     this.view.build({
        //         page: 1,
        //         content: {
        //             map: [],
        //             unitMenu: [['移動', ['武器一', '武器二'], ['道具一', '道具二', '道具三'], '待機'], [0, 0, 0, 0], 0]
        //         }
        //     });

        // }).delay(2).call(() => {
        //     console.log("調整unit menu");
        //     this.view.build({
        //         page: 1,
        //         content: {
        //             map: [],
        //             unitMenu: [['移動', ['武器一', '武器二'], ['道具一', '道具二', '道具三'], '待機'], [0, 0, 0, 0], 1]
        //         }
        //     });

        // }).delay(.5).call(() => {
        //     console.log("調整unit menu");
        //     this.view.build({
        //         page: 1,
        //         content: {
        //             map: [],
        //             unitMenu: [['移動', ['武器一', '武器二'], ['道具一', '道具二', '道具三'], '待機'], [0, 1, 0, 0], 1]
        //         }
        //     });

        // }).delay(.5).call(() => {
        //     console.log("調整unit menu");
        //     this.view.build({
        //         page: 1,
        //         content: {
        //             map: [],
        //             unitMenu: [['移動', ['武器一', '武器二'], ['道具一', '道具二', '道具三'], '待機'], [0, 1, 0, 0], 2]
        //         }
        //     });
        // }).delay(.5).call(() => {
        //     console.log("調整unit menu");
        //     this.view.build({
        //         page: 1,
        //         content: {
        //             map: [],
        //             unitMenu: [['移動', ['武器一', '武器二'], ['道具一', '道具二', '道具三'], '待機'], [0, 1, 1, 0], 2]
        //         }
        //     });
        // }).delay(.5).call(() => {
        //     console.log("調整unit menu");
        //     this.view.build({
        //         page: 1,
        //         content: {
        //             map: [],
        //             unitMenu: [['移動', ['武器一', '武器二'], ['道具一', '道具二', '道具三'], '待機'], [0, 1, 2, 0], 2]
        //         }
        //     });
        // }).start();

    }
}
