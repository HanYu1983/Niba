
import { _decorator, Component, Node } from 'cc';
import { Page } from './Page';
const { ccclass, property } = _decorator;

@ccclass('ChangePage')
export class ChangePage extends Component {
    
    private pages:Page[] = [];

    onLoad(){
        this.node.children.forEach(node=>{
            const page = node.getComponent(Page);
            if(page){
                this.pages.push(page);
            }
        });
    }

    closeAllPage(){
        this.pages.forEach(page=>{
            page.close();
        });
    }

    openPage(pageName:string, data?:any){
        this.closeAllPage();
        this.getPage(pageName)?.open(data);
    }

    getPage(pageName:string):Page | null{
        let returnPage = null;
        this.pages.forEach(page=>{
            if(page.node.name == pageName){
                returnPage = page;
                return;
            }
        });
        return returnPage;
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
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
