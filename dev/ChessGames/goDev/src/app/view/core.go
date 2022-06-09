package view

import (
	"app/tool"

	"github.com/gopherjs/gopherjs/js"
)

// MoveChess is
func MoveChess(origin tool.Gameplay, chess tool.Chess, from tool.Position, to tool.Position) {
	wait := make(chan interface{})
	go func() {
		js.Global.Get("View").Call("MoveChess", origin, chess, from, to, func() {
			go func() {
				close(wait)
			}()
		})
	}()
	<-wait
}
