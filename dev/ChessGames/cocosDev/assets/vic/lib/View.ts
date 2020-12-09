// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node } from 'cc';
import { BasicViewer } from './BasicViewer';
import { IBasicViewer } from './IBasicViewer';
const { ccclass, property } = _decorator;

@ccclass('View')
export class View extends Component {

    @property(BasicViewer)
    public viewers:IBasicViewer[] = [];
    
    openByIndex(id:number, arg?:any):IBasicViewer|null{
        if(id < this.viewers.length){
            this.closeAllViewers();

            let viewer:IBasicViewer = this.viewers[id];
            viewer.open(arg);
            return viewer;
        }
        return null;
    }

    openByID(id:string, arg?:any):IBasicViewer|null{
        let viewer = this.getViewerByID(id);
        if(viewer){
            this.closeAllViewers();
            viewer.open(arg);
        }
        return viewer;
    }

    getViewerByID(id:string):IBasicViewer|null{
        this.viewers.forEach(element => {
            if ( element.id == id ){
                return element;
            }
        });
        return null;
    }

    closeAllViewers():void{
        this.viewers.forEach(element => {
            element.close();
        });
    }
}
