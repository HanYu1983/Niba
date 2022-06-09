import MenuCursor from "../MenuCursor";
import MenuButton from "../MenuButton";
import BasicViewer from "../BasicViewer";

const { ccclass, property, requireComponent } = cc._decorator;

@ccclass
@requireComponent(MenuCursor)
export default class PopPanel extends BasicViewer {

    @property(MenuButton)
    btnConfirm: MenuButton = null;

    @property(MenuButton)
    btnCancel: MenuButton = null;

    @property(cc.Label)
    content: cc.Label = null;

    init() {
        this.node.getComponent(MenuCursor).setData(["confirm", "cancel"]);
        this.onRightClick();
    }

    setContent(content:string){
        this.content.string = content;
    }

    onLeftClick(owner?: any) {
        this.node.getComponent(MenuCursor).previus();
        this._focus(this.node.getComponent(MenuCursor).getCurrentId());
    }

    onRightClick(owner?: any) {
        this.node.getComponent(MenuCursor).next();
        this._focus(this.node.getComponent(MenuCursor).getCurrentId());
    }

    getCursor():number[]{
        return this.node.getComponent(MenuCursor).getCurrentId();
    }

    private _focus(cursor: number[]) {
        this.btnConfirm.setFocus(cursor[0] == 0);
        this.btnCancel.setFocus(cursor[0] == 1);
    }
}
