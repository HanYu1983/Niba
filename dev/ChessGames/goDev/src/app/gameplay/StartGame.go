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
			return origin, err
		}
		if cmd == nil {
			break
		}
		switch detail := cmd.(type) {
		case CmdMoveChess:
			ctx, err = MoveChess(ctx, detail.from, detail.to)
			if err != nil {
				return origin, err
			}
		default:
			return origin, fmt.Errorf("no cmd")
		}
	}
	return ctx, nil
}
