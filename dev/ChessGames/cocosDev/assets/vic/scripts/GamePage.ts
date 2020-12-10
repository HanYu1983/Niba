// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, EventMouse, log, Button, Label } from 'cc';
import { BasicViewer } from '../lib/BasicViewer';
import { IGame } from './GamePage/IGame';
const { ccclass, property } = _decorator;

@ccclass('GamePage')
export class GamePage extends BasicViewer {

    @property(BasicViewer)
    public games:BasicViewer[] = [];

    @property(Button)
    public btnPrevStep:Button = null;

    @property(Label)
    public lblStatus:Label = null;

    private _currentGame:IGame = null;

    open(arg?:any){
        super.open(arg);

        this._currentGame = this.games[0] as IGame;
        this._currentGame.btnBackStep = this.btnPrevStep;
        this._currentGame.lblStatus = this.lblStatus;
        this._currentGame.onGameStart();
    }

    close(arg?:any){
        super.close(arg);

        if(this._currentGame){
            this._currentGame.onGameEnd();
        }
    }
}
