package lobby

import (
	"app/data"
	"app/lib"
	"app/ui"
)

var (
	view = lib.View
)

func Render(ctx data.Lobby) {
	view.Render(ui.UI{
		LobbyPage: ui.LobbyPage{
			Active: true,
		},
	})
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
