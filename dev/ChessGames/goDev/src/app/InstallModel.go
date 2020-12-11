package app

import (
	"app/gameplay"
	"app/tool"

	"github.com/gopherjs/gopherjs/js"
)

var (
	defaultGameplay = tool.Gameplay{Board: tool.DefaultChessBoard}
)

func InstallModel() {
	js.Global.Set("Model", map[string]interface{}{
		"StartGame": func() {
			go func() {
				gameplay.StartGame(defaultGameplay)
			}()
		},
	})
}
