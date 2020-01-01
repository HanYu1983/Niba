import IViewController from "../Han/IViewController";
import IModel from "../Han/IModel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component implements IModel {

    pushState(state: string, save: any, callback: () => void) {
        this.talk("pushState", [state, save], callback);
    }

    popState(callback: () => void) {
        this.talk("popState", 0, callback);
    }

    private viewController: IViewController;
    setViewController(ctr: IViewController) {
        this.bindModel();
        ctr.setModel(this);
        this.viewController = ctr;
        this.subscribe();
        this.send("startGameplay");
    }
    
    private viewNotifyOb: { next: (args: any) => void };
    private viewOb: { subscribe: (args: any) => { unsubscribe: () => void } };

    private send(cmd:string, data:any = 0){
        this.viewNotifyOb.next([cmd, data]);
    }

    private subscribe(){
        this.viewOb.subscribe(e => {
            const [cmd, args] = e;
            switch (cmd) {
                case "onStateChange":
                    {
                        const [state, data] = e;
                        this.viewController.onStateChange(state, data);
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


    private seqId: number = 0;
    private talk(q: string, args: any, callback: (answer: any) => void) {
        const id = this.seqId++;
        this.viewNotifyOb.next([q, [id + "", args]]);
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

    private bindModel() {
        window.startApp();
        this.viewNotifyOb = window.viewNotifyOb;
        this.viewOb = window.viewOb;
    }
}
