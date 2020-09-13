package html

import (
	"app/gameplay"

	"github.com/gopherjs/gopherjs/js"
)

// AskOnePlayer is
func (view HTMLView) AskOnePlayer(gameplayCtx gameplay.Gameplay, player gameplay.Player, players []gameplay.Player) (gameplay.Player, error) {
	wait := make(chan interface{})
	go func() {
		js.Global.Get("View").Call("AskOnePlayer", player, players, func(id *js.Object) {
			if id == nil || id == js.Undefined {
				close(wait)
			} else {
				wait <- id.String()
			}
		})
	}()
	id := <-wait
	if id == nil {
		return gameplay.Player{}, nil
	}
	for _, _plyr := range players {
		if _plyr.ID == id {
			return _plyr, nil
		}
	}
	return gameplay.Player{}, nil
}
