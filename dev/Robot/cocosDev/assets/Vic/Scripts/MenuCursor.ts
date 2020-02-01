// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class MenuCursor extends cc.Component {
    private _data: any;
    private _cursor1: number = 0;
    private _cursor2: Array<number> = [];

    static ON_CURSOR_CHANGE: string = "ON_CURSOR_CHANGE";

    setData(data: any, cursors?: any[]) {
        this._data = data;
        this._cursor1 = 0;
        this._cursor2 = [];
        let id = 0;
        data.forEach(element => {
            if (typeof element == 'string') {
                this._data[id] = [element];
            }
            this._cursor2.push(0);
            id++;
        });
        if (cursors) {
            this._cursor1 = cursors[0];
            this._cursor2 = cursors[1];
        }
    }

    getData() {
        return this._data;
    }

    private _focusOn() {
        this.node.emit(MenuCursor.ON_CURSOR_CHANGE, this.getCurrentId());
    }

    previus(): Array<number> {
        if (--this._cursor1 < 0) {
            this._cursor1 = this._data.length - 1;
        }
        this._focusOn();
        return this.getCurrentId();
    }

    next(): Array<number> {
        if (++this._cursor1 > this._data.length - 1) {
            this._cursor1 = 0;
        }
        this._focusOn();
        return this.getCurrentId();
    }

    left(): Array<number> {
        if (--this._cursor2[this._cursor1] < 0) {
            this._cursor2[this._cursor1] = this._data[this._cursor1].length - 1;
        }
        this._focusOn();
        return this.getCurrentId();
    }

    right(): Array<number> {
        if (++this._cursor2[this._cursor1] > this._data[this._cursor1].length - 1) {
            this._cursor2[this._cursor1] = 0;
        }
        this._focusOn();
        return this.getCurrentId();
    }

    getCurrentId(): Array<number> {
        return [this._cursor1, this._cursor2[this._cursor1]];
    }

    getCurrentFocus(): any {
        return this.getData()[this._cursor1][this._cursor2[this._cursor1]];
    }
}
