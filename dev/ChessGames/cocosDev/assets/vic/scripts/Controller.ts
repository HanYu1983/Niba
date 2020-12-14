// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

enum GameType {
    ChineseXiangQi
}

import { _decorator, Component, Node } from 'cc';
import { View } from '../lib/View';
const { ccclass, property } = _decorator;
import * as ModelType from "../../han/types"
import { IGame } from './GamePage/IGame';
import { GamePage } from './GamePage';

@ccclass('Controller')
export class Controller extends Component {

    static inst:Controller;

    @property(View)
    public view: View = null;
    public app: ModelType.App = window.App
    public model: ModelType.QueryModel = window.QueryModel
    public modelView: ModelType.View = window.View = {
        AskCommand: (player: number, answer: ModelType.AskCommandAnswer) => {
            console.log("AskCommand")
            
            let game:GamePage = this.view.getViewerByIndex(1) as GamePage;
            game.updateGame(this.model.Query());

            answer.CmdMoveChess(0, 0, 1, 1)
        },
        MoveChess: (gameplay: ModelType.Gameplay, chess: ModelType.Chess, from: ModelType.Position, to: ModelType.Position, done: () => void) => {
            console.log("MoveChess", gameplay)
            done()
        }
    }

    start() {
        Controller.inst = this;

        this.view.openByIndex(0);
    }

    onMainPageChineseXiangQiClick() {
        this.view.openByIndex(1, GameType.ChineseXiangQi);
        this.app.StartGame()
        // console.log(this.model.Query())
        // console.log(this.model.QueryMoveRange(1, 1))
        // console.log(this.model.Query().Board[0][1].ID.Word)
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
