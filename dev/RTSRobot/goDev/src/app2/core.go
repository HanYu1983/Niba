package app2

import (
	"app2/alg"
	"app2/data"
	"app2/lib"
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
