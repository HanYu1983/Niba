import IViewController from "../interface/IViewController";
import IModel from "../interface/IModel";
import IUnit from "../interface/IUnit";
import IView from "../interface/IView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ModelController extends cc.Component implements IModel {

    private viewNotifyOb: { next: (args: any) => void };
    private viewOb: { subscribe: (args: any) => { unsubscribe: () => void } };

    private send(cmd: string, data: any = 0) {
        this.viewNotifyOb.next([cmd, data]);
    }

    private view: IView;
    setView(ctr: IView) {
        this.bindModel();
        this.view = ctr;
        this.subscribe();
    }

    subscribe(){
        this.viewOb.subscribe(e => {
            const [cmd, args] = e;
            if(this.view[cmd]){
                console.log("[ModelController][receive]"+cmd, args);
                const [id, data] = args;
                this.view[cmd](data, ()=>{
                    console.log("[ModelController][reply]"+cmd)
                    this.send("ok", [id, 0])
                })
            }
        })
    }

    private bindModel() {
        window.startApp();
        this.viewNotifyOb = window.viewNotifyOb;
        this.viewOb = window.viewOb;
    }

    private seqId: number = 0;
    private talk(q: string, args: any, callback: (answer: any) => void) {
        const id = this.seqId++;
        this.viewNotifyOb.next([q, [id + "", args]]);
        if (callback == null) {
            return;
        }
        const sub = this.viewOb.subscribe(e => {
            const [cmd, args] = e;
            if (cmd == "ok") {
                const [resId, resArgs] = args;
                if (resId == id) {
                    sub.unsubscribe();
                    callback(resArgs);
                } else {
                    console.log("[talk][wait]" + q);
                }
            }
        })
    }

    startGame(){
        this.send("startGameplay");
        
    }

    loadConfig(cb: (data:any)=>void){
        this.talk("loadConfig", null, cb)
    }

    // =============================== //

    pushState(state: string, save: any, callback: () => void) {
        this.talk("pushState", [state, save], callback);
    }

    popState(callback: () => void) {
        this.talk("popState", 0, callback);
    }

    getLocalMap(cb: (args: number[][]) => void) {
        this.talk("getLocalMap", 0, cb);
    }

    getLocalUnits(cb: (args: IUnit[]) => void) {
        this.talk("getLocalUnits", 0, cb);
    }

    private units: IUnit[] = [];
    getUnits(): IUnit[] {
        return this.units;
    }

    getUnitsByRegion(cb: (args: IUnit[]) => void) {
        this.talk("getUnitsByRegion", 0, args => {
            this.units = args;
            cb(args);
        });
    }

    getUnitMenu(unitKey: string, cb: (info: any[]) => void) {
        this.talk("getUnitMenu", unitKey, cb);
    }

    getUnitNormalState(unitKey: string, cb: (info: { unit: IUnit, moveRange: number[][] }) => void) {
        this.talk("getUnitNormalState", unitKey, cb);
    }

    buildPath(positon: number[], cb: (path: number[][])=>void){
        this.talk("buildPath", positon, cb);
    }

    endTurn(cb?: () => void) {
        this.talk("endTurn", 0, cb);
    }

    gameStart() {
        this.send("startGameplay");
    }

    private camera: number[] = [0, 0];
    getCamera(): number[] { return this.camera; }
    setCamera(camera: number[], cb: (args: number[]) => void) {
        this.talk("setCamera", camera, args => {
            this.camera = args;
            cb(args);
        });
    }

    private cursor: number[] = [0, 0];
    getCursor(): number[] { return this.cursor; }
    setCursor(cursor: number[], cb: (args: number[]) => void) {
        this.talk("setCursor", cursor, args => {
            this.cursor = args;
            cb(args);
        });
    }

    private viewController: IViewController;
    setViewController(ctr: IViewController) {
        this.bindModel();
        ctr.setModel(this);
        this.viewController = ctr;
        //this.subscribe2();
    }

    private lastState:string;
    setState(state:string){
        this.lastState = state;
    }
    getState():string{
        return this.lastState;
    }

    private subscribe2() {
        this.viewOb.subscribe(e => {
            const [cmd, args] = e;
            switch (cmd) {
                case "onStateChange":
                    {
                        const [state, data] = args;
                        this.setState(state);
                        this.viewController.onStateChange(state, data);
                    }
                    break;
                case "prepareForStart":
                    {
                        const [id] = args;
                        this.viewController.onPrepareForStart(() => {
                            this.send("ok", [id, 0])
                        })
                    }
                    break;
                case "playerTurnStart":
                    {
                        const [id] = args;
                        this.viewController.onPlayerTurnStart(() => {
                            this.send("ok", [id, 0])
                        })
                    }
                    break;
                case "enemyTurnStart":
                    {
                        const [id, ai] = args;
                        this.viewController.onEnemyTurnStart(ai, () => {
                            this.send("ok", [id, 0])
                        })
                    }
                    break;
            }
        })
    }


    

    
}
