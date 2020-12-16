package app

import (
	"app/alg"
	"app/data"
	"app/lib"
)

var (
	view = lib.View
)

func Main() {
	view.Install()
	for {
		cmd := view.AskCommand()
		switch detail := cmd.(type) {
		case data.CommandKeyDown:
			switch detail.KeyCode {
			case data.KeyCodeSpace:
				var ctx data.Gameplay
				alg.GameLoop(ctx)
			}
		}
	}
}
