// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, systemEvent, SystemEvent, Tween, tween } from 'cc';
import { Drawer } from './Drawer';
const { ccclass, property } = _decorator;
import * as ModelType from "../../han/types"
import { Instant } from './lib/instanceViewer/Instant';
import { LandMap } from './gamePage/LandMap';
import { GamePage } from './gamePage/GamePage';

@ccclass('Controller')
export class Controller extends Component {

    @property(Drawer)
    view: Drawer = null;

    modelView: ModelType.View = window.View = {
        Render: (ui: ModelType.UI) => {

            // 應該是cocos3.0的bug。調整完ts之後
            // 回到editor時，他會compile一次ts
            // 這個時候，他會把本來應該要進入游戲才創建的物件就直接創建在場景上了
            // 導致我又要手動刪掉
            // 這邊先暫時用js檢查是不是在chrome的環境，是的話，再render畫面來避免bug
            var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
            if(isChrome){
                console.log("Render", ui);
                this.view.build(ui);
            }
        },
        RenderRobotMove: (robotID: string, path: any, cb: ()=>void) => {
            console.log(`[Controller][RenderRobotMove]`, robotID, path)

            const gamePage:Instant|null = this.view.getPageByName("GameplayPage");
            gamePage?.getComponent(GamePage)?.map.units.moveUnit(robotID, path, cb);
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



        // 這個測不出來
        let actions:Tween<Node>[] = [];
        [1].forEach(element => {
            const t1 = tween().call(()=>{console.log("no print");});
            actions.push(t1);
        });
        console.log(actions);
        
        let t = tween(this.node);
        t.sequence.apply(t, actions).start();

        // 這個可以用
        tween(this.node).sequence(
            tween().call(()=>{console.log("success, aaa");}),
            tween().call(()=>{console.log("success, bbb");})
        ).start();

        
        

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
