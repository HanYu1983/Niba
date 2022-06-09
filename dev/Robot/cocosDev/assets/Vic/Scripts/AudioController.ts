// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class AudioController extends cc.Component {

    @property(cc.Boolean)
    musicEnable:boolean = false;

    @property(cc.Boolean)
    audioEnable:boolean = false;

    @property(cc.AudioClip)
    musics:cc.AudioClip[] = [];

    @property(cc.AudioClip)
    audios:cc.AudioClip[] = [];

    gamePage(){
        this._playMusic(0);
    }
    
    explode(){
        this._playAudio(0);
    }

    _playMusic(id:number, loop:boolean = true){
        if(this.musicEnable){
            cc.audioEngine.play(this.musics[id], loop, 1);
        }
    }

    _playAudio(id:number){
        if(this.audioEnable){
            cc.audioEngine.play(this.audios[id], false, 1);
        }
    }
}
