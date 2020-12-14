// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, ImageAsset } from 'cc';
import { BasicViewer } from './BasicViewer';
import { IBasicViewer } from './IBasicViewer';
import ImageAssets from './ImageAssets';
const { ccclass, property } = _decorator;

@ccclass('View')
export class View extends Component {

    @property(BasicViewer)
    viewers:IBasicViewer[] = [];

    @property(ImageAssets)
    imageAssets:ImageAssets[] = [];

    start(){
        this.viewers.forEach(element => {
            element.view = this;
        });
    }

    getImage(assetId:number, imageName:string){
        if (assetId < this.imageAssets.length){
            return this.imageAssets[assetId].getImageByKey(imageName);
        }
    }
    
    openByIndex(id:number, arg?:any):IBasicViewer|null{
        let viewer = this.getViewerByIndex(id);
        if(viewer){
            this.closeAllViewers();
            viewer.open(arg);
        }
        return viewer;
    }

    getViewerByIndex(id:number):IBasicViewer|null{
        if(id < this.viewers.length){
            return this.viewers[id];
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
