// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { View } from "./View";

export interface IBasicViewer {
    id:string;
    view:View;
    isOpen():void;
    init():void;
    addListener(args?:any):void;
    removeListener(args?:any):void;
    open(args?:any):void;
    close(args?:any):void;
}
