import { Vec2, Node, tween, Vec3 } from "cc";

export class Tool {
    static getLocal(pos:Vec2, node:Node){
        return new Vec2(
            pos.x - node.getWorldPosition().x,
            pos.y - node.getWorldPosition().y,
        );
    }

    static playSequence(node:Node, actions:any[], cb:()=>void, delay:number = 1){
        if(actions.length > 0){
            const t = tween(node);
            if(actions.length > 1){

                // 爲了達成可以用陣列的形式，改用apply
                t.sequence.apply(t, actions).delay(delay).call(cb).start();
            }else{

                // 不知道爲什麽只有一個動作序列的時候，就不能用sequence的方法，改用then才可以
                t.then(actions[0]).delay(delay).call(cb).start();
            }
        }
    }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.0/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.0/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.0/manual/en/scripting/life-cycle-callbacks.html
 */
