package gameplay

import "github.com/gopherjs/gopherjs/js"

func AskOnePlayer(gameplay *Gameplay, player Player, players map[string]Player) (Player, error) {
	wait := make(chan interface{})
	go func() {
		js.Global.Get("View").Call("AskOnePlayer", player, players, func(id *js.Object) {
			if id == nil || id == js.Undefined {
				wait <- nil
			} else {
				wait <- id.String()
			}
		})
	}()
	id := <-wait
	if id == nil {
		return Player{}, nil
	}
	ret, isFind := players[id.(string)]
	if isFind == false {
		return Player{}, nil
	}
	return ret, nil
}
