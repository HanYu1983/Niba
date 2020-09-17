// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Table from "./Table";
import PlayerDetail from "./PlayerDetail";
import StateController from "../lib/StateController";
import StatePlayCard from "./StatePlayCard";
import BasicStateViewer from "../BasicStateViewer";
import { Gameplay, Player } from "../han/gameplay.types";
import PlayerInfo from "./PlayerInfo";
import Cards from "./Cards";
import Card from "../Card";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GamePage extends BasicStateViewer {
    @property(Table)
    table:Table = null;

    // @property(PlayerDetail)
    // playerDetail:PlayerDetail = null;

    @property(PlayerInfo)
    players:PlayerInfo[] = [];

    start(){
        
    }

    sync(data: any) {
        const gp:Gameplay = data as Gameplay;
        cc.log(gp);
        let index = 0;
        for(let key in gp.Players){
            const playerInfo:PlayerInfo = this.players[index];
            const playerData:Player = gp.Players[key];
            playerInfo.lblName.string = playerData.ID;
            
            const character = gp.Desktop.CardStacks[playerData.ID + "_CardStackCharacter"][0]
            const equips = gp.Desktop.CardStacks[playerData.ID + "_CardStackEquip"]
            const hands = gp.Desktop.CardStacks[playerData.ID + "_CardStackHand"]
            
            if(hands)
                playerInfo.cards.createCards(hands.map(back => Card.backIdToFrontId(back.CardPrototypeID.CardType.ID)))

            index++;
        }

        // gp.Players
        // gp.ActivePlayerID
        // gp.CharacterCardComs
        // gp.Desktop.CardStacks.
        
        // const hand:any[] = data["card-stacks"]["0-hand"];
        // const gravyard:any[] = data["card-stacks"].gravyard;
        // const home:any[] = data["card-stacks"].home;
        // const players:any = data.players;

        // this.playerDetail.cards.createCards(hand);

        // cc.log(hand);
        // cc.log(gravyard);
        // cc.log(home);
        // cc.log(players);
    }

    changeToPlayCard(){
        this.getComponent(StateController).changeState(new StatePlayCard(this));
    }

    onUpClick(){
        this.getComponent(StateController).onUpClick();
    }
    onDownClick(){
        this.getComponent(StateController).onDownClick();
    }
    onLeftClick(){
        this.getComponent(StateController).onLeftClick();
    }
    onRightClick(){
        this.getComponent(StateController).onRightClick();
    }
    onEnterClick(){
        this.getComponent(StateController).onEnterClick();
    }
    onEscClick(){
        this.getComponent(StateController).onEscClick();
    }
}
