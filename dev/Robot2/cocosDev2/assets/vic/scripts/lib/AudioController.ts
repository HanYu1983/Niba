// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, AudioClip, AudioSource, CCBoolean } from "cc";

const {ccclass, property} = _decorator;

@ccclass
export default class AudioController extends Component {

    @property(CCBoolean)
    musicEnable:boolean = false;

    @property(CCBoolean)
    audioEnable:boolean = false;

    @property(AudioClip)
    musics:AudioClip[] = [];

    @property(AudioClip)
    audios:AudioClip[] = [];

    gamePage(){
        this._playMusic(0);
    }
    
    explode(){
        this._playAudio(0);
    }

    _playMusic(id:number, loop:boolean = true){
        if(this.musicEnable){
            this.musics[id].setLoop(true);
            this.musics[id].play();
        }
    }

    _playAudio(id:number){
        if(this.audioEnable){
            this.audios[id].playOneShot(1)
        }
    }
}
