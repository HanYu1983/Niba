import { Button, Label } from "cc";

export interface IGame {
    btnBackStep:Button;
    lblStatus:Label;
    onGameStart(arg?:any):void;
    onGameEnd(arg?:any):void;
    onUpdate(arg?:any):void;
    onPlayerTurn(arg?:any):void;
    setAnswer(func:(data:any)=>void):void;
}
