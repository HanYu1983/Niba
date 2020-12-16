package lobby

import (
	"app/data"
	"app/lib"
)

var (
	view = lib.View
)

func Render(ctx data.Lobby) {
	view.Render(data.App{
		Page:  data.PageLobby,
		Lobby: ctx,
	})
}

func StartLobby(origin data.Lobby) (data.Lobby, error) {
	ctx := origin
	for {
		cmd := view.AskCommand()
		var _ = cmd
		break
	}
	return ctx
}
