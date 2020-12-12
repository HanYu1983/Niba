package gameplay

import (
	"app/tool"
	"fmt"

	"github.com/gopherjs/gopherjs/js"
)

type CmdMoveChess struct {
	from tool.Position
	to   tool.Position
}

func AskCommand(gameplayCtx tool.Gameplay, player int) (interface{}, error) {
	wait := make(chan interface{})
	go func() {
		js.Global.Get("View").Call("AskCommand", player, map[string]interface{}{
			"CmdMoveChess": func(_fx, _fy, _tx, _ty *js.Object) {
				go func() {
					fx, fy, tx, ty := _fx.Int(), _fy.Int(), _tx.Int(), _ty.Int()
					wait <- CmdMoveChess{tool.Position{fx, fy}, tool.Position{tx, ty}}
					close(wait)
				}()
			},
			"CmdCancel": func() {
				// return default of type
				close(wait)
			},
		})
	}()
	cmd := <-wait
	fmt.Printf("cmd: %v\n", cmd)
	if err, ok := cmd.(error); ok {
		return nil, err
	}
	return cmd, nil
}
