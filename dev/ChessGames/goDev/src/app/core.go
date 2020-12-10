package app

import (
	"app/gameplay"
	"app/tool"
)

func Main() {
	gameplay.StartGame(tool.Gameplay{})
}
