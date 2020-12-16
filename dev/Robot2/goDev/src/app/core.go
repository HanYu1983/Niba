package app

import (
	"app/data"
	"app/gameplay"
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
				gameplay.GameLoop(ctx)
			}
		}
	}
}
