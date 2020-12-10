package gameplay

import (
	"app/tool"
	"fmt"

	"github.com/gopherjs/gopherjs/js"
)

func QueryMoveRange(origin tool.Gameplay, pos tool.Position) ([]tool.Position, error) {
	selectedChess := origin.Board[pos[1]][pos[0]]
	if selectedChess == tool.NoChess {
		return nil, fmt.Errorf("no chess in %v", pos)
	}
	switch selectedChess.ID.Word {
	case tool.King:
	}
	return []tool.Position{}, nil
}

func MoveChess(origin tool.Gameplay, from tool.Position, to tool.Position) (tool.Gameplay, error) {
	ctx := origin
	validRange, err := QueryMoveRange(ctx, from)
	if err != nil {
		return origin, err
	}
	validPos := tool.AnyPosition(validRange, func(pos tool.Position) bool {
		return pos == to
	})
	if validPos == false {
		return origin, fmt.Errorf("")
	}
	selectedChess := ctx.Board[from[1]][from[0]]
	ctx.Board[from[1]][from[0]] = tool.NoChess
	ctx.Board[to[1]][to[0]] = selectedChess
	return ctx, nil
}

func AskCommand(gameplayCtx tool.Gameplay, player int) (interface{}, error) {
	wait := make(chan interface{})
	go func() {
		js.Global.Get("View").Call("AskCommand", player, map[string]interface{}{
			"CmdUseCard": func(info *js.Object) {
				go func() {

				}()
			},
			"Cancel": func() {
				// return default of type
				close(wait)
			},
		})
	}()
	cmd := <-wait
	if err, ok := cmd.(error); ok {
		return nil, err
	}
	return cmd, nil
}

func StartGame(origin tool.Gameplay) (tool.Gameplay, error) {
	var err error
	ctx := origin
	cmd, err := AskCommand(ctx, ctx.ActivePlayer)
	var _ = cmd
	if err != nil {
		return origin, err
	}
	return origin, nil
}
