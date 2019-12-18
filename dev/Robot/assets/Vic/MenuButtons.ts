// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Button)
    btns:cc.Button[] = []

    private _currentId:number = 0;
    
    start () {
        this._focusOn();
        this.next();
    }

    private _focusOn(){
        this.btns.forEach(element => {
            element.getComponentInChildren(cc.Sprite).node.color = cc.Color.WHITE;
        });
        this.btns[this._currentId].getComponentInChildren(cc.Sprite).node.color = cc.Color.YELLOW;
    }

    previus():number{
        if(--this._currentId < 0){
            this._currentId = this.btns.length - 1;
        }
        this._focusOn();
        return this.getCurrentId();
    }

    next():number{
        if(++this._currentId > this.btns.length - 1){
            this._currentId = 0;
        }
        this._focusOn();
        return this.getCurrentId();
    }

    getCurrentId():number{
        return this._currentId;
    }



    // update (dt) {}
}
