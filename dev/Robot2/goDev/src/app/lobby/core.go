package lobby

import (
	"app/tool/data"
	"app/tool/def"
)

var (
	view = def.View
)

func Render(ctx data.Lobby) {

}

func StartLobby(origin data.Lobby) (data.Lobby, error) {
	ctx := origin
	for {
		cmd := view.AskCommand()
		var _ = cmd
		break
	}
	return ctx, nil
}
