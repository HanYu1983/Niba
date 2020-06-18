const { ccclass, property } = cc._decorator;

@ccclass
export default class ModelController extends cc.Component {

    private view: any;
    setConsumer(ctr: any) {
        this.bindModel();
        this.view = ctr;
        this.subscribe();
    }

    subscribe() {
        this.viewOb.subscribe(e => {
            const [cmd, args] = e;
            if (this.view[cmd]) {
                console.log("[ModelController][receive]" + cmd, args);
                const [id, data] = args;
                this.view[cmd](data, () => {
                    console.log("[ModelController][reply]" + cmd)
                    this.send("ok", [id, 0])
                })
            }
        })
    }

    startGame() {
        this.send("startGameplay");
    }

    startLobby() {
        this.send("startLobby");
    }

    endLobby(){
        this.send("exit");
    }

    loadConfig(cb: (data: any) => void) {
        this.talk("loadConfig", null, cb)
    }

    private seqId: number = 0;
    talk(q: string, args: any, callback: (answer: any) => void) {
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

    private viewNotifyOb: { next: (args: any) => void };
    private viewOb: { subscribe: (args: any) => { unsubscribe: () => void } };
    private send(cmd: string, data: any = 0) {
        this.viewNotifyOb.next([cmd, data]);
    }

    private bindModel() {
        window.startApp();
        //window.startV1();
        this.viewNotifyOb = window.viewNotifyOb;
        this.viewOb = window.viewOb;
    }
}
