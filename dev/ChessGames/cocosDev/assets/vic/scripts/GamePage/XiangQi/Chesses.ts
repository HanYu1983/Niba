// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, instantiate, log, Color } from 'cc';
import * as ModelType from "../../../../han/types"
import { Controller } from '../../Controller';
import { Chess } from './Chess';
const { ccclass, property } = _decorator;

@ccclass('Chesses')
export class Chesses extends Component {


    @property(Node)
    chessPrefab:Node = null;

    private chesss:any = {};

    initChesses(){
        for(let i = 0; i < 90; ++i){
            let chessNode = instantiate(this.chessPrefab);
            let x = i % 9;
            let y = Math.floor(i / 9);
            chessNode.name = x + "_" + y;
            chessNode.active = true;
            chessNode.setParent(this.node);
            chessNode.getComponent(Chess)?.noChess();
            this.chesss[chessNode.name] = chessNode;
        }
    }

    clearChesses(){
        for (let key in this.chesss) {
            let chess = this.chesss[key];
            chess.getComponent(Chess)?.noChess();
        }
    }

    clearMovable(){
        for (let key in this.chesss) {
            let chess = this.chesss[key];
            chess.getComponent(Chess)?.showMovable(false);
        }
    }

    setMovable(x:number, y:number){
        const name = x + "_" + y;
        let chess = this.chesss[name];
        chess.getComponent(Chess).showMovable(true);
    }
    
    setChess(x:number, y:number, data:ModelType.Chess){
        const name = x + "_" + y;
        let chess = this.chesss[name];

        const id = data.ID.Word;
        const color = data.ID.Color;
        const face = data.Face;
        
        if(face == 0){
            chess.getComponent(Chess).noChess();
        }else{
            let imageName = "chess_";
            switch(id){
                case 1:{
                    imageName += "jiang";
                }
                break;
                case 2:{
                    imageName += "shi";
                }
                break;
                case 3:{
                    imageName += "xiang";
                }
                break;
                case 4:{
                    imageName += "ma";
                }
                break;
                case 5:{
                    imageName += "che";
                }
                break;
                case 6:{
                    imageName += "pao";
                }
                break;
                case 7:{
                    imageName += "bing";
                }
                break;
            }
            
            const image = Controller.inst.view.getImage(0, imageName);
            if(image){
                chess.getComponent(Chess)?.setChessImageAndColor(image, color == 1 ? Color.BLUE : Color.RED);
            }
        }
    }

}
