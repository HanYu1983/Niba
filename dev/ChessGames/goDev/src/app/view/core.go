package view

import (
	"app/tool"

	"github.com/gopherjs/gopherjs/js"
)

// MoveChess is
func MoveChess(chess tool.Chess, from tool.Position, to tool.Position) {
	wait := make(chan interface{})
	go func() {
		js.Global.Get("View").Call("MoveChess", chess, from, to, func() {
			go func() {
				close(wait)
			}()
		})
	}()
	<-wait
}
