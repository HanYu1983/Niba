// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import View from "./View";
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    private _inited = false;
    private _isOpen = false;

    isOpen():boolean{
        return this._isOpen;
    }

    init() {
        this._inited = true;
    }

    addListener() {
        this.removeListenser();
    }

    removeListenser() {

    }

    open() {
        this.node.active = true;
        if (!this._inited) {
            this.init();
        }
        this.addListener();

        this._isOpen = true;
    }

    close() {
        this.node.active = false;
        this.removeListenser();

        this._isOpen = false;
    }
}
