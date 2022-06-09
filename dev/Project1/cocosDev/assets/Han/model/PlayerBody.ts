
import { _decorator, Component, RigidBody2D, math } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerBody')
export class PlayerBody extends Component {
    @property
    isPlayerControl = false

    rigidBody: RigidBody2D | null = null

    start() {
        this.rigidBody = this.getComponentInChildren(RigidBody2D)
        if (this.rigidBody == null) {
            throw new Error("[PlayerBody] rigit body not found")
        }
    }

    rotate(force: number) {
        this.rigidBody?.applyAngularImpulse(force, true)
    }

    forward(force: number) {
        //console.log("forward", force)
        const pos = new math.Vec2();
        this.rigidBody?.getWorldPoint(math.Vec2.ZERO, pos)

        const dir = new math.Vec2()
        this.rigidBody?.getWorldVector(new math.Vec2(force, 0), dir)
        this.rigidBody?.applyForce(dir, pos, true);
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
