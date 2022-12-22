package assets;

import haxe.ui.containers.Absolute;
import haxe.ui.containers.Box;
import haxe.ui.events.MouseEvent;

@:build(haxe.ui.ComponentBuilder.build('src/assets/card.xml'))
class Card extends Box{
    public function new(){
        super();

        // this.onMouseOver = function(e){
        //     trace(this.id);
        // };
    }

    

    // override function onPointerEventsMouseOver(e:MouseEvent) {
    //     super.onPointerEventsMouseOver(e);

    //     trace(this.id);
    // }

}