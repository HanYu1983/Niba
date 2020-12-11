package gameplay

import (
	"app/tool"
	"app/view"
	"fmt"
)

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
		return origin, fmt.Errorf("invalid position")
	}
	selectedChess := ctx.Board[from[1]][from[0]]
	occuptyChess := ctx.Board[to[1]][to[0]]
	var _ = occuptyChess
	ctx.Board[from[1]][from[0]] = tool.NoChess
	ctx.Board[to[1]][to[0]] = selectedChess
	view.MoveChess(selectedChess, from, to)
	return ctx, nil
}
