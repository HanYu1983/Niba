const { ccclass, property } = cc._decorator;

@ccclass
export default class BasicViewer extends cc.Component {

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
