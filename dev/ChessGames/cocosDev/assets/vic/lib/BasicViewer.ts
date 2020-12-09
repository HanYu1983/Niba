// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node } from 'cc';
import { IBasicViewer } from './IBasicViewer';
const { ccclass, property } = _decorator;

@ccclass('BasicViewer')
export class BasicViewer extends Component implements IBasicViewer {
    
    public id:string = "";

    private _isOpen:boolean = false;
    private _isInit:boolean = false;
    
    public isOpen():boolean{
        return this._isOpen;
    }
    public addListener(args?:any):void{
        this.removeListener();
    }
    public removeListener(args?:any):void{
    }
    public open(args?:any):void{
        this.addListener(args);
        this._isOpen = true;
        this.node.active = true;
    }
    public close(args?:any):void{
        this.removeListener(args);
        this._isOpen = false;
        this.node.active = false;
    }

    public init():void{
        if(this._isInit) return;
        this._isInit = true;
    }

    start () {
        this.init();
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
