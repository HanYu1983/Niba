package gameplay

import (
	"app/tool"
	"fmt"
)

func StartGame(origin tool.Gameplay) (tool.Gameplay, error) {
	var err error
	var cmd interface{}
	ctx := origin
	for {
		SetQueryModel(ctx)
		cmd, err = AskCommand(ctx, ctx.ActivePlayer)
		if err != nil {
			Alert(err.Error())
			continue
		}
		if cmd == nil {
			break
		}
		switch detail := cmd.(type) {
		case CmdMoveChess:
			var nextCtx tool.Gameplay
			nextCtx, err = MoveChess(ctx, detail.from, detail.to)
			if err != nil {
				Alert(err.Error())
				continue
			}
			ctx = nextCtx
		default:
			return origin, fmt.Errorf("no cmd")
		}
		if IsWin(ctx) {
			break
		}
	}
	return ctx, nil
}
